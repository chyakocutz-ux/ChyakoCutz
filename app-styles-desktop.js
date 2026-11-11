// Tablet & desktop layout. Phones (≤480px) are untouched by everything in here.
//  - 481px+                      : drop the fake phone frame, fill the screen
//  - 768px+ (and 600px+ tall)    : proper wide layout (landscape phones keep the phone layout)
//  - 1100px+ (and 600px+ tall)   : desktop extras (split welcome screen)

window.appStylesDesktop = `
  /* Layout wrappers in the owner dashboard are invisible on phones */
  .osched, .oside, .omain, .oall { display: contents; }

  @keyframes ckFade { from { opacity: 0; } to { opacity: 1; } }

  /* ============ 481px+: NO PHONE FRAME ============ */
  @media (min-width: 481px) {
    .stage { padding: 0; background: #000; }
    .phone {
      width: 100%; height: 100%;
      max-width: none; max-height: none;
      aspect-ratio: auto;
      border-radius: 0;
      box-shadow: none;
    }
    .phone::before { display: none; }
    .statusbar { display: none; }
  }

  /* Phones turned sideways (short + wide): split welcome so the logo isn't hidden behind the buttons */
  @media (min-width: 481px) and (max-height: 599px) {
    .screen:has(.welcome-body-logo) .welcome-bg-video { width: 42%; object-fit: contain; }
    .screen:has(.welcome-body-logo) .welcome-veil { display: none; }
    .welcome-body-logo { margin-left: 42%; padding: 20px 28px 16px; }
  }

  /* ============ 768px+: WIDE LAYOUT ============ */
  @media (min-width: 768px) and (min-height: 600px) {

    /* ---------- welcome ---------- */
    .welcome-bg-video { object-fit: contain; object-position: center 45%; }
    .welcome-body-logo {
      width: 100%; max-width: 560px;
      margin: 0 auto;
      padding: 56px 32px 48px;
    }

    /* ---------- sign in / sign up / forgot / owner access ---------- */
    .auth {
      flex: none;
      width: min(480px, calc(100% - 48px));
      max-height: calc(100% - 64px);
      margin: auto;
      padding: 8px 40px 32px;
      border: 1px solid rgba(232, 194, 104, 0.22);
      border-radius: 6px;
      box-shadow: 0 30px 80px rgba(0, 0, 0, 0.6);
      background:
        radial-gradient(ellipse at top, rgba(232, 194, 104, 0.06) 0%, transparent 50%),
        rgba(10, 8, 6, 0.94);
    }

    /* ---------- customer app: top bar with nav ---------- */
    .topbar {
      min-height: 76px;
      padding: 18px max(40px, calc((100% - 1200px) / 2)) 18px;
      border-bottom: 1px solid rgba(232, 194, 104, 0.14);
      background: var(--ink);
    }
    .bnav {
      top: 0; bottom: auto; left: auto;
      right: max(96px, calc((100% - 1200px) / 2 + 56px));
      height: 76px;
      padding: 0;
      background: transparent;
      border: none;
      align-items: center; gap: 4px;
    }
    .bnav-item {
      flex: none;
      flex-direction: row; gap: 8px;
      padding: 10px 14px;
      font-size: 0.6875rem; letter-spacing: 0.22em;
      border-bottom: 2px solid transparent;
    }
    .bnav-item:hover { color: rgba(244, 235, 214, 0.8); }
    .bnav-item.active { border-bottom-color: var(--gold); }
    .bnav-item-icon, .bnav-item-icon svg { width: 18px; height: 18px; }
    .bnav-book {
      order: 10;
      margin-left: 12px;
      padding: 11px 18px;
      background: var(--gold);
      color: var(--ink) !important;
      flex-direction: row;
      border-bottom: none;
    }
    .bnav-book:hover { background: var(--gold-bright); }
    .bnav-book-pill {
      width: auto; height: auto;
      background: none; color: inherit;
      transform: none; box-shadow: none;
    }
    .bnav-book-pill svg { width: 11px; height: 11px; }

    .app-body {
      padding: 12px max(18px, calc((100% - 1244px) / 2)) 56px;
    }

    /* ---------- customer home: two-column grid ---------- */
    .app-body:has(> .svc-grid) {
      display: grid;
      grid-template-columns: minmax(0, 1.2fr) minmax(0, 1fr);
      column-gap: 8px;
      align-content: start;
    }
    .app-body:has(> .svc-grid) > * { grid-column: 1 / -1; }
    .app-body:has(> .svc-grid) > .hero { grid-column: 1; grid-row: 1; padding-top: 32px; }
    .app-body:has(> .svc-grid) > :nth-child(2) { grid-column: 2; grid-row: 1; align-self: end; margin-bottom: 24px; }
    .app-body:has(> .svc-grid) > :nth-child(5) { grid-column: 1; grid-row: 4; }
    .app-body:has(> .svc-grid) > .svc-list { grid-column: 1; grid-row: 5; }
    .app-body:has(> .svc-grid) > .info-strip { grid-column: 2; grid-row: 4 / span 2; align-self: start; margin-top: 96px; }
    .app-body:has(> .svc-grid) > .home-foot { grid-row: 6; }

    .hero-title { font-size: 4.25rem; }
    .hero-meta { max-width: 560px; }
    .svc-grid { grid-template-columns: repeat(4, 1fr); gap: 12px; }
    .svc-tile { min-height: 150px; }
    .svc-tile-name { font-size: 1.25rem; }
    .info-strip .info-block { padding: 22px; }

    /* ---------- bookings + account ---------- */
    .bk-tabs { max-width: 600px; }
    .blist:has(> .booking-card) {
      display: grid;
      grid-template-columns: repeat(auto-fill, minmax(340px, 1fr));
      gap: 12px;
    }
    .blist > .booking-card { margin-bottom: 0; }
    .blist-empty { max-width: 460px; margin: 0 auto; }
    .acct { columns: 2; column-gap: 24px; }
    .acct > * { break-inside: avoid; }
    .acct-section-label { break-after: avoid; }

    /* ---------- sheets become centred pop-ups ---------- */
    .sheet {
      inset: 0; margin: auto;
      width: min(680px, calc(100% - 48px));
      height: min(880px, calc(100% - 48px));
      border: 1px solid rgba(232, 194, 104, 0.25);
      border-radius: 8px;
      overflow: hidden;
      box-shadow: 0 0 0 100vmax rgba(0, 0, 0, 0.72), 0 30px 80px rgba(0, 0, 0, 0.6);
      animation: ckFade 0.2s ease;
    }
    .sheet-head { padding-top: 24px; }

    .notif-prompt {
      top: 50%; left: 50%; right: auto; bottom: auto;
      transform: translate(-50%, -50%);
      width: min(440px, calc(100% - 48px));
      border-radius: 12px;
      border: 1px solid rgba(232, 194, 104, 0.2);
      animation: ckFade 0.2s ease both;
    }
    .toast-stack { top: 88px; left: auto; right: 24px; width: 360px; }

    /* ---------- owner / staff dashboard ---------- */
    .owner-topbar, .owner-body {
      padding-left: max(22px, calc((100% - 1236px) / 2));
      padding-right: max(22px, calc((100% - 1236px) / 2));
    }
    .owner-topbar { padding-top: 20px; }
    .owner-seg { width: calc(100% - 44px); max-width: 1236px; margin: 14px auto 0; }
    .oseg:hover:not(.on) { color: rgba(244, 235, 214, 0.85); }
    .owner-body { padding-top: 22px; }

    .osched {
      display: grid;
      grid-template-columns: 380px minmax(0, 1fr);
      gap: 32px;
      align-items: start;
    }
    .oside { display: block; position: sticky; top: 0; }
    .omain { display: block; min-width: 0; }
    .oday-strip {
      display: grid; grid-template-columns: repeat(7, 1fr); gap: 6px;
      overflow: visible;
      margin: 0 0 16px; padding: 6px 6px 0 0;
    }
    .oday { width: auto; }
    .obarbers { flex-wrap: wrap; overflow: visible; margin: 0 0 18px; padding: 0; }
    .ostat-label { font-size: 9px; }

    .oall {
      display: grid;
      grid-template-columns: repeat(auto-fill, minmax(340px, 1fr));
      gap: 0 24px;
      align-items: start;
    }
    .oall > .oall-head, .oall > .oempty { grid-column: 1 / -1; }

    .ostaff {
      display: grid;
      grid-template-columns: repeat(auto-fill, minmax(360px, 1fr));
      align-items: start;
    }
    .ostaff > .ostaff-intro, .ostaff > .ostaff-created,
    .ostaff > .ostaff-error, .ostaff > .ostaff-add { grid-column: 1 / -1; }
    .ostaff > .ostaff-intro { max-width: 640px; }
    .ostaff-add { max-width: 360px; }
  }

  /* ============ 1100px+: DESKTOP EXTRAS ============ */
  @media (min-width: 1100px) and (min-height: 600px) {
    /* Split welcome: logo artwork on the left, actions on the right */
    .screen:has(.welcome-body-logo) .welcome-bg-video { width: 55%; object-position: center; }
    .screen:has(.welcome-body-logo) .welcome-veil { display: none; }
    .welcome-body-logo {
      margin: 0 0 0 55%;
      width: 45%; max-width: 560px;
      padding: 64px 56px 56px;
      justify-content: center; gap: 96px;
      border-left: 1px solid rgba(232, 194, 104, 0.12);
    }
    .hero-title { font-size: 5rem; }
  }
`;
