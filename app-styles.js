// App-wide styles for Chyako Cutz mobile booking app
// Reuses Sharp variant DNA: Pirata One + Space Grotesk, gold on near-black.

window.appStyles = `
  /* ============ ROOT ============ */
  :root {
    --gold: #e8c268;
    --gold-bright: #f4d98a;
    --gold-deep: #a77e2e;
    --ink: #000;
    --ink-2: #0a0806;
    --ink-3: #15110b;
    --cream: #f4ebd6;
    --cream-dim: rgba(244, 235, 214, 0.6);
    --red: #e85d3e;
  }

  html, body {
    margin: 0; padding: 0;
    background: #000;
    color: var(--cream);
    font-family: 'Space Grotesk', 'Inter', system-ui, sans-serif;
    -webkit-font-smoothing: antialiased;
    overflow: hidden;
    height: 100%;
  }
  * { box-sizing: border-box; }
  button { font-family: inherit; }

  /* ============ DEVICE STAGE ============ */
  .stage {
    position: fixed; inset: 0;
    display: flex; align-items: center; justify-content: center;
    background:
      radial-gradient(ellipse at center, #1a1612 0%, #000 70%);
    padding: 20px;
  }
  /* The phone frame — only shows on desktop. Mobile is edge-to-edge. */
  .phone {
    position: relative;
    width: min(420px, 100%);
    height: min(900px, 100%);
    aspect-ratio: 9/19.5;
    border-radius: 48px;
    background: #000;
    overflow: hidden;
    box-shadow:
      0 0 0 10px #1a1612,
      0 0 0 12px #2a2218,
      0 40px 80px rgba(0,0,0,0.55),
      0 0 100px rgba(232, 194, 104, 0.06);
  }
  /* Notch */
  .phone::before {
    content: '';
    position: absolute; top: 12px; left: 50%;
    transform: translateX(-50%);
    width: 120px; height: 30px;
    background: #000;
    border-radius: 100px;
    z-index: 1000; pointer-events: none;
  }
  @media (max-width: 480px) {
    .stage { padding: 0; }
    .phone {
      width: 100%; height: 100%;
      max-width: none; max-height: none;
      aspect-ratio: auto;
      border-radius: 0;
      box-shadow: none;
    }
    .phone::before { display: none; }
  }

  .screen {
    position: absolute; inset: 0;
    background: var(--ink);
    color: var(--cream);
    display: flex; flex-direction: column;
    overflow: hidden;
  }
  .screen::after {
    /* film grain overlay */
    content: ''; position: absolute; inset: 0; pointer-events: none; z-index: 999;
    background-image: url("data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='100' height='100'><filter id='n'><feTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='3'/><feColorMatrix values='0 0 0 0 0  0 0 0 0 0  0 0 0 0 0  0 0 0 0.05 0'/></filter><rect width='100' height='100' filter='url(%23n)'/></svg>");
    mix-blend-mode: overlay; opacity: 0.5;
  }

  /* Status bar */
  .statusbar {
    display: flex; justify-content: space-between; align-items: center;
    padding: 14px 22px 0;
    font-size: 0.8125rem; font-weight: 700;
    color: var(--cream);
    z-index: 10;
  }
  .statusbar-r { display: flex; gap: 6px; align-items: center; }

  /* ============ WELCOME SCREEN ============ */
  .welcome {
    position: absolute; inset: 0;
    display: flex; flex-direction: column;
  }
  .welcome-video {
    position: absolute; inset: 0;
    width: 100%; height: 100%;
    object-fit: cover;
    filter: contrast(1.1) saturate(0.85) brightness(0.45);
  }
  .welcome-veil {
    position: absolute; inset: 0;
    background:
      linear-gradient(180deg, rgba(0,0,0,0.4) 0%, rgba(0,0,0,0.2) 30%, rgba(0,0,0,0.85) 75%, var(--ink) 100%);
    z-index: 2;
    pointer-events: none;
  }
  .welcome-body {
    position: relative; z-index: 3;
    flex: 1; display: flex; flex-direction: column; justify-content: space-between;
    padding: 60px 28px 36px;
  }
  .welcome-top {
    display: flex; justify-content: space-between; align-items: flex-start;
  }
  .welcome-badge {
    display: inline-flex; align-items: center; gap: 6px;
    padding: 6px 10px;
    border: 1px solid rgba(232, 194, 104, 0.5);
    font-family: 'Space Grotesk', sans-serif;
    font-size: 0.6875rem; letter-spacing: 0.3em; font-weight: 700;
    color: var(--gold);
  }
  .welcome-badge-dot {
    width: 6px; height: 6px; border-radius: 50%;
    background: var(--gold);
    animation: pulse 1.6s ease-in-out infinite;
  }
  @keyframes pulse { 50% { opacity: 0.4; } }
  .welcome-loc {
    font-family: 'Space Grotesk', sans-serif;
    font-size: 0.6875rem; letter-spacing: 0.3em; font-weight: 700;
    color: rgba(244, 235, 214, 0.6);
    text-align: right;
  }

  .welcome-center {
    text-align: center;
  }
  .welcome-eyebrow {
    font-family: 'Space Grotesk', sans-serif;
    font-size: 0.6875rem; letter-spacing: 0.4em; font-weight: 700;
    color: var(--gold);
    margin-bottom: 16px;
  }
  .welcome-brand {
    font-family: 'Pirata One', serif;
    font-size: 5.75rem; line-height: 0.88;
    color: var(--cream);
    letter-spacing: 0.01em;
    margin: 0;
    text-transform: uppercase;
    text-shadow: 0 0 80px rgba(232, 194, 104, 0.2);
  }
  .welcome-brand span {
    display: block;
    color: var(--gold);
    margin-left: 30px;
  }
  .welcome-tag {
    font-family: 'Space Grotesk', sans-serif;
    font-size: 0.8125rem; letter-spacing: 0.05em;
    color: rgba(244, 235, 214, 0.7);
    margin: 22px auto 0;
    max-width: 280px;
    line-height: 1.5;
  }

  .welcome-actions {
    display: flex; flex-direction: column; gap: 10px;
  }
  .btn {
    display: inline-flex; align-items: center; justify-content: center;
    gap: 10px;
    padding: 16px 20px;
    font-family: 'Space Grotesk', sans-serif;
    font-weight: 700;
    font-size: 0.8125rem; letter-spacing: 0.18em;
    text-transform: uppercase;
    cursor: pointer;
    border: none;
    transition: all 0.15s;
  }
  .btn-primary {
    background: var(--gold); color: var(--ink);
    border-radius: 100px;
  }
  .btn-primary:hover { background: var(--gold-bright); }
  .btn-primary:disabled { opacity: 0.4; cursor: not-allowed; }
  .btn-outline {
    background: transparent;
    color: var(--cream);
    border: 1px solid rgba(244, 235, 214, 0.35);
    border-radius: 100px;
  }
  .btn-outline:hover { border-color: var(--cream); }
  .btn-arrow {
    width: 26px; height: 26px;
    background: var(--ink);
    color: var(--gold);
    display: flex; align-items: center; justify-content: center;
  }
  .btn-primary .btn-arrow { background: var(--ink); color: var(--gold); }
  .btn-outline .btn-arrow { background: var(--cream); color: var(--ink); }

  .welcome-foot {
    text-align: center;
    margin-top: 16px;
    font-family: 'Space Grotesk', sans-serif;
    font-size: 0.6875rem; letter-spacing: 0.18em;
    color: rgba(244, 235, 214, 0.4);
    text-transform: uppercase;
  }

  /* ============ AUTH SCREENS ============ */
  .auth {
    position: relative; z-index: 3;
    flex: 1; display: flex; flex-direction: column;
    padding: 4px 28px 24px;
    overflow-y: auto;
    overflow-x: hidden;
    background:
      radial-gradient(ellipse at top, rgba(232, 194, 104, 0.06) 0%, transparent 50%),
      rgba(13, 12, 10, 0.72);
  }
  .auth::-webkit-scrollbar { width: 0; }
  .auth-head {
    display: flex; justify-content: space-between; align-items: center;
    margin-bottom: 30px;
    padding-top: max(14px, env(safe-area-inset-top));
  }
  .back-btn {
    width: 44px; height: 44px;
    background: transparent;
    border: 1px solid rgba(244, 235, 214, 0.25);
    color: var(--cream);
    display: flex; align-items: center; justify-content: center;
    cursor: pointer;
  }
  .auth-mark {
    font-family: 'Pirata One', serif;
    font-size: 1.375rem; color: var(--gold);
    letter-spacing: 0.02em;
  }
  .auth-title {
    font-family: 'Pirata One', serif;
    font-size: 3.25rem; line-height: 0.9;
    color: var(--cream);
    margin: 0 0 6px;
    letter-spacing: 0.01em;
  }
  .auth-title span { color: var(--gold); }
  .auth-sub {
    font-family: 'Space Grotesk', sans-serif;
    font-size: 0.8125rem;
    color: rgba(244, 235, 214, 0.55);
    margin: 0 0 28px;
    line-height: 1.5;
  }
  .form {
    display: flex; flex-direction: column; gap: 18px;
  }
  .field {
    display: flex; flex-direction: column; gap: 8px;
  }
  .field-label {
    font-family: 'Space Grotesk', sans-serif;
    font-size: 0.6875rem; letter-spacing: 0.25em; font-weight: 700;
    color: var(--gold);
    text-transform: uppercase;
  }
  .field-label span { color: rgba(244, 235, 214, 0.4); }
  .input {
    background: transparent;
    border: none;
    border-bottom: 1px solid rgba(232, 194, 104, 0.3);
    color: var(--cream);
    padding: 6px 0 12px;
    font-family: 'Space Grotesk', sans-serif;
    font-size: 1.125rem; font-weight: 500;
    outline: none;
    border-radius: 0;
    transition: border-color 0.15s;
  }
  .input:focus { border-bottom-color: var(--gold); }
  .input::placeholder { color: rgba(244, 235, 214, 0.25); }
  .input.error {
    border-bottom-color: var(--red);
  }
  .field-error {
    font-family: 'Space Grotesk', sans-serif;
    font-size: 0.6875rem; color: var(--red);
    letter-spacing: 0.1em; font-weight: 600;
    margin-top: 2px;
  }
  .auth-submit {
    margin-top: 12px; width: 100%;
  }
  .auth-foot {
    text-align: center;
    margin-top: 24px;
    font-family: 'Space Grotesk', sans-serif;
    font-size: 0.75rem;
    color: rgba(244, 235, 214, 0.55);
  }
  .auth-foot-link {
    background: none; border: none; padding: 0;
    font-family: inherit; font-size: inherit;
  }
  .auth-foot a, .auth-foot-link {
    color: var(--gold);
    text-decoration: underline;
    text-underline-offset: 4px;
    text-decoration-thickness: 1px;
    cursor: pointer;
    margin-left: 4px;
    font-weight: 600;
  }
  .auth-divider {
    display: flex; align-items: center; gap: 12px;
    margin: 22px 0 16px;
  }
  .auth-divider-line {
    flex: 1; height: 1px; background: rgba(232, 194, 104, 0.2);
  }
  .auth-divider-text {
    font-family: 'Space Grotesk', sans-serif;
    font-size: 0.6875rem; letter-spacing: 0.3em; font-weight: 700;
    color: rgba(232, 194, 104, 0.6);
  }
  .social-btn {
    background: transparent;
    border: 1px solid rgba(244, 235, 214, 0.2);
    color: var(--cream);
    padding: 14px;
    display: flex; align-items: center; justify-content: center; gap: 10px;
    font-family: 'Space Grotesk', sans-serif;
    font-size: 0.75rem; letter-spacing: 0.15em; font-weight: 700;
    cursor: pointer;
    text-transform: uppercase;
  }

  /* ============ AUTHENTICATED APP ============ */
  .app {
    position: absolute; inset: 0;
    display: flex; flex-direction: column;
    background: var(--ink);
  }
  .app-body {
    flex: 1;
    overflow-y: auto;
    overflow-x: hidden;
    padding-bottom: max(80px, calc(60px + env(safe-area-inset-bottom)));
  }
  .app-body::-webkit-scrollbar { width: 0; }

  /* Top bar */
  .topbar {
    display: flex; justify-content: space-between; align-items: center;
    padding: max(16px, env(safe-area-inset-top)) 22px 14px;
    background: linear-gradient(180deg, rgba(0,0,0,0.95) 0%, transparent 100%);
    z-index: 5;
  }
  .topbar-l {
    display: flex; align-items: center; gap: 10px;
  }
  .topbar-brand {
    font-family: 'Pirata One', serif;
    font-size: 1.625rem; color: var(--gold);
    line-height: 1;
  }
  .topbar-sub {
    font-family: 'Space Grotesk', sans-serif;
    font-size: 0.6875rem; letter-spacing: 0.3em; font-weight: 700;
    color: rgba(244, 235, 214, 0.55);
    margin-top: 3px;
  }
  .topbar-avatar {
    width: 38px; height: 38px;
    border: 1px solid var(--gold);
    background: rgba(232, 194, 104, 0.08);
    color: var(--gold);
    display: flex; align-items: center; justify-content: center;
    font-family: 'Pirata One', serif;
    font-size: 1rem;
    cursor: pointer;
  }

  /* HOME HERO */
  .hero {
    padding: 8px 22px 24px;
    position: relative;
  }
  .hero-greet {
    font-family: 'Space Grotesk', sans-serif;
    font-size: 0.6875rem; letter-spacing: 0.3em; font-weight: 700;
    color: var(--gold);
    margin-bottom: 8px;
  }
  .hero-title {
    font-family: 'Pirata One', serif;
    font-size: 3rem; line-height: 0.92;
    color: var(--cream);
    margin: 0 0 4px;
    letter-spacing: 0.01em;
    text-transform: uppercase;
  }
  .hero-title-accent { color: var(--gold); }
  .hero-meta {
    display: flex; gap: 14px;
    margin-top: 14px;
  }
  .hero-meta-item {
    flex: 1;
    border: 1px solid rgba(232, 194, 104, 0.2);
    padding: 10px 12px;
  }
  .hero-meta-label {
    font-family: 'Space Grotesk', sans-serif;
    font-size: 0.6875rem; letter-spacing: 0.25em; font-weight: 700;
    color: rgba(232, 194, 104, 0.7);
  }
  .hero-meta-val {
    font-family: 'Pirata One', serif;
    font-size: 1.125rem; color: var(--cream);
    margin-top: 4px;
    letter-spacing: 0.02em;
  }
  .hero-meta-val.live { color: var(--gold); }

  /* Upcoming booking card */
  .upcoming {
    margin: 20px 22px 28px;
    background:
      linear-gradient(165deg, rgba(232, 194, 104, 0.12), rgba(232, 194, 104, 0.03));
    border: 1px solid rgba(232, 194, 104, 0.35);
    padding: 18px;
    position: relative;
  }
  .upcoming-eyebrow {
    font-family: 'Space Grotesk', sans-serif;
    font-size: 0.6875rem; letter-spacing: 0.3em; font-weight: 700;
    color: var(--gold);
    display: flex; align-items: center; gap: 6px;
  }
  .upcoming-dot {
    width: 6px; height: 6px; border-radius: 50%;
    background: var(--gold);
    animation: pulse 1.6s infinite;
  }
  .upcoming-row {
    display: flex; justify-content: space-between; align-items: flex-end;
    margin-top: 14px;
  }
  .upcoming-when-day {
    font-family: 'Pirata One', serif;
    font-size: 1.375rem; color: var(--cream);
    line-height: 1; letter-spacing: 0.02em;
  }
  .upcoming-when-time {
    font-family: 'Pirata One', serif;
    font-size: 2.375rem; color: var(--gold);
    line-height: 1; margin-top: 4px;
  }
  .upcoming-svc {
    text-align: right;
    font-family: 'Space Grotesk', sans-serif;
    font-size: 0.6875rem; color: rgba(244, 235, 214, 0.65);
    text-transform: uppercase; letter-spacing: 0.12em;
    line-height: 1.5;
  }
  .upcoming-svc strong {
    color: var(--cream); font-weight: 700;
    display: block;
  }
  .upcoming-actions {
    display: flex; gap: 8px;
    margin-top: 16px;
  }
  .upcoming-btn {
    flex: 1;
    background: transparent;
    border: 1px solid rgba(244, 235, 214, 0.25);
    color: var(--cream);
    min-height: 44px;
    padding: 12px 10px;
    font-family: 'Space Grotesk', sans-serif;
    font-size: 0.6875rem; letter-spacing: 0.18em; font-weight: 700;
    text-transform: uppercase;
    cursor: pointer;
  }
  .upcoming-btn.danger { color: var(--red); border-color: rgba(232, 93, 62, 0.4); border-radius: 0; }

  /* Section header */
  .sec-head {
    display: flex; gap: 14px;
    padding: 28px 22px 18px;
    align-items: flex-start;
  }
  .sec-num {
    font-family: 'Pirata One', serif;
    font-size: 1.625rem; color: var(--gold);
    line-height: 1;
  }
  .sec-eyebrow {
    font-family: 'Space Grotesk', sans-serif;
    font-size: 0.6875rem; letter-spacing: 0.3em; font-weight: 700;
    color: rgba(232, 194, 104, 0.7);
  }
  .sec-title {
    font-family: 'Pirata One', serif;
    font-size: 1.875rem; line-height: 1;
    color: var(--cream); margin: 4px 0 0;
    letter-spacing: 0.01em;
  }

  /* Service tiles */
  .svc-grid {
    display: grid; grid-template-columns: 1fr 1fr; gap: 8px;
    padding: 0 22px;
  }
  .svc-tile {
    background: linear-gradient(165deg, var(--ink-2), var(--ink));
    border: 1px solid rgba(232, 194, 104, 0.2);
    padding: 14px;
    text-align: left;
    cursor: pointer;
    position: relative;
    min-height: 130px;
    display: flex; flex-direction: column; justify-content: space-between;
    color: var(--cream);
    transition: all 0.15s;
  }
  .svc-tile:hover { border-color: var(--gold); }
  .svc-tile.feature {
    grid-column: span 2;
    background: linear-gradient(165deg, var(--gold), #c89a3e);
    color: var(--ink);
    border-color: var(--gold);
  }
  .svc-tile-num {
    font-family: 'Pirata One', serif;
    font-size: 1rem;
    color: var(--gold); opacity: 0.7;
  }
  .svc-tile.feature .svc-tile-num { color: var(--ink); opacity: 0.6; }
  .svc-tile-name {
    font-family: 'Pirata One', serif;
    font-size: 1.062rem;
    line-height: 1.1;
    margin: 10px 0;
  }
  .svc-tile.feature .svc-tile-name { font-size: 1.375rem; }
  .svc-tile-row {
    display: flex; justify-content: space-between; align-items: baseline;
  }
  .svc-tile-price {
    font-family: 'Pirata One', serif;
    font-size: 1.5rem;
    color: var(--gold);
  }
  .svc-tile.feature .svc-tile-price { color: var(--ink); }
  .svc-tile-mins {
    font-family: 'Space Grotesk', sans-serif;
    font-size: 0.6875rem; letter-spacing: 0.15em; font-weight: 600;
    color: rgba(244, 235, 214, 0.5);
  }
  .svc-tile.feature .svc-tile-mins { color: rgba(13, 12, 10, 0.7); }
  .svc-tile-tag {
    position: absolute; top: 10px; right: 10px;
    font-family: 'Space Grotesk', sans-serif;
    font-size: 0.6875rem; letter-spacing: 0.18em; font-weight: 700;
    color: var(--ink);
    background: var(--cream);
    padding: 3px 6px;
  }
  .svc-tile.feature .svc-tile-tag {
    background: var(--ink); color: var(--gold);
  }

  /* Service list (compact rows) */
  .svc-list {
    padding: 12px 22px 0;
  }
  .svc-line {
    width: 100%;
    background: none; border: none; border-bottom: 1px solid rgba(232, 194, 104, 0.08);
    text-align: left;
    display: flex; align-items: baseline; gap: 8px;
    padding: 12px 0;
    cursor: pointer;
  }
  .svc-line-name {
    font-family: 'Space Grotesk', sans-serif;
    font-size: 0.8125rem; color: var(--cream);
    font-weight: 600;
    text-transform: uppercase;
    letter-spacing: 0.04em;
    line-height: 1.5;
  }
  .svc-line-dots {
    flex: 1; border-bottom: 1px dashed rgba(232, 194, 104, 0.25);
    transform: translateY(-2px);
  }
  .svc-line-price {
    font-family: 'Pirata One', serif;
    font-size: 1.125rem; color: var(--gold);
  }

  /* Info strip */
  .info-strip {
    display: flex; gap: 0;
    margin: 28px 22px 0;
    border: 1px solid rgba(232, 194, 104, 0.2);
  }
  .info-block {
    flex: 1; padding: 14px;
    border-right: 1px solid rgba(232, 194, 104, 0.15);
  }
  .info-block:last-child { border-right: none; }
  .info-eyebrow {
    font-family: 'Space Grotesk', sans-serif;
    font-size: 0.6875rem; letter-spacing: 0.3em; font-weight: 700;
    color: var(--gold);
    margin-bottom: 6px;
  }
  .info-val {
    font-family: 'Pirata One', serif;
    font-size: 0.8125rem; line-height: 1.3;
    color: var(--cream);
    letter-spacing: 0.02em;
  }

  /* BOOK BAR (sticky) */
  .book-bar {
    position: absolute; bottom: 64px; left: 0; right: 0;
    background: rgba(0, 0, 0, 0.95);
    backdrop-filter: blur(20px);
    border-top: 1px solid rgba(232, 194, 104, 0.3);
    padding: 12px 22px;
    display: flex; justify-content: space-between; align-items: center;
    gap: 12px;
    z-index: 20;
  }
  .book-bar-l {}
  .book-bar-label {
    font-family: 'Space Grotesk', sans-serif;
    font-size: 0.6875rem; letter-spacing: 0.3em; font-weight: 700;
    color: rgba(232, 194, 104, 0.75);
  }
  .book-bar-time {
    font-family: 'Pirata One', serif;
    font-size: 1rem; color: var(--cream);
    margin-top: 2px;
  }
  .book-bar-btn {
    background: var(--gold); color: var(--ink);
    border: none; padding: 12px 18px;
    font-family: 'Space Grotesk', sans-serif; font-weight: 700;
    font-size: 0.75rem; letter-spacing: 0.18em;
    cursor: pointer;
    display: flex; align-items: center; gap: 8px;
    text-transform: uppercase;
  }

  /* BOTTOM NAV */
  .bnav {
    position: absolute; bottom: 0; left: 0; right: 0;
    background: var(--ink);
    border-top: 1px solid rgba(232, 194, 104, 0.2);
    display: flex; justify-content: space-around;
    padding: 8px 0 max(20px, env(safe-area-inset-bottom));
    z-index: 30;
  }
  .bnav-item {
    flex: 1;
    background: transparent; border: none; color: rgba(244, 235, 214, 0.4);
    display: flex; flex-direction: column; align-items: center; gap: 4px;
    padding: 11px 0;
    cursor: pointer;
    font-family: 'Space Grotesk', sans-serif;
    font-size: 0.6875rem; letter-spacing: 0.25em; font-weight: 700;
    text-transform: uppercase;
  }
  .bnav-item.active { color: var(--gold); }
  .bnav-item-icon {
    width: 22px; height: 22px;
    display: flex; align-items: center; justify-content: center;
  }
  .bnav-item.active .bnav-item-icon { filter: drop-shadow(0 0 8px rgba(232,194,104,0.4)); }

  /* ============ BOOKINGS LIST ============ */
  .blist {
    padding: 0 22px;
  }
  .blist-empty {
    text-align: center;
    padding: 60px 20px;
    color: rgba(244, 235, 214, 0.5);
  }
  .blist-empty-mark {
    font-family: 'Pirata One', serif;
    font-size: 4.375rem; color: rgba(232, 194, 104, 0.25);
    line-height: 1;
  }
  .blist-empty-title {
    font-family: 'Pirata One', serif;
    font-size: 1.625rem; color: var(--cream);
    margin: 12px 0 8px;
  }
  .blist-empty-sub {
    font-family: 'Space Grotesk', sans-serif;
    font-size: 0.8125rem; color: rgba(244, 235, 214, 0.55);
    margin-bottom: 22px;
  }
  .booking-card {
    background: linear-gradient(165deg, var(--ink-2), var(--ink));
    border: 1px solid rgba(232, 194, 104, 0.2);
    padding: 16px;
    margin-bottom: 10px;
  }
  .booking-card.upcoming { border-color: var(--gold); }
  .booking-card-row {
    display: flex; justify-content: space-between; align-items: flex-start;
  }
  .booking-card-day {
    font-family: 'Space Grotesk', sans-serif;
    font-size: 0.6875rem; letter-spacing: 0.25em; font-weight: 700;
    color: var(--gold);
  }
  .booking-card-when {
    font-family: 'Pirata One', serif;
    font-size: 1.75rem; color: var(--cream);
    line-height: 1; margin-top: 4px;
  }
  .booking-card-status {
    padding: 4px 8px;
    font-family: 'Space Grotesk', sans-serif;
    font-size: 0.6875rem; letter-spacing: 0.2em; font-weight: 700;
    border: 1px solid rgba(232, 194, 104, 0.4);
    color: var(--gold);
  }
  .booking-card-status.past {
    color: rgba(244, 235, 214, 0.4);
    border-color: rgba(244, 235, 214, 0.2);
  }
  .booking-card-svcs {
    margin-top: 12px;
    padding-top: 12px;
    border-top: 1px dashed rgba(232, 194, 104, 0.15);
    font-family: 'Space Grotesk', sans-serif;
    font-size: 0.6875rem; color: rgba(244, 235, 214, 0.65);
    text-transform: uppercase; letter-spacing: 0.08em;
    line-height: 1.6;
  }
  .booking-card-svcs strong { color: var(--gold); font-weight: 700; }

  /* ============ ACCOUNT ============ */
  .acct {
    padding: 0 22px;
  }
  .acct-card {
    background: linear-gradient(165deg, var(--ink-2), var(--ink));
    border: 1px solid rgba(232, 194, 104, 0.2);
    padding: 22px;
    margin-bottom: 16px;
  }
  .acct-avatar {
    width: 72px; height: 72px;
    border: 1px solid var(--gold);
    background: rgba(232, 194, 104, 0.08);
    display: flex; align-items: center; justify-content: center;
    font-family: 'Pirata One', serif;
    font-size: 2rem;
    color: var(--gold);
    margin: 0 auto 14px;
  }
  .acct-name {
    font-family: 'Pirata One', serif;
    font-size: 1.75rem; color: var(--cream);
    text-align: center;
    margin: 0;
    letter-spacing: 0.02em;
  }
  .acct-since {
    font-family: 'Space Grotesk', sans-serif;
    font-size: 0.6875rem; letter-spacing: 0.25em; font-weight: 700;
    color: rgba(232, 194, 104, 0.7);
    text-align: center;
    margin-top: 6px;
    text-transform: uppercase;
  }
  .acct-stats {
    display: flex; gap: 14px;
    margin-top: 18px;
    padding-top: 18px;
    border-top: 1px solid rgba(232, 194, 104, 0.15);
  }
  .acct-stat {
    flex: 1; text-align: center;
  }
  .acct-stat-num {
    font-family: 'Pirata One', serif;
    font-size: 1.875rem; color: var(--gold);
    line-height: 1;
  }
  .acct-stat-label {
    font-family: 'Space Grotesk', sans-serif;
    font-size: 0.6875rem; letter-spacing: 0.25em; font-weight: 700;
    color: rgba(244, 235, 214, 0.55);
    text-transform: uppercase;
    margin-top: 5px;
  }
  .acct-row {
    display: flex; justify-content: space-between; align-items: center;
    padding: 16px 0;
    border-bottom: 1px solid rgba(232, 194, 104, 0.1);
    cursor: pointer;
  }
  .acct-row:last-child { border-bottom: none; }
  .acct-row-l {
    display: flex; align-items: center; gap: 12px;
  }
  .acct-row-icon {
    width: 32px; height: 32px;
    border: 1px solid rgba(232, 194, 104, 0.3);
    display: flex; align-items: center; justify-content: center;
    color: var(--gold);
  }
  .acct-row-label {
    font-family: 'Space Grotesk', sans-serif;
    font-size: 0.8125rem; letter-spacing: 0.05em; font-weight: 600;
    color: var(--cream);
  }
  .acct-row-val {
    font-family: 'Space Grotesk', sans-serif;
    font-size: 0.75rem;
    color: rgba(244, 235, 214, 0.55);
  }
  .acct-row.danger .acct-row-label { color: var(--red); }
  .acct-row.danger .acct-row-icon { color: var(--red); border-color: rgba(232, 93, 62, 0.3); }

  /* ============ BOOKING SHEET (overlay) ============ */
  .sheet {
    position: absolute; inset: 0; z-index: 100;
    background: var(--ink);
    display: flex; flex-direction: column;
    animation: slideUp 0.35s cubic-bezier(0.2, 0.9, 0.3, 1);
    background-image:
      linear-gradient(180deg, var(--ink-2) 0%, var(--ink) 60%);
  }
  @keyframes slideUp { from { transform: translateY(100%); } to { transform: translateY(0); } }

  .sheet-head {
    display: flex; justify-content: space-between; align-items: center;
    padding: 18px 22px 0;
  }
  .sheet-num {
    font-family: 'Pirata One', serif;
    font-size: 1rem; color: var(--gold);
  }
  .sheet-title {
    font-family: 'Space Grotesk', sans-serif;
    font-size: 0.6875rem; letter-spacing: 0.3em; font-weight: 700;
    color: var(--cream);
    margin-top: 2px;
  }
  .sheet-close {
    background: transparent; border: 1px solid rgba(244, 235, 214, 0.3);
    color: var(--cream);
    width: 44px; height: 44px;
    display: flex; align-items: center; justify-content: center;
    cursor: pointer;
  }

  .sheet-prog {
    display: flex; gap: 4px;
    padding: 14px 22px 0;
  }
  .prog-bar {
    flex: 1; height: 3px; background: rgba(244, 235, 214, 0.1);
  }
  .prog-bar.active { background: var(--gold); }

  .sheet-body {
    flex: 1; overflow-y: auto;
    padding: 18px 22px 12px;
  }
  .sheet-body::-webkit-scrollbar { width: 0; }
  .step { display: flex; flex-direction: column; gap: 8px; }
  .step-intro {
    font-family: 'Space Grotesk', sans-serif;
    font-size: 0.6875rem; letter-spacing: 0.25em; font-weight: 700;
    color: rgba(232, 194, 104, 0.7);
    margin-bottom: 6px;
    text-transform: uppercase;
  }

  .svc-card {
    display: flex; justify-content: space-between; align-items: center;
    padding: 14px;
    background: rgba(232, 194, 104, 0.04);
    border: 1px solid rgba(232, 194, 104, 0.15);
    cursor: pointer; text-align: left;
    transition: all 0.15s;
  }
  .svc-card.checked {
    background: var(--gold); border-color: var(--gold); color: var(--ink);
  }
  .svc-card-l { display: flex; align-items: center; gap: 12px; }
  .svc-card-num {
    font-family: 'Pirata One', serif;
    font-size: 1.5rem; color: var(--gold);
    line-height: 1; min-width: 30px;
  }
  .svc-card.checked .svc-card-num { color: var(--ink); }
  .svc-card-name {
    font-family: 'Space Grotesk', sans-serif;
    font-size: 0.8125rem; font-weight: 600;
    color: var(--cream);
    text-transform: uppercase; letter-spacing: 0.04em;
    line-height: 1.2;
  }
  .svc-card.checked .svc-card-name { color: var(--ink); }
  .svc-card-meta {
    font-family: 'Space Grotesk', sans-serif;
    font-size: 0.6875rem; letter-spacing: 0.18em; font-weight: 600;
    color: rgba(244, 235, 214, 0.5);
    margin-top: 3px;
  }
  .svc-card.checked .svc-card-meta { color: rgba(13, 12, 10, 0.6); }
  .svc-card-r { display: flex; align-items: center; gap: 10px; }
  .svc-card-price {
    font-family: 'Pirata One', serif;
    font-size: 1.25rem; color: var(--gold);
  }
  .svc-card.checked .svc-card-price { color: var(--ink); }
  .svc-card-check {
    width: 22px; height: 22px;
    border: 1px solid rgba(244, 235, 214, 0.4);
    display: flex; align-items: center; justify-content: center;
  }
  .svc-card-check.on { background: var(--cream); border-color: var(--cream); }

  /* Barber */
  .barber {
    display: flex; align-items: center; gap: 12px;
    padding: 12px;
    background: rgba(232, 194, 104, 0.04);
    border: 1px solid rgba(232, 194, 104, 0.15);
    cursor: pointer; text-align: left;
  }
  .barber.checked { background: rgba(232, 194, 104, 0.12); border-color: var(--gold); }
  .barber-avatar {
    width: 56px; height: 56px;
    background: linear-gradient(135deg, var(--ink-2), #2a2218);
    border: 1px solid var(--gold-deep);
    display: flex; flex-direction: column; align-items: center; justify-content: center;
    flex-shrink: 0;
  }
  .barber.checked .barber-avatar {
    background: linear-gradient(135deg, var(--gold), #c89a3e);
    border-color: var(--gold);
  }
  .barber-init {
    font-family: 'Pirata One', serif;
    font-size: 1.375rem; color: var(--gold);
    line-height: 1;
  }
  .barber.checked .barber-init { color: var(--ink); }
  .barber-tag {
    font-family: 'Space Grotesk', sans-serif;
    font-size: 0.6875rem; letter-spacing: 0.15em; font-weight: 700;
    color: rgba(232, 194, 104, 0.7);
    margin-top: 2px;
  }
  .barber.checked .barber-tag { color: rgba(13, 12, 10, 0.7); }
  .barber-mid { flex: 1; }
  .barber-name {
    font-family: 'Pirata One', serif;
    font-size: 1.25rem; color: var(--cream);
    letter-spacing: 0.02em; line-height: 1;
  }
  .barber-role {
    font-family: 'Space Grotesk', sans-serif;
    font-size: 0.6875rem; letter-spacing: 0.2em; font-weight: 600;
    color: var(--gold);
    margin-top: 4px;
  }
  .barber-spec {
    font-family: 'Space Grotesk', sans-serif;
    font-size: 0.6875rem; color: rgba(244, 235, 214, 0.6);
    margin-top: 3px;
    line-height: 1.5;
  }

  /* Days */
  .days {
    display: grid; grid-template-columns: repeat(7, 1fr); gap: 5px;
  }
  .day {
    background: rgba(232, 194, 104, 0.04);
    border: 1px solid rgba(232, 194, 104, 0.15);
    padding: 10px 0;
    display: flex; flex-direction: column; align-items: center; gap: 4px;
    cursor: pointer; color: var(--cream);
  }
  .day-name {
    font-family: 'Space Grotesk', sans-serif;
    font-size: 0.6875rem; letter-spacing: 0.15em; font-weight: 700;
    color: rgba(232, 194, 104, 0.7);
  }
  .day-num {
    font-family: 'Pirata One', serif;
    font-size: 1.375rem; line-height: 1;
  }
  .day.checked { background: var(--gold); border-color: var(--gold); }
  .day.checked .day-name { color: rgba(13, 12, 10, 0.7); }
  .day.checked .day-num { color: var(--ink); }

  .slots {
    display: grid; grid-template-columns: repeat(4, 1fr); gap: 5px;
  }
  .slot {
    background: transparent;
    border: 1px solid rgba(232, 194, 104, 0.3);
    color: var(--cream);
    min-height: 44px;
    padding: 10px 0;
    font-family: 'Space Grotesk', sans-serif;
    font-size: 0.75rem; font-weight: 600;
    cursor: pointer;
    display: flex; align-items: center; justify-content: center;
  }
  .slot.checked { background: var(--gold); color: var(--ink); border-color: var(--gold); }
  .slot.taken { opacity: 0.2; text-decoration: line-through; cursor: not-allowed; }

  /* Details form (sheet) */
  .sheet-field {
    display: flex; flex-direction: column; gap: 5px;
  }
  .sheet-field-label {
    font-family: 'Space Grotesk', sans-serif;
    font-size: 0.6875rem; letter-spacing: 0.25em; font-weight: 700;
    color: var(--gold);
  }
  .sheet-input {
    background: transparent;
    border: 1px solid rgba(232, 194, 104, 0.25);
    color: var(--cream);
    padding: 14px;
    font-family: 'Space Grotesk', sans-serif;
    font-size: 0.875rem; font-weight: 500;
    text-transform: uppercase; letter-spacing: 0.05em;
    outline: none;
  }
  .sheet-input:focus { border-color: var(--gold); }
  .sheet-input::placeholder { color: rgba(244, 235, 214, 0.3); }

  .friend-card {
    display: flex; align-items: center; gap: 12px;
    padding: 14px;
    background: rgba(232, 194, 104, 0.04);
    border: 1px solid rgba(232, 194, 104, 0.15);
    cursor: pointer; text-align: left;
    margin-top: 4px;
  }
  .friend-card.on { background: rgba(232, 194, 104, 0.12); border-color: var(--gold); }
  .friend-icon {
    width: 44px; height: 44px;
    border: 1px solid var(--gold);
    display: flex; align-items: center; justify-content: center;
    font-family: 'Pirata One', serif;
    font-size: 1.125rem; color: var(--gold);
  }
  .friend-card.on .friend-icon { background: var(--gold); color: var(--ink); }
  .friend-mid { flex: 1; }
  .friend-name {
    font-family: 'Space Grotesk', sans-serif;
    font-size: 0.8125rem; letter-spacing: 0.1em; font-weight: 700;
    color: var(--cream);
    text-transform: uppercase;
  }
  .friend-sub {
    font-family: 'Space Grotesk', sans-serif;
    font-size: 0.6875rem; letter-spacing: 0.12em;
    color: rgba(244, 235, 214, 0.5);
    margin-top: 3px;
    text-transform: uppercase;
  }

  /* Confirm */
  .confirm { align-items: center; text-align: center; padding-top: 10px; }
  .confirm-badge {
    position: relative;
    width: 80px; height: 80px;
    margin: 0 auto 18px;
  }
  .confirm-mark {
    position: absolute; inset: 0;
    background: var(--gold); color: var(--ink);
    border-radius: 50%;
    display: flex; align-items: center; justify-content: center;
    font-size: 2.5rem; font-weight: 700;
    z-index: 2;
  }
  .confirm-rings {
    position: absolute; inset: -10px;
    border: 1px solid rgba(232, 194, 104, 0.4);
    border-radius: 50%;
    animation: rings 2s ease-out infinite;
  }
  .confirm-rings::before {
    content: ''; position: absolute; inset: -10px;
    border: 1px solid rgba(232, 194, 104, 0.2);
    border-radius: 50%;
  }
  @keyframes rings {
    from { transform: scale(0.9); opacity: 1; }
    to { transform: scale(1.3); opacity: 0; }
  }
  .confirm-eyebrow {
    font-family: 'Space Grotesk', sans-serif;
    font-size: 0.6875rem; letter-spacing: 0.3em; font-weight: 700;
    color: var(--gold); margin-bottom: 10px;
  }
  .confirm-title {
    font-family: 'Pirata One', serif;
    font-size: 2.375rem; line-height: 0.95;
    color: var(--cream);
    margin: 0 0 24px;
    letter-spacing: 0.01em;
  }
  .ticket {
    width: 100%;
    background: var(--gold); color: var(--ink);
    padding: 20px 18px;
    position: relative;
    text-align: left;
  }
  .ticket-head {
    display: flex; justify-content: space-between;
    font-family: 'Space Grotesk', sans-serif;
    font-size: 0.6875rem; letter-spacing: 0.2em; font-weight: 700;
    padding-bottom: 12px;
    border-bottom: 1px dashed rgba(13, 12, 10, 0.3);
  }
  .ticket-when {
    display: flex; justify-content: space-between; align-items: baseline;
    padding: 14px 0;
  }
  .ticket-day {
    font-family: 'Pirata One', serif;
    font-size: 1.75rem; line-height: 1;
  }
  .ticket-time {
    font-family: 'Pirata One', serif;
    font-size: 2.25rem; line-height: 1;
  }
  .ticket-row {
    display: flex; justify-content: space-between;
    font-family: 'Space Grotesk', sans-serif;
    font-size: 0.6875rem; letter-spacing: 0.05em; font-weight: 600;
    padding: 5px 0;
    text-transform: uppercase;
    gap: 12px;
  }
  .ticket-row > span:last-child { text-align: right; font-weight: 700; }
  .ticket-divider {
    height: 1px; background: rgba(13, 12, 10, 0.3); margin: 8px 0;
  }
  .ticket-total {
    display: flex; justify-content: space-between;
    font-family: 'Pirata One', serif;
    font-size: 1.5rem;
  }

  /* Sheet footer */
  .sheet-foot {
    padding: 14px 22px 18px;
    border-top: 1px solid rgba(232, 194, 104, 0.2);
    background: rgba(0, 0, 0, 0.95);
    backdrop-filter: blur(10px);
  }
  .sheet-summary {
    display: flex; justify-content: space-between; align-items: center;
    gap: 12px;
  }
  .summary-label {
    font-family: 'Space Grotesk', sans-serif;
    font-size: 0.6875rem; letter-spacing: 0.25em; font-weight: 700;
    color: rgba(232, 194, 104, 0.7);
  }
  .summary-total {
    font-family: 'Pirata One', serif;
    font-size: 1.625rem; color: var(--gold);
    line-height: 1; margin-top: 2px;
  }
  .sheet-cta {
    background: var(--gold); color: var(--ink);
    border: none; padding: 14px 16px;
    border-radius: 100px;
    font-family: 'Space Grotesk', sans-serif; font-weight: 700;
    font-size: 0.75rem; letter-spacing: 0.18em;
    cursor: pointer; text-transform: uppercase;
    display: flex; align-items: center; gap: 12px;
  }
  .sheet-cta:disabled { opacity: 0.4; cursor: not-allowed; }
  .sheet-back {
    background: transparent; border: none; color: rgba(244, 235, 214, 0.6);
    font-family: 'Space Grotesk', sans-serif;
    font-size: 0.6875rem; letter-spacing: 0.2em; font-weight: 600;
    cursor: pointer; padding: 8px 0 0;
    text-transform: uppercase;
  }
  .listener-error-banner {
    position: relative; z-index: 50;
    background: rgba(232, 93, 62, 0.12);
    border-bottom: 1px solid rgba(232, 93, 62, 0.3);
    color: var(--red);
    font-family: 'Space Grotesk', sans-serif;
    font-size: 0.6875rem; letter-spacing: 0.06em;
    padding: 10px 16px;
    display: flex; justify-content: space-between; align-items: center;
  }
  .listener-error-banner button {
    background: transparent; border: none; color: var(--red);
    font-size: 0.875rem; cursor: pointer; padding: 0 0 0 12px; line-height: 1;
  }
  .sheet-submit-error {
    font-family: 'Space Grotesk', sans-serif;
    font-size: 0.6875rem; color: var(--red);
    letter-spacing: 0.05em; text-align: center;
    padding: 6px 0 0;
  }

  @media (orientation: landscape) and (max-height: 500px) {
    .hero { padding: 12px 22px; }
    .welcome-brand { font-size: 3.25rem; }
    .sheet-body { max-height: 55vh; overflow-y: auto; }
    .bnav { position: fixed; }
  }

  @media (prefers-reduced-motion: reduce) {
    .welcome-badge-dot, .upcoming-dot { animation: none; }
    .sheet { animation: none; }
    .confirm-rings, .confirm-rings::before { animation: none; }
  }

  :focus:not(:focus-visible) { outline: none; }

  .btn:focus-visible,
  .btn-primary:focus-visible,
  .btn-outline:focus-visible,
  .sheet-cta:focus-visible,
  .sheet-close:focus-visible,
  .sheet-back:focus-visible,
  .back-btn:focus-visible,
  .owner-access-link:focus-visible,
  .topbar-avatar:focus-visible,
  .bnav-item:focus-visible,
  .bnav-book:focus-visible,
  .svc-tile:focus-visible,
  .svc-card:focus-visible,
  .svc-line:focus-visible,
  .svc-line-more:focus-visible,
  .barber:focus-visible,
  .day:focus-visible,
  .slot:focus-visible,
  .upcoming-btn:focus-visible,
  .friend-card:focus-visible,
  .auth-foot-link:focus-visible {
    outline: 2px solid var(--gold);
    outline-offset: 2px;
  }
`;
