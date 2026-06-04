// Chyako Cutz — shared booking data
window.CHYAKO_DATA = {
  brand: {
    name: "Chyako Cutz",
    tagline: "Quality Hairstyles",
    since: "Since 2023",
    phone: "+44 7888 658011",
    address: "Railway Bridge, High St, Sutton SM1 1JA",
    locality: "Sutton, London",
    logo: "assets/logo.png",
    video: "assets/bg-video.mp4",
  },

  services: [
    { id: "skin-beard",   name: "Skin Fade, Beard Trim & Shape Up", price: 35, mins: 45, popular: true },
    { id: "normal-beard", name: "Normal Haircut, Beard Trim & Shape Up", price: 32, mins: 40 },
    { id: "skin-fade",    name: "Skin Fade", price: 22, mins: 30, popular: true },
    { id: "taper-fade",   name: "Taper Fade", price: 20, mins: 25 },
    { id: "normal",       name: "Normal Haircut", price: 19, mins: 25 },
    { id: "scissor",      name: "Scissor Cut", price: 20, mins: 30 },
    { id: "oap",          name: "O.A.P. Cut", price: 17, mins: 25 },
    { id: "kids",         name: "Kids Under 12", price: 16, mins: 20 },
    { id: "beard",        name: "Beard Trim & Shape Up", price: 14, mins: 15 },
    { id: "crew-2-4",     name: "Crew Cut (1,2,3,4 N)", price: 15, mins: 20 },
    { id: "crew-1",       name: "Crew Cut (1 No)", price: 12, mins: 15 },
    { id: "head-shave",   name: "Head Shave (Electric)", price: 14, mins: 20 },
    { id: "hot-towel",    name: "Hot Towel Shave — Head or Beard", price: 19, mins: 30, popular: true },
    { id: "wax",          name: "Waxing — Nose & Ears", price: 6,  mins: 10 },
  ],

  // 3 barbers — placeholder names until owner confirms
  barbers: [
    { id: "b1", name: "Chyako",   role: "Master Barber",  initials: "C",  years: 12, specialty: "Skin Fades & Beard Sculpting" },
    { id: "b2", name: "Barber 02", role: "Senior Barber", initials: "02", years: 7,  specialty: "Scissor Work & Classics" },
    { id: "b3", name: "Barber 03", role: "Barber",        initials: "03", years: 4,  specialty: "Modern Cuts & Tapers" },
  ],

  hours: [
    { day: "Mon", open: "09:00", close: "19:00" },
    { day: "Tue", open: "09:00", close: "19:00" },
    { day: "Wed", open: "09:00", close: "19:00" },
    { day: "Thu", open: "09:00", close: "19:00" },
    { day: "Fri", open: "09:00", close: "19:00" },
    { day: "Sat", open: "09:00", close: "19:00" },
    { day: "Sun", open: "10:00", close: "17:00" },
  ],

  // Time slots generator (hourly + 30-min)
  generateSlots: function (dayIdx) {
    // dayIdx: 0=Mon ... 6=Sun
    const day = this.hours[dayIdx];
    if (!day) return [];
    const [oh] = day.open.split(":").map(Number);
    const [ch] = day.close.split(":").map(Number);
    const slots = [];
    for (let h = oh; h < ch; h++) {
      slots.push(`${String(h).padStart(2, "0")}:00`);
      slots.push(`${String(h).padStart(2, "0")}:30`);
    }
    return slots;
  },

  // Synthetic availability — some slots randomly "taken" for realism
  isSlotTaken: function (dateStr, slot, barberId) {
    // Deterministic pseudo-random based on inputs
    const seed = (dateStr + slot + barberId).split("").reduce((a, c) => a + c.charCodeAt(0), 0);
    return (seed * 9301 + 49297) % 233280 / 233280 < 0.35;
  },

  // ---- OWNER DEMO DATA -------------------------------------------------
  // Synthetic shop bookings (other customers) so the owner dashboard looks live.
  shopCustomers: [
    { name: "Marcus Bryan",   phone: "07700 900118" },
    { name: "Dwayne Foster",  phone: "07700 900214" },
    { name: "Aiden Clarke",   phone: "07700 900337" },
    { name: "Leon Pierce",    phone: "07700 900451" },
    { name: "Tariq Hassan",   phone: "07700 900562" },
    { name: "Joe Whelan",     phone: "07700 900673" },
    { name: "Sam Okafor",     phone: "07700 900784" },
    { name: "Reece Bennett",  phone: "07700 900895" },
    { name: "Kofi Mensah",    phone: "07700 900906" },
    { name: "Liam Doyle",     phone: "07700 900017" },
    { name: "Andre Campbell", phone: "07700 900128" },
    { name: "Nathan Reid",    phone: "07700 900239" },
  ],

  seedShopBookings: function () {
    const days = this.next14Days();
    // [dayOffset, slot, barberId, [serviceIds], customerIndex, status]
    const picks = [
      // ---- TODAY ----
      [0, "09:00", "b1", ["skin-beard"],            0, "done"],
      [0, "09:30", "b2", ["normal"],                1, "done"],
      [0, "10:00", "b1", ["skin-fade"],             2, "noshow"],
      [0, "10:30", "b3", ["taper-fade"],            3, "confirmed"],
      [0, "11:30", "b1", ["skin-beard"],            5, "confirmed"],
      [0, "12:00", "b2", ["scissor"],               4, "confirmed"],
      [0, "13:00", "b1", ["hot-towel"],             6, "confirmed"],
      [0, "13:30", "b3", ["kids"],                  7, "confirmed"],
      [0, "14:30", "b2", ["normal-beard"],          8, "confirmed"],
      [0, "15:30", "b1", ["skin-fade", "beard"],    9, "confirmed"],
      [0, "16:30", "b3", ["beard"],                10, "confirmed"],
      [0, "17:30", "b1", ["skin-beard"],           11, "confirmed"],
      // ---- TOMORROW ----
      [1, "09:30", "b1", ["skin-beard"],            3, "confirmed"],
      [1, "11:00", "b2", ["normal"],                6, "confirmed"],
      [1, "12:00", "b1", ["skin-fade"],             8, "confirmed"],
      [1, "14:00", "b3", ["taper-fade"],            1, "confirmed"],
      [1, "15:30", "b1", ["hot-towel"],            10, "confirmed"],
      [1, "17:00", "b2", ["scissor"],               4, "confirmed"],
      // ---- +2 ----
      [2, "10:00", "b1", ["skin-beard"],            7, "confirmed"],
      [2, "11:30", "b3", ["kids"],                  9, "confirmed"],
      [2, "13:00", "b1", ["skin-fade"],             0, "confirmed"],
      [2, "16:00", "b2", ["beard"],                 5, "confirmed"],
      // ---- +3 ----
      [3, "09:00", "b1", ["skin-beard"],            2, "confirmed"],
      [3, "12:30", "b1", ["normal-beard"],         11, "confirmed"],
      [3, "15:00", "b3", ["taper-fade"],            6, "confirmed"],
      // ---- +4 ----
      [4, "11:00", "b1", ["hot-towel"],             8, "confirmed"],
      [4, "14:00", "b2", ["skin-fade"],             3, "confirmed"],
    ];

    return picks.map((p, i) => {
      const [off, slot, barberId, services, ci, status] = p;
      const total = services.reduce((s, id) => s + (this.services.find(x => x.id === id)?.price || 0), 0);
      return {
        id: "shop_" + i,
        services,
        barberId,
        dateIso: days[off].iso,
        slot,
        friend: false,
        total,
        reservationFee: 5,
        dueAtChair: total,
        status,
        customer: this.shopCustomers[ci],
        demo: true,
        createdAt: Date.now() - (200 - i) * 3600 * 1000,
      };
    });
  },

  next14Days: function () {
    const out = [];
    const today = new Date();
    const dayNames = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
    for (let i = 0; i < 14; i++) {
      const d = new Date(today);
      d.setDate(today.getDate() + i);
      out.push({
        date: d,
        iso: d.toISOString().slice(0, 10),
        day: dayNames[d.getDay()],
        dayIdx: (d.getDay() + 6) % 7, // Mon=0...Sun=6
        dayNum: d.getDate(),
        monthShort: d.toLocaleString("en-GB", { month: "short" }),
        isToday: i === 0,
      });
    }
    return out;
  },
};
