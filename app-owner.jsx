// OWNER DASHBOARD — master view of every booking + workload management.
// Two segments: SCHEDULE (day-by-day agenda) and ALL BOOKINGS (full upcoming list).

const OwnerDashboard = ({ allBookings, daysOff, onSetStatus, onDelete, onAddDayOff, onRemoveDayOff, onSignOut }) => {
  const D = window.CHYAKO_DATA;
  const days = React.useMemo(() => D.next14Days(), []);
  const [seg, setSeg] = React.useState("schedule"); // schedule | all
  const [selectedIso, setSelectedIso] = React.useState(days[0].iso);
  const [barberFilter, setBarberFilter] = React.useState("all"); // all | b1 | b2 | b3

  const barberLabel = (id) => id === "any" ? "ANYONE" : (D.barbers.find(b => b.id === id)?.name.toUpperCase() || "—");
  const barberInit = (id) => id === "any" ? "?" : (D.barbers.find(b => b.id === id)?.initials || "—");
  const svcNames = (ids) => ids.map(id => D.services.find(s => s.id === id)?.name).filter(Boolean);
  const svcMins = (ids) => ids.reduce((s, id) => s + (D.services.find(x => x.id === id)?.mins || 0), 0);
  const dt = (b) => window.bookingDateTime(b);

  // ---- counts per day (for date strip badges) ----
  const countForDay = (iso) => allBookings.filter(b => b.dateIso === iso && b.status !== "cancelled").length;

  // ---- selected-day agenda ----
  const dayAppts = allBookings
    .filter(b => b.dateIso === selectedIso)
    .filter(b => barberFilter === "all" || b.barberId === barberFilter)
    .sort((a, b) => dt(a) - dt(b));

  const dayActive = allBookings.filter(b => b.dateIso === selectedIso && b.status !== "cancelled");
  const chairValue = dayActive.reduce((s, b) => s + (b.dueAtChair ?? b.total ?? 0), 0);
  const barbeCountOn = D.barbers.filter(b => {
    if (!D.isBarberAvailableOn(b.id, selectedIso, daysOff)) return false;
    return true;
  }).length;

  // ---- barber chip counts (selected day) ----
  const barberCount = (id) => allBookings.filter(b => b.dateIso === selectedIso && b.status !== "cancelled" && (id === "all" || b.barberId === id)).length;

  // ---- ALL BOOKINGS — upcoming grouped by date ----
  const upcomingGroups = React.useMemo(() => {
    const up = allBookings
      .filter(b => b.status !== "cancelled" && b.status !== "noshow")
      .filter(b => window.isUpcoming(b))
      .sort((a, b) => dt(a) - dt(b));
    const groups = [];
    up.forEach(b => {
      let g = groups.find(x => x.iso === b.dateIso);
      if (!g) { g = { iso: b.dateIso, items: [] }; groups.push(g); }
      g.items.push(b);
    });
    return groups;
  }, [allBookings]);

  const Appt = ({ b }) => {
    const names = svcNames(b.services);
    const mins = svcMins(b.services);
    return (
      <div className={`oappt ${b.status}`}>
        <div className="oappt-time">
          <span className="oappt-time-h">{b.slot}</span>
          <span className="oappt-dur">{mins}M</span>
        </div>
        <div className="oappt-main">
          <div className="oappt-top">
            <span className="oappt-cust">{(b.customer?.name || "WALK-IN").toUpperCase()}</span>
            <span className={`ostatus ${b.status}`}>{b.status === "noshow" ? "NO-SHOW" : b.status.toUpperCase()}</span>
          </div>
          <div className="oappt-svc">{names.map(n => n.toUpperCase()).join(" · ")}{b.friend ? " · +FRIEND" : ""}</div>
          <div className="oappt-meta">
            <span className="oappt-barber"><span className="oappt-init">{barberInit(b.barberId)}</span>{barberLabel(b.barberId)}</span>
            {b.customer?.phone && <a className="oappt-phone" href={`tel:${b.customer.phone.replace(/\s/g, "")}`}>{b.customer.phone}</a>}
            <span className="oappt-price">£{b.dueAtChair ?? b.total}</span>
          </div>

          {b.status === "confirmed" ? (
            <div className="oappt-actions">
              <button className="oact done" onClick={() => onSetStatus(b.id, "done")}>✓ DONE</button>
              <button className="oact noshow" onClick={() => onSetStatus(b.id, "noshow")}>NO-SHOW</button>
              <button className="oact cancel" onClick={() => onSetStatus(b.id, "cancelled")}>CANCEL</button>
            </div>
          ) : (
            <div className="oappt-actions">
              <button className="oact reopen" onClick={() => onSetStatus(b.id, "confirmed")}>↺ REOPEN</button>
              <button className="oact cancel" onClick={() => onDelete(b.id)}>✕ DELETE</button>
            </div>
          )}
        </div>
      </div>
    );
  };

  return (
    <div className="owner">
      {/* TOPBAR */}
      <div className="owner-topbar">
        <div>
          <div className="owner-eyebrow"><span className="owner-key">⚿</span> MASTER DASHBOARD</div>
          <div className="owner-brand">CHYAKO<span>//CUTZ · SM1</span></div>
        </div>
        <button className="owner-signout" onClick={onSignOut} aria-label="Sign out">
          <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
            <path d="M7 2H3a1 1 0 0 0-1 1v12a1 1 0 0 0 1 1h4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
            <path d="M11 12l4-3-4-3M15 9H6" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
        </button>
      </div>

      {/* SEGMENTED */}
      <div className="owner-seg">
        <button className={`oseg ${seg === "schedule" ? "on" : ""}`} onClick={() => setSeg("schedule")}>SCHEDULE</button>
        <button className={`oseg ${seg === "all" ? "on" : ""}`} onClick={() => setSeg("all")}>ALL BOOKINGS</button>
      </div>

      <div className="owner-body">
        {seg === "schedule" && (
          <>
            {/* DATE STRIP */}
            <div className="oday-strip">
              {days.map(d => {
                const c = countForDay(d.iso);
                const hasOff = (daysOff || []).some(x => x.dateIso === d.iso);
                return (
                  <button key={d.iso} className={`oday ${selectedIso === d.iso ? "on" : ""}`} onClick={() => setSelectedIso(d.iso)}>
                    <span className="oday-name">{d.isToday ? "TDY" : d.day.toUpperCase()}</span>
                    <span className="oday-num">{d.dayNum}</span>
                    {c > 0 && <span className="oday-count">{c}</span>}
                    {hasOff && <span className="oday-off-dot"/>}
                  </button>
                );
              })}
            </div>

            {/* STATS */}
            <div className="ostats">
              <div className="ostat">
                <div className="ostat-num">{dayActive.length}</div>
                <div className="ostat-label">CHAIRS BOOKED</div>
              </div>
              <div className="ostat">
                <div className="ostat-num">£{chairValue}</div>
                <div className="ostat-label">CHAIR VALUE</div>
              </div>
              <div className="ostat">
                <div className="ostat-num">{barbeCountOn}</div>
                <div className="ostat-label">BARBERS ON</div>
              </div>
            </div>

            {/* BARBER FILTER */}
            <div className="obarbers">
              <button className={`obarber ${barberFilter === "all" ? "on" : ""}`} onClick={() => setBarberFilter("all")}>
                ALL <span className="obarber-c">{barberCount("all")}</span>
              </button>
              {D.barbers.map(b => (
                <button key={b.id} className={`obarber ${barberFilter === b.id ? "on" : ""}`} onClick={() => setBarberFilter(b.id)}>
                  {b.name.toUpperCase()} <span className="obarber-c">{barberCount(b.id)}</span>
                </button>
              ))}
            </div>

            {/* DAYS OFF */}
            <div className="odaysoff-section">
              <div className="odaysoff-label">DAYS OFF</div>
              {D.barbers.map(b => {
                const isOff = (daysOff || []).some(x => x.barberId === b.id && x.dateIso === selectedIso);
                return (
                  <button
                    key={b.id}
                    className={`odayoff-row ${isOff ? "active" : ""}`}
                    onClick={() => isOff ? onRemoveDayOff(b.id, selectedIso) : onAddDayOff(b.id, selectedIso)}
                  >
                    <span className="odayoff-init">{b.initials}</span>
                    <span className="odayoff-name">{b.name.toUpperCase()}</span>
                    <span className="odayoff-action">{isOff ? "✕ OFF TODAY" : "+ MARK OFF"}</span>
                  </button>
                );
              })}
            </div>

            {/* AGENDA */}
            <div className="oagenda-head">{window.formatDayLabel(selectedIso)} — {dayAppts.length} {dayAppts.length === 1 ? "BOOKING" : "BOOKINGS"}</div>
            {dayAppts.length === 0 ? (
              <div className="oempty">
                <div className="oempty-mark">✂</div>
                <div className="oempty-title">NO CHAIRS BOOKED</div>
                <div className="oempty-sub">Nothing on the books for this day{barberFilter !== "all" ? " under this barber" : ""}.</div>
              </div>
            ) : (
              dayAppts.map(b => <Appt key={b.id} b={b}/>)
            )}
          </>
        )}

        {seg === "all" && (
          <>
            <div className="oall-head">UPCOMING — {upcomingGroups.reduce((s, g) => s + g.items.length, 0)} BOOKINGS</div>
            {upcomingGroups.length === 0 ? (
              <div className="oempty">
                <div className="oempty-mark">✂</div>
                <div className="oempty-title">ALL CLEAR</div>
                <div className="oempty-sub">No upcoming bookings on the books.</div>
              </div>
            ) : (
              upcomingGroups.map(g => (
                <div key={g.iso} className="ogroup">
                  <div className="ogroup-head">
                    <span>{window.formatDayLabel(g.iso)}</span>
                    <span className="ogroup-count">{g.items.length}</span>
                  </div>
                  {g.items.map(b => <Appt key={b.id} b={b}/>)}
                </div>
              ))
            )}
          </>
        )}
      </div>
    </div>
  );
};

window.OwnerDashboard = OwnerDashboard;
