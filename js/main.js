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
     Marquees — the two photo strips. CSS animates them on its own; once this
     runs it takes the animation over so the same track can also be dragged.
     Falls back to the pure-CSS loop if this block never executes.
     ------------------------------------------------------------------ */
  const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)');

  if (!reducedMotion.matches) {
    document.querySelectorAll('.culture-strip, .interns-strip').forEach((strip) => {
      const track = strip.querySelector('.culture-track, .interns-track');
      const group = track && track.firstElementChild;
      if (!group) return;

      // Hand the animation over to us; the CSS keyframes stay as the fallback.
      track.style.animation = 'none';
      track.style.willChange = 'transform';
      strip.classList.add('is-draggable');

      const SPEED = 26; // px per second, left to right — matches the CSS timing
      let loop = 0;     // one group plus one gap: the distance a full cycle covers
      let offset = 0;
      let paused = false;
      let dragging = false;
      let startX = 0;
      let startOffset = 0;
      let last = 0;

      const measure = () => {
        const gap = parseFloat(getComputedStyle(track).columnGap) || 0;
        loop = group.getBoundingClientRect().width + gap;
      };
      measure();
      window.addEventListener('resize', measure);

      const wrap = () => {
        if (!loop) return;
        // Keep offset inside [0, loop) so the transform never grows unbounded
        offset = ((offset % loop) + loop) % loop;
      };

      const draw = () => { track.style.transform = 'translateX(' + -offset + 'px)'; };

      const frame = (now) => {
        const dt = last ? Math.min((now - last) / 1000, 0.1) : 0;
        last = now;
        if (!paused && !dragging) {
          offset -= SPEED * dt;
          wrap();
          draw();
        }
        requestAnimationFrame(frame);
      };
      offset = loop;
      wrap();
      draw();
      requestAnimationFrame(frame);

      strip.addEventListener('pointerenter', () => { paused = true; });
      strip.addEventListener('pointerleave', () => { paused = false; });

      strip.addEventListener('pointerdown', (event) => {
        if (event.button !== 0 && event.pointerType === 'mouse') return;
        dragging = true;
        startX = event.clientX;
        startOffset = offset;
        strip.setPointerCapture(event.pointerId);
        strip.classList.add('is-dragging');
      });

      strip.addEventListener('pointermove', (event) => {
        if (!dragging) return;
        // Drag right, the strip follows right
        offset = startOffset - (event.clientX - startX);
        wrap();
        draw();
      });

      const endDrag = (event) => {
        if (!dragging) return;
        dragging = false;
        strip.classList.remove('is-dragging');
        if (event && event.pointerId != null && strip.hasPointerCapture(event.pointerId)) {
          strip.releasePointerCapture(event.pointerId);
        }
      };
      strip.addEventListener('pointerup', endDrag);
      strip.addEventListener('pointercancel', endDrag);

      // A drag that ends over an image would otherwise fire a click on it
      strip.addEventListener('dragstart', (event) => event.preventDefault());
    });
  }

  /* ------------------------------------------------------------------
     Footer year
     ------------------------------------------------------------------ */
  const year = document.getElementById('year');
  if (year) year.textContent = new Date().getFullYear();
})();
