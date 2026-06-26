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
    { id: "normal-beard", name: "Normal Haircut, Beard Trim & Shape Up", price: 32, mins: 45 },
    { id: "skin-fade",    name: "Skin Fade", price: 22, mins: 30, popular: true },
    { id: "taper-fade",   name: "Taper Fade", price: 20, mins: 30 },
    { id: "scissor",      name: "Scissor Cut", price: 20, mins: 30 },
    { id: "normal",       name: "Normal Haircut", price: 19, mins: 30 },
    { id: "hot-towel",    name: "Hot Towel Shave — Head or Beard", price: 19, mins: 30, popular: true },
    { id: "oap",          name: "O.A.P. Cut", price: 17, mins: 30 },
    { id: "kids",         name: "Kids Under 12", price: 16, mins: 15 },
    { id: "crew-2-4",     name: "Crew Cut (1,2,3,4 N)", price: 15, mins: 15 },
    { id: "beard",        name: "Beard Trim & Shape Up", price: 14, mins: 15 },
    { id: "head-shave",   name: "Head Shave (Electric)", price: 14, mins: 15 },
    { id: "crew-1",       name: "Crew Cut (1 No)", price: 12, mins: 15 },
    { id: "wax",          name: "Waxing — Nose & Ears", price: 6,  mins: 15 },
  ],

  // 3 barbers — workingDayIdx uses Mon=0…Sun=6 to match next14Days dayIdx
  barbers: [
    { id: "b1", name: "Chyako",    role: "Master Barber",  initials: "C",  years: 12, specialty: "Skin Fades & Beard Sculpting", workingDayIdx: [0,1,2,3,4,5,6] },
    { id: "b2", name: "Barber 02", role: "Senior Barber",  initials: "02", years: 7,  specialty: "Scissor Work & Classics",       workingDayIdx: [0,1,2,3,4,5,6] },
    { id: "b3", name: "Barber 03", role: "Barber",         initials: "03", years: 4,  specialty: "Modern Cuts & Tapers",          workingDayIdx: [4,5,6] },
  ],

  isBarberAvailableOn: function(barberId, dateStr, daysOff) {
    if (!dateStr || barberId === "any") return true;
    const barber = this.barbers.find(b => b.id === barberId);
    if (!barber?.workingDayIdx) return true;
    const dow = (new Date(dateStr + "T12:00:00").getDay() + 6) % 7; // Mon=0…Sun=6
    if (!barber.workingDayIdx.includes(dow)) return false;
    if (daysOff && daysOff.some(d => d.barberId === barberId && d.dateIso === dateStr)) return false;
    return true;
  },

  getAvailableBarbers: function(dateStr, daysOff) {
    if (!dateStr) return this.barbers;
    return this.barbers.filter(b => this.isBarberAvailableOn(b.id, dateStr, daysOff));
  },

  hours: [
    { day: "Mon", open: "09:00", close: "19:00" },
    { day: "Tue", open: "09:00", close: "19:00" },
    { day: "Wed", open: "09:00", close: "19:00" },
    { day: "Thu", open: "09:00", close: "19:00" },
    { day: "Fri", open: "09:00", close: "19:00" },
    { day: "Sat", open: "09:00", close: "19:00" },
    { day: "Sun", open: "10:00", close: "17:00" },
  ],

  slotToMins: function (slot) {
    const [h, m] = slot.split(":").map(Number);
    return h * 60 + m;
  },

  // Time slots generator — every 15 min
  generateSlots: function (dayIdx) {
    const day = this.hours[dayIdx];
    if (!day) return [];
    const [oh, om] = day.open.split(":").map(Number);
    const [ch, cm] = day.close.split(":").map(Number);
    const startMin = oh * 60 + om;
    const endMin = ch * 60 + cm;
    const slots = [];
    for (let m = startMin; m < endMin; m += 15) {
      slots.push(`${String(Math.floor(m / 60)).padStart(2, "0")}:${String(m % 60).padStart(2, "0")}`);
    }
    return slots;
  },

  isSlotTaken: function (dateStr, slotStr, barberId, bookings, daysOff, newDurationMins) {
    if (!bookings || bookings.length === 0) return false;
    const newStart = this.slotToMins(slotStr);
    const newEnd   = newStart + (newDurationMins || 15);
    const active = bookings.filter(b =>
      b.status !== "cancelled" && b.status !== "deleted" && b.dateIso === dateStr
    );
    const avail = this.getAvailableBarbers(dateStr, daysOff);

    // Bidirectional interval overlap: new booking [newStart, newEnd) vs existing [bStart, bEnd)
    const overlaps = (b) => {
      const bStart = this.slotToMins(b.slot);
      const bEnd   = bStart + (b.durationMins || 30);
      return newStart < bEnd && newEnd > bStart;
    };

    // Barbers with a specific booking that overlaps
    const specificBusy = new Set(
      active.filter(b => b.barberId && b.barberId !== "any" && overlaps(b)).map(b => b.barberId)
    );
    // "any"-barber bookings each consume one slot from the available pool
    const anyCount = active.filter(b => (!b.barberId || b.barberId === "any") && overlaps(b)).length;

    const allBusy = (specificBusy.size + anyCount) >= avail.length;

    if (barberId === "any") return allBusy;
    if (daysOff && daysOff.some(d => d.barberId === barberId && d.dateIso === dateStr)) return true;
    return specificBusy.has(barberId) || allBusy;
  },

  isSlotPast: function (dateStr, slot) {
    const slotTime = new Date(dateStr + "T" + slot + ":00");
    return slotTime <= new Date();
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
    for (let i = 0; i < 28; i++) {
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
