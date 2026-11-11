// Transactional emails via Resend (https://resend.com). Called from Cloud Functions in index.js.
// Sending never throws: a failed email must not block a booking, a cancel or a staff login.

const FROM = "Chyako Cutz <bookings@chyakocutz.com>";
const SHOP_EMAIL = "chyakocutz@gmail.com";
const SITE = "https://www.chyakocutz.com";
const SHOP = {
  address: "Railway Bridge, High St, Sutton SM1 1JA",
  phone: "07888 658011",
  phoneHref: "tel:+447888658011",
  maps: "https://www.google.com/maps/search/?api=1&query=Chyako+Cutz+Railway+Bridge+High+St+Sutton+SM1+1JA",
};

// Copy of the service list in ../data.js — keep in sync when prices or names change.
const SERVICES = Object.fromEntries([
  ["skin-beard", "Skin Fade, Beard Trim & Shape Up", 35, 45],
  ["normal-beard", "Normal Haircut, Beard Trim & Shape Up", 32, 45],
  ["skin-fade", "Skin Fade", 22, 30],
  ["taper-fade", "Taper Fade", 20, 30],
  ["scissor", "Scissor Cut", 20, 30],
  ["normal", "Normal Haircut", 19, 30],
  ["hot-towel", "Hot Towel Shave — Head or Beard", 19, 30],
  ["oap", "O.A.P. Cut", 17, 30],
  ["kids", "Kids Under 12", 16, 15],
  ["crew-2-4", "Crew Cut (1,2,3,4 N)", 15, 15],
  ["beard", "Beard Trim & Shape Up", 14, 15],
  ["head-shave", "Head Shave (Electric)", 14, 15],
  ["crew-1", "Crew Cut (1 No)", 12, 15],
  ["wax", "Waxing — Nose & Ears", 6, 15],
].map(([id, name, price, mins]) => [id, { name, price, mins }]));

const esc = (s) => String(s ?? "").replace(/[&<>"']/g, c => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]));

const formatDate = (iso) => new Date(`${iso}T12:00:00Z`).toLocaleDateString("en-GB", {
  weekday: "long", day: "numeric", month: "long", year: "numeric", timeZone: "Europe/London",
});

// Normalised booking details for the templates
function describe(b, barberName) {
  const services = (b.services || []).map(id => SERVICES[id]).filter(Boolean);
  const mins = services.reduce((s, x) => s + x.mins, 0);
  const total = b.dueAtChair ?? b.total ?? services.reduce((s, x) => s + x.price, 0) * (b.friend ? 2 : 1);
  return {
    date: formatDate(b.dateIso),
    time: b.slot,
    barber: !b.barberId || b.barberId === "any" ? "Any available barber" : (barberName || "Your barber"),
    services: services.map(s => s.name),
    friend: !!b.friend,
    mins,
    total,
    customerName: b.customer?.name || "Customer",
    customerPhone: b.customer?.phone || "",
    customerEmail: b.customer?.email || "",
  };
}

// ---------- layout ----------
const GOLD = "#e8c268", INK = "#0a0806", CREAM = "#f4ebd6", DIM = "#a89f8c", LINE = "#3a3020";

const button = (href, label) =>
  `<a href="${href}" style="display:inline-block;background:${GOLD};color:#000;text-decoration:none;font-weight:700;font-size:13px;letter-spacing:2px;text-transform:uppercase;padding:14px 26px;border-radius:999px">${esc(label)}</a>`;

const rows = (pairs) => `<table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="border-collapse:collapse;margin:8px 0 4px">${
  pairs.filter(([, v]) => v !== "" && v != null).map(([k, v]) => `
  <tr>
    <td style="padding:10px 0;border-bottom:1px solid ${LINE};color:${DIM};font-size:11px;letter-spacing:2px;text-transform:uppercase;vertical-align:top;width:38%">${esc(k)}</td>
    <td style="padding:10px 0;border-bottom:1px solid ${LINE};color:${CREAM};font-size:15px;font-weight:600;text-align:right">${v}</td>
  </tr>`).join("")}</table>`;

function layout({ preheader, eyebrow, title, body }) {
  return `<!doctype html><html><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><meta name="color-scheme" content="dark"><title>${esc(title)}</title></head>
<body style="margin:0;padding:0;background:#000">
<span style="display:none!important;opacity:0;color:transparent;height:0;width:0;overflow:hidden">${esc(preheader)}</span>
<table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background:#000">
<tr><td align="center" style="padding:28px 14px">
  <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="max-width:560px;background:${INK};border:1px solid ${LINE};font-family:'Helvetica Neue',Helvetica,Arial,sans-serif">
    <tr><td align="center" style="padding:30px 28px 8px">
      <img src="${SITE}/assets/logo.png" width="84" alt="Chyako Cutz" style="display:block;border:0;width:84px;height:auto">
    </td></tr>
    <tr><td style="padding:14px 32px 0">
      <div style="color:${GOLD};font-size:11px;font-weight:700;letter-spacing:3px;text-transform:uppercase">${esc(eyebrow)}</div>
      <h1 style="margin:8px 0 0;color:${CREAM};font-size:26px;line-height:1.2;font-weight:800;letter-spacing:.5px">${esc(title)}</h1>
    </td></tr>
    <tr><td style="padding:14px 32px 30px;color:${CREAM};font-size:15px;line-height:1.6">${body}</td></tr>
    <tr><td style="padding:18px 32px 26px;border-top:1px solid ${LINE};color:${DIM};font-size:12px;line-height:1.7">
      <strong style="color:${GOLD};letter-spacing:2px">CHYAKO CUTZ</strong><br>
      <a href="${SHOP.maps}" style="color:${DIM};text-decoration:underline">${esc(SHOP.address)}</a><br>
      <a href="${SHOP.phoneHref}" style="color:${DIM};text-decoration:none">${esc(SHOP.phone)}</a> · <a href="${SITE}" style="color:${DIM};text-decoration:none">chyakocutz.com</a>
    </td></tr>
  </table>
</td></tr></table></body></html>`;
}

const p = (t, style = "") => `<p style="margin:0 0 14px;${style}">${t}</p>`;
const serviceList = (d) => esc(d.services.join(" + ") || "—") + (d.friend ? " <span style=\"color:" + DIM + "\">(× 2, with a friend)</span>" : "");

// ---------- templates ----------
function bookingConfirmed(b, barberName) {
  const d = describe(b, barberName);
  const first = esc(d.customerName.split(" ")[0]);
  return {
    subject: `Booked: ${d.date.split(",")[0]} ${d.time} at Chyako Cutz`,
    html: layout({
      preheader: `You're booked for ${d.date} at ${d.time}.`,
      eyebrow: "Booking confirmed",
      title: `You're in the chair, ${first}.`,
      body:
        p(`Your booking at Chyako Cutz is confirmed. See you soon.`) +
        rows([["Date", esc(d.date)], ["Time", esc(d.time)], ["Barber", esc(d.barber)], ["Service", serviceList(d)], ["Duration", `${d.mins} min`], ["Due at the chair", `£${d.total}`]]) +
        `<div style="text-align:center;padding:24px 0 10px">${button(SITE, "Manage booking")}</div>` +
        p(`Can't make it? Cancel or reschedule from <strong>Bookings</strong> in the app, so someone else can take the slot.`, `color:${DIM};font-size:13px;text-align:center`),
    }),
    text: `Booking confirmed — Chyako Cutz\n\n${d.date} at ${d.time}\nBarber: ${d.barber}\nService: ${d.services.join(" + ")}${d.friend ? " (x2, with a friend)" : ""}\nDue at the chair: £${d.total}\n\nManage or cancel: ${SITE}\n\n${SHOP.address} · ${SHOP.phone}`,
  };
}

function bookingCancelled(b, barberName) {
  const d = describe(b, barberName);
  const byShop = b.cancelledBy === "owner" || b.cancelledBy === "shop";
  const first = esc(d.customerName.split(" ")[0]);
  return {
    subject: `Cancelled: ${d.date.split(",")[0]} ${d.time} at Chyako Cutz`,
    html: layout({
      preheader: `Your ${d.time} booking on ${d.date} has been cancelled.`,
      eyebrow: "Booking cancelled",
      title: byShop ? `Sorry ${first}, we had to cancel.` : `Your booking is cancelled.`,
      body:
        p(byShop
          ? `The shop had to cancel your booking below. Sorry for the trouble. Book another time that suits you, or give us a call.`
          : `You cancelled the booking below. Nothing else to do. Your slot is free for someone else.`) +
        rows([["Date", esc(d.date)], ["Time", esc(d.time)], ["Barber", esc(d.barber)], ["Service", serviceList(d)]]) +
        `<div style="text-align:center;padding:24px 0 6px">${button(SITE, "Book again")}</div>`,
    }),
    text: `Booking cancelled — Chyako Cutz\n\n${byShop ? "The shop had to cancel your booking." : "You cancelled your booking."}\n${d.date} at ${d.time} · ${d.barber}\n${d.services.join(" + ")}\n\nBook again: ${SITE}\n\n${SHOP.address} · ${SHOP.phone}`,
  };
}

// Internal notice for the shop inbox and the barber
function shopNotice(kind, b, barberName) {
  const d = describe(b, barberName);
  const isNew = kind === "new";
  const head = isNew ? "New booking" : "Customer cancelled";
  return {
    subject: `${isNew ? "New booking" : "Cancelled"}: ${d.customerName} · ${d.date.split(",")[0]} ${d.time}`,
    html: layout({
      preheader: `${d.customerName} · ${d.date} ${d.time} · ${d.barber}`,
      eyebrow: head,
      title: `${d.customerName} · ${d.time}`,
      body:
        rows([
          ["Date", esc(d.date)], ["Time", esc(d.time)], ["Barber", esc(d.barber)], ["Service", serviceList(d)],
          ["Value", `£${d.total}`],
          ["Customer", esc(d.customerName)],
          ["Phone", d.customerPhone ? `<a href="tel:${esc(d.customerPhone.replace(/\s/g, ""))}" style="color:${GOLD};text-decoration:none">${esc(d.customerPhone)}</a>` : ""],
          ["Email", esc(d.customerEmail)],
        ]) +
        `<div style="text-align:center;padding:22px 0 4px">${button(SITE, "Open dashboard")}</div>`,
    }),
    text: `${head}\n\n${d.customerName}${d.customerPhone ? " · " + d.customerPhone : ""}\n${d.date} at ${d.time} · ${d.barber}\n${d.services.join(" + ")} · £${d.total}\n\n${SITE}`,
  };
}

function staffWelcome(name, email, link) {
  const first = esc(String(name).split(" ")[0]);
  return {
    subject: `Your Chyako Cutz staff login`,
    html: layout({
      preheader: `Set your password to start using the Chyako Cutz app.`,
      eyebrow: "Welcome to the team",
      title: `Welcome, ${first}.`,
      body:
        p(`The shop has set you up with your own login for the Chyako Cutz app. You'll see your bookings and can manage your days off.`) +
        p(`<strong>Step 1.</strong> Choose your password:`) +
        `<div style="text-align:center;padding:10px 0 22px">${button(link, "Set your password")}</div>` +
        p(`<strong>Step 2.</strong> Open <a href="${SITE}" style="color:${GOLD}">chyakocutz.com</a>, tap <strong>OWNER / STAFF ACCESS</strong>, then <strong>Sign in with your email</strong>.`) +
        rows([["Your login", esc(email)]]) +
        p(`If the button has expired, use <strong>Forgot password?</strong> on the sign-in screen to get a new link.`, `color:${DIM};font-size:13px;margin-top:16px`),
    }),
    text: `Welcome to Chyako Cutz, ${name}.\n\n1. Set your password: ${link}\n2. Open ${SITE}, tap OWNER / STAFF ACCESS, then "Sign in with your email".\nYour login: ${email}\n\nIf the link has expired, use "Forgot password?" on the sign-in screen.`,
  };
}

// ---------- sending ----------
async function sendEmail({ to, subject, html, text }) {
  const recipients = [...new Set((Array.isArray(to) ? to : [to]).filter(Boolean).map(s => String(s).trim().toLowerCase()))];
  if (!recipients.length) return { ok: false, error: "no recipient" };
  const key = (process.env.RESEND_API_KEY || "").trim();
  if (!key) { console.error("sendEmail: RESEND_API_KEY missing"); return { ok: false, error: "no key" }; }
  try {
    const res = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: { Authorization: `Bearer ${key}`, "Content-Type": "application/json" },
      body: JSON.stringify({ from: FROM, to: recipients, reply_to: SHOP_EMAIL, subject, html, text }),
    });
    const body = await res.json().catch(() => ({}));
    if (!res.ok) { console.error("sendEmail failed", res.status, body?.message, subject); return { ok: false, error: body?.message || res.status }; }
    return { ok: true, id: body.id };
  } catch (err) {
    console.error("sendEmail error", err.message, subject);
    return { ok: false, error: err.message };
  }
}

module.exports = { SHOP_EMAIL, sendEmail, bookingConfirmed, bookingCancelled, shopNotice, staffWelcome };
