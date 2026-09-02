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

  document.querySelectorAll('[data-image-dialog]').forEach((trigger) => {
    const dialog = document.getElementById(trigger.dataset.imageDialog);
    if (!dialog) return;

    trigger.addEventListener('click', () => {
      const frame = dialog.querySelector('iframe[data-src]');
      if (frame && !frame.getAttribute('src')) frame.src = frame.dataset.src;
      dialog.showModal();
    });
    dialog.querySelector('[data-close-dialog]')?.addEventListener('click', () => dialog.close());
    dialog.addEventListener('click', (event) => {
      if (event.target === dialog) dialog.close();
    });
  });
})();
