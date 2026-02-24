(() => {
    "use strict";
  
    const THRESHOLD = 10;
    let lastY = 0;
    let ticking = false;
  
    function getWindowY() {
      return window.scrollY || document.documentElement.scrollTop || document.body.scrollTop || 0;
    }
  
    function setHeaderState(header, y) {
      header.classList.remove("is-solid");         // махаме конфликт ако имаш стар стил
      header.classList.toggle("villa-red", y > THRESHOLD);
    }
  
    function requestUpdate(header) {
      if (ticking) return;
      ticking = true;
      requestAnimationFrame(() => {
        ticking = false;
        setHeaderState(header, lastY);
      });
    }
  
    function init() {
      const header = document.getElementById("siteHeader");
      if (!header) return;
  
      // Debug badge (за да виждаш 100% какво чете)

  
      function updateBadge() {
        badge.textContent = `VV: y=${Math.round(lastY)} | ${lastY > THRESHOLD ? "RED" : "TOP"}`;
        badge.style.background = lastY > THRESHOLD ? "#a00" : "#0a0";
      }
  
      // 1) Хваща скрол на ВСИЧКО (wrapper/контейнер/iframe preview)
      document.addEventListener(
        "scroll",
        (e) => {
          const t = e.target;
          // ако скролва контейнер -> взимаме неговия scrollTop
          const yFromTarget = t && typeof t.scrollTop === "number" ? t.scrollTop : 0;
  
          // взимаме “най-голямото” от window и target, за да сме сигурни
          lastY = Math.max(getWindowY(), yFromTarget);
  
          setHeaderState(header, lastY);
          updateBadge();
          requestUpdate(header);
        },
        true // CAPTURE — това е ключът
      );
  
      // 2) Backup: ако няма scroll event (някои среди), проверяваме периодично
      setInterval(() => {
        const y = getWindowY();
        if (y !== lastY) {
          lastY = y;
          setHeaderState(header, lastY);
          updateBadge();
        }
      }, 200);
  
      // init state
      lastY = getWindowY();
      setHeaderState(header, lastY);
      updateBadge();
    }
  
    if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", init);
    else init();
  })();
  
  