/* =========================================================
   HERO SLIDER + NAV + OFFCANVAS + STAY + AMENITIES + GALLERY
   UPDATED: Mobile menu hash navigation (fixes phone browser)
   ========================================================= */

/* ---------------- HERO SLIDES ---------------- */
const slides = [
  {
    image: "img/belivit/beli-vit.webp",
    kicker: "КЪЩА ЗА ГОСТИ • РИБАРИЦА",
    title: "БЕЛИ\nВИТ",
    line1: "До 12 гости • камина • механа",
    line2: "BBQ до реката • басейн • джакузи • гледка към Балкана",
    statValue: "12",
    statUnit: "ГОСТИ",
    statLabel: "КАПАЦИТЕТ",
    facebook: "https://www.facebook.com/share/1EPW8GWsVT/",
  },
  {
    image: "img/gergana/gergana-kushta-za-gosti.webp",
    kicker: "ВИЛА ГЕРГАНА • РИБАРИЦА",
    title: "ВИЛА\nГЕРГАНА",
    line1: "Уют за 13 гости сред тишината на Балкана",
    line2: "Басейн • джакузи • веранда • барбекю с камина",
    statValue: "13",
    statUnit: "ГОСТИ",
    statLabel: "КАПАЦИТЕТ",
    facebook: "https://www.facebook.com/share/18H3qgbbKt/",
  },
  {
    image: "img/bryazovo/brqzovo-gledka-kushta.webp",
    kicker: "ВИЛА БРЯЗОВО • РИБАРИЦА",
    title: "ВИЛА\nБРЯЗОВО",
    line1: "Комфорт и пространство за до 15 гости",
    line2: "Лятна кухня • механа • басейн • джакузи • детски кът",
    statValue: "15",
    statUnit: "ГОСТИ",
    statLabel: "КАПАЦИТЕТ",
    facebook: "https://www.facebook.com/share/14UyGU2zC7a/",
  },
];

/* ---------------- ELEMENTS ---------------- */
const header = document.getElementById("siteHeader");

const sliderEl = document.getElementById("heroSlider");
const kickerEl = document.getElementById("heroKicker");
const titleEl = document.getElementById("heroTitle");
const line1El = document.getElementById("heroLine1");
const line2El = document.getElementById("heroLine2");

const primaryCta = document.getElementById("primaryCta");
const secondaryCta = document.getElementById("secondaryCta");

const statValueEl = document.getElementById("statValue");
const statUnitEl = document.getElementById("statUnit");
const statLabelEl = document.getElementById("statLabel");

const counterEl = document.getElementById("progressCounter");
const barsEl = document.getElementById("progressBars");

const prevBtn = sliderEl?.querySelector?.("[data-prev]");
const nextBtn = sliderEl?.querySelector?.("[data-next]");

// Dropdowns (desktop)
const dropdowns = [...document.querySelectorAll("[data-dropdown]")];

/* ---------------- OFFCANVAS ---------------- */
const burgerBtn = document.getElementById("burgerBtn");
const offcanvas = document.getElementById("offcanvas");
const menuOverlay = document.getElementById("menuOverlay");
const closeMenuBtn = document.getElementById("closeMenuBtn");

/* ---------------- HERO STATE ---------------- */
let index = 0;
let timerId = null;
let revealTimers = [];

const AUTOPLAY_MS = 6500;
const STAGGER_TITLE_MS = 40;
const STAGGER_L1_MS = 220;
const STAGGER_L2_MS = 420;

/* ---------------- HERO HELPERS ---------------- */
function pad2(n) {
  return String(n).padStart(2, "0");
}

function setMultilineTitle(text) {
  if (!titleEl) return;
  titleEl.innerHTML = (text || "").replaceAll("\n", "<br/>");
}

function setActiveBars(i) {
  if (!barsEl) return;
  const bars = [...barsEl.querySelectorAll(".bar")];
  bars.forEach((b, idx) => b.classList.toggle("is-active", idx === i));
}

function applyRevealClasses() {
  kickerEl?.classList?.add("reveal");
  titleEl?.classList?.add("reveal");
  line1El?.classList?.add("reveal");
  line2El?.classList?.add("reveal");
}

function fastStaggerIn() {
  revealTimers.forEach((t) => clearTimeout(t));
  revealTimers = [];

  [kickerEl, titleEl, line1El, line2El].forEach((el) => el?.classList?.remove("is-in"));
  if (titleEl) void titleEl.offsetWidth; // force reflow

  revealTimers.push(setTimeout(() => kickerEl?.classList?.add("is-in"), 0));
  revealTimers.push(setTimeout(() => titleEl?.classList?.add("is-in"), STAGGER_TITLE_MS));
  revealTimers.push(setTimeout(() => line1El?.classList?.add("is-in"), STAGGER_L1_MS));
  revealTimers.push(setTimeout(() => line2El?.classList?.add("is-in"), STAGGER_L2_MS));
}

function renderSlide(i) {
  const s = slides[i];
  if (!sliderEl) return;

  sliderEl.style.backgroundImage = `url("${s.image}")`;

  // reset zoom
  sliderEl.style.transition = "none";
  sliderEl.style.setProperty("--bgZoom", "108%");
  void sliderEl.offsetWidth;

  // activate animation
  sliderEl.style.transition = "background-size 6.6s ease";
  sliderEl.style.setProperty("--bgZoom", "118%");

  const kickerText = kickerEl?.querySelector?.(".k-text");
  if (kickerText) kickerText.textContent = s.kicker || "";

  setMultilineTitle(s.title || "");
  if (line1El) line1El.textContent = s.line1 || "";
  if (line2El) line2El.textContent = s.line2 || "";

  if (statValueEl) statValueEl.textContent = s.statValue ?? "";
  if (statUnitEl) statUnitEl.textContent = s.statUnit || "";
  if (statLabelEl) statLabelEl.textContent = s.statLabel || "";

  // facebook per slide
  const fbBtn = document.getElementById("heroFacebook");
  if (fbBtn) fbBtn.href = s.facebook || "https://www.facebook.com/";

  if (primaryCta && s.primary) {
    primaryCta.innerHTML = "";
    primaryCta.textContent = s.primary.text;
    primaryCta.href = s.primary.href;
    primaryCta.insertAdjacentHTML("beforeend", ' <span class="btn-ic">▶</span>');
  }

  if (secondaryCta && s.secondary) {
    secondaryCta.textContent = s.secondary.text;
    secondaryCta.href = s.secondary.href;
  }

  if (counterEl) counterEl.textContent = `${pad2(i + 1)}/${pad2(slides.length)}`;
  setActiveBars(i);

  fastStaggerIn();
}

function go(dir) {
  index = (index + dir + slides.length) % slides.length;
  renderSlide(index);
  restartAutoplay();
}

function restartAutoplay() {
  if (timerId) clearInterval(timerId);
  timerId = setInterval(() => go(1), AUTOPLAY_MS);
}

function stopAutoplay() {
  if (timerId) clearInterval(timerId);
  timerId = null;
}

/* ---------------- DROPDOWNS (desktop) ---------------- */
function closeAllDropdowns(except = null) {
  dropdowns.forEach((dd) => {
    if (dd === except) return;
    dd.classList.remove("is-open");
    const btn = dd.querySelector("button");
    if (btn) btn.setAttribute("aria-expanded", "false");
  });
}

dropdowns.forEach((dd) => {
  const btn = dd.querySelector("button");
  if (!btn) return;

  btn.addEventListener("click", (e) => {
    e.stopPropagation();
    const willOpen = !dd.classList.contains("is-open");
    closeAllDropdowns(dd);
    dd.classList.toggle("is-open", willOpen);
    btn.setAttribute("aria-expanded", String(willOpen));
  });
});

document.addEventListener("click", () => closeAllDropdowns(null));
document.addEventListener("keydown", (e) => {
  if (e.key === "Escape") closeAllDropdowns(null);
});

/* ---------------- OFFCANVAS open/close ---------------- */
function openMenu() {
  document.body.classList.add("menu-open");
  burgerBtn?.setAttribute("aria-expanded", "true");
  offcanvas?.setAttribute("aria-hidden", "false");
  if (menuOverlay) menuOverlay.hidden = false;
  setTimeout(() => closeMenuBtn?.focus?.(), 50);
}

function closeMenu() {
  document.body.classList.remove("menu-open");
  burgerBtn?.setAttribute("aria-expanded", "false");
  offcanvas?.setAttribute("aria-hidden", "true");

  setTimeout(() => {
    if (!document.body.classList.contains("menu-open") && menuOverlay) menuOverlay.hidden = true;
  }, 280);

  burgerBtn?.focus?.();
}

burgerBtn?.addEventListener("click", () => {
  const isOpen = document.body.classList.contains("menu-open");
  if (isOpen) closeMenu();
  else openMenu();
});

closeMenuBtn?.addEventListener("click", closeMenu);
menuOverlay?.addEventListener("click", closeMenu);

document.addEventListener("keydown", (e) => {
  if (e.key === "Escape" && document.body.classList.contains("menu-open")) closeMenu();
});

/* ---------------- HERO events ---------------- */
prevBtn?.addEventListener("click", () => go(-1));
nextBtn?.addEventListener("click", () => go(1));

document.addEventListener("keydown", (e) => {
  if (e.key === "ArrowLeft") go(-1);
  if (e.key === "ArrowRight") go(1);
});

window.addEventListener("scroll", () => {
  header?.classList?.toggle("is-solid", window.scrollY > 10);
});

sliderEl?.addEventListener("mouseenter", stopAutoplay);
sliderEl?.addEventListener("mouseleave", restartAutoplay);

document.addEventListener("visibilitychange", () => {
  if (document.hidden) stopAutoplay();
  else restartAutoplay();
});

/* ---------------- Touch swipe (hero) ---------------- */
let touchStartX = 0;
let touchStartY = 0;
let isSwiping = false;

sliderEl?.addEventListener(
  "touchstart",
  (e) => {
    const t = e.touches[0];
    touchStartX = t.clientX;
    touchStartY = t.clientY;
    isSwiping = true;
    stopAutoplay();
  },
  { passive: true }
);

sliderEl?.addEventListener(
  "touchmove",
  (e) => {
    if (!isSwiping) return;
    const t = e.touches[0];
    const dx = Math.abs(t.clientX - touchStartX);
    const dy = Math.abs(t.clientY - touchStartY);
    if (dy > dx && dy > 12) isSwiping = false;
  },
  { passive: true }
);

sliderEl?.addEventListener(
  "touchend",
  (e) => {
    if (!isSwiping) {
      restartAutoplay();
      return;
    }
    const t = e.changedTouches[0];
    const dx = t.clientX - touchStartX;

    const SWIPE_THRESHOLD = 40;
    if (dx > SWIPE_THRESHOLD) go(-1);
    else if (dx < -SWIPE_THRESHOLD) go(1);

    isSwiping = false;
    restartAutoplay();
  },
  { passive: true }
);

/* ---------------- INIT HERO ---------------- */
applyRevealClasses();
renderSlide(index);
restartAutoplay();

/* ---------------- LOADER ---------------- */
window.addEventListener("load", () => {
  const loader = document.getElementById("vvLoader");
  if (!loader) return;

  const MIN_MS = 900;
  const started = performance.now();

  const hide = () => {
    loader.classList.add("is-hidden");
    setTimeout(() => loader.remove(), 450);
  };

  const elapsed = performance.now() - started;
  if (elapsed >= MIN_MS) hide();
  else setTimeout(hide, MIN_MS - elapsed);
});

/* ---------------- VH FIX ---------------- */
function setVH() {
  const h = window.visualViewport ? window.visualViewport.height : window.innerHeight;
  document.documentElement.style.setProperty("--vh", `${h * 0.01}px`);
}
setVH();
window.addEventListener("resize", setVH);
window.addEventListener("orientationchange", setVH);
if (window.visualViewport) {
  window.visualViewport.addEventListener("resize", setVH);
  window.visualViewport.addEventListener("scroll", setVH);
}

/* =========================================================
   STAY SHOW (Accommodation slider) + expose vvOpenStay()
   ========================================================= */
(() => {
  const show = document.getElementById("stayShow");
  const track = document.getElementById("stayTrack");
  if (!show || !track) return;

  const slidesLocal = [...track.querySelectorAll(".stay-slide")];
  const tabs = [...show.querySelectorAll("[data-stay-tab]")];
  const dots = [...show.querySelectorAll("[data-stay-dot]")];
  const prev = show.querySelector("[data-stay-prev]");
  const next = show.querySelector("[data-stay-next]");

  let i = 0;
  let t = null;
  let resumeTimeout = null;

  const AUTOPLAY = 5200;
  const PAUSE_AFTER_MANUAL_MS = 12000;

  function setActive(idx) {
    i = (idx + slidesLocal.length) % slidesLocal.length;

    track.style.transform = `translateX(-${i * 100}%)`;

    slidesLocal.forEach((s, k) => s.classList.toggle("is-active", k === i));
    tabs.forEach((b, k) => {
      b.classList.toggle("is-active", k === i);
      b.setAttribute("aria-selected", String(k === i));
    });
    dots.forEach((d, k) => d.classList.toggle("is-active", k === i));
  }

  function stop() {
    if (t) clearInterval(t);
    t = null;
  }

  function restart() {
    stop();
    /* t = setInterval(() => setActive(i + 1), AUTOPLAY); */
  }

  let isVisible = false;

  function pauseThenResume() {
    stop();
    if (resumeTimeout) clearTimeout(resumeTimeout);
    resumeTimeout = setTimeout(() => {
      if (isVisible) restart();
    }, PAUSE_AFTER_MANUAL_MS);
  }

  function go(dir) {
    setActive(i + dir);
    pauseThenResume();
  }

  prev?.addEventListener("click", () => go(-1));
  next?.addEventListener("click", () => go(1));

  tabs.forEach((btn) => {
    btn.addEventListener("click", () => {
      setActive(Number(btn.dataset.stayTab || 0));
      pauseThenResume();
    });
  });

  dots.forEach((btn) => {
    btn.addEventListener("click", () => {
      setActive(Number(btn.dataset.stayDot || 0));
      pauseThenResume();
    });
  });

  const io = new IntersectionObserver(
    (entries) => {
      isVisible = entries.some((e) => e.isIntersecting);
      if (isVisible) restart();
      else stop();
    },
    { threshold: 0.25 }
  );
  io.observe(show);

  show.addEventListener("mouseenter", stop);
  show.addEventListener("mouseleave", () => {
    if (isVisible) restart();
  });

  // ✅ EXPOSE a global helper so offcanvas can call it safely
  window.vvOpenStay = function vvOpenStay(targetIdx, { scroll = true } = {}) {
    setActive(Number(targetIdx || 0));
    pauseThenResume();
    if (scroll) {
      requestAnimationFrame(() => {
        show.scrollIntoView({ behavior: "smooth", block: "start" });
      });
    }
  };

  // OPEN SPECIFIC SLIDE FROM ANY LINK with [data-stay-go]
  document.addEventListener("click", (e) => {
    const el = e.target.closest("[data-stay-go]");
    if (!el) return;

    const href = el.getAttribute("href") || "";
    if (href && href !== "#stay" && !href.endsWith("#stay")) return;

    e.preventDefault();

    const targetIdx = Number(el.dataset.stayGo || 0);

    // ✅ Mobile safe: if menu is open, close first then open
    const wasMenuOpen = document.body.classList.contains("menu-open");
    if (wasMenuOpen && typeof closeMenu === "function") closeMenu();

    const DELAY = wasMenuOpen ? 320 : 0;

    setTimeout(() => {
      window.vvOpenStay?.(targetIdx, { scroll: true });
    }, DELAY);
  });

  // SWIPE / DRAG
  const viewport = show.querySelector(".stay-viewport") || show;

  let sx = 0,
    sy = 0,
    lx = 0;
  let dragging = false;
  let locked = null; // "x" | "y" | null

  const THRESHOLD = 50;
  const LOCK_DIST = 10;

  function startGesture(x, y) {
    dragging = true;
    locked = null;
    sx = x;
    sy = y;
    lx = x;
    stop();
  }

  function moveGesture(x, y, ev) {
    if (!dragging) return;
    const dx = x - sx;
    const dy = y - sy;

    if (!locked) {
      if (Math.abs(dx) > LOCK_DIST) locked = "x";
      else if (Math.abs(dy) > LOCK_DIST) locked = "y";
    }

    if (locked === "x") {
      if (ev && ev.cancelable) ev.preventDefault();
      lx = x;
    }
  }

  function endGesture() {
    if (!dragging) return;
    dragging = false;

    if (locked !== "x") {
      if (isVisible) restart();
      return;
    }

    const diff = lx - sx;

    if (diff > THRESHOLD) go(-1);
    else if (diff < -THRESHOLD) go(1);
    else if (isVisible) restart();
  }

  viewport.addEventListener(
    "touchstart",
    (e) => {
      const t2 = e.touches[0];
      startGesture(t2.clientX, t2.clientY);
    },
    { passive: true }
  );

  viewport.addEventListener(
    "touchmove",
    (e) => {
      const t2 = e.touches[0];
      moveGesture(t2.clientX, t2.clientY, e);
    },
    { passive: false }
  );

  viewport.addEventListener("touchend", endGesture, { passive: true });
  viewport.addEventListener("touchcancel", endGesture, { passive: true });

  viewport.addEventListener("mousedown", (e) => {
    if (e.target.closest("button, a")) return;
    startGesture(e.clientX, e.clientY);

    const onMove = (ev) => moveGesture(ev.clientX, ev.clientY, null);
    const onUp = () => {
      window.removeEventListener("mousemove", onMove);
      window.removeEventListener("mouseup", onUp);
      endGesture();
    };

    window.addEventListener("mousemove", onMove);
    window.addEventListener("mouseup", onUp);
  });

  setActive(0);
})();

/* =========================================================
   AMENITIES (Удобства): cinematic grid -> panels + expose vvOpenAmenity()
   ========================================================= */
(() => {
  const root = document.getElementById("amenities");
  if (!root) return;

  const detail = document.getElementById("expDetail");
  const cards = [...root.querySelectorAll("[data-exp-card]")];
  const tabs = [...root.querySelectorAll("[data-exp-tab]")];
  const panels = [...root.querySelectorAll("[data-exp-panel]")];

  const keys = new Set(panels.map((p) => p.dataset.expPanel));

  const hashMap = {
    "#amen-bbq": "bbq",
    "#amen-pool": "pool",
    "#amen-spa": "spa",
    "#amen-trips": "trips",
    "#amen-kids": "kids",

    "#bbq": "bbq",
    "#pool": "pool",
    "#spa": "spa",
    "#trips": "trips",
    "#kids": "kids",
  };

  function scrollToDetail() {
    (detail || root).scrollIntoView({ behavior: "smooth", block: "start" });
  }

  function open(key, { scrollIntoView = false } = {}) {
    if (!keys.has(key)) return;

    cards.forEach((c) => c.classList.toggle("is-active", c.dataset.expCard === key));

    tabs.forEach((t) => {
      const on = t.dataset.expTab === key;
      t.classList.toggle("is-active", on);
      t.setAttribute("aria-selected", String(on));
    });

    panels.forEach((p) => p.classList.toggle("is-active", p.dataset.expPanel === key));

    if (scrollIntoView) scrollToDetail();
  }

  // ✅ Expose global helper for mobile menu
  window.vvOpenAmenity = function vvOpenAmenity(key, { scroll = true } = {}) {
    open(key, { scrollIntoView: scroll });
    const panel = panels.find((p) => p.dataset.expPanel === key);
    if (panel?.id) history.replaceState(null, "", `#${panel.id}`);
  };

  // card click
  cards.forEach((c) => {
    c.addEventListener("click", (e) => {
      e.preventDefault();
      const key = c.dataset.expCard;
      open(key, { scrollIntoView: true });

      const panel = panels.find((p) => p.dataset.expPanel === key);
      if (panel?.id) history.replaceState(null, "", `#${panel.id}`);
    });
  });

  // tab click
  tabs.forEach((t) => {
    t.addEventListener("click", () => {
      const key = t.dataset.expTab;
      open(key, { scrollIntoView: true });

      const panel = panels.find((p) => p.dataset.expPanel === key);
      if (panel?.id) history.replaceState(null, "", `#${panel.id}`);
    });
  });

  function handleHash() {
    const h = window.location.hash;
    const key = hashMap[h];
    if (!key) return;
    setTimeout(() => open(key, { scrollIntoView: true }), 50);
  }

  window.addEventListener("hashchange", handleHash);

  open("bbq");
  handleHash();

  // expose mapping (optional)
  window.vvAmenityHashToKey = (h) => hashMap[h] || null;
})();

/* =========================================================
   OFFCANVAS: MOBILE-SAFE HASH NAVIGATION (THE FIX)
   - closes menu first
   - then opens stay/amenities properly
   ========================================================= */
offcanvas?.addEventListener("click", (e) => {
  const a = e.target.closest("a");
  if (!a) return;

  const href = a.getAttribute("href") || "";
  const isMenuOpen = document.body.classList.contains("menu-open");

  // Only handle internal hash links when menu is open
  if (!isMenuOpen) return;

  // Stay deep-link (data-stay-go)
  const stayGo = a.getAttribute("data-stay-go");
  if (stayGo !== null) {
    e.preventDefault();
    closeMenu();
    setTimeout(() => {
      window.vvOpenStay?.(Number(stayGo || 0), { scroll: true });
      // keep hash consistent
      if (location.hash !== "#stay") history.replaceState(null, "", "#stay");
    }, 320);
    return;
  }

  // Amenities hash links
  if (href.startsWith("#amen-") || href === "#amenities") {
    e.preventDefault();
    closeMenu();

    setTimeout(() => {
      if (href === "#amenities") {
        document.getElementById("amenities")?.scrollIntoView({ behavior: "smooth", block: "start" });
        history.replaceState(null, "", "#amenities");
        return;
      }

      const key = window.vvAmenityHashToKey?.(href);
      if (key) {
        window.vvOpenAmenity?.(key, { scroll: true });
      } else {
        // fallback: set hash
        location.hash = href;
      }
    }, 320);
    return;
  }

  // Other internal anchors (home/gallery/location/contact/booking/stay)
  const internal = [
    "#home",
    "#gallery",
    "#location",
    "#contact",
    "#booking",
    "#stay",
    "#nearby",
    "#seo",
  ];

  if (internal.includes(href)) {
    e.preventDefault();
    closeMenu();
    setTimeout(() => {
      const target = document.querySelector(href);
      if (target) target.scrollIntoView({ behavior: "smooth", block: "start" });
      history.replaceState(null, "", href);
    }, 320);
    return;
  }

  // External link -> just close menu
  closeMenu();
});

/* =========================================================
   GALLERY LIGHTBOX (unchanged)
   ========================================================= */
(() => {
  const grid = document.getElementById("vvGalGrid");
  const lb = document.getElementById("vvLb");
  const img = document.getElementById("vvLbImg");
  const cap = document.getElementById("vvLbCap");
  const stage = document.getElementById("vvLbStage");
  const zoomBtn = document.getElementById("vvLbZoom");

  if (!grid || !lb || !img || !cap || !stage) return;

  const filters = [...document.querySelectorAll("[data-vv-filter]")];
  const cards = [...grid.querySelectorAll(".villa-gal__card")];

  const btnPrev = lb.querySelector("[data-vv-prev]");
  const btnNext = lb.querySelector("[data-vv-next]");
  const closes = [...lb.querySelectorAll("[data-vv-close]")];

  let visible = cards.slice();
  let idx = 0;

  let scale = 1;
  let tx = 0,
    ty = 0;

  function clamp(n, min, max) {
    return Math.max(min, Math.min(max, n));
  }

  function refreshVisible() {
    visible = cards.filter((c) => !c.classList.contains("is-hidden"));
    if (!visible.length) visible = cards.slice();
  }

  function applyTransform() {
    img.style.transform = `translate(${tx}px, ${ty}px) scale(${scale})`;
    if (zoomBtn) zoomBtn.textContent = scale > 1 ? "⤡" : "⤢";
    stage.style.cursor = scale > 1 ? "grab" : "default";
  }

  function resetZoom() {
    scale = 1;
    tx = 0;
    ty = 0;
    applyTransform();
  }

  function toggleZoom() {
    if (scale === 1) {
      scale = 2;
      tx = 0;
      ty = 0;
    } else {
      scale = 1;
      tx = 0;
      ty = 0;
    }
    applyTransform();
  }

  zoomBtn?.addEventListener("click", toggleZoom);

  function openAt(newIdx) {
    refreshVisible();
    idx = (newIdx + visible.length) % visible.length;
    const el = visible[idx];
    if (!el) return;

    img.src = el.dataset.full || "";
    img.alt = el.querySelector("img")?.alt || "";
    cap.textContent = el.dataset.caption || "";

    resetZoom();

    lb.hidden = false;
    lb.setAttribute("aria-hidden", "false");
    document.body.classList.add("villa-lb-open");
  }

  function close() {
    lb.hidden = true;
    lb.setAttribute("aria-hidden", "true");
    img.src = "";
    cap.textContent = "";
    resetZoom();
    document.body.classList.remove("villa-lb-open");
  }

  function next() {
    openAt(idx + 1);
  }
  function prev() {
    openAt(idx - 1);
  }

  cards.forEach((c) => {
    c.addEventListener("click", () => {
      refreshVisible();
      const at = visible.indexOf(c);
      openAt(at >= 0 ? at : 0);
    });
  });

  btnNext?.addEventListener("click", next);
  btnPrev?.addEventListener("click", prev);
  closes.forEach((x) => x.addEventListener("click", close));

  lb.addEventListener("click", (e) => {
    if (e.target?.hasAttribute?.("data-vv-close")) close();
  });

  document.addEventListener("keydown", (e) => {
    if (lb.hidden) return;
    if (e.key === "Escape") close();
    if (e.key === "ArrowRight") next();
    if (e.key === "ArrowLeft") prev();
  });

  img.addEventListener("dblclick", toggleZoom);

  let lastTap = 0;
  img.addEventListener(
    "touchend",
    () => {
      const now = Date.now();
      if (now - lastTap < 280) toggleZoom();
      lastTap = now;
    },
    { passive: true }
  );

  let sx = 0,
    sy = 0,
    swiping = false;
  stage.addEventListener(
    "touchstart",
    (e) => {
      if (scale > 1) return;
      const t = e.touches[0];
      sx = t.clientX;
      sy = t.clientY;
      swiping = true;
    },
    { passive: true }
  );

  stage.addEventListener(
    "touchend",
    (e) => {
      if (!swiping || scale > 1) return;
      const t = e.changedTouches[0];
      const dx = t.clientX - sx;
      const dy = t.clientY - sy;
      swiping = false;
      if (Math.abs(dy) > Math.abs(dx)) return;
      if (dx < -50) next();
      else if (dx > 50) prev();
    },
    { passive: true }
  );

  let dragging = false,
    px = 0,
    py = 0;
  stage.addEventListener("pointerdown", (e) => {
    if (scale === 1) return;
    dragging = true;
    px = e.clientX;
    py = e.clientY;
    stage.setPointerCapture(e.pointerId);
    stage.style.cursor = "grabbing";
  });

  stage.addEventListener("pointermove", (e) => {
    if (!dragging) return;
    const dx = e.clientX - px;
    const dy = e.clientY - py;
    px = e.clientX;
    py = e.clientY;

    tx += dx;
    ty += dy;

    const maxX = stage.clientWidth * 0.6;
    const maxY = stage.clientHeight * 0.6;
    tx = clamp(tx, -maxX, maxX);
    ty = clamp(ty, -maxY, maxY);

    applyTransform();
  });

  stage.addEventListener("pointerup", () => {
    dragging = false;
    stage.style.cursor = scale > 1 ? "grab" : "default";
  });
  stage.addEventListener("pointercancel", () => {
    dragging = false;
    stage.style.cursor = scale > 1 ? "grab" : "default";
  });

  filters.forEach((btn) => {
    btn.addEventListener("click", () => {
      const key = btn.dataset.vvFilter || "all";

      filters.forEach((b) => {
        const on = b === btn;
        b.classList.toggle("is-active", on);
        b.setAttribute("aria-selected", String(on));
      });

      cards.forEach((c) => {
        const tag = c.dataset.vv || "";
        const hide = key !== "all" && tag !== key;
        c.classList.toggle("is-hidden", hide);
      });

      refreshVisible();
    });
  });

  refreshVisible();
})();

/* =========================================================
   COPY ADDRESS + NEARBY + CONTACT COPY + BOOKING FORM
   ========================================================= */
(() => {
  const copyBtn = document.getElementById("vvCopyAddress");
  const addressText = `Къщи за гости: Бели Вит • Гергана • Брязово, с. Рибарица, общ. Тетевен, България`;

  copyBtn?.addEventListener("click", async () => {
    try {
      await navigator.clipboard.writeText(addressText);
      const old = copyBtn.textContent;
      copyBtn.textContent = "Копирано ✅";
      setTimeout(() => (copyBtn.textContent = old), 1200);
    } catch {
      const ta = document.createElement("textarea");
      ta.value = addressText;
      document.body.appendChild(ta);
      ta.select();
      document.execCommand("copy");
      ta.remove();
      const old = copyBtn.textContent;
      copyBtn.textContent = "Копирано ✅";
      setTimeout(() => (copyBtn.textContent = old), 1200);
    }
  });

  const places = [
    { type: "nature", tag: "Екопътека", name: "Екопътека „Черният рът“ (старт: Рибарица)", km: null, desc: "Маршрут ~4–5 часа, с вишки, беседки и места за отдих.", img: "img/bryazovo/razhodki.jpg" },
    { type: "nature", tag: "Водопад", name: "Водопад „Скока“ (Тетевен)", km: null, desc: "По екопътека „Под пръските на водопада“ – мостчета, панорами и финал при водопада.", img: "img/bryazovo/razhodki.jpg" },
    { type: "sights", tag: "История", name: "Местност „Костина“ – лобното място на Георги Бенковски", km: null, desc: "Паметно място край Рибарица, подходящо за спокойна разходка и снимки.", img: "img/bryazovo/razhodki.jpg" },
    { type: "sights", tag: "Манастир", name: "Гложенски манастир „Св. Георги Победоносец“", km: null, desc: "Емблематично място с много красиви гледки – супер за еднодневна разходка.", img: "img/bryazovo/razhodki.jpg" },
    { type: "sights", tag: "Още идеи", name: "Около Тетевен: „Съева дупка“, Тетевенски манастир и др.", km: null, desc: "Класики за региона – лесно се комбинират с престой в Рибарица.", img: "img/bryazovo/razhodki.jpg" },
    { type: "food", tag: "Храна", name: "Механи и ресторанти в центъра на Рибарица", km: null, desc: "Традиционна кухня, скара и домашни специалитети – попитай ни и ще препоръчаме според вкуса ти.", img: "img/belivit/beli-vit-vunshno-bbq.webp" },
    { type: "food", tag: "Скара", name: "Скара/грил места по главната улица", km: null, desc: "Бърз вариант за хапване – кюфтета/кебапчета, салати, супи (идеално след разходка).", img: "img/belivit/beli-vit-vunshno-bbq.webp" },
    { type: "food", tag: "Кафе", name: "Кафе + десерти (Тетевен)", km: null, desc: "Сладки изкушения и кафе – приятно за следобедна пауза, ако сте на разходка към Тетевен.", img: "img/gergana/gergana-zakuska-s-gledka.webp" },
    { type: "shops", tag: "Магазин", name: "Хранителни магазини в Рибарица (основни покупки)", km: null, desc: "Вода, закуски, месо за BBQ, въглища/подпалки – всичко за уикенд в Балкана.", img: "img/belivit/beli-vit-kuhnq.webp" },
    { type: "shops", tag: "Аптека", name: "Аптека/дрогерия (Тетевен)", km: null, desc: "Удобно при непредвидени ситуации – лекарства, козметика и базови неща.", img: "img/bryazovo/brqzovo-wc.webp" },
    { type: "shops", tag: "Пазар", name: "Малки местни сергии/пазар (сезонно)", km: null, desc: "Сезонни плодове/зеленчуци и местни продукти – ако улучите ден, струва си.", img: "img/belivit/beli-vit-delikates.webp" },
  ];

  const grid = document.getElementById("vvNearGrid");
  const filterBtns = [...document.querySelectorAll("[data-near]")];
  if (!grid) return;

  function card(p) {
    const el = document.createElement("article");
    el.className = "villa-place";
    el.dataset.type = p.type;

    const kmText = typeof p.km === "number" ? `${p.km.toFixed(1)} km` : "";

    el.innerHTML = `
      <div class="villa-place__media">
        <img src="${p.img}" alt="${p.name}" loading="lazy">
        <span class="villa-place__tag">${p.tag}</span>
      </div>
      <div class="villa-place__body">
        <h4 class="villa-place__name">${p.name}</h4>
        <p class="villa-place__desc">${p.desc}</p>
        <div class="villa-place__meta ${kmText ? "" : "is-hidden"}">
          <span>Разстояние</span>
          <span class="villa-place__km">${kmText}</span>
        </div>
      </div>
    `;
    return el;
  }

  const nodes = places.map(card);
  nodes.forEach((n) => grid.appendChild(n));

  function setFilter(key) {
    filterBtns.forEach((b) => {
      const on = (b.dataset.near || "all") === key;
      b.classList.toggle("is-active", on);
      b.setAttribute("aria-selected", String(on));
    });

    nodes.forEach((n) => {
      const t = n.dataset.type;
      const hide = key !== "all" && t !== key;
      n.classList.toggle("is-hidden", hide);
    });
  }

  filterBtns.forEach((b) => b.addEventListener("click", () => setFilter(b.dataset.near || "all")));
  setFilter("all");
})();

(() => {
  const btn = document.getElementById("vvCopyContactAddr");
  if (!btn) return;

  const address = "Къщи за гости: Бели Вит • Гергана • Брязово, с. Рибарица, общ. Тетевен, България";

  btn.addEventListener("click", async () => {
    const old = btn.textContent;
    try {
      await navigator.clipboard.writeText(address);
      btn.textContent = "Копирано ✅";
    } catch {
      const ta = document.createElement("textarea");
      ta.value = address;
      document.body.appendChild(ta);
      ta.select();
      document.execCommand("copy");
      ta.remove();
      btn.textContent = "Копирано ✅";
    }
    setTimeout(() => (btn.textContent = old), 1200);
  });
})();

(() => {
  const form = document.getElementById("bookingForm2");
  const success = document.getElementById("bookingSuccess2");
  const captcha = document.getElementById("captcha2");
  const villaSelect = document.getElementById("villaSelect");

  if (!form) return;

  form.addEventListener("submit", (e) => {
    e.preventDefault();

    if (!villaSelect || !villaSelect.value) {
      alert("Моля, избери вила за запитването.");
      villaSelect?.focus();
      return;
    }

    if (captcha.value.trim() !== "3") {
      alert("Грешен отговор. Опитай пак.");
      return;
    }

    success?.classList?.add("is-show");
    form.reset();
  });
})();

/* ---------------- YEAR ---------------- */
const yearEl = document.getElementById("year");
if (yearEl) yearEl.textContent = new Date().getFullYear();

/* =========================================================
   AUTO GLOBAL SITE ANIMATION
   ========================================================= */
document.addEventListener("DOMContentLoaded", () => {
  const elements = document.querySelectorAll(
    "section h2, section h3, section p, section .btn, section .stay-card, section .spa-card, section .exp-card, section .villa-contact__card, section .villa-gal__card"
  );

  const directions = ["left", "right", "up", "rotate"];

  elements.forEach((el, index2) => {
    el.classList.add("villa-animate");
    const dir = directions[index2 % directions.length];
    el.setAttribute("data-dir", dir);
  });

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) entry.target.classList.add("is-visible");
      });
    },
    { threshold: 0.15 }
  );

  document.querySelectorAll(".villa-animate").forEach((el) => observer.observe(el));
});


