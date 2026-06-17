// Welcome + Auth screens
// Welcome (splash) → SignUp / SignIn → Home (handled by parent)

// ------- STATUS BAR (mock iOS status bar for phone chrome) -------
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
  const D = window.CHYAKO_DATA;
  const now = new Date();
  const dayIdx = (now.getDay() + 6) % 7;
  const hoursRow = D?.hours?.[dayIdx];
  const [oh] = (hoursRow?.open || "09:00").split(":").map(Number);
  const [ch] = (hoursRow?.close || "19:00").split(":").map(Number);
  const isOpen = now.getHours() >= oh && now.getHours() < ch;

  return (
    <div className="screen">
      <img className="welcome-bg-video" src="assets/boot.jpg" alt=""/>
      <div className="welcome-veil"/>

      <div className="welcome-body welcome-body-logo">
        <div>
          <div className="welcome-top" style={{ marginTop: 14, padding: '0 0' }}>
            <div className="welcome-badge">
              <span className="welcome-badge-dot" style={!isOpen ? { background: 'rgba(244,235,214,0.3)', animationName: 'none' } : {}}/>
              {isOpen ? "OPEN NOW" : "CLOSED"}
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
const SignUpScreen = ({ onBack, onSwitchToSignIn }) => {
  const [errors, setErrors] = React.useState({});
  const [loading, setLoading] = React.useState(false);
  const clr = (f) => setErrors(prev => ({ ...prev, [f]: null }));

  const submit = async (e) => {
    e.preventDefault();
    const fd = new FormData(e.currentTarget);
    const name = (fd.get("name") || "").trim();
    const phone = (fd.get("phone") || "").trim();
    const email = (fd.get("email") || "").trim();
    const password = fd.get("password") || "";

    const err = {};
    if (!name) err.name = "Name required";
    if (!phone) err.phone = "Phone required";
    else if (phone.replace(/\D/g, "").length < 7) err.phone = "Phone too short";
    if (!email) err.email = "Email required";
    else if (!/\S+@\S+\.\S+/.test(email)) err.email = "Invalid email";
    if (!password) err.password = "Password required";
    else if (password.length < 6) err.password = "Min 6 characters";
    if (Object.keys(err).length) { setErrors(err); return; }

    setLoading(true);
    try {
      const cred = await window.fbAuth.createUserWithEmailAndPassword(email, password);
      const uid = cred.user.uid;
      await window.fbDb.collection("users").doc(uid).set({
        uid, name, phone, email,
        role: "customer",
        createdAt: firebase.firestore.FieldValue.serverTimestamp()
      });
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
      <img className="welcome-bg-video" src="assets/boot.jpg" alt=""/>
      <div className="welcome-veil"/>
      <div className="auth">
        <div className="auth-head">
          <button className="back-btn" onClick={onBack} aria-label="Back">
            <svg width="14" height="10" viewBox="0 0 14 10"><path d="M14 5H1M5 1L1 5l4 4" stroke="currentColor" strokeWidth="1.6" fill="none"/></svg>
          </button>
          <div className="auth-mark">CHYAKO//CUTZ</div>
          <div style={{ width: 44 }}/>
        </div>

        <h1 className="auth-title">CREATE<br/><span>ACCOUNT.</span></h1>
        <p className="auth-sub">Join the chair. Book in seconds, save your details for next time.</p>

        <form className="form" onSubmit={submit}>
          <label className="field">
            <span className="field-label">FULL NAME</span>
            <input className={`input ${errors.name ? "error" : ""}`} name="name" autoComplete="name" placeholder="James Carter" onChange={() => clr("name")}/>
            {errors.name && <span className="field-error">{errors.name}</span>}
          </label>

          <label className="field">
            <span className="field-label">PHONE</span>
            <input className={`input ${errors.phone ? "error" : ""}`} name="phone" type="tel" autoComplete="tel" placeholder="07XXX XXXXXX" onChange={() => clr("phone")}/>
            {errors.phone && <span className="field-error">{errors.phone}</span>}
          </label>

          <label className="field">
            <span className="field-label">EMAIL</span>
            <input className={`input ${errors.email ? "error" : ""}`} name="email" type="email" autoComplete="email" placeholder="you@mail.com" onChange={() => clr("email")}/>
            {errors.email && <span className="field-error">{errors.email}</span>}
          </label>

          <label className="field">
            <span className="field-label">PASSWORD <span>(min 6)</span></span>
            <input className={`input ${errors.password ? "error" : ""}`} name="password" type="password" autoComplete="new-password" placeholder="••••••" onChange={() => clr("password")}/>
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
          <button type="button" className="auth-foot-link" onClick={onSwitchToSignIn}>Sign in</button>
        </div>
      </div>
    </div>
  );
};

// ------- SIGN IN -------
const SignInScreen = ({ onBack, onSwitchToSignUp, onForgotPassword }) => {
  const [errors, setErrors] = React.useState({});
  const [loading, setLoading] = React.useState(false);
  const clr = () => setErrors({});

  const submit = async (e) => {
    e.preventDefault();
    const fd = new FormData(e.currentTarget);
    const email = (fd.get("email") || "").trim();
    const password = fd.get("password") || "";

    const err = {};
    if (!email) err.email = "Email required";
    if (!password) err.password = "Password required";
    if (Object.keys(err).length) { setErrors(err); return; }

    setLoading(true);
    try {
      await window.fbAuth.signInWithEmailAndPassword(email, password);
    } catch (fbErr) {
      let msg = "Sign in failed";
      const code = fbErr.code || "";
      if (code === "auth/wrong-password" || code === "auth/invalid-credential" || code === "auth/invalid-login-credentials" || code === "auth/INVALID_LOGIN_CREDENTIALS") {
        msg = "Wrong email or password";
      } else if (code === "auth/user-not-found") {
        msg = "No account with this email — try creating one";
      } else if (code === "auth/invalid-email") {
        msg = "Enter a valid email address";
      } else if (code === "auth/too-many-requests") {
        msg = "Too many attempts — try again later";
      } else if (code === "auth/network-request-failed") {
        msg = "No connection — check your internet";
      }
      setErrors({ email: msg });
      setLoading(false);
    }
  };

  return (
    <div className="screen">
      <img className="welcome-bg-video" src="assets/boot.jpg" alt=""/>
      <div className="welcome-veil"/>
      <div className="auth">
        <div className="auth-head">
          <button className="back-btn" onClick={onBack} aria-label="Back">
            <svg width="14" height="10" viewBox="0 0 14 10"><path d="M14 5H1M5 1L1 5l4 4" stroke="currentColor" strokeWidth="1.6" fill="none"/></svg>
          </button>
          <div className="auth-mark">CHYAKO//CUTZ</div>
          <div style={{ width: 44 }}/>
        </div>

        <h1 className="auth-title">WELCOME<br/><span>BACK.</span></h1>
        <p className="auth-sub">Sign in to your chair. Your details and bookings are right where you left them.</p>

        <form className="form" onSubmit={submit}>
          <label className="field">
            <span className="field-label">EMAIL</span>
            <input className={`input ${errors.email ? "error" : ""}`} name="email" type="email" autoComplete="email" placeholder="you@mail.com" autoCapitalize="off" autoCorrect="off" onChange={clr}/>
            {errors.email && <span className="field-error">{errors.email}</span>}
          </label>

          <label className="field">
            <span className="field-label">PASSWORD</span>
            <input className={`input ${errors.password ? "error" : ""}`} name="password" type="password" autoComplete="current-password" placeholder="••••••" onChange={clr}/>
            {errors.password && <span className="field-error">{errors.password}</span>}
          </label>

          <button
            type="button"
            className="auth-foot-link"
            style={{ display: "block", textAlign: "right", marginTop: 4, marginBottom: 8, background: "none", border: "none", padding: 0, cursor: "pointer" }}
            onClick={onForgotPassword}
          >
            Forgot password?
          </button>

          <button type="submit" className="btn btn-primary auth-submit" disabled={loading}>
            <span>{loading ? "SIGNING IN…" : "SIGN IN"}</span>
            {!loading && <span className="btn-arrow">
              <svg width="12" height="12" viewBox="0 0 14 14"><path d="M2 12L12 2M5 2h7v7" stroke="currentColor" strokeWidth="1.8" fill="none"/></svg>
            </span>}
          </button>
        </form>

        <div className="auth-foot">
          New to the chair?
          <button type="button" className="auth-foot-link" onClick={onSwitchToSignUp}>Create account</button>
        </div>
      </div>
    </div>
  );
};

// ------- FORGOT PASSWORD -------
const ForgotPasswordScreen = ({ onBack }) => {
  const [sent, setSent] = React.useState(false);
  const [email, setEmail] = React.useState("");
  const [error, setError] = React.useState(null);
  const [loading, setLoading] = React.useState(false);

  const submit = async (e) => {
    e.preventDefault();
    const val = email.trim();
    if (!val) { setError("Email required"); return; }
    setLoading(true);
    setError(null);
    try {
      await window.fbAuth.sendPasswordResetEmail(val);
      setSent(true);
    } catch (fbErr) {
      const code = fbErr.code || "";
      let msg = "Something went wrong — try again";
      if (code === "auth/invalid-email") msg = "Enter a valid email address";
      else if (code === "auth/network-request-failed") msg = "No connection — check your internet";
      setError(msg);
    }
    setLoading(false);
  };

  return (
    <div className="screen">
      <img className="welcome-bg-video" src="assets/boot.jpg" alt=""/>
      <div className="welcome-veil"/>
      <div className="auth">
        <div className="auth-head">
          <button className="back-btn" onClick={onBack} aria-label="Back">
            <svg width="14" height="10" viewBox="0 0 14 10"><path d="M14 5H1M5 1L1 5l4 4" stroke="currentColor" strokeWidth="1.6" fill="none"/></svg>
          </button>
          <div className="auth-mark">CHYAKO//CUTZ</div>
          <div style={{ width: 44 }}/>
        </div>

        {sent ? (
          <div style={{ flex: 1, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", gap: 24, padding: "0 8px" }}>
            <svg width="56" height="56" viewBox="0 0 56 56" fill="none">
              <circle cx="28" cy="28" r="27" stroke="#e8c268" strokeWidth="1.5"/>
              <path d="M17 28l8 8 14-16" stroke="#e8c268" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
            <h1 className="auth-title" style={{ textAlign: "center", fontSize: "clamp(28px, 8vw, 42px)" }}>CHECK YOUR<br/><span>INBOX.</span></h1>
            <p className="auth-sub" style={{ textAlign: "center" }}>A reset link is on its way to <strong style={{ color: "#e8c268", fontWeight: 600 }}>{email.trim()}</strong>. Follow the link to set a new password.</p>
            <div className="auth-foot" style={{ marginTop: 8 }}>
              <button type="button" className="auth-foot-link" onClick={onBack}>Back to sign in</button>
            </div>
          </div>
        ) : (
          <>
            <h1 className="auth-title">FORGOT<br/><span>PASSWORD?</span></h1>
            <p className="auth-sub">Enter your email and we'll send a reset link straight to your inbox.</p>

            <form className="form" onSubmit={submit}>
              <label className="field">
                <span className="field-label">EMAIL</span>
                <input
                  className={`input ${error ? "error" : ""}`}
                  type="email"
                  autoComplete="email"
                  placeholder="you@mail.com"
                  autoCapitalize="off"
                  autoCorrect="off"
                  value={email}
                  onChange={(e) => { setEmail(e.target.value); setError(null); }}
                />
                {error && <span className="field-error">{error}</span>}
              </label>

              <button type="submit" className="btn btn-primary auth-submit" disabled={loading}>
                <span>{loading ? "SENDING…" : "SEND RESET LINK"}</span>
                {!loading && <span className="btn-arrow">
                  <svg width="12" height="12" viewBox="0 0 14 14"><path d="M2 12L12 2M5 2h7v7" stroke="currentColor" strokeWidth="1.8" fill="none"/></svg>
                </span>}
              </button>
            </form>

            <div className="auth-foot">
              Remembered it?
              <button type="button" className="auth-foot-link" onClick={onBack}>Sign in</button>
            </div>
          </>
        )}
      </div>
    </div>
  );
};
window.ForgotPasswordScreen = ForgotPasswordScreen;

// ------- OWNER LOGIN -------
const OwnerLoginScreen = ({ onBack, onSubmit }) => {
  const [code, setCode] = React.useState("");
  const [error, setError] = React.useState(null);
  const [loading, setLoading] = React.useState(false);

  const submit = async (e) => {
    e?.preventDefault();
    if (!code.trim()) { setError("Passcode required"); return; }
    setLoading(true);
    try {
      if (!window.fbFunctions) window.fbFunctions = firebase.functions();
      const fn = window.fbFunctions.httpsCallable("verifyOwnerPasscode");
      const result = await fn({ passcode: code.trim() });
      await window.fbAuth.signInWithEmailAndPassword(result.data.email, result.data.password);
    } catch (err) {
      const code = err?.code || "";
      let msg = err?.message || "Login failed — try again";
      if (code === "functions/permission-denied") msg = "Wrong passcode";
      else if (code === "functions/not-found" || code === "functions/unimplemented") msg = "Login service not found — check Functions are deployed";
      else if (code === "functions/internal") msg = "Login service error — check Firebase Function logs";
      else if (code === "auth/wrong-password" || code === "auth/invalid-credential" || code === "auth/invalid-login-credentials") msg = "Auth mismatch — OWNER_FB_PASSWORD secret may need updating";
      else if (code === "auth/user-not-found") msg = "Owner account not set up — run the function once to create it";
      setError(msg);
      setLoading(false);
    }
  };

  return (
    <div className="screen owner-login-screen">
      <div className="auth">
        <div className="auth-head">
          <button className="back-btn" onClick={onBack} aria-label="Back">
            <svg width="14" height="10" viewBox="0 0 14 10"><path d="M14 5H1M5 1L1 5l4 4" stroke="currentColor" strokeWidth="1.6" fill="none"/></svg>
          </button>
          <div className="auth-mark">CHYAKO//CUTZ</div>
          <div style={{ width: 44 }}/>
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
