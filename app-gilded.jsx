// GILDED — shared "Atelier × Gold" UI pieces: gold logo, filigree frame,
// ornaments, slide-to-book, playing-card service deck, next openings.

// ---------- Gold logo: strip the logo's black square, crop to the artwork ----------
const goldLogoCache = { url: null, waiters: [] };
(function buildGoldLogo() {
  const img = new Image();
  img.onload = () => {
    try {
      const S = 800, c = document.createElement("canvas"); c.width = c.height = S;
      const x = c.getContext("2d"); x.drawImage(img, 0, 0, S, S);
      const base = x.getImageData(0, 0, S, S).data;
      let x0 = S, y0 = S, x1 = 0, y1 = 0;
      for (let y = 0; y < S; y++) for (let xx = 0; xx < S; xx++) {
        const i = (y * S + xx) * 4, m = Math.max(base[i], base[i + 1], base[i + 2]);
        if (m > 40) { if (xx < x0) x0 = xx; if (xx > x1) x1 = xx; if (y < y0) y0 = y; if (y > y1) y1 = y; }
      }
      x0 = Math.max(0, x0 - 6); y0 = Math.max(0, y0 - 6); x1 = Math.min(S - 1, x1 + 6); y1 = Math.min(S - 1, y1 + 6);
      const W = x1 - x0 + 1, H = y1 - y0 + 1;
      const o = document.createElement("canvas"); o.width = W; o.height = H;
      const d = x.getImageData(x0, y0, W, H), p = d.data;
      for (let i = 0; i < p.length; i += 4) {
        const r = p[i], g = p[i + 1], b = p[i + 2], m = Math.max(r, g, b);
        const a = Math.min(255, Math.max(0, (m - 14) * 1.7)), k = a ? 255 / Math.max(a, m) : 0;
        p[i] = Math.min(255, r * k * 1.05); p[i + 1] = Math.min(255, g * k * 1.05); p[i + 2] = Math.min(255, b * k * 1.05); p[i + 3] = a;
      }
      o.getContext("2d").putImageData(d, 0, 0);
      goldLogoCache.url = o.toDataURL("image/png");
    } catch (e) { goldLogoCache.url = "assets/logo.png"; }
    goldLogoCache.waiters.forEach(fn => fn(goldLogoCache.url)); goldLogoCache.waiters = [];
  };
  img.onerror = () => { goldLogoCache.url = "assets/logo.png"; };
  img.src = "assets/logo.png";
})();

const GoldLogo = ({ className = "", alt = "Chyako Cutz" }) => {
  const [src, setSrc] = React.useState(goldLogoCache.url);
  React.useEffect(() => { if (!goldLogoCache.url) goldLogoCache.waiters.push(setSrc); }, []);
  if (!src) return <div className={`glogo ${className}`} aria-label={alt} role="img"/>;
  return <img className={`glogo ${className}`} src={src} alt={alt}/>;
};

// ---------- Ornaments ----------
const GoldDefs = () => (
  <defs><linearGradient id="gg" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stopColor="#f6e2a4"/><stop offset=".5" stopColor="#c99a45"/><stop offset="1" stopColor="#7d5c20"/></linearGradient></defs>
);
const Corner = ({ pos }) => (
  <svg className={`gcorner ${pos}`} viewBox="0 0 100 100" fill="none" stroke="url(#gg)" strokeWidth="1.5" strokeLinecap="round" aria-hidden="true">
    <GoldDefs/>
    <path d="M1 99V24C1 11 11 1 24 1h75"/><path d="M12 64C12 34 34 12 64 12"/>
    <path d="M64 12c10 0 14 8 8 12-5 3-10-2-6-5"/><path d="M12 64c0 10 8 14 12 8 3-5-2-10-5-6"/>
    <path d="M22 22c8-4 16 0 18 8-8 2-16 0-18-8z" fill="url(#gg)"/><path d="M28 44c6-8 14-10 22-6M44 28c-8 6-10 14-6 22"/>
    <circle cx="8" cy="8" r="2.5" fill="url(#gg)"/>
  </svg>
);
const GildedFrame = () => (
  <div className="gframe" aria-hidden="true">
    <Corner pos="tl"/><Corner pos="tr"/><Corner pos="bl"/><Corner pos="br"/>
  </div>
);
const Fleur = () => (
  <svg className="gfleur" viewBox="0 0 120 30" fill="none" stroke="url(#gg)" strokeWidth="1.3" strokeLinecap="round" aria-hidden="true">
    <GoldDefs/>
    <path d="M60 2c-4 7-4 13 0 17 4-4 4-10 0-17z" fill="url(#gg)"/>
    <path d="M60 19c-12 0-18-6-24-12-3 4 0 8 4 8M60 19c12 0 18-6 24-12 3 4 0 8-4 8"/>
    <path d="M8 24h44M68 24h44"/><circle cx="60" cy="24" r="2" fill="url(#gg)"/>
  </svg>
);
const Orn = () => (
  <div className="gorn" aria-hidden="true"><svg viewBox="0 0 16 16"><path d="M8 1 15 8 8 15 1 8z" fill="currentColor"/></svg></div>
);
const SecHead = ({ eyebrow, title }) => (
  <div className="gsec-head">
    <h2 className="gh gt"><small>{eyebrow}</small>{title}</h2>
    <Orn/>
  </div>
);

// ---------- Icons ----------
const GI = {
  scissors: <><circle cx="6" cy="6" r="3"/><circle cx="6" cy="18" r="3"/><path d="M20 4 8.12 15.88M14.47 14.48 20 20M8.12 8.12 12 12"/></>,
  clipper: <><rect x="7.5" y="8" width="9" height="13" rx="3"/><path d="M7.5 8V5h9v3M9 5V2.5M11 5V2.5M13 5V2.5M15 5V2.5M10.5 12h3"/></>,
  razor: <><path d="M3 16.5 13.5 6l3.5 2-9 9.5z"/><path d="M13.5 6 19 3.5l1.5 1.5-3.5 3"/></>,
  comb: <><rect x="3" y="5" width="18" height="4" rx="1"/><path d="M5 9v10M8 9v10M11 9v10M14 9v10M17 9v10M20 9v7"/></>,
  towel: <><path d="M8 2.5c-1 1.5 1 2.5 0 4.5M12 2.5c-1 1.5 1 2.5 0 4.5M16 2.5c-1 1.5 1 2.5 0 4.5"/><rect x="4" y="10" width="16" height="10" rx="2"/><path d="M4 14.5h16"/></>,
  drop: <path d="M12 3c3 4 6 7 6 11a6 6 0 0 1-12 0c0-4 3-7 6-11z"/>,
};
const GIcon = ({ name, sw = 1.6, size = 22 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={sw} strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">{GI[name] || GI.scissors}</svg>
);
const SVC_ICON = { "skin-beard": "clipper", "normal-beard": "comb", "skin-fade": "clipper", "taper-fade": "clipper", "scissor": "scissors", "normal": "scissors", "hot-towel": "towel", "oap": "comb", "kids": "scissors", "crew-2-4": "clipper", "beard": "razor", "head-shave": "clipper", "crew-1": "clipper", "wax": "drop" };
const svcPhoto = (id) => `assets/services/${id}.jpg`;

// ---------- Slide to book ----------
const SlideToBook = ({ onBook, label = "SLIDE TO BOOK" }) => {
  const track = React.useRef(null), knob = React.useRef(null);
  const st = React.useRef({ x0: null, x: 0, max: 0 });
  const [x, setX] = React.useState(0), [drag, setDrag] = React.useState(false);
  const down = (e) => { st.current = { x0: e.clientX, x: 0, max: track.current.clientWidth - knob.current.offsetWidth - 10 }; setDrag(true); knob.current.setPointerCapture(e.pointerId); };
  const move = (e) => { const s = st.current; if (s.x0 === null) return; s.x = Math.max(0, Math.min(s.max, e.clientX - s.x0)); setX(s.x); };
  const up = () => { const s = st.current; if (s.x0 === null) return; const done = s.x >= s.max - 6; s.x0 = null; setDrag(false); setX(0); if (done) onBook(); };
  const max = st.current.max || 1;
  return (
    <div className="gslide" ref={track} role="button" tabIndex={0} aria-label="Book a chair"
      onKeyDown={(e) => { if (e.key === "Enter" || e.key === " ") { e.preventDefault(); onBook(); } }}
      onClick={(e) => { if (e.target === track.current || e.target.classList.contains("gslide-lbl")) onBook(); }}>
      <span className="gslide-lbl">{label}</span>
      <span ref={knob} className={`gslide-knob ${drag ? "drag" : ""}`} style={{ transform: x ? `translateX(${x}px) rotate(${x / max * 360}deg)` : undefined }}
        onPointerDown={down} onPointerMove={move} onPointerUp={up} onPointerCancel={up}>
        <GIcon name="razor" sw={1.7} size={26}/>
      </span>
    </div>
  );
};

// ---------- Playing-card service deck ----------
const DECK_TILT = [-3, 2, -2, 3, -1.5, 2];
const CardDeck = ({ services, onPick }) => (
  <div className="gdeck" role="list">
    {services.map((s, i) => (
      <button key={s.id} type="button" role="listitem" className="gcard" style={{ "--r": `${DECK_TILT[i % 6]}deg` }} onClick={() => onPick(s.id)} aria-label={`${s.name}, £${s.price}, ${s.mins} minutes. Book`}>
        <span className="gcard-idx tl">£{s.price}<GIcon name={SVC_ICON[s.id]} size={14}/></span>
        <span className="gcard-face"><i style={{ backgroundImage: `url(${svcPhoto(s.id)})` }}/></span>
        <span className="gcard-name">{s.name}</span>
        <span className="gcard-mins">{s.mins} MIN{s.popular ? " · ★" : ""}</span>
        <span className="gcard-idx br">£{s.price}<GIcon name={SVC_ICON[s.id]} size={14}/></span>
      </button>
    ))}
  </div>
);

// ---------- Next openings (real hours + real bookings) ----------
const pad2 = (n) => String(n).padStart(2, "0");
const isoOf = (d) => `${d.getFullYear()}-${pad2(d.getMonth() + 1)}-${pad2(d.getDate())}`;
const findNextOpenings = (bookings, daysOff, count = 4) => {
  const D = window.CHYAKO_DATA, now = new Date();
  for (let off = 0; off < 14; off++) {
    const d = new Date(now); d.setDate(d.getDate() + off);
    const iso = isoOf(d), dayIdx = (d.getDay() + 6) % 7;
    if (D.getAvailableBarbers(iso, daysOff).length === 0) continue;
    const slots = D.generateSlots(dayIdx)
      .filter(s => s.endsWith(":00") || s.endsWith(":30"))
      .filter(s => !D.isSlotPast(iso, s) && !D.isSlotTaken(iso, s, "any", bookings || [], daysOff || [], 30));
    if (slots.length) {
      const label = off === 0 ? "TODAY" : off === 1 ? "TOMORROW" : d.toLocaleDateString("en-GB", { weekday: "long" }).toUpperCase();
      return { iso, label, slots: slots.slice(0, count) };
    }
  }
  return null;
};

const NextOpenings = ({ bookings, daysOff, onPick, onBook }) => {
  const D = window.CHYAKO_DATA;
  const next = React.useMemo(() => findNextOpenings(bookings, daysOff), [bookings, daysOff]);
  const now = new Date(), dayIdx = (now.getDay() + 6) % 7, row = D.hours[dayIdx];
  const hm = `${pad2(now.getHours())}:${pad2(now.getMinutes())}`;
  const open = hm >= row.open && hm < row.close;
  const status = open ? `Open now · until ${row.close}` : `Closed · opens ${hm < row.open ? row.open : D.hours[(dayIdx + 1) % 7].open}`;
  return (
    <div className="glive">
      <div className="glive-head">
        <span>NEXT OPENINGS</span>
        <span className="glive-status"><i className={open ? "open" : ""}/>{status}</span>
      </div>
      {next ? (
        <>
          <div className="glive-day">{next.label}</div>
          <div className="glive-slots">
            {next.slots.map(s => (
              <button key={s} type="button" onClick={() => onPick({ dateIso: next.iso, slot: s })} aria-label={`Book ${next.label.toLowerCase()} at ${s}`}>{s}</button>
            ))}
          </div>
        </>
      ) : (
        <div className="glive-day">FULLY BOOKED THIS FORTNIGHT</div>
      )}
      <SlideToBook onBook={onBook}/>
    </div>
  );
};

Object.assign(window, { GoldLogo, GildedFrame, Fleur, Orn, SecHead, GIcon, SVC_ICON, svcPhoto, SlideToBook, CardDeck, NextOpenings, findNextOpenings });
