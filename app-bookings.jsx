// BOOKINGS TAB + ManageSheet + RescheduleSheet

const BookingsTab = ({ bookings, onBook, onManage }) => {
  const D = window.CHYAKO_DATA;
  const [filter, setFilter] = React.useState("upcoming"); // upcoming | past | cancelled

  const sorted = [...bookings].sort((a, b) => window.bookingDateTime(b) - window.bookingDateTime(a));
  const upcoming = sorted.filter(b => b.status !== "cancelled" && window.bookingDateTime(b) >= new Date(Date.now() - 30 * 60 * 1000))
    .sort((a, b) => window.bookingDateTime(a) - window.bookingDateTime(b));
  const past = sorted.filter(b => b.status !== "cancelled" && window.bookingDateTime(b) < new Date(Date.now() - 30 * 60 * 1000));
  const cancelled = sorted.filter(b => b.status === "cancelled");

  const list = filter === "upcoming" ? upcoming : filter === "past" ? past : cancelled;

  return (
    <>
      <section className="hero">
        <div className="hero-greet">★ YOUR CHAIRS</div>
        <h1 className="hero-title">
          BOOKINGS<span style={{ color: '#e8c268' }}>.</span>
        </h1>
      </section>

      <div className="bk-tabs">
        <button className={`bk-tab ${filter === "upcoming" ? "active" : ""}`} onClick={() => setFilter("upcoming")}>
          UPCOMING <span>{upcoming.length}</span>
        </button>
        <button className={`bk-tab ${filter === "past" ? "active" : ""}`} onClick={() => setFilter("past")}>
          PAST <span>{past.length}</span>
        </button>
        <button className={`bk-tab ${filter === "cancelled" ? "active" : ""}`} onClick={() => setFilter("cancelled")}>
          CANCELLED <span>{cancelled.length}</span>
        </button>
      </div>

      <div className="blist">
        {list.length === 0 ? (
          <div className="blist-empty">
            <div className="blist-empty-mark">∅</div>
            <div className="blist-empty-title">
              {filter === "upcoming" ? "NO CHAIR BOOKED" : filter === "past" ? "NO HISTORY YET" : "NOTHING CANCELLED"}
            </div>
            <div className="blist-empty-sub">
              {filter === "upcoming" ? "Pull up a chair — book your first cut." : filter === "past" ? "Your old chairs will live here." : "You've kept every chair so far."}
            </div>
            {filter === "upcoming" && (
              <button className="btn btn-primary" onClick={onBook}>
                <span>BOOK NOW</span>
                <span className="btn-arrow">
                  <svg width="12" height="12" viewBox="0 0 14 14"><path d="M2 12L12 2M5 2h7v7" stroke="currentColor" strokeWidth="1.8" fill="none"/></svg>
                </span>
              </button>
            )}
          </div>
        ) : (
          list.map(b => {
            const isUp = b.status !== "cancelled" && window.bookingDateTime(b) >= new Date(Date.now() - 30 * 60 * 1000);
            const statusText = b.status === "cancelled" ? "CANCELLED" : isUp ? "UPCOMING" : "DONE";
            const barber = b.barberId === "any" ? "ANYONE" : D.barbers.find(x => x.id === b.barberId)?.name.toUpperCase() || "—";
            const svcNames = b.services.map(id => D.services.find(s => s.id === id)?.name).filter(Boolean);
            const total = b.services.reduce((s, id) => s + (D.services.find(x => x.id === id)?.price || 0), 0) * (b.friend ? 2 : 1);
            return (
              <button key={b.id} className={`booking-card ${isUp ? "upcoming" : ""} ${b.status === "cancelled" ? "cancelled" : ""}`} onClick={() => onManage(b.id)}>
                <div className="booking-card-row">
                  <div>
                    <div className="booking-card-day">{window.formatDayLabel(b.dateIso)}</div>
                    <div className="booking-card-when">{b.slot}</div>
                    <div className="booking-card-barber">w/ {barber}</div>
                  </div>
                  <div className={`booking-card-status ${!isUp ? "past" : ""} ${b.status === "cancelled" ? "cancelled-tag" : ""}`}>
                    {statusText}
                  </div>
                </div>
                <div className="booking-card-svcs">
                  <strong>£{total}</strong> · {svcNames.slice(0, 2).join(" · ")}
                  {svcNames.length > 2 ? ` · +${svcNames.length - 2}` : ""}
                </div>
              </button>
            );
          })
        )}
      </div>
    </>
  );
};

// ============ MANAGE SHEET ============
const ManageSheet = ({ booking, onClose, onCancel, onDelete, onReschedule }) => {
  const D = window.CHYAKO_DATA;
  const [confirmCancel, setConfirmCancel] = React.useState(false);
  const barber = booking.barberId === "any" ? "ANYONE" : D.barbers.find(b => b.id === booking.barberId);
  const svcs = booking.services.map(id => D.services.find(s => s.id === id)).filter(Boolean);
  const total = svcs.reduce((s, x) => s + x.price, 0) * (booking.friend ? 2 : 1);
  const dueAtChair = total;
  const isUp = window.isUpcoming(booking);
  const ticketNum = booking.id.slice(-4).toUpperCase();

  return (
    <div className="sheet">
      <window.StatusBar/>
      <div className="sheet-head">
        <div>
          <div className="sheet-num">#{ticketNum}</div>
          <div className="sheet-title">{booking.status === "cancelled" ? "CANCELLED" : isUp ? "YOUR CHAIR" : "PAST BOOKING"}</div>
        </div>
        <button className="sheet-close" onClick={onClose} aria-label="Close">
          <svg width="14" height="14" viewBox="0 0 14 14"><path d="M1 1l12 12M13 1L1 13" stroke="currentColor" strokeWidth="1.8"/></svg>
        </button>
      </div>

      <div className="sheet-body">
        <div className="ticket manage-ticket">
          <div className="ticket-head">
            <span>CHYAKO//CUTZ</span>
            <span>#{ticketNum}</span>
          </div>
          <div className="ticket-when">
            <div className="ticket-day">{window.formatDayLabel(booking.dateIso)}</div>
            <div className="ticket-time">{booking.slot}</div>
          </div>
          <div className="ticket-row"><span>BARBER</span><span>{typeof barber === "string" ? barber : barber.name.toUpperCase()}</span></div>
          {svcs.map(s => (
            <div key={s.id} className="ticket-row"><span>{s.name.toUpperCase()}</span><span>£{s.price}</span></div>
          ))}
          {booking.friend && <div className="ticket-row"><span>+ FRIEND</span><span>×2</span></div>}
          <div className="ticket-divider"/>
          <div className="ticket-total"><span>DUE AT CHAIR</span><span>£{dueAtChair}</span></div>
        </div>

        {/* INFO ROWS */}
        <div className="manage-info">
          <div className="manage-info-row">
            <span className="manage-info-label">LOCATION</span>
            <span className="manage-info-val">RAILWAY BRIDGE<br/>HIGH ST · SUTTON SM1</span>
          </div>
          <div className="manage-info-row">
            <span className="manage-info-label">CALL SHOP</span>
            <a className="manage-info-val link" href="tel:+447888658011">+44 7888 658 011</a>
          </div>
          <div className="manage-info-row">
            <span className="manage-info-label">BOOKED</span>
            <span className="manage-info-val">{new Date(booking.createdAt).toLocaleDateString("en-GB")}</span>
          </div>
        </div>

        {isUp && booking.status !== "cancelled" && !confirmCancel && (
          <div className="manage-actions">
            <button className="btn btn-outline" onClick={() => onReschedule(booking.id)}>
              <span>RESCHEDULE</span>
            </button>
            <button className="btn btn-danger" onClick={() => setConfirmCancel(true)}>
              <span>CANCEL CHAIR</span>
            </button>
          </div>
        )}

        {confirmCancel && (
          <div className="manage-confirm">
            <div className="manage-confirm-title">CANCEL THIS CHAIR?</div>
            <div className="manage-confirm-sub">This can't be undone — you'll need to re-book.</div>
            <div className="manage-actions">
              <button className="btn btn-outline" onClick={() => setConfirmCancel(false)}>
                <span>KEEP IT</span>
              </button>
              <button className="btn btn-danger" onClick={() => onCancel(booking.id)}>
                <span>YES, CANCEL</span>
              </button>
            </div>
          </div>
        )}

        {booking.status === "cancelled" && (
          <div className="manage-cancelled-note">
            ✕ THIS BOOKING WAS CANCELLED.
          </div>
        )}
        {booking.status === "cancelled" && (
          <div className="manage-actions">
            <button className="btn btn-danger" onClick={() => onDelete(booking.id)}>
              <span>DELETE BOOKING</span>
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

// ============ RESCHEDULE SHEET ============
const RescheduleSheet = ({ booking, bookings, onClose, onSave }) => {
  const D = window.CHYAKO_DATA;
  const [dateIso, setDateIso] = React.useState(booking.dateIso);
  const [slot, setSlot] = React.useState(booking.slot);
  const days = React.useMemo(() => D.next14Days(), []);
  const dayObj = days.find(d => d.iso === dateIso) || days[0];
  const slots = D.generateSlots(dayObj.dayIdx);

  return (
    <div className="sheet">
      <window.StatusBar/>
      <div className="sheet-head">
        <div>
          <div className="sheet-num">/RESCHEDULE</div>
          <div className="sheet-title">NEW DATE + TIME</div>
        </div>
        <button className="sheet-close" onClick={onClose} aria-label="Back">
          <svg width="14" height="10" viewBox="0 0 14 10"><path d="M14 5H1M5 1L1 5l4 4" stroke="currentColor" strokeWidth="1.6" fill="none"/></svg>
        </button>
      </div>

      <div className="sheet-body">
        <div className="step">
          <div className="step-intro">PICK A NEW DAY</div>
          <div className="days">
            {days.map(d => (
              <button key={d.iso} className={`day ${dateIso === d.iso ? "checked" : ""}`} onClick={() => { setDateIso(d.iso); setSlot(null); }}>
                <span className="day-name">{d.isToday ? "TDY" : d.day.toUpperCase()}</span>
                <span className="day-num">{d.dayNum}</span>
              </button>
            ))}
          </div>

          <div className="step-intro" style={{ marginTop: 18 }}>OPEN SLOTS</div>
          <div className="slots">
            {slots.map(s => {
              const taken = D.isSlotTaken(dateIso, s, booking.barberId, bookings) || D.isSlotPast(dateIso, s);
              return (
                <button key={s} disabled={taken} className={`slot ${slot === s ? "checked" : ""} ${taken ? "taken" : ""}`} onClick={() => setSlot(s)}>
                  {s}
                </button>
              );
            })}
          </div>
        </div>
      </div>

      <div className="sheet-foot">
        <div className="sheet-summary">
          <div>
            <div className="summary-label">NEW SLOT</div>
            <div className="summary-total">{slot || "—"}</div>
          </div>
          <button className="sheet-cta" disabled={!slot} onClick={() => onSave(booking.id, dateIso, slot)}>
            <span>SAVE</span>
            <div className="btn-arrow">
              <svg width="12" height="12" viewBox="0 0 14 14"><path d="M2 12L12 2M5 2h7v7" stroke="currentColor" strokeWidth="1.8" fill="none"/></svg>
            </div>
          </button>
        </div>
      </div>
    </div>
  );
};

Object.assign(window, { BookingsTab, ManageSheet, RescheduleSheet });
