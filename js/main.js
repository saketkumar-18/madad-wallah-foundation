/* ============================================================
   MADAD WALLAH FOUNDATION — Site JavaScript
   ============================================================ */
(function () {
  "use strict";

  /* ---------- mobile nav ---------- */
  var toggle = document.querySelector(".nav-toggle");
  var nav = document.querySelector(".main-nav");
  if (toggle && nav) {
    toggle.addEventListener("click", function () {
      var open = nav.classList.toggle("open");
      toggle.setAttribute("aria-expanded", open ? "true" : "false");
      toggle.textContent = open ? "✕" : "☰";
    });
    // close menu after clicking a link (mobile)
    nav.querySelectorAll("a").forEach(function (a) {
      a.addEventListener("click", function () {
        nav.classList.remove("open");
        toggle.textContent = "☰";
      });
    });
  }

  /* ---------- active nav highlight ---------- */
  var path = location.pathname.split("/").pop() || "index.html";
  document.querySelectorAll(".main-nav a").forEach(function (a) {
    var href = a.getAttribute("href") || "";
    var file = href.split("/").pop();
    if (file === path || (path === "" && file === "index.html")) {
      a.classList.add("active");
    }
  });

  /* ---------- back to top ---------- */
  var backTop = document.querySelector(".back-top");
  if (backTop) {
    window.addEventListener("scroll", function () {
      backTop.classList.toggle("show", window.scrollY > 600);
    }, { passive: true });
    backTop.addEventListener("click", function () {
      window.scrollTo({ top: 0, behavior: "smooth" });
    });
  }

  /* ---------- animated stat counters ---------- */
  var statsSeen = false;
  function animateStats() {
    if (statsSeen) return;
    var statsEl = document.querySelector(".stats");
    if (!statsEl) return;
    var rect = statsEl.getBoundingClientRect();
    if (rect.top < window.innerHeight - 60) {
      statsSeen = true;
      statsEl.querySelectorAll(".stat .num").forEach(function (el) {
        var target = parseInt(el.getAttribute("data-count"), 10) || 0;
        var suffix = el.getAttribute("data-suffix") || "";
        var dur = 1400, start = null;
        function step(ts) {
          if (!start) start = ts;
          var p = Math.min((ts - start) / dur, 1);
          var eased = 1 - Math.pow(1 - p, 3);
          el.textContent = Math.round(target * eased).toLocaleString("en-IN") + suffix;
          if (p < 1) requestAnimationFrame(step);
        }
        requestAnimationFrame(step);
      });
    }
  }
  window.addEventListener("scroll", animateStats, { passive: true });
  animateStats();

  /* ---------- scroll reveal ---------- */
  if ("IntersectionObserver" in window) {
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (e) {
        if (e.isIntersecting) {
          e.target.classList.add("revealed");
          io.unobserve(e.target);
        }
      });
    }, { threshold: 0.12 });
    document.querySelectorAll(".card, .news-item, .gallery-item, .leader-card, .activity-card").forEach(function (el) {
      el.style.opacity = "0";
      el.style.transform = "translateY(18px)";
      el.style.transition = "opacity .5s ease, transform .5s ease";
      io.observe(el);
    });
    var style = document.createElement("style");
    style.textContent = ".revealed{opacity:1 !important;transform:none !important;}";
    document.head.appendChild(style);
  }

  /* ---------- gallery lightbox ---------- */
  var lightbox = document.querySelector(".lightbox");
  if (lightbox) {
    var lbImg = lightbox.querySelector("img");
    var lbCap = lightbox.querySelector(".lb-cap");
    document.querySelectorAll(".gallery-item").forEach(function (btn) {
      btn.addEventListener("click", function () {
        var img = btn.querySelector("img");
        var cap = btn.getAttribute("data-caption") || "";
        lbImg.src = img.src;
        lbImg.alt = img.alt;
        if (lbCap) lbCap.textContent = cap;
        lightbox.classList.add("open");
        document.body.style.overflow = "hidden";
      });
    });
    function closeLb() {
      lightbox.classList.remove("open");
      document.body.style.overflow = "";
    }
    lightbox.addEventListener("click", function (e) {
      if (e.target === lightbox || e.target.classList.contains("lb-close")) closeLb();
    });
    document.addEventListener("keydown", function (e) {
      if (e.key === "Escape") closeLb();
    });
  }

  /* ---------- copy to clipboard (donate page) ---------- */
  document.querySelectorAll(".copy-btn").forEach(function (btn) {
    btn.addEventListener("click", function () {
      var text = btn.getAttribute("data-copy");
      function done() {
        var old = btn.textContent;
        btn.textContent = "Copied ✓";
        setTimeout(function () { btn.textContent = old; }, 1600);
      }
      if (navigator.clipboard && navigator.clipboard.writeText) {
        navigator.clipboard.writeText(text).then(done).catch(function () { fallback(); });
      } else { fallback(); }
      function fallback() {
        var ta = document.createElement("textarea");
        ta.value = text; document.body.appendChild(ta); ta.select();
        try { document.execCommand("copy"); done(); } catch (e) {}
        document.body.removeChild(ta);
      }
    });
  });

  /* ---------- donation amount chips ---------- */
  var chips = document.querySelectorAll(".amount-chips button");
  var customAmt = document.getElementById("custom-amount");
  chips.forEach(function (chip) {
    chip.addEventListener("click", function () {
      chips.forEach(function (c) { c.classList.remove("sel"); });
      chip.classList.add("sel");
      if (customAmt) customAmt.value = chip.getAttribute("data-amount");
    });
  });

  /* ---------- volunteer form (local demo mode) ----------
     In production, the embedded Google Form is the source of truth.
     This handler powers the on-page demo form when no Google Form URL
     is configured yet: it validates and stores locally, then confirms. */
  var volForm = document.getElementById("volunteer-form");
  if (volForm) {
    volForm.addEventListener("submit", function (e) {
      e.preventDefault();
      var data = {};
      var ok = true;
      volForm.querySelectorAll("[name]").forEach(function (f) {
        if (f.type === "checkbox") {
          data[f.name] = data[f.name] || [];
          if (f.checked) data[f.name].push(f.value);
        } else {
          data[f.name] = f.value.trim();
          if (f.hasAttribute("required") && !data[f.name]) { ok = false; f.style.borderColor = "#b91c1c"; }
          else f.style.borderColor = "";
        }
      });
      var success = document.getElementById("vol-success");
      if (!ok) {
        if (success) { success.classList.remove("show"); }
        return;
      }
      try {
        var store = JSON.parse(localStorage.getItem("mwf_volunteers") || "[]");
        data.submitted_at = new Date().toISOString();
        store.push(data);
        localStorage.setItem("mwf_volunteers", JSON.stringify(store));
      } catch (err) { /* storage unavailable — still show confirmation */ }
      if (success) {
        success.classList.add("show");
        success.scrollIntoView({ behavior: "smooth", block: "center" });
      }
      volForm.reset();
    });
  }

  /* ---------- footer year ---------- */
  document.querySelectorAll("[data-year]").forEach(function (el) {
    el.textContent = new Date().getFullYear();
  });
})();
