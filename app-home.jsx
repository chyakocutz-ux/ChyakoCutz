// HOME TAB — Gilded "Atelier × Gold": B&W parlour banner, next booking or next openings,
// playing-card menu, craft band, barbers, hours.

const formatDayLabel = (iso) => {
  const d = new Date(iso + "T00:00:00");
  const today = new Date(); today.setHours(0,0,0,0);
  const tmrw = new Date(today); tmrw.setDate(tmrw.getDate() + 1);
  if (d.getTime() === today.getTime()) return "TODAY";
  if (d.getTime() === tmrw.getTime()) return "TOMORROW";
  return d.toLocaleDateString("en-GB", { weekday: "short", day: "2-digit", month: "short" }).toUpperCase();
};

const FULL_DAY = { Mon: "Monday", Tue: "Tuesday", Wed: "Wednesday", Thu: "Thursday", Fri: "Friday", Sat: "Saturday", Sun: "Sunday" };

const HomeTab = ({ user, upcoming, allBookings, daysOff, onBook, onManage }) => {
  const D = window.CHYAKO_DATA;
  const firstName = (user.name || "").trim().split(" ")[0].toUpperCase();
  const todayIdx = (new Date().getDay() + 6) % 7;
  const barbers = D.activeBarbers();

  return (
    <div className="ghome">
      {/* HERO BANNER */}
      <section className="ghero">
        <div className="ghero-top">
          <window.Fleur/>
          <window.GoldLogo className="ghero-logo"/>
        </div>
        <div className="ghero-copy">
          <p className="ghero-kicker">{firstName ? `WELCOME BACK, ${firstName}` : "WELCOME TO CHYAKO CUTZ"}</p>
          <h1 className="ghero-title gt">Take a seat.<br/>We'll do the rest.</h1>
        </div>
      </section>

      {/* NEXT BOOKING or NEXT OPENINGS */}
      {upcoming ? (
        <div className="upcoming">
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
            <button className="upcoming-btn" onClick={() => onManage(upcoming.id)}>MANAGE</button>
            <button className="upcoming-btn" onClick={() => onManage(upcoming.id)}>VIEW TICKET</button>
          </div>
        </div>
      ) : (
        <window.NextOpenings
          bookings={allBookings}
          daysOff={daysOff}
          onPick={({ dateIso, slot }) => onBook({ dateIso, slot })}
          onBook={() => onBook()}
        />
      )}

      {/* THE MENU — playing cards */}
      <section className="gsec">
        <window.SecHead eyebrow="PICK A CARD" title="The Menu"/>
        <window.CardDeck services={D.services} onPick={(id) => onBook({ services: [id] })}/>
      </section>

      {/* CRAFT BAND */}
      <div className="gcraft">
        <i/>
        <p>"Every line,<br/>by hand."<small>THE CRAFT · {D.brand.since.toUpperCase()}</small></p>
      </div>

      {/* BARBERS */}
      <section className="gsec">
        <window.SecHead eyebrow="THE CHAIRS" title="Our Barbers"/>
        <div className="gcrew">
          {barbers.map(b => (
            <div key={b.id}>
              <div className="goval">{b.initials}</div>
              <b>{b.name}</b>
              <span>{b.role}</span>
            </div>
          ))}
        </div>
      </section>

      {/* HOURS + ADDRESS */}
      <section className="gsec">
        <window.SecHead eyebrow="VISIT" title="Opening Hours"/>
        <ul className="ghours">
          {D.hours.map((h, i) => (
            <li key={h.day} className={i === todayIdx ? "today" : ""}>
              <span>{FULL_DAY[h.day]}</span><span>{h.open} – {h.close}</span>
            </li>
          ))}
        </ul>
        <p className="gaddr">
          {D.brand.address.split(", ")[0]}<br/>{D.brand.address.split(", ").slice(1).join(", ")}<br/>
          <a href={`tel:${D.brand.phone.replace(/\s/g, "")}`}>{D.brand.phone}</a>
        </p>
      </section>

      <div className="home-foot">CHYAKO CUTZ · {D.brand.since.toUpperCase()}</div>
    </div>
  );
};

window.HomeTab = HomeTab;
window.formatDayLabel = formatDayLabel;
