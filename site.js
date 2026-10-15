(() => {
  "use strict";

  const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)");
  const sections = [...document.querySelectorAll("main > section[id]")];
  const navLinks = [...document.querySelectorAll(".site-nav a")];

  // Keep navigation in step with reading, including clicks on anchor links.
  let scheduled = false;
  function updateNavigation() {
    const threshold = document.querySelector(".site-header").offsetHeight + 100;
    let current = sections[0];
    for (const section of sections) {
      if (section.getBoundingClientRect().top <= threshold) current = section;
    }
    if (
      window.innerHeight + window.scrollY >=
      document.documentElement.scrollHeight - 2
    ) {
      current = sections[sections.length - 1];
    }
    for (const link of navLinks) {
      if (link.hash === "#" + current.id)
        link.setAttribute("aria-current", "location");
      else link.removeAttribute("aria-current");
    }
    scheduled = false;
  }
  window.addEventListener(
    "scroll",
    () => {
      if (!scheduled) {
        scheduled = true;
        window.requestAnimationFrame(updateNavigation);
      }
    },
    { passive: true },
  );
  window.addEventListener("resize", updateNavigation);
  updateNavigation();

  if ("IntersectionObserver" in window) {
    const revealObserver = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (!entry.isIntersecting) continue;
          if (!reducedMotion.matches) entry.target.classList.add("is-entering");
          revealObserver.unobserve(entry.target);
        }
      },
      { threshold: 0.08 },
    );
    document.querySelectorAll(".reveal").forEach((element) => {
      if (element.getBoundingClientRect().top >= window.innerHeight)
        revealObserver.observe(element);
    });
    document.addEventListener("animationend", (event) => {
      event.target.classList.remove("is-entering");
    });
  }

  // Keep the original looping demo, with controls and respect for motion preferences.
  const video = document.querySelector("video");
  if (video) {
    video.playbackRate = 1.5;
    if (!reducedMotion.matches) video.play().catch(() => {});
    reducedMotion.addEventListener("change", () => {
      if (reducedMotion.matches) video.pause();
    });
  }
})();
