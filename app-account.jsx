// ACCOUNT TAB — profile, stats, settings rows, sign out.

const AccountTab = ({ user, bookings, onSignOut }) => {
  const D = window.CHYAKO_DATA;
  const completed = bookings.filter(b => b.status !== "cancelled" && window.bookingDateTime(b) < new Date()).length;
  const upcomingCount = bookings.filter(b => b.status !== "cancelled" && window.bookingDateTime(b) >= new Date(Date.now() - 30 * 60 * 1000)).length;
  const spend = bookings
    .filter(b => b.status !== "cancelled" && window.bookingDateTime(b) < new Date())
    .reduce((sum, b) => sum + b.services.reduce((s, id) => s + (D.services.find(x => x.id === id)?.price || 0), 0) * (b.friend ? 2 : 1), 0);

  const since = user.createdAt ? new Date(user.createdAt).toLocaleDateString("en-GB", { month: "short", year: "numeric" }) : "—";

  return (
    <>
      <section className="hero">
        <div className="hero-greet">★ YOUR ACCOUNT</div>
        <h1 className="hero-title">
          ME<span style={{ color: '#e8c268' }}>.</span>
        </h1>
      </section>

      <div className="acct">
        <div className="acct-card">
          <div className="acct-avatar">{(user.name?.[0] || "U").toUpperCase()}</div>
          <h2 className="acct-name">{(user.name || "GUEST").toUpperCase()}</h2>
          <div className="acct-since">MEMBER · {since}</div>

          <div className="acct-stats">
            <div className="acct-stat">
              <div className="acct-stat-num">{completed}</div>
              <div className="acct-stat-label">CUTS</div>
            </div>
            <div className="acct-stat">
              <div className="acct-stat-num">{upcomingCount}</div>
              <div className="acct-stat-label">BOOKED</div>
            </div>
            <div className="acct-stat">
              <div className="acct-stat-num">£{spend}</div>
              <div className="acct-stat-label">SPENT</div>
            </div>
          </div>
        </div>

        {/* CONTACT */}
        <div className="acct-section-label">CONTACT</div>
        <div className="acct-card acct-card-tight">
          <div className="acct-row">
            <div className="acct-row-l">
              <div className="acct-row-icon">
                <svg width="14" height="14" viewBox="0 0 14 14" fill="none"><path d="M2 4l5 4 5-4M2 3h10v8H2z" stroke="currentColor" strokeWidth="1.4"/></svg>
              </div>
              <span className="acct-row-label">EMAIL</span>
            </div>
            <span className="acct-row-val">{user.email || "—"}</span>
          </div>
          <div className="acct-row">
            <div className="acct-row-l">
              <div className="acct-row-icon">
                <svg width="14" height="14" viewBox="0 0 14 14" fill="none"><path d="M3 2l2 1-1 3 2 2 3-1 1 2-2 2c-3 0-7-4-7-7l2-2z" stroke="currentColor" strokeWidth="1.4"/></svg>
              </div>
              <span className="acct-row-label">PHONE</span>
            </div>
            <span className="acct-row-val">{user.phone || "Add"}</span>
          </div>
        </div>

        {/* PREFERENCES */}
        <div className="acct-section-label">PREFERENCES</div>
        <div className="acct-card acct-card-tight">
          <div className="acct-row">
            <div className="acct-row-l">
              <div className="acct-row-icon">
                <svg width="14" height="14" viewBox="0 0 14 14" fill="none"><circle cx="7" cy="5" r="2.5" stroke="currentColor" strokeWidth="1.4"/><path d="M2 13c0-3 2-4.5 5-4.5s5 1.5 5 4.5" stroke="currentColor" strokeWidth="1.4"/></svg>
              </div>
              <span className="acct-row-label">FAVOURITE BARBER</span>
            </div>
            <span className="acct-row-val">{D.barbers[0].name}</span>
          </div>
          <div className="acct-row">
            <div className="acct-row-l">
              <div className="acct-row-icon">
                <svg width="14" height="14" viewBox="0 0 14 14" fill="none"><path d="M2 7l3 3 7-7" stroke="currentColor" strokeWidth="1.6"/></svg>
              </div>
              <span className="acct-row-label">USUAL CUT</span>
            </div>
            <span className="acct-row-val">Skin Fade</span>
          </div>
          <div className="acct-row">
            <div className="acct-row-l">
              <div className="acct-row-icon">
                <svg width="14" height="14" viewBox="0 0 14 14" fill="none"><path d="M7 1v3M7 10v3M1 7h3M10 7h3M3 3l2 2M9 9l2 2M3 11l2-2M9 5l2-2" stroke="currentColor" strokeWidth="1.3"/></svg>
              </div>
              <span className="acct-row-label">NOTIFICATIONS</span>
            </div>
            <span className="acct-row-val">ON</span>
          </div>
        </div>

        {/* SHOP */}
        <div className="acct-section-label">THE SHOP</div>
        <div className="acct-card acct-card-tight">
          <div className="acct-row">
            <div className="acct-row-l">
              <div className="acct-row-icon">
                <svg width="14" height="14" viewBox="0 0 14 14" fill="none"><path d="M7 1C4 1 2 3 2 6c0 4 5 7 5 7s5-3 5-7c0-3-2-5-5-5z" stroke="currentColor" strokeWidth="1.4"/><circle cx="7" cy="6" r="2" stroke="currentColor" strokeWidth="1.4"/></svg>
              </div>
              <span className="acct-row-label">LOCATION</span>
            </div>
            <span className="acct-row-val">SUTTON SM1</span>
          </div>
          <div className="acct-row">
            <div className="acct-row-l">
              <div className="acct-row-icon">
                <svg width="14" height="14" viewBox="0 0 14 14" fill="none"><circle cx="7" cy="7" r="5.5" stroke="currentColor" strokeWidth="1.4"/><path d="M7 4v3l2 2" stroke="currentColor" strokeWidth="1.4"/></svg>
              </div>
              <span className="acct-row-label">HOURS</span>
            </div>
            <span className="acct-row-val">9:00 — 19:00</span>
          </div>
          <div className="acct-row">
            <div className="acct-row-l">
              <div className="acct-row-icon">
                <svg width="14" height="14" viewBox="0 0 14 14" fill="none"><circle cx="7" cy="7" r="5.5" stroke="currentColor" strokeWidth="1.4"/><path d="M7 4v3M7 10h.01" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round"/></svg>
              </div>
              <span className="acct-row-label">HELP &amp; SUPPORT</span>
            </div>
            <svg width="6" height="10" viewBox="0 0 6 10" fill="none"><path d="M1 1l4 4-4 4" stroke="rgba(244,235,214,0.4)" strokeWidth="1.4"/></svg>
          </div>
        </div>

        {/* SIGN OUT */}
        <div className="acct-card acct-card-tight">
          <div className="acct-row danger" onClick={onSignOut}>
            <div className="acct-row-l">
              <div className="acct-row-icon">
                <svg width="14" height="14" viewBox="0 0 14 14" fill="none"><path d="M6 2H3a1 1 0 0 0-1 1v8a1 1 0 0 0 1 1h3M9 4l3 3-3 3M5 7h7" stroke="currentColor" strokeWidth="1.4"/></svg>
              </div>
              <span className="acct-row-label">SIGN OUT</span>
            </div>
          </div>
        </div>

        <div className="acct-footer">
          CHYAKO//CUTZ · v1.0<br/>
          EST 2023 · SUTTON / LDN
        </div>
      </div>
    </>
  );
};

window.AccountTab = AccountTab;
