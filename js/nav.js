(function () {
  'use strict';

  const navToggle = document.getElementById('nav-toggle');
  const siteNav = document.getElementById('site-nav');
  const main = document.getElementById('main-content');

  if (main && !main.hasAttribute('tabindex')) {
    main.setAttribute('tabindex', '-1');
  }

  if (!navToggle || !siteNav) return;

  navToggle.addEventListener('click', () => {
    const open = siteNav.classList.toggle('is-open');
    navToggle.setAttribute('aria-expanded', String(open));
  });

  siteNav.querySelectorAll('a').forEach((link) => {
    link.addEventListener('click', () => {
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
})();
