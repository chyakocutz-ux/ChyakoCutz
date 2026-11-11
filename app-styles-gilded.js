// GILDED THEME — "Atelier × Gold". Loaded after the other style files.
// 1) Re-skins the existing style strings (fonts + gold palette) so every screen,
//    including owner/staff, picks up the new look without layout changes.
// 2) Adds the Gilded components and per-screen overrides.

(function reskinExistingStyles() {
  const swap = (s) => s
    .replace(/'Pirata One',\s*serif/g, "'Cinzel', serif")
    .replace(/'Space Grotesk'/g, "'Inter'")
    .replace(/#e8c268/gi, "#d9b25c")
    .replace(/#f4d98a/gi, "#f6e2a4")
    .replace(/#a77e2e/gi, "#8a6626")
    .replace(/#c89a3e/gi, "#b88a35")
    .replace(/rgba\(\s*232,\s*194,\s*104/g, "rgba(217, 178, 92");
  ["appStyles", "appStylesExtra", "appStylesDesktop"].forEach((k) => {
    if (typeof window[k] === "string") window[k] = swap(window[k]);
  });
})();

window.appStylesGilded = `
  :root {
    --gold: #d9b25c; --gold-bright: #f6e2a4; --gold-deep: #8a6626;
    --gold-hi: #f6e2a4; --gold-lo: #8a6626;
    --ink: #070606; --ink-2: #0d0c0b; --ink-3: #15120e;
    --cream: #efe6d2; --cream-dim: rgba(239, 230, 210, 0.6);
    --serif: 'Cinzel', Georgia, serif;
  }
  html, body { font-family: 'Inter', system-ui, sans-serif; }

  /* ---------- shared gilded bits ---------- */
  .gt { background: linear-gradient(180deg, var(--gold-hi) 0%, var(--gold) 45%, var(--gold-lo) 100%);
        -webkit-background-clip: text; background-clip: text; color: transparent; }
  .gframe { position: absolute; inset: 10px; z-index: 25; pointer-events: none;
            border: 1px solid rgba(217,178,92,0.55); box-shadow: inset 0 0 0 5px rgba(217,178,92,0.10); }
  .gcorner { position: absolute; width: 86px; height: 86px; }
  .gcorner.tl { top: -1px; left: -1px; }
  .gcorner.tr { top: -1px; right: -1px; transform: scaleX(-1); }
  .gcorner.bl { bottom: -1px; left: -1px; transform: scaleY(-1); }
  .gcorner.br { bottom: -1px; right: -1px; transform: scale(-1); }
  .gfleur { display: block; width: 120px; height: 30px; margin: 0 auto; }
  .gorn { display: flex; align-items: center; gap: 10px; justify-content: center; color: var(--gold); margin: 18px auto; }
  .gorn::before, .gorn::after { content: ""; height: 1px; width: 70px; background: linear-gradient(90deg, transparent, var(--gold)); }
  .gorn::after { transform: scaleX(-1); }
  .gorn svg { width: 14px; height: 14px; }
  .glogo { display: block; }
  div.glogo { aspect-ratio: 1.25; }

  /* ---------- app chrome ---------- */
  .app { background: radial-gradient(130% 70% at 50% 0%, #1d1a16 0%, #0d0c0b 55%, #070606 100%); }
  .app.tab-home .topbar { display: none; }
  .topbar { background: linear-gradient(180deg, rgba(7,6,6,0.96) 0%, rgba(7,6,6,0) 100%); padding-left: 26px; padding-right: 26px; }
  .topbar { justify-content: center !important; padding-top: max(24px, calc(env(safe-area-inset-top) + 12px)) !important; }
  .topbar-logo { height: 44px; width: auto; }
  .topbar-avatar { display: none !important; }
  .topbar-avatar { font-family: var(--serif); border-color: var(--gold) !important; color: var(--gold-hi) !important; }

  .bnav { background: linear-gradient(180deg, rgba(7,6,6,0.92), #070606 40%); border-top: 1px solid rgba(217,178,92,0.28); }
  .bnav-item { font-family: var(--serif); font-size: 0.5625rem; letter-spacing: 0.16em; font-weight: 600; color: rgba(239,230,210,0.55); }
  .bnav-item.active { color: var(--gold-hi); }
  .bnav-book { color: var(--gold-hi) !important; }
  .bnav-book-pill {
    width: 58px !important; height: 58px !important; border-radius: 50% !important; color: #2a1f0a !important;
    background: radial-gradient(circle at 35% 28%, #fff4c9, #d9b25c 48%, #7d5c20) !important;
    box-shadow: 0 0 0 4px #070606, 0 0 0 5px var(--gold), 0 8px 20px rgba(0,0,0,0.8) !important;
    transform: none !important; margin-top: -30px;
  }

  /* ---------- home ---------- */
  .ghome { padding-bottom: 12px; }
  .ghero { position: relative; height: 580px; overflow: hidden; background: #070606; }
  .ghero::before { content: ""; position: absolute; inset: 0; background: url(assets/brand/parlour.jpg) center 40% / cover;
                   filter: grayscale(1) contrast(1.18) brightness(0.82); }
  .ghero::after { content: ""; position: absolute; inset: 0;
                  background: linear-gradient(180deg, rgba(7,6,6,0.8) 0%, rgba(7,6,6,0.05) 32%, rgba(7,6,6,0.25) 58%, #070606 97%); }
  .ghero-top { position: relative; z-index: 2; text-align: center; padding-top: max(34px, calc(env(safe-area-inset-top) + 20px)); }
  .ghero-logo { width: 176px; margin: 8px auto 0; filter: drop-shadow(0 4px 22px rgba(0,0,0,0.9)); }
  .ghero-copy { position: absolute; z-index: 2; left: 0; right: 0; bottom: 22px; text-align: center; padding: 0 30px; }
  .ghero-kicker { margin: 0; font: 600 0.625rem var(--serif); letter-spacing: 0.4em; color: rgba(239,230,210,0.78); }
  .ghero-title { margin: 12px 0 0; font: 700 2rem/1.14 var(--serif); letter-spacing: 0.01em; text-shadow: none; }

  .glive { margin: 8px 30px 0; padding: 16px 16px 18px; border: 1px solid rgba(217,178,92,0.45);
           background: linear-gradient(180deg, rgba(217,178,92,0.08), rgba(0,0,0,0.3)); }
  .glive-head { display: flex; justify-content: space-between; align-items: center; gap: 10px;
                font: 700 0.6875rem var(--serif); letter-spacing: 0.22em; color: var(--gold-hi); }
  .glive-status { display: flex; align-items: center; gap: 7px; font: 500 0.6875rem 'Inter', sans-serif; letter-spacing: 0.02em; color: rgba(239,230,210,0.72); white-space: nowrap; }
  .glive-status i { width: 7px; height: 7px; border-radius: 50%; background: #e85d3e; box-shadow: 0 0 8px #e85d3e; }
  .glive-status i.open { background: #7fae5f; box-shadow: 0 0 8px #7fae5f; }
  .glive-day { font-size: 0.6875rem; letter-spacing: 0.2em; color: rgba(239,230,210,0.5); margin: 14px 0 8px; }
  .glive-slots { display: grid; grid-template-columns: repeat(4, 1fr); gap: 8px; }
  .glive-slots button { padding: 11px 0; background: none; border: 1px solid rgba(217,178,92,0.5); cursor: pointer;
                        font: 700 0.875rem var(--serif); color: var(--gold-hi); transition: background .2s, color .2s; }
  .glive-slots button:hover, .glive-slots button:focus-visible { background: var(--gold); color: #1b1406; outline: none; }

  .gslide { position: relative; height: 62px; margin-top: 16px; border-radius: 999px; cursor: pointer;
            background: linear-gradient(180deg, #050505, #1a1712); border: 1px solid rgba(217,178,92,0.6);
            box-shadow: inset 0 2px 8px rgba(0,0,0,0.9), 0 0 0 4px rgba(217,178,92,0.08);
            touch-action: none; user-select: none; -webkit-user-select: none; }
  .gslide:focus-visible { outline: 2px solid var(--gold); outline-offset: 3px; }
  .gslide-lbl { position: absolute; inset: 0; display: grid; place-items: center; padding-left: 40px;
                font: 700 0.8125rem var(--serif); letter-spacing: 0.32em;
                background: linear-gradient(90deg, #7a5c22 0%, #7a5c22 35%, #fff2c2 50%, #7a5c22 65%, #7a5c22 100%);
                background-size: 250% 100%; -webkit-background-clip: text; background-clip: text; color: transparent;
                animation: gshine 2.6s linear infinite; }
  @keyframes gshine { from { background-position: 120% 0; } to { background-position: -120% 0; } }
  .gslide-knob { position: absolute; left: 5px; top: 5px; width: 52px; height: 52px; border-radius: 50%;
                 display: grid; place-items: center; color: #2a1f0a; cursor: grab;
                 background: radial-gradient(circle at 35% 28%, #fff4c9, #d9b25c 48%, #7d5c20 100%);
                 box-shadow: 0 4px 12px rgba(0,0,0,0.7), inset 0 -2px 4px rgba(0,0,0,0.35);
                 transition: transform .35s cubic-bezier(.3,1.5,.5,1); }
  .gslide-knob.drag { transition: none; cursor: grabbing; }

  .gsec { padding: 44px 30px 0; }
  .gh { margin: 0; text-align: center; font: 700 1.375rem var(--serif); letter-spacing: 0.14em; }
  .gh small { display: block; font: 500 0.625rem 'Inter', sans-serif; letter-spacing: 0.4em; margin-bottom: 8px;
              color: rgba(239,230,210,0.5); -webkit-text-fill-color: rgba(239,230,210,0.5); }

  .gdeck { display: flex; gap: 14px; overflow-x: auto; scroll-snap-type: x mandatory; scroll-padding: 0 30px;
           padding: 10px 30px 22px; margin: 0 -30px; scrollbar-width: none; }
  .gdeck::-webkit-scrollbar { display: none; }
  .gcard { position: relative; flex: none; scroll-snap-align: start; width: 150px; height: 252px; padding: 0; border: 0;
           border-radius: 12px; cursor: pointer; text-align: center; color: var(--cream); background: #0b0a09;
           box-shadow: 0 0 0 1px var(--gold), 0 14px 26px rgba(0,0,0,0.7);
           transform: rotate(var(--r)); transition: transform .35s cubic-bezier(.3,1.5,.5,1); }
  .gcard:hover, .gcard:focus-visible { transform: rotate(0) translateY(-8px); outline: none; }
  .gcard::before { content: ""; position: absolute; inset: 6px; border: 1px solid rgba(217,178,92,0.45); border-radius: 8px; pointer-events: none; }
  .gcard-idx { position: absolute; z-index: 2; display: flex; flex-direction: column; align-items: center; gap: 3px;
               font: 700 0.9375rem/1 var(--serif); color: var(--gold-hi); }
  .gcard-idx svg { color: var(--gold); }
  .gcard-idx.tl { left: 12px; top: 12px; }
  .gcard-idx.br { right: 12px; bottom: 12px; transform: rotate(180deg); }
  .gcard-face { position: absolute; left: 30px; right: 30px; top: 34px; height: 118px; border-radius: 60px 60px 6px 6px;
                overflow: hidden; background: #141210; box-shadow: inset 0 0 0 1px rgba(217,178,92,0.5); }
  .gcard-face i { position: absolute; inset: 0; background: center 25% / cover; filter: grayscale(1) sepia(0.5) contrast(1.1); }
  .gcard-name { position: absolute; left: 14px; right: 14px; top: 162px; font: 600 0.6875rem/1.3 var(--serif); letter-spacing: 0.04em; }
  .gcard-mins { position: absolute; left: 14px; bottom: 16px; text-align: left; font-size: 0.5625rem; letter-spacing: 0.18em; color: rgba(239,230,210,0.45); }

  .gcraft { position: relative; margin: 48px 0 0; height: 300px; display: flex; align-items: flex-end; padding: 0 30px 28px; overflow: hidden; }
  .gcraft i { position: absolute; inset: 0; background: url(assets/brand/craft.jpg) center / cover; filter: grayscale(1) contrast(1.12); }
  .gcraft::before { content: ""; position: absolute; inset: 0; z-index: 1;
                    background: linear-gradient(180deg, #070606 0%, rgba(7,6,6,0.1) 30%, rgba(7,6,6,0.85) 100%); }
  .gcraft p { position: relative; z-index: 2; margin: 0; font: italic 500 1.875rem/1.15 'Cormorant Garamond', Georgia, serif; color: var(--gold-hi); }
  .gcraft small { display: block; margin-top: 10px; font: 600 0.625rem var(--serif); font-style: normal; letter-spacing: 0.36em; color: rgba(239,230,210,0.7); }

  .gcrew { display: grid; grid-template-columns: repeat(3, 1fr); gap: 12px; text-align: center; }
  .goval { width: 78px; height: 98px; margin: 0 auto 10px; border-radius: 50%; display: grid; place-items: center;
           font: 700 1.625rem var(--serif); color: var(--gold-hi);
           background: radial-gradient(circle at 50% 40%, #2a241b, #0c0b0a 70%);
           box-shadow: 0 0 0 3px var(--gold-lo), 0 0 0 5px #0c0b0a, 0 0 0 6px var(--gold), 0 8px 18px rgba(0,0,0,0.6); }
  .gcrew b { display: block; font: 600 0.8125rem var(--serif); }
  .gcrew span { font-size: 0.6875rem; color: rgba(239,230,210,0.55); }

  .ghours { list-style: none; margin: 0; padding: 18px; border: 3px double rgba(217,178,92,0.6); }
  .ghours li { display: flex; justify-content: space-between; padding: 7px 0; font-size: 0.8125rem; letter-spacing: 0.06em; }
  .ghours li.today { color: var(--gold-hi); font-weight: 600; }
  .gaddr { text-align: center; margin: 22px 0 0; font: 600 0.8125rem/1.7 var(--serif); letter-spacing: 0.08em; }
  .gaddr a { color: var(--gold); text-decoration: none; }
  .home-foot { margin-top: 36px; text-align: center; font: 600 0.5625rem var(--serif); letter-spacing: 0.3em; color: rgba(239,230,210,0.35); }

  /* upcoming booking card (home) */
  .ghome .upcoming { margin: 8px 30px 0; border: 3px double rgba(217,178,92,0.6); background: linear-gradient(180deg, rgba(217,178,92,0.08), rgba(0,0,0,0.3)); }
  .upcoming-eyebrow { font-family: var(--serif) !important; }
  .upcoming-when-day, .upcoming-when-time { font-family: var(--serif) !important; color: var(--gold-hi); }

  /* ---------- buttons ---------- */
  .btn-primary { background: linear-gradient(180deg, #f6e2a4, #d9b25c 50%, #a77e2e) !important; color: #1b1406 !important;
                 font-family: var(--serif) !important; font-weight: 700; letter-spacing: 0.2em; border: 0 !important; }
  .btn-outline { font-family: var(--serif) !important; letter-spacing: 0.2em; border-color: rgba(217,178,92,0.7) !important; color: var(--gold-hi) !important; }

  /* ---------- welcome + auth ---------- */
  .welcome-bg-video { filter: grayscale(1) contrast(1.15) brightness(0.72); }
  .screen .welcome-veil { background: linear-gradient(180deg, rgba(7,6,6,0.75) 0%, rgba(7,6,6,0.2) 30%, rgba(7,6,6,0.45) 60%, #070606 92%) !important; }
  .gwelcome-mid { position: relative; z-index: 2; text-align: center; }
  .gwelcome-logo { width: min(220px, 60%); margin: 10px auto 0; filter: drop-shadow(0 4px 22px rgba(0,0,0,0.9)); }
  .gwelcome-line { margin: 22px 0 0; font: 700 1.625rem/1.15 var(--serif); filter: drop-shadow(0 2px 10px rgba(0,0,0,0.95)); }
  .ghero-title { filter: drop-shadow(0 2px 12px rgba(0,0,0,0.9)); }
  .auth-logo { width: 120px; margin: 0 auto 8px; }
  .auth-title { font-family: var(--serif) !important; letter-spacing: 0.04em; }
  .owner-access-link { font-family: var(--serif); letter-spacing: 0.18em; }

  /* ---------- book sheet ---------- */
  .sheet { background: radial-gradient(130% 60% at 50% 0%, #1d1a16 0%, #0d0c0b 55%, #070606 100%) !important; }
  .sheet-title { font-family: var(--serif) !important; letter-spacing: 0.1em; }
  .sheet-num, .step-intro { font-family: var(--serif) !important; letter-spacing: 0.24em; }
  .prog-bar.active { background: var(--gold) !important; }
  .svc-card { background: rgba(0,0,0,0.3) !important; border-color: rgba(217,178,92,0.25) !important; }
  .svc-card.checked { background: linear-gradient(180deg, #f6e2a4, #d9b25c 55%, #b88a35) !important; color: #1b1406 !important; }
  .svc-card-l { display: flex; align-items: center; gap: 12px; }
  .svc-card.checked .svc-card-name, .svc-card.checked .svc-card-meta, .svc-card.checked .svc-card-price { color: #1b1406 !important; }
  .svc-card-thumb { width: 44px; height: 44px; flex: none; border-radius: 50%; background: #141210 center 25% / cover;
                    filter: grayscale(1) sepia(0.5) contrast(1.1); box-shadow: 0 0 0 1px var(--gold), 0 0 0 3px #0b0a09, 0 0 0 4px rgba(217,178,92,0.45); }
  .svc-card-name { font-family: var(--serif); font-weight: 600; letter-spacing: 0.02em; }
  .svc-card-price { font-family: var(--serif) !important; }
  .barber-avatar { border-radius: 50% / 50%; width: 52px !important; height: 64px !important;
                   box-shadow: 0 0 0 2px var(--gold-lo), 0 0 0 3px #0c0b0a, 0 0 0 4px var(--gold); border: 0 !important; }
  .barber-init { font-family: var(--serif) !important; }
  .barber-name { font-family: var(--serif) !important; letter-spacing: 0.06em; }
  .day.checked, .slot.checked { background: var(--gold) !important; color: #1b1406 !important; border-color: var(--gold) !important; }
  .day-num, .slot { font-family: var(--serif) !important; }
  .review-block { border: 3px double rgba(217,178,92,0.45) !important; }

  /* ---------- tabs: bookings + account ---------- */
  .booking-card { border-color: rgba(217,178,92,0.3) !important; }
  .booking-card.upcoming { border: 3px double rgba(217,178,92,0.6) !important; margin: 0 0 10px !important; padding: 16px !important; }
  .acct-avatar { font-family: var(--serif) !important; border-radius: 50%; }
  .bk-tab { font-family: var(--serif); letter-spacing: 0.16em; }

  /* ---------- desktop / tablet (nav moves to the top bar) ---------- */
  @media (min-width: 768px) {
    .topbar { justify-content: flex-start !important; padding-left: max(40px, calc((100% - 1200px) / 2)) !important; }
    .bnav { background: transparent !important; border-top: 0 !important; z-index: 40; }
    .bnav-item { font-size: 0.6875rem; }
    .bnav-book { background: linear-gradient(180deg, #f6e2a4, #d9b25c 50%, #a77e2e) !important; color: #1b1406 !important; border-radius: 999px; }
    .bnav-book-pill { width: auto !important; height: auto !important; margin-top: 0; border-radius: 0 !important;
                      background: none !important; box-shadow: none !important; color: inherit !important; }
    .bnav-book-pill svg { width: 14px; height: 14px; }
    .ghero { height: min(72vh, 640px); margin: 0 calc(-1 * max(18px, calc((100% - 1244px) / 2))); }
    .ghome .glive, .ghome .upcoming, .ghome .gsec { max-width: 760px; margin-left: auto; margin-right: auto; }
    .ghome .glive, .ghome .upcoming { margin-top: 8px; }
    .gsec { padding-left: 0; padding-right: 0; }
    .gdeck { margin: 0; padding-left: 4px; padding-right: 4px; }
    .gcraft { max-width: 760px; margin-left: auto; margin-right: auto; }
  }
`;
