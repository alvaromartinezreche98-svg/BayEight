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
      // Same threshold the landing uses — the frost lands as soon as the page
      // leaves the very top, rather than waiting for 40px of travel.
      header.classList.toggle('is-scrolled', window.scrollY > 8);
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
     FAQ — one-at-a-time accordion, zigzag entrance, 3D cursor tilt.
     Same choreography the bay-eight landing runs on GSAP, written
     against plain transitions here so nothing extra has to load.
     ------------------------------------------------------------------ */
  const faqRoot = document.querySelector('[data-faq]');

  if (faqRoot) {
    const items = Array.from(faqRoot.querySelectorAll('[data-faq-item]'));
    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    /* ---- Accordion ---- */
    const closeItem = (item) => {
      const panel = item.querySelector('.faq-panel');
      const btn = item.querySelector('.faq-toggle');
      if (!panel || !btn || panel.hidden) return;

      item.classList.remove('is-open');
      btn.setAttribute('aria-expanded', 'false');

      // From its measured height, so there is something to animate down from.
      panel.style.transition = 'none';
      panel.style.height = panel.scrollHeight + 'px';
      panel.style.opacity = '1';
      // Force the browser to take that height before the closing transition.
      void panel.offsetHeight;
      panel.style.transition =
        'height 0.3s cubic-bezier(0.55, 0.085, 0.68, 0.53), opacity 0.3s cubic-bezier(0.55, 0.085, 0.68, 0.53)';
      panel.style.height = '0px';
      panel.style.opacity = '0';

      const done = () => {
        panel.hidden = true;
        panel.style.transition = '';
        panel.removeEventListener('transitionend', onEnd);
      };
      const onEnd = (event) => {
        if (event.target === panel && event.propertyName === 'height') done();
      };
      if (reduced) done();
      else panel.addEventListener('transitionend', onEnd);
    };

    const openItem = (item) => {
      const panel = item.querySelector('.faq-panel');
      const btn = item.querySelector('.faq-toggle');
      if (!panel || !btn) return;

      item.classList.add('is-open');
      btn.setAttribute('aria-expanded', 'true');
      panel.hidden = false;

      panel.style.transition = 'none';
      panel.style.height = '0px';
      panel.style.opacity = '0';
      void panel.offsetHeight;
      panel.style.transition =
        'height 0.4s cubic-bezier(0.25, 0.46, 0.45, 0.94), opacity 0.4s cubic-bezier(0.25, 0.46, 0.45, 0.94)';
      panel.style.height = panel.scrollHeight + 'px';
      panel.style.opacity = '1';

      const onEnd = (event) => {
        if (event.target !== panel || event.propertyName !== 'height') return;
        // Back to auto so the answer can reflow if the window is resized.
        panel.style.height = 'auto';
        panel.style.transition = '';
        panel.removeEventListener('transitionend', onEnd);
      };
      panel.addEventListener('transitionend', onEnd);
    };

    items.forEach((item) => {
      const btn = item.querySelector('.faq-toggle');
      if (!btn) return;

      btn.addEventListener('click', () => {
        const wasOpen = item.classList.contains('is-open');
        // One at a time — opening a question closes whatever else is open.
        items.forEach((other) => {
          if (other !== item) closeItem(other);
        });
        if (wasOpen) closeItem(item);
        else openItem(item);
      });
    });

    /* ---- Zigzag entrance ---- */
    if (reduced) {
      items.forEach((item) => item.classList.add('is-in'));
    } else {
      const enter = new IntersectionObserver(
        (entries, observer) => {
          entries.forEach((entry) => {
            if (!entry.isIntersecting) return;
            observer.unobserve(entry.target);
            const i = items.indexOf(entry.target);
            // Same 40ms-per-card cascade the landing uses.
            setTimeout(() => entry.target.classList.add('is-in'), Math.max(i, 0) * 40);
          });
        },
        { threshold: 0.05, rootMargin: '0px 0px -10% 0px' }
      );
      items.forEach((item) => enter.observe(item));
    }

  }

  /* ------------------------------------------------------------------
     3D cursor tilt — the FAQ cards and the Success Stories cards, the
     same treatment the landing gives .engineer-card / .faq-item /
     .review-card: ±9deg following the pointer, settling back slower
     than it tracks.
     ------------------------------------------------------------------ */
  const tiltReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const finePointer = window.matchMedia('(hover: hover) and (pointer: fine)').matches;

  if (finePointer && !tiltReduced) {
    document.querySelectorAll('.faq-item, .story').forEach((card) => {
      let frame = 0;

      card.addEventListener('mouseenter', () => card.classList.add('is-tilting'));

      card.addEventListener('mousemove', (event) => {
        if (frame) return;
        frame = requestAnimationFrame(() => {
          frame = 0;
          const box = card.getBoundingClientRect();
          const px = (event.clientX - box.left) / box.width - 0.5;
          const py = (event.clientY - box.top) / box.height - 0.5;
          card.style.transform =
            'perspective(1000px) rotateX(' + (-py * 9).toFixed(2) + 'deg) rotateY(' +
            (px * 9).toFixed(2) + 'deg)';
        });
      });

      card.addEventListener('mouseleave', () => {
        if (frame) { cancelAnimationFrame(frame); frame = 0; }
        // Dropping the class hands the settle back to the slower curve.
        card.classList.remove('is-tilting');
        card.style.transform = '';
      });
    });
  }

  /* ------------------------------------------------------------------
     Footer year
     ------------------------------------------------------------------ */
  const year = document.getElementById('year');
  if (year) year.textContent = new Date().getFullYear();
})();
