// HOME TAB — greeting, next booking card, quick book, popular services, info strip.

const formatDayLabel = (iso) => {
  const d = new Date(iso + "T00:00:00");
  const today = new Date(); today.setHours(0,0,0,0);
  const tmrw = new Date(today); tmrw.setDate(tmrw.getDate() + 1);
  if (d.getTime() === today.getTime()) return "TODAY";
  if (d.getTime() === tmrw.getTime()) return "TOMORROW";
  return d.toLocaleDateString("en-GB", { weekday: "short", day: "2-digit", month: "short" }).toUpperCase();
};

const HomeTab = ({ user, upcoming, bookings, onBook, onManage, onSeeAll }) => {
  const D = window.CHYAKO_DATA;
  const firstName = (user.name || "GUEST").split(" ")[0].toUpperCase();

  // Status: open / closed (open 09:00–19:00 weekdays/sat, 10:00-17:00 sun)
  const now = new Date();
  const dayIdx = (now.getDay() + 6) % 7;
  const hoursRow = D.hours[dayIdx];
  const [oh] = hoursRow.open.split(":").map(Number);
  const [ch] = hoursRow.close.split(":").map(Number);
  const hourNow = now.getHours();
  const isOpen = hourNow >= oh && hourNow < ch;

  // Find next free slot today for the bottom hint
  const todaySlots = D.generateSlots(dayIdx);
  const nextSlot = todaySlots.find(s => {
    const [h, m] = s.split(":").map(Number);
    return (h > hourNow) || (h === hourNow && m > now.getMinutes());
  }) || "TMRW 09:00";

  const popular = D.services.filter(s => s.popular).slice(0, 3);
  const quick = D.services.filter(s => !s.popular).slice(0, 6);

  return (
    <>
      {/* HERO greeting */}
      <section className="hero">
        <div className="hero-greet">★ WELCOME BACK, {firstName}</div>
        <h1 className="hero-title">
          READY FOR<br/>
          <span className="hero-title-accent">A FRESH ONE?</span>
        </h1>
        <div className="hero-meta">
          <div className="hero-meta-item">
            <div className="hero-meta-label">SHOP</div>
            <div className={`hero-meta-val ${isOpen ? "live" : ""}`}>{isOpen ? "OPEN" : "CLOSED"}</div>
          </div>
          <div className="hero-meta-item">
            <div className="hero-meta-label">HOURS</div>
            <div className="hero-meta-val">{hoursRow.open}—{hoursRow.close}</div>
          </div>
          <div className="hero-meta-item">
            <div className="hero-meta-label">NEXT</div>
            <div className="hero-meta-val">{nextSlot}</div>
          </div>
        </div>
      </section>

      {/* UPCOMING BOOKING CARD or BIG BOOK CTA */}
      {upcoming ? (
        <div className="upcoming" onClick={() => onManage(upcoming.id)}>
          <div className="upcoming-eyebrow">
            <span className="upcoming-dot"/>
            YOUR NEXT CHAIR
          </div>
          <div className="upcoming-row">
            <div>
              <div className="upcoming-when-day">{formatDayLabel(upcoming.dateIso)}</div>
              <div className="upcoming-when-time">{upcoming.slot}</div>
            </div>
            <div className="upcoming-svc">
              <strong>{upcoming.barberId === "any" ? "ANYONE" : (D.barbers.find(b => b.id === upcoming.barberId)?.name.toUpperCase() || "BARBER")}</strong>
              {upcoming.services.slice(0, 2).map(id => {
                const s = D.services.find(x => x.id === id);
                return <div key={id}>{s?.name}</div>;
              })}
              {upcoming.services.length > 2 && <div>+{upcoming.services.length - 2} more</div>}
            </div>
          </div>
          <div className="upcoming-actions">
            <button className="upcoming-btn" onClick={(e) => { e.stopPropagation(); onManage(upcoming.id); }}>MANAGE</button>
            <button className="upcoming-btn" onClick={(e) => { e.stopPropagation(); onManage(upcoming.id); }}>VIEW TICKET</button>
          </div>
        </div>
      ) : (
        <div className="hero-cta-wrap">
          <button className="btn btn-primary hero-cta" onClick={onBook}>
            <span>BOOK A CHAIR</span>
            <span className="btn-arrow">
              <svg width="12" height="12" viewBox="0 0 14 14"><path d="M2 12L12 2M5 2h7v7" stroke="currentColor" strokeWidth="1.8" fill="none"/></svg>
            </span>
          </button>
        </div>
      )}

      {/* POPULAR SERVICES */}
      <div className="sec-head">
        <div className="sec-num">/01</div>
        <div>
          <div className="sec-eyebrow">MOST BOOKED</div>
          <h2 className="sec-title">POPULAR CUTS</h2>
        </div>
      </div>
      <div className="svc-grid">
        {popular.map((s, i) => (
          <button key={s.id} className={`svc-tile ${i === 0 ? "feature" : ""}`} onClick={onBook}>
            <div className="svc-tile-num">{String(i + 1).padStart(2, "0")}</div>
            <div className="svc-tile-name">{s.name}</div>
            <div className="svc-tile-row">
              <span className="svc-tile-price">£{s.price}</span>
              <span className="svc-tile-mins">{s.mins}MIN</span>
            </div>
            {s.popular && <div className="svc-tile-tag">★ POPULAR</div>}
          </button>
        ))}
      </div>

      {/* QUICK SERVICES LIST */}
      <div className="sec-head">
        <div className="sec-num">/02</div>
        <div>
          <div className="sec-eyebrow">FULL LINE-UP</div>
          <h2 className="sec-title">PRICES</h2>
        </div>
      </div>
      <div className="svc-list">
        {quick.map(s => (
          <div key={s.id} className="svc-line" onClick={onBook}>
            <span className="svc-line-name">{s.name}</span>
            <span className="svc-line-dots"/>
            <span className="svc-line-price">£{s.price}</span>
          </div>
        ))}
        <button className="svc-line-more" onClick={onBook}>
          SEE ALL {D.services.length} SERVICES →
        </button>
      </div>

      {/* INFO STRIP */}
      <div className="info-strip">
        <div className="info-block">
          <div className="info-eyebrow">FIND US</div>
          <div className="info-val">RAILWAY BRIDGE<br/>HIGH ST · SUTTON</div>
        </div>
        <div className="info-block">
          <div className="info-eyebrow">CALL</div>
          <div className="info-val">07888<br/>658 011</div>
        </div>
      </div>

      <div className="home-foot">CHYAKO//CUTZ · SM1 · EST 23</div>
    </>
  );
};

window.HomeTab = HomeTab;
window.formatDayLabel = formatDayLabel;
