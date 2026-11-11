// STAFF PANEL — owner-only. Each barber gets a personal login linked to their chair.
// When someone leaves, the owner removes their access here; the master passcode stays the same.

const DAY_NAMES = ["MON", "TUE", "WED", "THU", "FRI", "SAT", "SUN"];

const callFn = async (name, payload) => {
  if (!window.fbFunctions) window.fbFunctions = firebase.functions();
  const res = await window.fbFunctions.httpsCallable(name)(payload);
  return res.data;
};

const errMsg = (err) => err?.message || "Something went wrong — try again";

const makeTempPassword = () => {
  const chars = "ABCDEFGHJKLMNPQRSTUVWXYZabcdefghjkmnpqrstuvwxyz23456789";
  const buf = new Uint32Array(10);
  crypto.getRandomValues(buf);
  return Array.from(buf, n => chars[n % chars.length]).join("");
};

// Form for adding a new barber with a login, or giving a login to an existing barber
const StaffForm = ({ barber, onDone, onCancel }) => {
  const isNew = !barber;
  const [name, setName] = React.useState(barber?.name || "");
  const [title, setTitle] = React.useState("Barber");
  const [days, setDays] = React.useState([0, 1, 2, 3, 4, 5, 6]);
  const [email, setEmail] = React.useState("");
  const [password, setPassword] = React.useState(makeTempPassword);
  const [busy, setBusy] = React.useState(false);
  const [error, setError] = React.useState(null);

  const toggleDay = (d) => setDays(prev => prev.includes(d) ? prev.filter(x => x !== d) : [...prev, d].sort());

  const submit = async (e) => {
    e.preventDefault();
    setError(null);
    if (!name.trim()) return setError("Name required");
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim())) return setError("Enter a valid email");
    if (password.length < 6) return setError("Password must be at least 6 characters");
    if (isNew && days.length === 0) return setError("Pick at least one working day");
    setBusy(true);
    try {
      const res = await callFn("createStaff", {
        name: name.trim(),
        email: email.trim(),
        tempPassword: password,
        ...(isNew
          ? { newBarber: { name: name.trim(), role: title.trim() || "Barber", workingDayIdx: days } }
          : { barberId: barber.id })
      });
      onDone({ name: name.trim(), email: email.trim().toLowerCase(), password, emailSent: !!res?.emailSent });
    } catch (err) {
      setError(errMsg(err));
      setBusy(false);
    }
  };

  return (
    <form className="ostaff-form" onSubmit={submit}>
      <div className="ostaff-form-title">{isNew ? "ADD NEW BARBER" : `GIVE ${barber.name.toUpperCase()} A LOGIN`}</div>

      <label className="field">
        <span className="field-label">NAME</span>
        <input className="input" value={name} onChange={e => setName(e.target.value)} placeholder="e.g. Marcus" maxLength={40}/>
      </label>

      {isNew && (
        <>
          <label className="field">
            <span className="field-label">TITLE <span>(shown to customers)</span></span>
            <input className="input" value={title} onChange={e => setTitle(e.target.value)} placeholder="Barber" maxLength={40}/>
          </label>
          <div className="field">
            <span className="field-label">WORKING DAYS</span>
            <div className="ostaff-days">
              {DAY_NAMES.map((d, i) => (
                <button type="button" key={d} className={`ostaff-day ${days.includes(i) ? "on" : ""}`} onClick={() => toggleDay(i)}>{d}</button>
              ))}
            </div>
          </div>
        </>
      )}

      <label className="field">
        <span className="field-label">THEIR EMAIL</span>
        <input className="input" type="email" value={email} onChange={e => setEmail(e.target.value)} placeholder="name@email.com" autoComplete="off"/>
      </label>

      <label className="field">
        <span className="field-label">TEMPORARY PASSWORD</span>
        <div className="ostaff-pw">
          <input className="input" value={password} onChange={e => setPassword(e.target.value)} autoComplete="off"/>
          <button type="button" className="ostaff-btn" onClick={() => setPassword(makeTempPassword())}>NEW</button>
        </div>
      </label>

      {error && <div className="field-error">{error}</div>}

      <div className="ostaff-form-actions">
        <button type="button" className="ostaff-btn" onClick={onCancel} disabled={busy}>CANCEL</button>
        <button type="submit" className="ostaff-btn primary" disabled={busy}>{busy ? "CREATING…" : "CREATE LOGIN"}</button>
      </div>
    </form>
  );
};

const StaffPanel = ({ barbers }) => {
  const [staffUsers, setStaffUsers] = React.useState({});
  const [formFor, setFormFor] = React.useState(null);     // null | "new" | barberId
  const [confirmRemove, setConfirmRemove] = React.useState(null); // barberId
  const [hideOnRemove, setHideOnRemove] = React.useState(true);
  const [busyId, setBusyId] = React.useState(null);
  const [error, setError] = React.useState(null);
  const [created, setCreated] = React.useState(null);     // { name, email, password }

  React.useEffect(() => {
    return window.fbDb.collection("users").where("role", "==", "staff").onSnapshot(
      snap => {
        const map = {};
        snap.docs.forEach(d => { map[d.id] = { uid: d.id, ...d.data() }; });
        setStaffUsers(map);
      },
      () => {}
    );
  }, []);

  const toggleActive = async (b) => {
    setBusyId(b.id); setError(null);
    try { await callFn("updateBarber", { id: b.id, fields: { active: b.active === false } }); }
    catch (err) { setError(errMsg(err)); }
    setBusyId(null);
  };

  const removeAccess = async (b) => {
    setBusyId(b.id); setError(null);
    try {
      await callFn("removeStaff", { uid: b.staffUid, hideBarber: hideOnRemove });
      setConfirmRemove(null);
    } catch (err) { setError(errMsg(err)); }
    setBusyId(null);
  };

  return (
    <div className="ostaff">
      <p className="ostaff-intro">
        Every barber gets their own login and sees only their own chair. When someone leaves, remove their access here. Your master passcode doesn't need to change.
      </p>

      {created && (
        <div className="ostaff-created">
          <div className="ostaff-created-title">LOGIN CREATED FOR {created.name.toUpperCase()}</div>
          <div className="ostaff-created-row"><span>EMAIL</span><strong>{created.email}</strong></div>
          {created.emailSent ? (
            <p>We've emailed {created.name} a link to set their own password, with sign-in steps. Ask them to check their spam folder if it hasn't arrived in a few minutes.</p>
          ) : (
            <>
              <div className="ostaff-created-row"><span>TEMP PASSWORD</span><strong>{created.password}</strong></div>
              <p>The welcome email couldn't be sent, so pass these on yourself. They tap <b>OWNER / STAFF ACCESS → Sign in with your email</b>, then use <b>Forgot password?</b> to set their own.</p>
            </>
          )}
          <button className="ostaff-btn" onClick={() => setCreated(null)}>DONE</button>
        </div>
      )}

      {error && <div className="field-error ostaff-error">{error}</div>}

      {barbers.map(b => {
        const account = b.staffUid ? staffUsers[b.staffUid] : null;
        const hidden = b.active === false;
        const busy = busyId === b.id;
        return (
          <div key={b.id} className={`ostaff-card ${hidden ? "hidden" : ""}`}>
            <div className="ostaff-card-top">
              <span className="odayoff-init">{b.initials}</span>
              <div className="ostaff-card-main">
                <div className="ostaff-name">{b.name.toUpperCase()}</div>
                <div className="ostaff-meta">{(b.role || "Barber").toUpperCase()}{window.CHYAKO_DATA.workingDaysLabel(b.workingDayIdx) ? ` · ${window.CHYAKO_DATA.workingDaysLabel(b.workingDayIdx)}` : ""}</div>
                <div className="ostaff-login">
                  {b.staffUid ? <>LOGIN · <span>{account?.email || "linked"}</span></> : <span className="none">NO LOGIN</span>}
                  {hidden && <span className="ostaff-badge">HIDDEN FROM BOOKING</span>}
                </div>
              </div>
            </div>

            {confirmRemove === b.id ? (
              <div className="ostaff-confirm">
                <div>Remove {b.name}'s access? They'll be signed out on every device.</div>
                <label className="ostaff-check">
                  <input type="checkbox" checked={hideOnRemove} onChange={e => setHideOnRemove(e.target.checked)}/>
                  Also hide them from booking
                </label>
                <div className="ostaff-form-actions">
                  <button className="ostaff-btn" onClick={() => setConfirmRemove(null)} disabled={busy}>KEEP</button>
                  <button className="ostaff-btn danger" onClick={() => removeAccess(b)} disabled={busy}>{busy ? "REMOVING…" : "REMOVE ACCESS"}</button>
                </div>
              </div>
            ) : formFor === b.id ? (
              <StaffForm barber={b} onCancel={() => setFormFor(null)} onDone={(c) => { setFormFor(null); setCreated(c); }}/>
            ) : (
              <div className="ostaff-actions">
                {b.staffUid
                  ? <button className="ostaff-btn danger" onClick={() => { setConfirmRemove(b.id); setHideOnRemove(true); }}>REMOVE ACCESS</button>
                  : <button className="ostaff-btn primary" onClick={() => setFormFor(b.id)}>GIVE LOGIN</button>}
                <button className="ostaff-btn" onClick={() => toggleActive(b)} disabled={busy}>
                  {busy ? "SAVING…" : hidden ? "SHOW IN BOOKING" : "HIDE FROM BOOKING"}
                </button>
              </div>
            )}
          </div>
        );
      })}

      {formFor === "new"
        ? <div className="ostaff-card"><StaffForm onCancel={() => setFormFor(null)} onDone={(c) => { setFormFor(null); setCreated(c); }}/></div>
        : <button className="ostaff-add" onClick={() => { setFormFor("new"); setCreated(null); }}>+ ADD NEW BARBER</button>}
    </div>
  );
};

window.StaffPanel = StaffPanel;
