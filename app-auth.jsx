// Welcome + Auth screens
// Welcome (splash) → SignUp / SignIn → Home (handled by parent)

const StatusBar = () => (
  <div className="statusbar">
    <span>9:41</span>
    <span className="statusbar-r">
      <svg width="16" height="10" viewBox="0 0 16 10"><path d="M1 8h2v2H1zM5 6h2v4H5zM9 3h2v7H9zM13 0h2v10h-2z" fill="currentColor"/></svg>
      <svg width="14" height="10" viewBox="0 0 14 10"><path d="M7 9.5c.6 0 1-.4 1-1s-.4-1-1-1-1 .4-1 1 .4 1 1 1zM7 5.5c1.4 0 2.7.5 3.7 1.4l-.8.8C9.2 7 8.2 6.5 7 6.5s-2.2.5-3 1.2l-.8-.8c1-.9 2.4-1.4 3.8-1.4zM7 1.5c2.5 0 4.8 1 6.6 2.5l-.9.9C11.2 3.6 9.2 2.7 7 2.7s-4.2.9-5.7 2.2l-.9-.9C2.2 2.5 4.5 1.5 7 1.5z" fill="currentColor"/></svg>
      <svg width="22" height="10" viewBox="0 0 22 10"><rect x="0.5" y="0.5" width="18" height="9" rx="1.5" fill="none" stroke="currentColor"/><rect x="2" y="2" width="14" height="6" fill="currentColor"/><rect x="19" y="3.5" width="1.5" height="3" fill="currentColor"/></svg>
    </span>
  </div>
);

// ------- WELCOME -------
const WelcomeScreen = ({ onSignUp, onSignIn, onOwner }) => {
  const videoRef = React.useRef(null);
  React.useEffect(() => {
    if (videoRef.current) { videoRef.current.muted = true; videoRef.current.play().catch(() => {}); }
  }, []);

  return (
    <div className="screen">
      <video ref={videoRef} className="welcome-bg-video" autoPlay muted loop playsInline>
        <source src="assets/bg1.mp4" type="video/mp4"/>
      </video>
      <div className="welcome-veil"/>

      <div className="welcome-body welcome-body-logo">
        <div>
          <StatusBar/>
          <div className="welcome-top" style={{ marginTop: 14, padding: '0 0' }}>
            <div className="welcome-badge">
              <span className="welcome-badge-dot"/>
              OPEN NOW
            </div>
            <div className="welcome-loc">SUTTON · UK</div>
          </div>
        </div>

        {/* Logo image carries the wordmark — no overlay text */}
        <div/>

        <div>
          <div className="welcome-actions">
            <button className="btn btn-primary" onClick={onSignUp}>
              <span>CREATE ACCOUNT</span>
              <span className="btn-arrow">
                <svg width="12" height="12" viewBox="0 0 14 14"><path d="M2 12L12 2M5 2h7v7" stroke="currentColor" strokeWidth="1.8" fill="none"/></svg>
              </span>
            </button>
            <button className="btn btn-outline" onClick={onSignIn}>
              <span>SIGN IN</span>
            </button>
          </div>
          <div className="welcome-foot">— RAILWAY BRIDGE · HIGH ST · SUTTON —</div>
          <button className="owner-access-link" onClick={onOwner}>
            <span className="owner-access-key">⚿</span> OWNER / STAFF ACCESS
          </button>
        </div>
      </div>
    </div>
  );
};

// ------- SIGN UP -------
const SignUpScreen = ({ onBack, onSubmit, onSwitchToSignIn }) => {
  const [form, setForm] = React.useState({ name: "", phone: "", email: "", password: "" });
  const [errors, setErrors] = React.useState({});
  const [loading, setLoading] = React.useState(false);
  const set = (k, v) => { setForm({ ...form, [k]: v }); setErrors({ ...errors, [k]: null }); };

  const submit = async (e) => {
    e?.preventDefault();
    const err = {};
    if (!form.name.trim()) err.name = "Name required";
    if (!form.phone.trim()) err.phone = "Phone required";
    else if (form.phone.replace(/\D/g, "").length < 7) err.phone = "Phone too short";
    if (!form.email.trim()) err.email = "Email required";
    else if (!/\S+@\S+\.\S+/.test(form.email)) err.email = "Invalid email";
    if (!form.password) err.password = "Password required";
    else if (form.password.length < 6) err.password = "Min 6 characters";
    if (Object.keys(err).length) { setErrors(err); return; }
    setLoading(true);
    try {
      const cred = await window.fbAuth.createUserWithEmailAndPassword(form.email.trim(), form.password);
      const uid = cred.user.uid;
      await window.fbDb.collection("users").doc(uid).set({
        uid,
        name: form.name.trim(),
        phone: form.phone.trim(),
        email: form.email.trim(),
        role: "customer",
        createdAt: firebase.firestore.FieldValue.serverTimestamp()
      });
      // onAuthStateChanged in AppShell fires automatically and handles routing
    } catch (fbErr) {
      const msg = fbErr.code === "auth/email-already-in-use"
        ? "An account with this email already exists"
        : fbErr.message || "Sign up failed";
      setErrors({ email: msg });
      setLoading(false);
    }
  };

  return (
    <div className="screen">
      <StatusBar/>
      <div className="auth">
        <div className="auth-head">
          <button className="back-btn" onClick={onBack} aria-label="Back">
            <svg width="14" height="10" viewBox="0 0 14 10"><path d="M14 5H1M5 1L1 5l4 4" stroke="currentColor" strokeWidth="1.6" fill="none"/></svg>
          </button>
          <div className="auth-mark">CHYAKO//CUTZ</div>
          <div style={{ width: 38 }}/>
        </div>

        <h1 className="auth-title">CREATE<br/><span>ACCOUNT.</span></h1>
        <p className="auth-sub">Join the chair. Book in seconds, save your details for next time.</p>

        <form className="form" onSubmit={submit}>
          <label className="field">
            <span className="field-label">FULL NAME</span>
            <input className={`input ${errors.name ? "error" : ""}`} value={form.name} onChange={(e) => set("name", e.target.value)} placeholder="James Carter"/>
            {errors.name && <span className="field-error">{errors.name}</span>}
          </label>

          <label className="field">
            <span className="field-label">PHONE</span>
            <input className={`input ${errors.phone ? "error" : ""}`} value={form.phone} onChange={(e) => set("phone", e.target.value)} placeholder="07XXX XXXXXX" inputMode="tel"/>
            {errors.phone && <span className="field-error">{errors.phone}</span>}
          </label>

          <label className="field">
            <span className="field-label">EMAIL</span>
            <input className={`input ${errors.email ? "error" : ""}`} value={form.email} onChange={(e) => set("email", e.target.value)} placeholder="you@mail.com" inputMode="email"/>
            {errors.email && <span className="field-error">{errors.email}</span>}
          </label>

          <label className="field">
            <span className="field-label">PASSWORD <span>(min 6)</span></span>
            <input className={`input ${errors.password ? "error" : ""}`} type="password" value={form.password} onChange={(e) => set("password", e.target.value)} placeholder="••••••"/>
            {errors.password && <span className="field-error">{errors.password}</span>}
          </label>

          <button type="submit" className="btn btn-primary auth-submit" disabled={loading}>
            <span>{loading ? "CREATING…" : "CREATE ACCOUNT"}</span>
            {!loading && <span className="btn-arrow">
              <svg width="12" height="12" viewBox="0 0 14 14"><path d="M2 12L12 2M5 2h7v7" stroke="currentColor" strokeWidth="1.8" fill="none"/></svg>
            </span>}
          </button>
        </form>

        <div className="auth-foot">
          Got a chair already?
          <a onClick={onSwitchToSignIn}>Sign in</a>
        </div>
      </div>
    </div>
  );
};

// ------- SIGN IN -------
const SignInScreen = ({ onBack, onSubmit, onSwitchToSignUp }) => {
  const [form, setForm] = React.useState({ email: "", password: "" });
  const [errors, setErrors] = React.useState({});
  const [loading, setLoading] = React.useState(false);
  const set = (k, v) => { setForm({ ...form, [k]: v }); setErrors({ ...errors, [k]: null }); };

  const submit = async (e) => {
    e?.preventDefault();
    const err = {};
    if (!form.email.trim()) err.email = "Email required";
    if (!form.password) err.password = "Password required";
    if (Object.keys(err).length) { setErrors(err); return; }
    setLoading(true);
    try {
      await window.fbAuth.signInWithEmailAndPassword(form.email.trim(), form.password);
      // onAuthStateChanged in AppShell fires automatically and handles routing
    } catch (fbErr) {
      let msg = "Sign in failed";
      if (fbErr.code === "auth/wrong-password" || fbErr.code === "auth/invalid-credential") msg = "Wrong email or password";
      else if (fbErr.code === "auth/user-not-found") msg = "No account found with this email";
      else if (fbErr.code === "auth/too-many-requests") msg = "Too many attempts — try again later";
      setErrors({ email: msg });
      setLoading(false);
    }
  };

  return (
    <div className="screen">
      <StatusBar/>
      <div className="auth">
        <div className="auth-head">
          <button className="back-btn" onClick={onBack} aria-label="Back">
            <svg width="14" height="10" viewBox="0 0 14 10"><path d="M14 5H1M5 1L1 5l4 4" stroke="currentColor" strokeWidth="1.6" fill="none"/></svg>
          </button>
          <div className="auth-mark">CHYAKO//CUTZ</div>
          <div style={{ width: 38 }}/>
        </div>

        <h1 className="auth-title">WELCOME<br/><span>BACK.</span></h1>
        <p className="auth-sub">Sign in to your chair. Your details and bookings are right where you left them.</p>

        <form className="form" onSubmit={submit}>
          <label className="field">
            <span className="field-label">EMAIL OR PHONE</span>
            <input className={`input ${errors.email ? "error" : ""}`} value={form.email} onChange={(e) => set("email", e.target.value)} placeholder="you@mail.com"/>
            {errors.email && <span className="field-error">{errors.email}</span>}
          </label>

          <label className="field">
            <span className="field-label">PASSWORD</span>
            <input className={`input ${errors.password ? "error" : ""}`} type="password" value={form.password} onChange={(e) => set("password", e.target.value)} placeholder="••••••"/>
            {errors.password && <span className="field-error">{errors.password}</span>}
          </label>

          <div style={{ textAlign: 'right', marginTop: -8 }}>
            <a className="auth-foot" style={{ display: 'inline-block', margin: 0, fontSize: 11 }}>
              <span style={{ color: 'rgba(232,194,104,0.7)', cursor: 'pointer', textDecoration: 'underline', textUnderlineOffset: 4 }}>Forgot password?</span>
            </a>
          </div>

          <button type="submit" className="btn btn-primary auth-submit" disabled={loading}>
            <span>{loading ? "SIGNING IN…" : "SIGN IN"}</span>
            {!loading && <span className="btn-arrow">
              <svg width="12" height="12" viewBox="0 0 14 14"><path d="M2 12L12 2M5 2h7v7" stroke="currentColor" strokeWidth="1.8" fill="none"/></svg>
            </span>}
          </button>
        </form>

        <div className="auth-divider">
          <span className="auth-divider-line"/>
          <span className="auth-divider-text">OR</span>
          <span className="auth-divider-line"/>
        </div>

        <button className="social-btn" onClick={submit} disabled={loading}>
          <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
            <path d="M13.7 7.1c0-.4 0-.9-.1-1.3H7v2.5h3.8c-.2.9-.7 1.7-1.5 2.2v1.8h2.4c1.4-1.3 2-3.2 2-5.2z" fill="#e8c268"/>
            <path d="M7 14c2 0 3.7-.7 4.9-1.8L9.5 10.4c-.7.5-1.5.7-2.5.7-2 0-3.6-1.3-4.2-3.1H.4v1.9C1.6 12.4 4.1 14 7 14z" fill="#e8c268"/>
            <path d="M2.8 8c-.2-.5-.3-1-.3-1.5s.1-1 .3-1.5V3H.4C-.1 4.1-.1 5.4 0 6.5c.1 1 .3 2 .4 2.5L2.8 8z" fill="#e8c268"/>
          </svg>
          CONTINUE WITH GOOGLE
        </button>

        <div className="auth-foot">
          New to the chair?
          <a onClick={onSwitchToSignUp}>Create account</a>
        </div>
      </div>
    </div>
  );
};

// ------- OWNER LOGIN -------
const OwnerLoginScreen = ({ onBack, onSubmit }) => {
  const [code, setCode] = React.useState("");
  const [error, setError] = React.useState(null);
  const [loading, setLoading] = React.useState(false);
  const OWNER_EMAIL = "owner@chyakocutz.internal";

  const submit = async (e) => {
    e?.preventDefault();
    if (!code.trim()) { setError("Passcode required"); return; }
    setLoading(true);
    try {
      await window.fbAuth.signInWithEmailAndPassword(OWNER_EMAIL, code.trim());
      // onAuthStateChanged in AppShell fires → loads user doc with role:"owner" → renders OwnerDashboard
    } catch {
      setError("Wrong passcode");
      setLoading(false);
    }
  };

  return (
    <div className="screen owner-login-screen">
      <StatusBar/>
      <div className="auth">
        <div className="auth-head">
          <button className="back-btn" onClick={onBack} aria-label="Back">
            <svg width="14" height="10" viewBox="0 0 14 10"><path d="M14 5H1M5 1L1 5l4 4" stroke="currentColor" strokeWidth="1.6" fill="none"/></svg>
          </button>
          <div className="auth-mark">CHYAKO//CUTZ</div>
          <div style={{ width: 38 }}/>
        </div>

        <div className="owner-crest">⚿</div>
        <h1 className="auth-title">OWNER<br/><span>ACCESS.</span></h1>
        <p className="auth-sub">Master login for the shop. See every booking, run your chairs, manage the day.</p>

        <form className="form" onSubmit={submit}>
          <label className="field">
            <span className="field-label">MASTER PASSCODE</span>
            <input
              className={`input ${error ? "error" : ""}`}
              type="password"
              value={code}
              onChange={(e) => { setCode(e.target.value); setError(null); }}
              placeholder="••••••••"
              autoComplete="off"
            />
            {error && <span className="field-error">{error}</span>}
          </label>

          <button type="submit" className="btn btn-primary auth-submit" disabled={loading}>
            <span>{loading ? "ENTERING…" : "ENTER DASHBOARD"}</span>
            {!loading && <span className="btn-arrow">
              <svg width="12" height="12" viewBox="0 0 14 14"><path d="M2 12L12 2M5 2h7v7" stroke="currentColor" strokeWidth="1.8" fill="none"/></svg>
            </span>}
          </button>
        </form>
      </div>
    </div>
  );
};

Object.assign(window, { WelcomeScreen, SignUpScreen, SignInScreen, OwnerLoginScreen, StatusBar });
