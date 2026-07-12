(function(){
  "use strict";

  var reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  /* ---------- Mobile nav toggle ---------- */
  var toggle   = document.getElementById("navToggle");
  var panel    = document.getElementById("primaryNav");
  var backdrop = document.getElementById("navBackdrop");

  function openMenu(){
    panel.classList.add("is-open");
    backdrop.classList.add("is-visible");
    toggle.setAttribute("aria-expanded", "true");
    toggle.setAttribute("aria-label", "Close menu");
  }
  function closeMenu(){
    panel.classList.remove("is-open");
    backdrop.classList.remove("is-visible");
    toggle.setAttribute("aria-expanded", "false");
    toggle.setAttribute("aria-label", "Open menu");
  }
  function isOpen(){ return panel.classList.contains("is-open"); }

  if (toggle && panel && backdrop){
    toggle.addEventListener("click", function(){
      isOpen() ? closeMenu() : openMenu();
    });
    backdrop.addEventListener("click", closeMenu);
    panel.querySelectorAll("a").forEach(function(link){
      link.addEventListener("click", closeMenu);
    });
    document.addEventListener("keydown", function(e){
      if (e.key === "Escape" && isOpen()) closeMenu();
    });
    // Close the mobile panel if the viewport grows into desktop layout
    window.addEventListener("resize", function(){
      if (window.innerWidth >= 960 && isOpen()) closeMenu();
    });
  }

  /* ---------- Sticky nav shadow on scroll ---------- */
  var nav = document.getElementById("siteNav");
  function onScroll(){
    if (!nav) return;
    if (window.scrollY > 8) nav.style.boxShadow = "0 6px 18px -12px rgba(22,35,63,.35)";
    else nav.style.boxShadow = "none";
  }
  document.addEventListener("scroll", onScroll, { passive: true });
  onScroll();

  /* ---------- Achievement progress rings ---------- */
  var rings = document.querySelectorAll(".ach-photo-wrap .val");
  rings.forEach(function(circle){
    var target = circle.getAttribute("stroke-dashoffset");
    var full   = circle.getAttribute("stroke-dasharray");
    circle.dataset.target = target;
    if (!reduceMotion){
      circle.style.strokeDashoffset = full; // start empty
    }
  });

  /* ---------- Scroll reveal ---------- */
  var revealEls = document.querySelectorAll(".reveal");

  if ("IntersectionObserver" in window && !reduceMotion){
    var observer = new IntersectionObserver(function(entries){
      entries.forEach(function(entry){
        if (entry.isIntersecting){
          entry.target.classList.add("is-visible");

          // If this reveal contains an achievement ring, animate it in
          var ring = entry.target.querySelector(".ach-photo-wrap .val");
          if (ring && ring.dataset.target !== undefined){
            ring.style.strokeDashoffset = ring.dataset.target;
          }
          observer.unobserve(entry.target);
        }
      });
    }, { threshold: 0.15, rootMargin: "0px 0px -40px 0px" });

    revealEls.forEach(function(el){ observer.observe(el); });
  } else {
    // No IntersectionObserver support, or reduced motion: show everything immediately
    revealEls.forEach(function(el){ el.classList.add("is-visible"); });
    rings.forEach(function(circle){
      circle.style.strokeDashoffset = circle.dataset.target;
    });
  }
})();
