/* ==========================================================================
   Bay Eight Studios — site scripts
   Vanilla JS only. Bootstrap's bundle (with Popper) is loaded before this.
   ========================================================================== */

(function () {
  'use strict';

  /* ------------------------------------------------------------------
     Header: solid background once the page is scrolled past the top
     ------------------------------------------------------------------ */
  const header = document.getElementById('mainNav');

  if (header) {
    const setHeaderState = () => {
      header.classList.toggle('is-scrolled', window.scrollY > 40);
    };
    setHeaderState();
    window.addEventListener('scroll', setHeaderState, { passive: true });
  }


  /* ------------------------------------------------------------------
     Scroll reveal — add class="reveal" to anything that should fade up
     ------------------------------------------------------------------ */
  const revealItems = document.querySelectorAll('.reveal, .reveal-group');

  if (revealItems.length) {
    const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    if (prefersReduced) {
      revealItems.forEach((el) => el.classList.add('is-visible'));
    } else {
      const revealer = new IntersectionObserver(
        (entries, observer) => {
          entries.forEach((entry) => {
            if (!entry.isIntersecting) return;
            observer.unobserve(entry.target);
            // Give the browser a frame to paint the hidden state first.
            // Anything already on screen when the observer starts would
            // otherwise flip to visible in the same frame and never
            // transition — which just reads as "it appeared at full opacity".
            requestAnimationFrame(() => {
              requestAnimationFrame(() => entry.target.classList.add('is-visible'));
            });
          });
        },
        // A low threshold so tall blocks trigger as soon as their top edge
        // clears, rather than waiting to be 15% on screen
        { threshold: 0.05, rootMargin: '0px 0px -8% 0px' }
      );

      revealItems.forEach((el) => revealer.observe(el));
    }
  }





  /* ------------------------------------------------------------------
     Contact form — front-end only. Validates, then shows an inline
     confirmation; nothing is sent anywhere.
     ------------------------------------------------------------------ */
  const contactForm = document.getElementById('contactForm');
  const contactStatus = document.getElementById('contactStatus');

  if (contactForm && contactStatus) {
    contactForm.addEventListener('submit', (event) => {
      event.preventDefault();

      if (!contactForm.checkValidity()) {
        contactStatus.hidden = false;
        contactStatus.dataset.state = 'error';
        contactStatus.textContent = 'Please fill in the required fields.';
        // Surfaces the browser's own messages and focuses the first bad field
        contactForm.reportValidity();
        return;
      }

      contactStatus.hidden = false;
      contactStatus.dataset.state = 'ok';
      contactStatus.textContent =
        "Thanks — we've got your request. Our team will get back to you within 15 minutes.";
      contactForm.reset();
    });
  }


  /* ------------------------------------------------------------------
     Back to top — only shown once there's somewhere to go back to
     ------------------------------------------------------------------ */
  const toTop = document.getElementById('toTop');

  if (toTop) {
    const syncToTop = () => {
      toTop.hidden = window.scrollY < window.innerHeight;
    };
    syncToTop();
    window.addEventListener('scroll', syncToTop, { passive: true });

    toTop.addEventListener('click', () => {
      const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
      window.scrollTo({ top: 0, behavior: reduced ? 'auto' : 'smooth' });
    });
  }

  /* ------------------------------------------------------------------
     Footer year
     ------------------------------------------------------------------ */
  const year = document.getElementById('year');
  if (year) year.textContent = new Date().getFullYear();
})();
