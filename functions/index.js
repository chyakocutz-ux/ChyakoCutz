const functions = require("firebase-functions");
const admin     = require("firebase-admin");
const crypto    = require("crypto");

admin.initializeApp();
const db = admin.firestore();
const { HttpsError } = functions.https;

const OWNER_EMAIL = "owner@chyakocutz.internal";

// ---------- helpers ----------
async function getOwnerUid() {
  const snap = await db.collection("users").where("role", "==", "owner").limit(1).get();
  return snap.empty ? null : snap.docs[0].id;
}

async function getStaffUidForBarber(barberId) {
  if (!barberId || barberId === "any") return null;
  const doc = await db.collection("barbers").doc(barberId).get();
  return doc.exists ? (doc.data().staffUid || null) : null;
}

const randomPassword = () => crypto.randomBytes(24).toString("base64url");
const sha256 = (s) => crypto.createHash("sha256").update("chyako-owner:" + s).digest("hex");
const safeEqual = (a, b) => {
  const ba = Buffer.from(a), bb = Buffer.from(b);
  return ba.length === bb.length && crypto.timingSafeEqual(ba, bb);
};

async function assertOwner(context) {
  if (!context.auth) throw new HttpsError("unauthenticated", "Sign in first");
  const doc = await db.collection("users").doc(context.auth.uid).get();
  if (doc.data()?.role !== "owner") throw new HttpsError("permission-denied", "Owner only");
}

const str = (v, max) => (typeof v === "string" ? v.trim().slice(0, max) : "");

// Whitelist + clamp barber fields coming from the client
function cleanBarber(input, { partial = false } = {}) {
  const out = {};
  const f = input || {};
  if (!partial || "name" in f)      out.name = str(f.name, 40);
  if (!partial || "role" in f)      out.role = str(f.role, 40) || "Barber";
  if (!partial || "initials" in f)  out.initials = str(f.initials, 3) || (str(f.name, 40)[0] || "?").toUpperCase();
  if (!partial || "years" in f)     out.years = Math.max(0, Math.min(60, parseInt(f.years, 10) || 0));
  if (!partial || "specialty" in f) out.specialty = str(f.specialty, 80);
  if (!partial || "workingDayIdx" in f) {
    const days = Array.isArray(f.workingDayIdx) ? f.workingDayIdx : [0, 1, 2, 3, 4, 5, 6];
    out.workingDayIdx = [...new Set(days.map(Number).filter(n => Number.isInteger(n) && n >= 0 && n <= 6))].sort();
  }
  if (!partial || "active" in f)    out.active = f.active !== false;
  if ("order" in f)                 out.order = parseInt(f.order, 10) || 0;
  if (!partial && !out.name) throw new HttpsError("invalid-argument", "Barber name required");
  return out;
}

async function sendPush(uid, title, body, bookingId) {
  const doc = await db.collection("users").doc(uid).get();
  const tokens = (doc.data()?.fcmTokens || []).filter(Boolean);
  if (!tokens.length) return;

  const result = await admin.messaging().sendEachForMulticast({
    tokens,
    notification: { title, body },
    webpush: {
      notification: {
        icon:  "/assets/logo.png",
        badge: "/assets/logo.png",
        tag:   bookingId || "ck"
      },
      fcmOptions: { link: "/" }
    }
  });

  // Remove any tokens that are no longer valid
  const stale = result.responses
    .map((r, i) => (r.error?.code === "messaging/registration-token-not-registered" ? tokens[i] : null))
    .filter(Boolean);
  if (stale.length) {
    await db.collection("users").doc(uid).update({
      fcmTokens: admin.firestore.FieldValue.arrayRemove(...stale)
    });
  }
}

// Push + in-app toast for the staff member who owns this barber chair
async function notifyStaff(barberId, type, title, body, bookingId) {
  const staffUid = await getStaffUidForBarber(barberId);
  if (!staffUid) return;
  await db.collection("notifications").doc(staffUid).collection("items").add({
    type, title: title.toUpperCase(), body, bookingId,
    createdAt: admin.firestore.FieldValue.serverTimestamp(),
    read: false
  });
  await sendPush(staffUid, title, body, bookingId);
}

// ---------- booking triggers ----------

// New booking → alert the owner and the barber's staff account
exports.onBookingCreated = functions.firestore
  .document("bookings/{bookingId}")
  .onCreate(async (snap) => {
    const b = snap.data();
    const body = `${b.customer?.name || "A customer"} booked ${b.slot} on ${b.dateIso}.`;
    const ownerUid = await getOwnerUid();
    if (ownerUid) await sendPush(ownerUid, "New Booking", body, snap.id);
    await notifyStaff(b.barberId, "new_booking", "New Booking", body, snap.id);
  });

// Status change → alert the right party
exports.onBookingUpdated = functions.firestore
  .document("bookings/{bookingId}")
  .onUpdate(async (change) => {
    const before = change.before.data();
    const after  = change.after.data();

    if (before.status === after.status || after.status !== "cancelled") return;

    if (after.cancelledBy === "owner" || after.cancelledBy === "shop") {
      await sendPush(
        after.uid,
        "Booking Cancelled",
        `Your ${after.slot} on ${after.dateIso} was cancelled by the shop.`,
        change.after.id
      );
    } else if (after.cancelledBy === "customer") {
      const body = `${after.customer?.name || "A customer"} cancelled their ${after.slot} on ${after.dateIso}.`;
      const ownerUid = await getOwnerUid();
      if (ownerUid) await sendPush(ownerUid, "Booking Cancelled", body, change.after.id);
      await notifyStaff(after.barberId, "cancelled_by_customer", "Booking Cancelled", body, change.after.id);
    }
  });

// ---------- owner login ----------

// Validate the master passcode server-side and hand back a one-time sign-in token.
// The owner account's real password is never sent to the browser.
// When OWNER_PASSCODE changes, the first successful login with the new code
// scrambles the owner password and signs out every device still logged in.
exports.verifyOwnerPasscode = functions.runWith({ secrets: ["OWNER_PASSCODE"] }).https.onCall(async (data) => {
  const passcode = String(data?.passcode || "").trim();
  const expected = (process.env.OWNER_PASSCODE || "").trim();
  if (!expected || !safeEqual(passcode, expected)) {
    throw new HttpsError("permission-denied", "Wrong passcode");
  }

  // Ensure the owner Firebase Auth account exists (first-run setup)
  let owner;
  try {
    owner = await admin.auth().getUserByEmail(OWNER_EMAIL);
  } catch (err) {
    if (err.code !== "auth/user-not-found") throw err;
    owner = await admin.auth().createUser({ email: OWNER_EMAIL, password: randomPassword(), displayName: "Chyako" });
  }

  const userRef = db.collection("users").doc(owner.uid);
  const userDoc = await userRef.get();
  if (!userDoc.exists || userDoc.data().role !== "owner") {
    await userRef.set({
      uid: owner.uid, name: "Chyako", email: OWNER_EMAIL, role: "owner",
      createdAt: admin.firestore.FieldValue.serverTimestamp()
    }, { merge: true });
  }

  // Mint the sign-in token first so a failure here never leaves things half-rotated.
  // (The session it creates starts after the revoke below, so it stays valid.)
  const token = await admin.auth().createCustomToken(owner.uid);

  // Passcode changed since the last login → lock out old sessions and old credentials
  const cfgRef = db.collection("config").doc("owner");
  const cfg = await cfgRef.get();
  const hash = sha256(expected);
  if (cfg.data()?.passcodeHash !== hash) {
    await admin.auth().updateUser(owner.uid, { password: randomPassword() });
    await admin.auth().revokeRefreshTokens(owner.uid);
    await cfgRef.set({ passcodeHash: hash, rotatedAt: admin.firestore.FieldValue.serverTimestamp() }, { merge: true });
  }

  return { token };
});

// ---------- barbers & staff (owner only) ----------

// One-time: copy the built-in barber list into Firestore (same ids so old bookings still match)
exports.seedBarbers = functions.https.onCall(async (data, context) => {
  await assertOwner(context);
  const existing = await db.collection("barbers").limit(1).get();
  if (!existing.empty) return { seeded: 0 };
  const list = Array.isArray(data?.barbers) ? data.barbers.slice(0, 20) : [];
  const batch = db.batch();
  list.forEach((b, i) => {
    const id = str(b.id, 20);
    if (!/^[A-Za-z0-9_-]+$/.test(id)) return;
    batch.set(db.collection("barbers").doc(id), { ...cleanBarber(b), order: i });
  });
  await batch.commit();
  return { seeded: list.length };
});

exports.updateBarber = functions.https.onCall(async (data, context) => {
  await assertOwner(context);
  const id = str(data?.id, 40);
  const ref = db.collection("barbers").doc(id);
  if (!id || !(await ref.get()).exists) throw new HttpsError("not-found", "Barber not found");
  await ref.update(cleanBarber(data.fields, { partial: true }));
  return { ok: true };
});

// Create a personal login for a staff member, linked to a barber chair
exports.createStaff = functions.https.onCall(async (data, context) => {
  await assertOwner(context);
  const name = str(data?.name, 40);
  const email = str(data?.email, 120).toLowerCase();
  const password = String(data?.tempPassword || "");
  if (!name) throw new HttpsError("invalid-argument", "Name required");
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) throw new HttpsError("invalid-argument", "Valid email required");
  if (password.length < 6) throw new HttpsError("invalid-argument", "Temporary password must be at least 6 characters");

  // Resolve the barber chair: link an existing one or create a new one
  let barberRef;
  if (data?.barberId) {
    barberRef = db.collection("barbers").doc(str(data.barberId, 40));
    const b = await barberRef.get();
    if (!b.exists) throw new HttpsError("not-found", "Barber not found");
    if (b.data().staffUid) throw new HttpsError("already-exists", "This barber already has a login");
  } else {
    const count = (await db.collection("barbers").get()).size;
    barberRef = db.collection("barbers").doc();
    await barberRef.set({ ...cleanBarber({ name, ...(data?.newBarber || {}) }), order: count });
  }

  let userRecord;
  try {
    userRecord = await admin.auth().createUser({ email, password, displayName: name });
  } catch (err) {
    if (!data?.barberId) await barberRef.delete().catch(() => {});
    if (err.code === "auth/email-already-exists") throw new HttpsError("already-exists", "That email already has an account");
    throw new HttpsError("internal", err.message);
  }

  await db.collection("users").doc(userRecord.uid).set({
    uid: userRecord.uid, name, email, role: "staff", barberId: barberRef.id,
    createdAt: admin.firestore.FieldValue.serverTimestamp()
  });
  await barberRef.update({ staffUid: userRecord.uid, active: true });
  return { uid: userRecord.uid, barberId: barberRef.id };
});

// Remove a staff member's access: disable login, sign out all their devices
exports.removeStaff = functions.https.onCall(async (data, context) => {
  await assertOwner(context);
  const uid = str(data?.uid, 128);
  const userRef = db.collection("users").doc(uid);
  const userDoc = await userRef.get();
  if (!uid || !userDoc.exists || userDoc.data().role !== "staff") throw new HttpsError("not-found", "Staff account not found");

  await admin.auth().updateUser(uid, { disabled: true });
  await admin.auth().revokeRefreshTokens(uid);
  const { barberId } = userDoc.data();
  await userRef.update({ role: "former_staff", removedAt: admin.firestore.FieldValue.serverTimestamp() });
  if (barberId) {
    const barberRef = db.collection("barbers").doc(barberId);
    if ((await barberRef.get()).exists) {
      await barberRef.update({
        staffUid: admin.firestore.FieldValue.delete(),
        ...(data?.hideBarber ? { active: false } : {})
      });
    }
  }
  return { ok: true };
});
