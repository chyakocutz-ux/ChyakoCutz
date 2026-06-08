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
  const [authScreen, setAuthScreen] = React.useState("welcome"); // welcome | signup | signin | forgotPassword | owner
  const [tab, setTab] = React.useState("home");
  const [sheet, setSheet] = React.useState(null); // null | { type:'book' } | { type:'manage', id } | { type:'reschedule', id }
  const [bookings, setBookings] = React.useState([]);
  const [allBookings, setAllBookings] = React.useState([]);
  const [listenerError, setListenerError] = React.useState(false);
  const [toasts, setToasts] = React.useState([]);
  const [showNotifPrompt, setShowNotifPrompt] = React.useState(false);
  const notifInitialized = React.useRef(false);
  const notifPromptPending = React.useRef(false);

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
        .where("uid", "==", user.uid);
    }
    setListenerError(false);
    const unsub = query.onSnapshot(
      (snap) => {
        setListenerError(false);
        setBookings(snap.docs.map(d => ({ id: d.id, ...d.data() })).filter(b => b.status !== "deleted"));
      },
      () => setListenerError(true)
    );
    return unsub;
  }, [user?.uid, user?.role]);

  // All-bookings listener — used for slot availability checks across all users
  React.useEffect(() => {
    if (!user?.uid) return;
    const today = new Date().toISOString().slice(0, 10);
    const unsub = window.fbDb.collection("bookings")
      .where("dateIso", ">=", today)
      .onSnapshot(
        (snap) => setAllBookings(snap.docs.map(d => ({ id: d.id, ...d.data() })).filter(b => b.status !== "deleted")),
        () => {}
      );
    return unsub;
  }, [user?.uid]);

  // Notification listener — shows toasts for new unread notifications
  React.useEffect(() => {
    if (!user?.uid) return;
    notifInitialized.current = false;
    const col = user.role === "owner"
      ? window.fbDb.collection("notifications").doc("owner_inbox").collection("items")
      : window.fbDb.collection("notifications").doc(user.uid).collection("items");
    const unsub = col.where("read", "==", false).onSnapshot(snap => {
      if (!notifInitialized.current) {
        notifInitialized.current = true;
        return;
      }
      snap.docChanges().forEach(change => {
        if (change.type !== "added") return;
        const { id } = change.doc;
        const data = change.doc.data();
        setToasts(prev => [...prev, { id, ...data }]);
        setTimeout(() => {
          setToasts(prev => prev.filter(t => t.id !== id));
          col.doc(id).update({ read: true }).catch(() => {});
        }, 5000);
      });
    });
    return unsub;
  }, [user?.uid, user?.role]);

  // Silently refresh FCM token if permission already granted
  React.useEffect(() => {
    if (!user?.uid || !window.fbMessaging) return;
    if (window.Notification?.permission !== "granted") return;
    window.fbMessaging.getToken({ vapidKey: window.CHYAKO_VAPID_KEY })
      .then(token => {
        if (!token) return;
        window.fbDb.collection("users").doc(user.uid).update({
          fcmTokens: firebase.firestore.FieldValue.arrayUnion(token)
        }).catch(() => {});
      })
      .catch(() => {});
  }, [user?.uid]);

  // Show permission prompt to owner on first dashboard load
  React.useEffect(() => {
    if (!user?.uid || user.role !== "owner") return;
    if (localStorage.getItem("notif_asked")) return;
    if (window.Notification?.permission !== "default") return;
    const t = setTimeout(() => setShowNotifPrompt(true), 1400);
    return () => clearTimeout(t);
  }, [user?.uid, user?.role]);

  const handleAllowNotifications = async () => {
    localStorage.setItem("notif_asked", "1");
    setShowNotifPrompt(false);
    if (!window.fbMessaging) return;
    try {
      const token = await window.fbMessaging.getToken({ vapidKey: window.CHYAKO_VAPID_KEY });
      if (token && user?.uid) {
        await window.fbDb.collection("users").doc(user.uid).update({
          fcmTokens: firebase.firestore.FieldValue.arrayUnion(token)
        });
      }
    } catch (_) {}
  };

  const dismissNotifPrompt = () => {
    localStorage.setItem("notif_asked", "1");
    setShowNotifPrompt(false);
  };

  const signOut = () => {
    setTab("home");
    setSheet(null);
    setAuthScreen("welcome");
    window.fbAuth.signOut();
  };

  const addBooking = async (b) => {
    const customer = { name: user.name, phone: user.phone, email: user.email || "" };
    const ref = await window.fbDb.collection("bookings").add({
      ...b,
      uid: user.uid,
      status: "confirmed",
      customer,
      createdAt: firebase.firestore.FieldValue.serverTimestamp()
    });
    window.fbDb.collection("notifications").doc("owner_inbox").collection("items").add({
      type: "new_booking",
      title: "NEW BOOKING",
      body: `${user.name} booked ${b.slot} on ${b.dateIso}.`,
      bookingId: ref.id,
      createdAt: firebase.firestore.FieldValue.serverTimestamp(),
      read: false
    }).catch(() => {});
    // Queue the notification permission prompt after this first booking
    if (window.Notification?.permission === "default" && !localStorage.getItem("notif_asked")) {
      notifPromptPending.current = true;
    }
    return ref.id;
  };

  const cancelBooking = async (id) => {
    await window.fbDb.collection("bookings").doc(id).update({ status: "cancelled", cancelledBy: "customer" });
    const booking = bookings.find(b => b.id === id);
    if (booking) {
      window.fbDb.collection("notifications").doc("owner_inbox").collection("items").add({
        type: "cancelled_by_customer",
        title: "BOOKING CANCELLED",
        body: `${booking.customer?.name || "A customer"} cancelled their ${booking.slot} on ${booking.dateIso}.`,
        bookingId: id,
        createdAt: firebase.firestore.FieldValue.serverTimestamp(),
        read: false
      }).catch(() => {});
    }
  };

  const deleteBooking = (id) =>
    window.fbDb.collection("bookings").doc(id).update({ status: "deleted" });

  const rescheduleBooking = (id, dateIso, slot) =>
    window.fbDb.collection("bookings").doc(id).update({ dateIso, slot });

  const setBookingStatus = async (id, status) => {
    const extra = status === "cancelled" ? { cancelledBy: "owner" } : {};
    await window.fbDb.collection("bookings").doc(id).update({ status, ...extra });
    if (status === "cancelled") {
      const booking = bookings.find(b => b.id === id);
      if (booking?.uid) {
        window.fbDb.collection("notifications").doc(booking.uid).collection("items").add({
          type: "cancelled_by_owner",
          title: "BOOKING CANCELLED",
          body: `Your ${booking.slot} appointment on ${booking.dateIso} has been cancelled by the shop.`,
          bookingId: id,
          createdAt: firebase.firestore.FieldValue.serverTimestamp(),
          read: false
        }).catch(() => {});
      }
    }
  };

  // Show boot spinner while Firebase resolves the persisted session
  if (authLoading) {
    return (
      <div className="boot">
        <img className="boot-logo" src="assets/logo.png" alt="Chyako Cutz"/>
        <div className="boot-name">CHYAKO CUTZ</div>
        <div className="boot-sub">SUTTON · SM1</div>
        <div className="boot-spinner"/>
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
        onForgotPassword={() => setAuthScreen("forgotPassword")}
      />;
    }
    if (authScreen === "forgotPassword") {
      return <window.ForgotPasswordScreen
        onBack={() => setAuthScreen("signin")}
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

  const ToastLayer = () => toasts.length === 0 ? null : (
    <div className="toast-stack">
      {toasts.map(t => (
        <div key={t.id} className="toast" onClick={() => setToasts(prev => prev.filter(x => x.id !== t.id))}>
          <div className="toast-icon">✂</div>
          <div className="toast-content">
            <div className="toast-title">{t.title}</div>
            <div className="toast-msg">{t.body}</div>
          </div>
        </div>
      ))}
    </div>
  );

  const isOwner = user?.role === "owner";
  const NotifPrompt = () => !showNotifPrompt ? null : (
    <>
      <div className="notif-overlay" onClick={dismissNotifPrompt}/>
      <div className="notif-prompt">
        <div className="notif-prompt-icon">
          <svg width="26" height="26" viewBox="0 0 24 24" fill="none">
            <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9" stroke="#e8c268" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
            <path d="M13.73 21a2 2 0 0 1-3.46 0" stroke="#e8c268" strokeWidth="1.5" strokeLinecap="round"/>
          </svg>
        </div>
        <div className="notif-prompt-title">STAY UPDATED</div>
        <div className="notif-prompt-body">
          {isOwner
            ? "New bookings and cancellations reach your phone straight away — even when the app is closed."
            : "Booking changes and cancellations from the shop reach your lock screen straight away."}
        </div>
        <button className="notif-prompt-allow" onClick={handleAllowNotifications}>
          ALLOW NOTIFICATIONS
        </button>
        <button className="notif-prompt-skip" onClick={dismissNotifPrompt}>Not now</button>
      </div>
    </>
  );

  // ---------- OWNER DASHBOARD ----------
  if (user.role === "owner") {
    return (
      <>
        <window.OwnerDashboard
          allBookings={bookings}
          onSetStatus={setBookingStatus}
          onDelete={deleteBooking}
          onSignOut={signOut}
        />
        <ToastLayer/>
        <NotifPrompt/>
      </>
    );
  }

  // ---------- AUTHED APP ----------
  const upcoming = nextBooking(bookings);
  const manageBooking = sheet?.type === "manage" || sheet?.type === "reschedule"
    ? bookings.find(b => b.id === sheet.id)
    : null;

  return (
    <div className="app">
      {listenerError && (
        <div className="listener-error-banner">
          Couldn't load bookings — check your connection.
          <button onClick={() => setListenerError(false)} aria-label="Dismiss">✕</button>
        </div>
      )}
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
          bookings={allBookings}
          userBookings={bookings}
          onClose={() => {
            setSheet(null);
            if (notifPromptPending.current) {
              notifPromptPending.current = false;
              setTimeout(() => setShowNotifPrompt(true), 350);
            }
          }}
          onConfirm={(payload) => addBooking(payload)}
        />
      )}
      {sheet?.type === "manage" && manageBooking && (
        <window.ManageSheet
          booking={manageBooking}
          onClose={() => setSheet(null)}
          onCancel={(id) => { cancelBooking(id); setSheet(null); }}
          onDelete={(id) => { deleteBooking(id); setSheet(null); }}
          onReschedule={(id) => setSheet({ type: "reschedule", id })}
        />
      )}
      {sheet?.type === "reschedule" && manageBooking && (
        <window.RescheduleSheet
          booking={manageBooking}
          bookings={allBookings}
          onClose={() => setSheet({ type: "manage", id: manageBooking.id })}
          onSave={(id, dateIso, slot) => { rescheduleBooking(id, dateIso, slot); setSheet({ type: "manage", id }); }}
        />
      )}
      <ToastLayer/>
      <NotifPrompt/>
    </div>
  );
};

Object.assign(window, { AppShell, isUpcoming, bookingDateTime, nextBooking });
