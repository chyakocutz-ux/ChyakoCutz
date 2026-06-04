// BOOK SHEET — Service → Barber → Date+Time → Review → Confirmed
// User is logged in so we pre-fill name/phone/email and skip the details step.

const BookSheet = ({ user, bookings, onClose, onConfirm }) => {
  const D = window.CHYAKO_DATA;
  const [step, setStep] = React.useState(0);
  const [selectedServices, setSelectedServices] = React.useState([]);
  const [selectedBarber, setSelectedBarber] = React.useState(null);
  const [selectedDate, setSelectedDate] = React.useState(null);
  const [selectedSlot, setSelectedSlot] = React.useState(null);
  const [friend, setFriend] = React.useState(false);
  const [savedId, setSavedId] = React.useState(null);
  const [submitting, setSubmitting] = React.useState(false);
  const [submitError, setSubmitError] = React.useState(null);

  const stepLabels = ["SERVICE", "BARBER", "DATE + TIME", "REVIEW", "CONFIRMED"];

  const totalPrice =selectedServices.reduce((s, id) => s + D.services.find(x => x.id === id).price, 0) * (friend ? 2 : 1);
  const totalMins = selectedServices.reduce((s, id) => s + D.services.find(x => x.id === id).mins, 0);
  const dueAtChair = totalPrice;

  const canAdvance = () => {
    if (step === 0) return selectedServices.length > 0;
    if (step === 1) return selectedBarber !== null;
    if (step === 2) return selectedDate !== null && selectedSlot !== null;
    if (step === 3) return true;
    return false;
  };

  const toggleService = (id) => setSelectedServices(selectedServices.includes(id) ? selectedServices.filter(x => x !== id) : [...selectedServices, id]);
  const days = React.useMemo(() => D.next14Days(), []);

  const handleConfirm = async () => {
    const payload = {
      services: selectedServices,
      barberId: selectedBarber,
      dateIso: selectedDate,
      slot: selectedSlot,
      friend,
      total: totalPrice,
      dueAtChair,
    };
    setSubmitting(true);
    setSubmitError(null);
    try {
      const id = await onConfirm(payload);
      setSavedId(id);
      setStep(4);
    } catch {
      setSubmitError("Couldn't save your booking. Please try again.");
    } finally {
      setSubmitting(false);
    }
  };

  const barberObj = selectedBarber === "any" ? null : D.barbers.find(b => b.id === selectedBarber);

  return (
    <div className="sheet">
      <window.StatusBar/>

      <div className="sheet-head">
        <div>
          <div className="sheet-num">0{step + 1}/05</div>
          <div className="sheet-title">{stepLabels[step]}</div>
        </div>
        <button className="sheet-close" onClick={onClose} aria-label="Close">
          <svg width="14" height="14" viewBox="0 0 14 14"><path d="M1 1l12 12M13 1L1 13" stroke="currentColor" strokeWidth="1.8"/></svg>
        </button>
      </div>

      <div className="sheet-prog">
        {stepLabels.map((_, i) => (
          <div key={i} className={`prog-bar ${i <= step ? "active" : ""}`}/>
        ))}
      </div>

      <div className="sheet-body">
        {/* STEP 0 — SERVICES */}
        {step === 0 && (
          <div className="step">
            <div className="step-intro">PICK YOUR CUTS — STACK 'EM UP.</div>
            {D.services.map((s, i) => {
              const checked = selectedServices.includes(s.id);
              return (
                <button key={s.id} className={`svc-card ${checked ? "checked" : ""}`} onClick={() => toggleService(s.id)}>
                  <div className="svc-card-l">
                    <div className="svc-card-num">{String(i + 1).padStart(2, "0")}</div>
                    <div>
                      <div className="svc-card-name">{s.name}</div>
                      <div className="svc-card-meta">{s.mins} MIN{s.popular ? " · ★" : ""}</div>
                    </div>
                  </div>
                  <div className="svc-card-r">
                    <div className="svc-card-price">£{s.price}</div>
                    <div className={`svc-card-check ${checked ? "on" : ""}`}>
                      {checked && <svg width="10" height="8" viewBox="0 0 10 8"><path d="M1 4l3 3 5-6" stroke="#000" strokeWidth="2" fill="none"/></svg>}
                    </div>
                  </div>
                </button>
              );
            })}
          </div>
        )}

        {/* STEP 1 — BARBER */}
        {step === 1 && (
          <div className="step">
            <div className="step-intro">CHOOSE YOUR BLADE.</div>
            {D.barbers.map((b, i) => (
              <button key={b.id} className={`barber ${selectedBarber === b.id ? "checked" : ""}`} onClick={() => setSelectedBarber(b.id)}>
                <div className="barber-avatar">
                  <span className="barber-init">{b.initials}</span>
                  <span className="barber-tag">/{String(i + 1).padStart(2, "0")}</span>
                </div>
                <div className="barber-mid">
                  <div className="barber-name">{b.name.toUpperCase()}</div>
                  <div className="barber-role">{b.role.toUpperCase()} · {b.years}Y</div>
                  <div className="barber-spec">{b.specialty}</div>
                </div>
              </button>
            ))}
            <button className={`barber ${selectedBarber === "any" ? "checked" : ""}`} onClick={() => setSelectedBarber("any")}>
              <div className="barber-avatar"><span className="barber-init">?</span></div>
              <div className="barber-mid">
                <div className="barber-name">ANYONE</div>
                <div className="barber-role">FIRST AVAILABLE</div>
                <div className="barber-spec">We'll pair you fast.</div>
              </div>
            </button>
          </div>
        )}

        {/* STEP 2 — DATE + TIME */}
        {step === 2 && (
          <div className="step">
            <div className="step-intro">WHEN ARE YOU PULLING UP?</div>
            <div className="days">
              {days.map(d => (
                <button key={d.iso} className={`day ${selectedDate === d.iso ? "checked" : ""}`} onClick={() => { setSelectedDate(d.iso); setSelectedSlot(null); }}>
                  <span className="day-name">{d.isToday ? "TDY" : d.day.toUpperCase()}</span>
                  <span className="day-num">{d.dayNum}</span>
                </button>
              ))}
            </div>
            {selectedDate && (
              <>
                <div className="step-intro" style={{ marginTop: 18 }}>OPEN SLOTS</div>
                <div className="slots">
                  {(() => {
                    const dayObj = days.find(x => x.iso === selectedDate);
                    const slots = D.generateSlots(dayObj.dayIdx);
                    return slots.map(slot => {
                      const taken = D.isSlotTaken(selectedDate, slot, selectedBarber || "any", bookings);
                      return (
                        <button key={slot} disabled={taken} className={`slot ${selectedSlot === slot ? "checked" : ""} ${taken ? "taken" : ""}`} onClick={() => setSelectedSlot(slot)}>
                          {slot}
                        </button>
                      );
                    });
                  })()}
                </div>
              </>
            )}
          </div>
        )}

        {/* STEP 3 — REVIEW */}
        {step === 3 && (
          <div className="step">
            <div className="step-intro">REVIEW &amp; LOCK IN.</div>

            <div className="review-block">
              <div className="review-row">
                <span className="review-label">WHO</span>
                <span className="review-val">{(user.name || "—").toUpperCase()}</span>
              </div>
              <div className="review-row">
                <span className="review-label">PHONE</span>
                <span className="review-val">{user.phone || "—"}</span>
              </div>
              <div className="review-row">
                <span className="review-label">EMAIL</span>
                <span className="review-val">{user.email || "—"}</span>
              </div>
              <p className="review-hint">Wrong details? Update in Account before booking.</p>
            </div>

            <div className="review-block">
              <div className="review-row">
                <span className="review-label">WHEN</span>
                <span className="review-val">{window.formatDayLabel(selectedDate)} · {selectedSlot}</span>
              </div>
              <div className="review-row">
                <span className="review-label">BARBER</span>
                <span className="review-val">{barberObj ? barberObj.name.toUpperCase() : "ANYONE"}</span>
              </div>
              <div className="review-row">
                <span className="review-label">DURATION</span>
                <span className="review-val">{totalMins} MIN</span>
              </div>
            </div>

            <div className="review-block">
              <div className="review-block-head">SERVICES</div>
              {selectedServices.map(id => {
                const s = D.services.find(x => x.id === id);
                return (
                  <div key={id} className="review-row">
                    <span className="review-val">{s.name.toUpperCase()}</span>
                    <span className="review-label" style={{ color: 'var(--gold)' }}>£{s.price}</span>
                  </div>
                );
              })}
              {friend && (
                <div className="review-row">
                  <span className="review-val">+ FRIEND (×2)</span>
                  <span className="review-label" style={{ color: 'var(--gold)' }}>×2</span>
                </div>
              )}
            </div>

            <button className={`friend-card ${friend ? "on" : ""}`} onClick={() => setFriend(!friend)}>
              <div className="friend-icon">+1</div>
              <div className="friend-mid">
                <div className="friend-name">BRING A FRIEND</div>
                <div className="friend-sub">2 CHAIRS · PRICE ×2</div>
              </div>
              <div className={`svc-card-check ${friend ? "on" : ""}`}>
                {friend && <svg width="10" height="8" viewBox="0 0 10 8"><path d="M1 4l3 3 5-6" stroke="#000" strokeWidth="2" fill="none"/></svg>}
              </div>
            </button>

            <div className="review-block pay-block">
              <div className="review-block-head">PAYMENT</div>
              <div className="review-row">
                <span className="review-val">SERVICE TOTAL</span>
                <span className="review-label" style={{ color: 'var(--cream-dim)' }}>£{totalPrice}</span>
              </div>
              <div className="review-row">
                <span className="review-val">DUE AT CHAIR</span>
                <span className="review-label" style={{ color: 'var(--cream-dim)' }}>£{dueAtChair}</span>
              </div>
            </div>
          </div>
        )}

        {/* STEP 4 — CONFIRMED */}
        {step === 4 && (
          <div className="step confirm">
            <div className="confirm-badge">
              <div className="confirm-mark">✓</div>
              <div className="confirm-rings"/>
            </div>
            <div className="confirm-eyebrow">CHAIR LOCKED IN</div>
            <h2 className="confirm-title">{(user.name || "YOU").split(" ")[0].toUpperCase()},<br/>WE GOT YOU.</h2>

            <div className="ticket">
              <div className="ticket-head">
                <span>CHYAKO//CUTZ</span>
                <span>#{savedId ? savedId.slice(-4).toUpperCase() : "—"}</span>
              </div>
              <div className="ticket-when">
                <div className="ticket-day">{window.formatDayLabel(selectedDate)}</div>
                <div className="ticket-time">{selectedSlot}</div>
              </div>
              <div className="ticket-row">
                <span>BARBER</span>
                <span>{barberObj ? barberObj.name.toUpperCase() : "ANYONE"}</span>
              </div>
              {selectedServices.map(id => {
                const s = D.services.find(x => x.id === id);
                return <div key={id} className="ticket-row"><span>{s.name.toUpperCase()}</span><span>£{s.price}</span></div>;
              })}
              {friend && <div className="ticket-row"><span>+ FRIEND</span><span>×2</span></div>}
              <div className="ticket-divider"/>
              <div className="ticket-total"><span>DUE AT CHAIR</span><span>£{dueAtChair}</span></div>
            </div>

            <button className="btn btn-primary confirm-done" onClick={onClose}>
              <span>DONE</span>
              <span className="btn-arrow">
                <svg width="12" height="12" viewBox="0 0 14 14"><path d="M2 12L12 2M5 2h7v7" stroke="currentColor" strokeWidth="1.8" fill="none"/></svg>
              </span>
            </button>
          </div>
        )}
      </div>

      {step < 4 && (
        <div className="sheet-foot">
          <div className="sheet-summary">
            <div>
              <div className="summary-label">{`${selectedServices.length} SVC · ${totalMins}MIN${friend ? " · ×2" : ""}`}</div>
              <div className="summary-total">£{totalPrice}</div>
            </div>
            <button className="sheet-cta" disabled={!canAdvance() || submitting} onClick={() => step === 3 ? handleConfirm() : setStep(step + 1)}>
              <span>{submitting ? "BOOKING…" : step === 3 ? "LOCK IN" : "NEXT"}</span>
              {!submitting && <div className="btn-arrow">
                <svg width="12" height="12" viewBox="0 0 14 14"><path d="M2 12L12 2M5 2h7v7" stroke="currentColor" strokeWidth="1.8" fill="none"/></svg>
              </div>}
            </button>
          </div>
          {submitError && <div className="sheet-submit-error">{submitError}</div>}
          {step > 0 && <button className="sheet-back" onClick={() => setStep(step - 1)}>← BACK</button>}
        </div>
      )}
    </div>
  );
};

window.BookSheet = BookSheet;
