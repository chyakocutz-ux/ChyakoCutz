// App shell — auth gate, Firestore persistence, bottom nav, sheets.
// Mounts WelcomeScreen / SignUpScreen / SignInScreen until authed,
// then HomeTab / BookingsTab / AccountTab with bottom nav.

// derived helpers
const bookingDateTime = (b) => {
  const [hh, mm] = b.slot.split(":").map(Number);
  const d = new Date(b.dateIso + "T00:00:00");
  d.setHours(hh, mm, 0, 0);
  return d;
};
const isUpcoming = (b) => b.status !== "cancelled" && bookingDateTime(b) >= new Date(Date.now() - 30 * 60 * 1000);
const nextBooking = (bookings) => bookings
  .filter(isUpcoming)
  .sort((a, b) => bookingDateTime(a) - bookingDateTime(b))[0] || null;

const AppShell = () => {
  const [user, setUser] = React.useState(null);
  const [authLoading, setAuthLoading] = React.useState(true);
  const [authScreen, setAuthScreen] = React.useState("welcome"); // welcome | signup | signin | owner
  const [tab, setTab] = React.useState("home");
  const [sheet, setSheet] = React.useState(null); // null | { type:'book' } | { type:'manage', id } | { type:'reschedule', id }
  const [bookings, setBookings] = React.useState([]);

  // Firebase Auth listener — single source of truth for user state
  React.useEffect(() => {
    return window.fbAuth.onAuthStateChanged(async (firebaseUser) => {
      if (!firebaseUser) {
        setUser(null);
        setBookings([]);
        setAuthLoading(false);
        return;
      }
      try {
        const snap = await window.fbDb.collection("users").doc(firebaseUser.uid).get();
        if (snap.exists) {
          setUser({ uid: firebaseUser.uid, ...snap.data() });
        } else {
          // User authenticated but no Firestore profile yet (edge case)
          setUser({ uid: firebaseUser.uid, email: firebaseUser.email, role: "customer" });
        }
      } catch {
        setUser({ uid: firebaseUser.uid, email: firebaseUser.email, role: "customer" });
      }
      setAuthLoading(false);
    });
  }, []);

  // Firestore bookings listener — attaches/detaches when user changes
  React.useEffect(() => {
    if (!user?.uid) return;
    let query;
    if (user.role === "owner") {
      query = window.fbDb.collection("bookings").orderBy("createdAt", "desc");
    } else {
      query = window.fbDb.collection("bookings")
        .where("uid", "==", user.uid)
        .orderBy("createdAt", "desc");
    }
    const unsub = query.onSnapshot(
      (snap) => setBookings(snap.docs.map(d => ({ id: d.id, ...d.data() }))),
      () => {} // ignore listener errors silently
    );
    return unsub;
  }, [user?.uid, user?.role]);

  const signOut = () => {
    setTab("home");
    setSheet(null);
    setAuthScreen("welcome");
    window.fbAuth.signOut();
  };

  const addBooking = async (b) => {
    const customer = { name: user.name, phone: user.phone, email: user.email || "" };
    await window.fbDb.collection("bookings").add({
      ...b,
      uid: user.uid,
      status: "confirmed",
      customer,
      createdAt: firebase.firestore.FieldValue.serverTimestamp()
    });
  };

  const cancelBooking = (id) =>
    window.fbDb.collection("bookings").doc(id).update({ status: "cancelled" });

  const rescheduleBooking = (id, dateIso, slot) =>
    window.fbDb.collection("bookings").doc(id).update({ dateIso, slot });

  const setBookingStatus = (id, status) =>
    window.fbDb.collection("bookings").doc(id).update({ status });

  // Show boot spinner while Firebase resolves the persisted session
  if (authLoading) {
    return (
      <div className="boot">
        <div className="boot-spinner"/>
        <div>CHYAKO//CUTZ</div>
      </div>
    );
  }

  // ---------- NOT AUTHED ----------
  if (!user) {
    if (authScreen === "signup") {
      return <window.SignUpScreen
        onBack={() => setAuthScreen("welcome")}
        onSwitchToSignIn={() => setAuthScreen("signin")}
      />;
    }
    if (authScreen === "signin") {
      return <window.SignInScreen
        onBack={() => setAuthScreen("welcome")}
        onSwitchToSignUp={() => setAuthScreen("signup")}
      />;
    }
    if (authScreen === "owner") {
      return <window.OwnerLoginScreen
        onBack={() => setAuthScreen("welcome")}
      />;
    }
    return <window.WelcomeScreen
      onSignUp={() => setAuthScreen("signup")}
      onSignIn={() => setAuthScreen("signin")}
      onOwner={() => setAuthScreen("owner")}
    />;
  }

  // ---------- OWNER DASHBOARD ----------
  if (user.role === "owner") {
    return <window.OwnerDashboard
      allBookings={bookings}
      onSetStatus={setBookingStatus}
      onSignOut={signOut}
    />;
  }

  // ---------- AUTHED APP ----------
  const upcoming = nextBooking(bookings);
  const manageBooking = sheet?.type === "manage" || sheet?.type === "reschedule"
    ? bookings.find(b => b.id === sheet.id)
    : null;

  return (
    <div className="app">
      <window.StatusBar/>

      {/* TOPBAR */}
      <div className="topbar">
        <div className="topbar-l">
          <div>
            <div className="topbar-brand">CHYAKO</div>
            <div className="topbar-sub">CUTZ / SM1</div>
          </div>
        </div>
        <button className="topbar-avatar" onClick={() => setTab("account")} aria-label="Account">
          {(user.name?.[0] || "U").toUpperCase()}
        </button>
      </div>

      <div className="app-body">
        {tab === "home" && (
          <window.HomeTab
            user={user}
            upcoming={upcoming}
            bookings={bookings}
            onBook={() => setSheet({ type: "book" })}
            onManage={(id) => setSheet({ type: "manage", id })}
            onSeeAll={() => setTab("bookings")}
          />
        )}
        {tab === "bookings" && (
          <window.BookingsTab
            bookings={bookings}
            onBook={() => setSheet({ type: "book" })}
            onManage={(id) => setSheet({ type: "manage", id })}
          />
        )}
        {tab === "account" && (
          <window.AccountTab
            user={user}
            bookings={bookings}
            onSignOut={signOut}
          />
        )}
      </div>

      {/* BOTTOM NAV */}
      <div className="bnav">
        <button className={`bnav-item ${tab === "home" ? "active" : ""}`} onClick={() => setTab("home")}>
          <span className="bnav-item-icon">
            <svg width="22" height="22" viewBox="0 0 22 22" fill="none">
              <path d="M3 10l8-7 8 7v9a1 1 0 0 1-1 1h-4v-6H8v6H4a1 1 0 0 1-1-1v-9z" stroke="currentColor" strokeWidth="1.4" strokeLinejoin="round"/>
            </svg>
          </span>
          HOME
        </button>
        <button className="bnav-item bnav-book" onClick={() => setSheet({ type: "book" })} aria-label="Book">
          <span className="bnav-book-pill">
            <svg width="14" height="14" viewBox="0 0 14 14"><path d="M7 1v12M1 7h12" stroke="currentColor" strokeWidth="2"/></svg>
          </span>
          BOOK
        </button>
        <button className={`bnav-item ${tab === "bookings" ? "active" : ""}`} onClick={() => setTab("bookings")}>
          <span className="bnav-item-icon">
            <svg width="22" height="22" viewBox="0 0 22 22" fill="none">
              <rect x="3" y="5" width="16" height="14" stroke="currentColor" strokeWidth="1.4"/>
              <path d="M3 9h16M7 3v4M15 3v4" stroke="currentColor" strokeWidth="1.4"/>
            </svg>
          </span>
          BOOKINGS
        </button>
        <button className={`bnav-item ${tab === "account" ? "active" : ""}`} onClick={() => setTab("account")}>
          <span className="bnav-item-icon">
            <svg width="22" height="22" viewBox="0 0 22 22" fill="none">
              <circle cx="11" cy="7" r="4" stroke="currentColor" strokeWidth="1.4"/>
              <path d="M3 20c0-4.4 3.6-7 8-7s8 2.6 8 7" stroke="currentColor" strokeWidth="1.4"/>
            </svg>
          </span>
          ME
        </button>
      </div>

      {/* SHEETS */}
      {sheet?.type === "book" && (
        <window.BookSheet
          user={user}
          onClose={() => setSheet(null)}
          onConfirm={(payload) => { addBooking(payload); }}
        />
      )}
      {sheet?.type === "manage" && manageBooking && (
        <window.ManageSheet
          booking={manageBooking}
          onClose={() => setSheet(null)}
          onCancel={(id) => { cancelBooking(id); setSheet(null); }}
          onReschedule={(id) => setSheet({ type: "reschedule", id })}
        />
      )}
      {sheet?.type === "reschedule" && manageBooking && (
        <window.RescheduleSheet
          booking={manageBooking}
          onClose={() => setSheet({ type: "manage", id: manageBooking.id })}
          onSave={(id, dateIso, slot) => { rescheduleBooking(id, dateIso, slot); setSheet({ type: "manage", id }); }}
        />
      )}
    </div>
  );
};

Object.assign(window, { AppShell, isUpcoming, bookingDateTime, nextBooking });
