// Extra styles for app-shell, home tweaks, bookings filter, manage sheet, review block,
// account sections, and the centered BOOK button in the bottom nav.

window.appStylesExtra = `
  /* ============ WELCOME BG IMAGE ============ */
  .welcome-bg-video {
    position: absolute; inset: 0;
    width: 100%; height: 100%;
    object-fit: cover;
    background-color: #000;
    pointer-events: none;
  }
  /* Ensure the surrounding screen + body fade also bottom out at pure black */
  .screen:has(.welcome-bg-video) { background: #000 !important; }
  .screen:has(.welcome-bg-video) .welcome-veil {
    background:
      linear-gradient(180deg,
        rgba(0,0,0,0.15) 0%,
        rgba(0,0,0,0.0) 25%,
        rgba(0,0,0,0.0) 50%,
        rgba(0,0,0,0.7) 85%,
        #000 100%) !important;
  }
  /* Override the dark veil with a softer bottom-only gradient so the logo reads */
  .screen .welcome-veil {
    background:
      linear-gradient(180deg,
        rgba(13,12,10,0.35) 0%,
        rgba(13,12,10,0.05) 22%,
        rgba(13,12,10,0.05) 55%,
        rgba(13,12,10,0.85) 88%,
        var(--ink) 100%) !important;
  }
  /* Logo-mode body: top stays where it is, CTAs hug the bottom — no centered text */
  .welcome-body-logo {
    padding: 60px 28px 36px;
  }

  /* ============ BOTTOM NAV — center BOOK button ============ */
  .bnav-book {
    color: var(--gold) !important;
    gap: 6px;
  }
  .bnav-book-pill {
    width: 44px; height: 44px;
    background: var(--gold);
    color: var(--ink);
    display: flex; align-items: center; justify-content: center;
    transform: translateY(-12px);
    box-shadow:
      0 0 0 4px var(--ink),
      0 0 18px rgba(232,194,104,0.45);
  }
  .bnav-book .bnav-item-icon { display: none; }

  /* ============ HOME tweaks ============ */
  .hero-cta-wrap {
    margin: 4px 22px 8px;
  }
  .hero-cta {
    width: 100%;
    padding: 18px 20px !important;
    font-size: 0.875rem !important;
  }
  .svc-line-more {
    background: transparent;
    border: 1px dashed rgba(232, 194, 104, 0.35);
    color: var(--gold);
    width: 100%;
    padding: 14px;
    margin-top: 14px;
    font-family: 'Space Grotesk', sans-serif;
    font-size: 0.6875rem; letter-spacing: 0.2em; font-weight: 700;
    text-transform: uppercase;
    cursor: pointer;
  }
  .home-foot {
    text-align: center;
    margin: 36px 0 24px;
    font-family: 'Space Grotesk', sans-serif;
    font-size: 0.6875rem; letter-spacing: 0.3em; font-weight: 700;
    color: rgba(244, 235, 214, 0.3);
  }

  /* ============ BOOKINGS TAB filter ============ */
  .bk-tabs {
    display: flex; gap: 6px;
    padding: 0 22px 18px;
  }
  .bk-tab {
    flex: 1;
    background: transparent;
    border: 1px solid rgba(232, 194, 104, 0.2);
    color: rgba(244, 235, 214, 0.55);
    padding: 10px 6px;
    font-family: 'Space Grotesk', sans-serif;
    font-size: 0.6875rem; letter-spacing: 0.18em; font-weight: 700;
    text-transform: uppercase;
    cursor: pointer;
    display: flex; align-items: center; justify-content: center; gap: 6px;
  }
  .bk-tab span {
    color: rgba(232, 194, 104, 0.5);
    font-family: 'Pirata One', serif;
    font-size: 0.875rem;
    letter-spacing: 0;
  }
  .bk-tab.active {
    background: rgba(232, 194, 104, 0.12);
    border-color: var(--gold);
    color: var(--gold);
  }
  .bk-tab.active span { color: var(--gold); }

  .booking-card {
    text-align: left;
    cursor: pointer;
    width: 100%;
    color: var(--cream);
  }
  .booking-card:hover { border-color: var(--gold); }
  .booking-card.cancelled { opacity: 0.55; }
  .booking-card-barber {
    font-family: 'Space Grotesk', sans-serif;
    font-size: 0.6875rem; letter-spacing: 0.15em; font-weight: 600;
    color: rgba(232, 194, 104, 0.7);
    margin-top: 6px;
    text-transform: uppercase;
  }
  .booking-card-status.cancelled-tag {
    color: var(--red);
    border-color: rgba(232, 93, 62, 0.4);
  }

  /* ============ MANAGE SHEET ============ */
  .manage-ticket {
    margin-top: 6px;
  }
  .manage-info {
    margin-top: 22px;
    border: 1px solid rgba(232, 194, 104, 0.2);
  }
  .manage-info-row {
    display: flex; justify-content: space-between; align-items: flex-start;
    padding: 14px 16px;
    border-bottom: 1px solid rgba(232, 194, 104, 0.1);
    gap: 16px;
  }
  .manage-info-row:last-child { border-bottom: none; }
  .manage-info-label {
    font-family: 'Space Grotesk', sans-serif;
    font-size: 0.6875rem; letter-spacing: 0.3em; font-weight: 700;
    color: rgba(232, 194, 104, 0.7);
  }
  .manage-info-val {
    font-family: 'Pirata One', serif;
    font-size: 1rem; line-height: 1.25;
    color: var(--cream);
    letter-spacing: 0.02em;
    text-align: right;
    text-decoration: none;
  }
  .manage-info-val.link { color: var(--gold); }

  .manage-actions {
    display: flex; gap: 8px;
    margin-top: 18px;
  }
  .manage-actions .btn {
    flex: 1;
    padding: 14px 12px;
    font-size: 0.6875rem;
  }
  .btn-danger {
    background: transparent;
    border: 1px solid rgba(232, 93, 62, 0.5);
    color: var(--red);
    border-radius: 0;
  }
  .btn-danger:hover { border-color: var(--red); background: rgba(232, 93, 62, 0.08); }

  .manage-confirm {
    margin-top: 22px;
    border-top: 1px solid rgba(232, 93, 62, 0.3);
    padding-top: 18px;
  }
  .manage-confirm-title {
    font-family: 'Pirata One', serif;
    font-size: 1.375rem; color: var(--red);
    text-align: center;
    margin-bottom: 4px;
    letter-spacing: 0.02em;
  }
  .manage-confirm-sub {
    text-align: center;
    font-family: 'Space Grotesk', sans-serif;
    font-size: 0.6875rem;
    color: rgba(244, 235, 214, 0.55);
    margin-bottom: 14px;
  }
  .manage-cancelled-note {
    margin-top: 22px;
    padding: 18px;
    border: 1px dashed rgba(232, 93, 62, 0.4);
    text-align: center;
    font-family: 'Space Grotesk', sans-serif;
    font-size: 0.6875rem; letter-spacing: 0.25em; font-weight: 700;
    color: var(--red);
  }

  /* ============ REVIEW STEP (book sheet) ============ */
  .review-block {
    border: 1px solid rgba(232, 194, 104, 0.2);
    padding: 14px 16px;
    margin-bottom: 10px;
    display: flex; flex-direction: column; gap: 10px;
  }
  .review-block-head {
    font-family: 'Space Grotesk', sans-serif;
    font-size: 0.6875rem; letter-spacing: 0.3em; font-weight: 700;
    color: rgba(232, 194, 104, 0.7);
    padding-bottom: 6px;
    border-bottom: 1px dashed rgba(232, 194, 104, 0.15);
    margin-bottom: 4px;
  }
  .review-row {
    display: flex; justify-content: space-between; align-items: baseline;
    gap: 12px;
  }
  .review-label {
    font-family: 'Space Grotesk', sans-serif;
    font-size: 0.6875rem; letter-spacing: 0.25em; font-weight: 700;
    color: rgba(244, 235, 214, 0.5);
    flex-shrink: 0;
  }
  .review-val {
    font-family: 'Space Grotesk', sans-serif;
    font-size: 0.8125rem; letter-spacing: 0.04em; font-weight: 600;
    color: var(--cream);
    text-align: right;
    text-transform: uppercase;
  }
  .review-hint {
    margin: 4px 0 0;
    font-family: 'Space Grotesk', sans-serif;
    font-size: 0.6875rem; color: rgba(244, 235, 214, 0.35);
    text-align: center; letter-spacing: 0.04em;
  }

  /* ============ PAYMENT / RESERVATION FEE ============ */
  .pay-block .review-val { text-align: left; }
  .pay-block .review-label { font-size: 0.8125rem; }
  .pay-now-row {
    margin: 2px -8px;
    padding: 8px;
    background: rgba(232, 194, 104, 0.08);
    border: 1px solid rgba(232, 194, 104, 0.25);
  }
  .pay-now-row .review-val { color: var(--gold); letter-spacing: 0.06em; }
  .pay-now-row .review-label { font-family: 'Pirata One', serif; font-size: 1.125rem; letter-spacing: 0; }
  .pay-note {
    font-family: 'Space Grotesk', sans-serif;
    font-size: 8.5px; letter-spacing: 0.16em; font-weight: 600;
    line-height: 1.7;
    color: rgba(244, 235, 214, 0.4);
    border-top: 1px dashed rgba(232, 194, 104, 0.15);
    padding-top: 10px;
    margin-top: 2px;
  }

  /* ============ CONFIRM DONE BUTTON ============ */
  .confirm-done {
    width: 100%;
    margin-top: 22px;
  }

  /* ============ ACCOUNT TAB ============ */
  .acct-section-label {
    font-family: 'Space Grotesk', sans-serif;
    font-size: 0.6875rem; letter-spacing: 0.3em; font-weight: 700;
    color: rgba(232, 194, 104, 0.7);
    margin: 20px 0 8px;
    padding-left: 4px;
    text-transform: uppercase;
  }
  .acct-card-tight {
    padding: 4px 16px;
  }
  .acct-footer {
    text-align: center;
    margin: 32px 0 24px;
    font-family: 'Space Grotesk', sans-serif;
    font-size: 0.6875rem; letter-spacing: 0.3em; font-weight: 700;
    color: rgba(244, 235, 214, 0.3);
    line-height: 2;
  }

  /* Welcome brand fits 390px better */
  @media (max-width: 420px) {
    .welcome-brand { font-size: 4.875rem; }
  }

  /* ============ OWNER ACCESS LINK (welcome) ============ */
  .owner-access-link {
    display: block; width: 100%;
    margin-top: 14px;
    background: transparent; border: none;
    font-family: 'Space Grotesk', sans-serif;
    font-size: 0.6875rem; letter-spacing: 0.32em; font-weight: 700;
    color: rgba(244, 235, 214, 0.4);
    cursor: pointer; text-align: center;
    transition: color 0.15s;
  }
  .owner-access-link:hover { color: var(--gold); }
  .owner-access-key { color: var(--gold); margin-right: 4px; }

  /* ============ OWNER LOGIN ============ */
  .owner-login-screen {
    background:
      radial-gradient(ellipse at top, rgba(232, 194, 104, 0.10) 0%, transparent 55%),
      var(--ink);
  }
  .owner-crest {
    font-size: 2.5rem; color: var(--gold);
    margin: 8px 0 14px;
    line-height: 1;
  }
  .owner-hint {
    margin-top: 22px; text-align: center;
    font-family: 'Space Grotesk', sans-serif;
    font-size: 0.6875rem; letter-spacing: 0.28em; font-weight: 700;
    color: rgba(244, 235, 214, 0.35);
  }
  .owner-hint strong { color: var(--gold); letter-spacing: 0.1em; }

  /* ============ OWNER DASHBOARD ============ */
  .owner {
    position: absolute; inset: 0;
    display: flex; flex-direction: column;
    background: var(--ink);
    overflow: hidden;
  }
  .owner-topbar {
    display: flex; justify-content: space-between; align-items: flex-start;
    padding: 12px 22px 14px;
    border-bottom: 1px solid rgba(232, 194, 104, 0.18);
  }
  .owner-eyebrow {
    font-family: 'Space Grotesk', sans-serif;
    font-size: 0.6875rem; letter-spacing: 0.3em; font-weight: 700;
    color: var(--gold);
    margin-bottom: 7px;
    display: flex; align-items: center; gap: 5px;
  }
  .owner-key { font-size: 0.75rem; }
  .owner-brand {
    font-family: 'Pirata One', serif;
    font-size: 1.875rem; color: var(--cream);
    line-height: 1; letter-spacing: 0.01em;
  }
  .owner-brand span {
    font-family: 'Space Grotesk', sans-serif;
    font-size: 0.6875rem; letter-spacing: 0.18em; font-weight: 700;
    color: rgba(244, 235, 214, 0.45);
    margin-left: 8px;
  }
  .owner-signout {
    width: 40px; height: 40px; flex-shrink: 0;
    background: transparent;
    border: 1px solid rgba(232, 194, 104, 0.3);
    color: var(--gold);
    display: flex; align-items: center; justify-content: center;
    cursor: pointer;
  }
  .owner-signout:hover { border-color: var(--gold); background: rgba(232, 194, 104, 0.08); }

  .owner-seg {
    display: flex; gap: 0;
    margin: 14px 22px 0;
    border: 1px solid rgba(232, 194, 104, 0.25);
  }
  .oseg {
    flex: 1; background: transparent; border: none;
    padding: 12px 8px;
    font-family: 'Space Grotesk', sans-serif;
    font-size: 0.6875rem; letter-spacing: 0.22em; font-weight: 700;
    color: rgba(244, 235, 214, 0.5);
    cursor: pointer; text-transform: uppercase;
    transition: all 0.15s;
  }
  .oseg + .oseg { border-left: 1px solid rgba(232, 194, 104, 0.25); }
  .oseg.on { background: var(--gold); color: var(--ink); }

  .owner-body {
    flex: 1; overflow-y: auto;
    padding: 16px 22px 40px;
  }
  .owner-body::-webkit-scrollbar { width: 0; }

  /* date strip */
  .oday-strip {
    display: flex; gap: 7px;
    overflow-x: auto; padding-bottom: 4px;
    margin: 0 -22px 16px; padding-left: 22px; padding-right: 22px;
  }
  .oday-strip::-webkit-scrollbar { height: 0; }
  .oday {
    position: relative; flex-shrink: 0;
    width: 48px; padding: 9px 0;
    background: transparent;
    border: 1px solid rgba(232, 194, 104, 0.22);
    color: var(--cream);
    display: flex; flex-direction: column; align-items: center; gap: 3px;
    cursor: pointer;
  }
  .oday-name {
    font-family: 'Space Grotesk', sans-serif;
    font-size: 0.6875rem; letter-spacing: 0.14em; font-weight: 700;
    color: rgba(244, 235, 214, 0.55);
  }
  .oday-num {
    font-family: 'Pirata One', serif;
    font-size: 1.375rem; line-height: 1; color: var(--cream);
  }
  .oday.on { background: var(--gold); border-color: var(--gold); }
  .oday.on .oday-name { color: rgba(0,0,0,0.6); }
  .oday.on .oday-num { color: var(--ink); }
  .oday-count {
    position: absolute; top: -6px; right: -6px;
    min-width: 17px; height: 17px; padding: 0 4px;
    background: var(--gold); color: var(--ink);
    border: 1px solid var(--ink);
    font-family: 'Space Grotesk', sans-serif;
    font-size: 0.6875rem; font-weight: 700;
    display: flex; align-items: center; justify-content: center;
    border-radius: 9px;
  }
  .oday.on .oday-count { background: var(--ink); color: var(--gold); border-color: var(--gold); }

  /* stats */
  .ostats {
    display: grid; grid-template-columns: repeat(3, 1fr); gap: 8px;
    margin-bottom: 16px;
  }
  .ostat {
    background: linear-gradient(165deg, var(--ink-2), var(--ink));
    border: 1px solid rgba(232, 194, 104, 0.2);
    padding: 14px 10px;
    text-align: center;
  }
  .ostat-num {
    font-family: 'Pirata One', serif;
    font-size: 1.75rem; line-height: 1; color: var(--gold);
  }
  .ostat-label {
    font-family: 'Space Grotesk', sans-serif;
    font-size: 7.5px; letter-spacing: 0.2em; font-weight: 700;
    color: rgba(244, 235, 214, 0.5);
    margin-top: 7px;
  }

  /* barber filter chips */
  .obarbers {
    display: flex; gap: 7px;
    overflow-x: auto; padding-bottom: 4px;
    margin: 0 -22px 18px; padding-left: 22px; padding-right: 22px;
  }
  .obarbers::-webkit-scrollbar { height: 0; }
  .obarber {
    flex-shrink: 0;
    background: transparent;
    border: 1px solid rgba(232, 194, 104, 0.25);
    color: rgba(244, 235, 214, 0.7);
    padding: 8px 12px;
    font-family: 'Space Grotesk', sans-serif;
    font-size: 0.6875rem; letter-spacing: 0.14em; font-weight: 700;
    cursor: pointer; white-space: nowrap;
    display: flex; align-items: center; gap: 7px;
    text-transform: uppercase;
  }
  .obarber.on { background: var(--gold); border-color: var(--gold); color: var(--ink); }
  .obarber-c {
    font-family: 'Pirata One', serif; font-size: 0.8125rem;
    color: var(--gold); line-height: 1;
  }
  .obarber.on .obarber-c { color: var(--ink); }

  /* section labels */
  .oagenda-head, .oall-head {
    font-family: 'Space Grotesk', sans-serif;
    font-size: 0.6875rem; letter-spacing: 0.28em; font-weight: 700;
    color: rgba(232, 194, 104, 0.7);
    margin: 4px 0 12px;
  }
  .ogroup { margin-bottom: 22px; }
  .ogroup-head {
    display: flex; justify-content: space-between; align-items: center;
    padding-bottom: 8px; margin-bottom: 12px;
    border-bottom: 1px dashed rgba(232, 194, 104, 0.2);
    font-family: 'Pirata One', serif;
    font-size: 1.125rem; color: var(--cream); letter-spacing: 0.02em;
  }
  .ogroup-count {
    font-family: 'Space Grotesk', sans-serif;
    font-size: 0.6875rem; letter-spacing: 0.1em; font-weight: 700;
    color: var(--gold);
    border: 1px solid rgba(232, 194, 104, 0.35);
    padding: 3px 9px;
  }

  /* appointment card */
  .oappt {
    display: flex; gap: 12px;
    background: linear-gradient(165deg, var(--ink-2), var(--ink));
    border: 1px solid rgba(232, 194, 104, 0.18);
    border-left: 3px solid var(--gold);
    padding: 13px 14px 14px;
    margin-bottom: 9px;
  }
  .oappt.done { border-left-color: #7fae5f; opacity: 0.82; }
  .oappt.noshow { border-left-color: var(--red); opacity: 0.78; }
  .oappt.cancelled { border-left-color: rgba(244,235,214,0.25); opacity: 0.55; }
  .oappt-time {
    flex-shrink: 0; width: 50px;
    display: flex; flex-direction: column; align-items: flex-start; gap: 3px;
    padding-top: 1px;
  }
  .oappt-time-h {
    font-family: 'Pirata One', serif;
    font-size: 1.438rem; line-height: 0.95; color: var(--gold);
  }
  .oappt.done .oappt-time-h { color: #7fae5f; }
  .oappt.noshow .oappt-time-h { color: var(--red); }
  .oappt.cancelled .oappt-time-h { color: rgba(244,235,214,0.4); }
  .oappt-dur {
    font-family: 'Space Grotesk', sans-serif;
    font-size: 0.6875rem; letter-spacing: 0.12em; font-weight: 700;
    color: rgba(244, 235, 214, 0.4);
  }
  .oappt-main { flex: 1; min-width: 0; }
  .oappt-top {
    display: flex; justify-content: space-between; align-items: center;
    gap: 8px; margin-bottom: 5px;
  }
  .oappt-cust {
    font-family: 'Space Grotesk', sans-serif;
    font-size: 0.8125rem; letter-spacing: 0.03em; font-weight: 700;
    color: var(--cream);
    white-space: nowrap; overflow: hidden; text-overflow: ellipsis;
  }
  .ostatus {
    flex-shrink: 0;
    font-family: 'Space Grotesk', sans-serif;
    font-size: 0.6875rem; letter-spacing: 0.16em; font-weight: 700;
    padding: 3px 7px;
    border: 1px solid var(--gold); color: var(--gold);
  }
  .ostatus.done { border-color: #7fae5f; color: #7fae5f; }
  .ostatus.noshow { border-color: var(--red); color: var(--red); }
  .ostatus.cancelled { border-color: rgba(244,235,214,0.3); color: rgba(244,235,214,0.45); }
  .oappt-svc {
    font-family: 'Space Grotesk', sans-serif;
    font-size: 0.6875rem; letter-spacing: 0.05em; font-weight: 600;
    color: rgba(244, 235, 214, 0.75);
    line-height: 1.45; margin-bottom: 8px;
  }
  .oappt-meta {
    display: flex; align-items: center; flex-wrap: wrap; gap: 10px;
    margin-bottom: 11px;
  }
  .oappt-barber {
    display: flex; align-items: center; gap: 6px;
    font-family: 'Space Grotesk', sans-serif;
    font-size: 0.6875rem; letter-spacing: 0.1em; font-weight: 700;
    color: rgba(244, 235, 214, 0.6);
  }
  .oappt-init {
    width: 18px; height: 18px;
    border: 1px solid rgba(232, 194, 104, 0.4);
    color: var(--gold);
    display: flex; align-items: center; justify-content: center;
    font-family: 'Pirata One', serif; font-size: 0.6875rem;
  }
  .oappt-phone {
    font-family: 'Space Grotesk', sans-serif;
    font-size: 0.6875rem; letter-spacing: 0.06em; font-weight: 600;
    color: rgba(232, 194, 104, 0.7);
    text-decoration: none;
  }
  .oappt-phone:hover { color: var(--gold); text-decoration: underline; text-underline-offset: 3px; }
  .oappt-price {
    margin-left: auto;
    font-family: 'Pirata One', serif;
    font-size: 1rem; color: var(--cream);
  }
  .oappt-actions { display: flex; gap: 6px; }
  .oact {
    flex: 1;
    background: transparent;
    border: 1px solid rgba(244, 235, 214, 0.22);
    color: rgba(244, 235, 214, 0.8);
    padding: 8px 4px;
    font-family: 'Space Grotesk', sans-serif;
    font-size: 0.6875rem; letter-spacing: 0.1em; font-weight: 700;
    cursor: pointer; text-transform: uppercase;
    transition: all 0.13s;
  }
  .oact.done:hover { background: #7fae5f; border-color: #7fae5f; color: var(--ink); }
  .oact.noshow:hover { background: var(--red); border-color: var(--red); color: var(--ink); }
  .oact.cancel:hover { background: rgba(244,235,214,0.12); border-color: rgba(244,235,214,0.5); }
  .oact.reopen {
    flex: 0 0 auto; padding: 8px 16px;
    border-color: rgba(232, 194, 104, 0.4); color: var(--gold);
  }
  .oact.reopen:hover { background: rgba(232, 194, 104, 0.1); border-color: var(--gold); }

  /* empty state */
  .oempty {
    text-align: center; padding: 50px 20px;
    border: 1px dashed rgba(232, 194, 104, 0.2);
  }
  .oempty-mark { font-size: 2.125rem; color: rgba(232, 194, 104, 0.5); }
  .oempty-title {
    font-family: 'Pirata One', serif;
    font-size: 1.375rem; color: var(--cream);
    margin: 12px 0 6px;
  }
  .oempty-sub {
    font-family: 'Space Grotesk', sans-serif;
    font-size: 0.6875rem; letter-spacing: 0.04em;
    color: rgba(244, 235, 214, 0.45);
    line-height: 1.5;
  }

  /* ============ TOAST NOTIFICATIONS ============ */
  .toast-stack {
    position: absolute; top: 60px; left: 10px; right: 10px;
    z-index: 300; display: flex; flex-direction: column; gap: 8px;
    pointer-events: none;
  }
  .toast {
    background: rgba(10,10,10,0.97);
    border: 1px solid rgba(232,194,104,0.3);
    border-left: 3px solid #e8c268;
    border-radius: 6px;
    padding: 12px 14px;
    display: flex; align-items: flex-start; gap: 10px;
    pointer-events: all; cursor: pointer;
    box-shadow: 0 4px 20px rgba(0,0,0,0.6);
    animation: toast-in 0.25s ease both;
  }
  @keyframes toast-in {
    from { opacity: 0; transform: translateY(-8px); }
    to   { opacity: 1; transform: translateY(0); }
  }
  .toast-icon { font-size: 13px; color: #e8c268; flex-shrink: 0; margin-top: 1px; }
  .toast-content { flex: 1; min-width: 0; }
  .toast-title {
    font-size: 10px; font-weight: 700; letter-spacing: 0.12em;
    color: #e8c268; margin-bottom: 3px;
  }
  .toast-msg { font-size: 11px; color: rgba(244,235,214,0.8); line-height: 1.4; }

  /* ============ NOTIFICATION PERMISSION PROMPT ============ */
  .notif-overlay {
    position: absolute; inset: 0; z-index: 400;
    background: rgba(0,0,0,0.55);
  }
  .notif-prompt {
    position: absolute; bottom: 0; left: 0; right: 0; z-index: 401;
    background: #0a0806;
    border-radius: 20px 20px 0 0;
    padding: 32px 24px 44px;
    box-shadow: 0 -12px 48px rgba(0,0,0,0.7);
    animation: slideUp 0.35s cubic-bezier(0.2, 0.9, 0.3, 1) both;
  }
  .notif-prompt-icon {
    width: 56px; height: 56px;
    background: rgba(232,194,104,0.08);
    border-radius: 50%;
    display: flex; align-items: center; justify-content: center;
    margin: 0 auto 22px;
  }
  .notif-prompt-title {
    font-family: 'Space Grotesk', sans-serif;
    font-size: 17px; font-weight: 700;
    letter-spacing: 0.1em; text-transform: uppercase;
    color: #f4ebd6; text-align: center; margin-bottom: 12px;
  }
  .notif-prompt-body {
    font-family: 'Space Grotesk', sans-serif;
    font-size: 13px; line-height: 1.6;
    color: rgba(244,235,214,0.55);
    text-align: center;
    max-width: 270px; margin: 0 auto 28px;
  }
  .notif-prompt-allow {
    display: block; width: 100%;
    padding: 14px; margin-bottom: 14px;
    background: #e8c268; color: #000;
    border: none; border-radius: 100px;
    font-family: 'Space Grotesk', sans-serif;
    font-size: 11px; font-weight: 700;
    letter-spacing: 0.15em; text-transform: uppercase;
    cursor: pointer; transition: background 0.15s;
  }
  .notif-prompt-allow:active { background: #f4d98a; }
  .notif-prompt-skip {
    display: block; width: 100%; text-align: center;
    background: none; border: none; cursor: pointer;
    font-family: 'Space Grotesk', sans-serif;
    font-size: 11px; letter-spacing: 0.08em;
    color: rgba(244,235,214,0.3);
    padding: 8px 0;
  }
`;
