(() => {
  const navToggle = document.getElementById('nav-toggle');
  const siteNav = document.getElementById('site-nav');

  if (!navToggle || !siteNav) return;

  navToggle.addEventListener('click', () => {
    const open = siteNav.classList.toggle('is-open');
    navToggle.setAttribute('aria-expanded', open ? 'true' : 'false');
  });

  siteNav.querySelectorAll('a').forEach((el) => {
    el.addEventListener('click', () => {
      siteNav.classList.remove('is-open');
      navToggle.setAttribute('aria-expanded', 'false');
    });
  });

  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && siteNav.classList.contains('is-open')) {
      siteNav.classList.remove('is-open');
      navToggle.setAttribute('aria-expanded', 'false');
      navToggle.focus();
    }
  });

  const scaleArchitectureFrames = () => {
    document.querySelectorAll('.architecture-frame').forEach((frame) => {
      const embed = frame.querySelector('.architecture-embed');
      if (!embed) return;
      const nativeW = Number.parseFloat(getComputedStyle(frame).getPropertyValue('--arch-w')) || 1600;
      const width = frame.clientWidth;
      if (!width || !nativeW) return;
      frame.style.setProperty('--arch-scale', String(width / nativeW));
      frame.classList.add('is-scaled');
    });
  };

  scaleArchitectureFrames();
  window.addEventListener('resize', scaleArchitectureFrames);
  if (window.ResizeObserver) {
    document.querySelectorAll('.architecture-frame').forEach((frame) => {
      new ResizeObserver(scaleArchitectureFrames).observe(frame);
    });
  }

  document.querySelectorAll('[data-image-dialog]').forEach((trigger) => {
    const dialog = document.getElementById(trigger.dataset.imageDialog);
    if (!dialog) return;

    trigger.addEventListener('click', () => {
      const frame = dialog.querySelector('iframe[data-src]');
      if (frame && !frame.getAttribute('src')) frame.src = frame.dataset.src;
      dialog.showModal();
      requestAnimationFrame(() => {
        scaleArchitectureFrames();
        requestAnimationFrame(scaleArchitectureFrames);
      });
    });
    dialog.querySelector('[data-close-dialog]')?.addEventListener('click', () => dialog.close());
    dialog.addEventListener('click', (event) => {
      if (event.target === dialog) dialog.close();
    });
  });
})();
