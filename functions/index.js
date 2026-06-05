const functions = require("firebase-functions");
const admin     = require("firebase-admin");

admin.initializeApp();
const db = admin.firestore();

async function getOwnerUid() {
  const snap = await db.collection("users").where("role", "==", "owner").limit(1).get();
  return snap.empty ? null : snap.docs[0].id;
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

// New booking → alert the owner
exports.onBookingCreated = functions.firestore
  .document("bookings/{bookingId}")
  .onCreate(async (snap) => {
    const b = snap.data();
    const ownerUid = await getOwnerUid();
    if (!ownerUid) return;
    await sendPush(
      ownerUid,
      "New Booking",
      `${b.customer?.name || "A customer"} booked ${b.slot} on ${b.dateIso}.`,
      snap.id
    );
  });

// Status change → alert the right party
exports.onBookingUpdated = functions.firestore
  .document("bookings/{bookingId}")
  .onUpdate(async (change) => {
    const before = change.before.data();
    const after  = change.after.data();

    if (before.status === after.status || after.status !== "cancelled") return;

    if (after.cancelledBy === "owner") {
      await sendPush(
        after.uid,
        "Booking Cancelled",
        `Your ${after.slot} on ${after.dateIso} was cancelled by the shop.`,
        change.after.id
      );
    } else if (after.cancelledBy === "customer") {
      const ownerUid = await getOwnerUid();
      if (ownerUid) {
        await sendPush(
          ownerUid,
          "Booking Cancelled",
          `${after.customer?.name || "A customer"} cancelled their ${after.slot} on ${after.dateIso}.`,
          change.after.id
        );
      }
    }
  });

// Validate owner passcode server-side and return a custom auth token
exports.verifyOwnerPasscode = functions.runWith({ secrets: ["OWNER_PASSCODE"] }).https.onCall(async (data) => {
  const { passcode } = data;
  const expected = (process.env.OWNER_PASSCODE || "").trim();
  if (!expected || passcode.trim() !== expected) {
    throw new functions.https.HttpsError("permission-denied", "Wrong passcode");
  }

  const snap = await db.collection("users").where("role", "==", "owner").limit(1).get();
  let ownerUid;
  if (snap.empty) {
    const userRecord = await admin.auth().createUser({ displayName: "Chyako" });
    ownerUid = userRecord.uid;
    await db.collection("users").doc(ownerUid).set({
      uid: ownerUid,
      name: "Chyako",
      role: "owner",
      createdAt: admin.firestore.FieldValue.serverTimestamp()
    });
  } else {
    ownerUid = snap.docs[0].id;
  }

  const token = await admin.auth().createCustomToken(ownerUid);
  return { token };
});
