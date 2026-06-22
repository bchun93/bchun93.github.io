(function () {
  'use strict';

  const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  /* ── Skip link target ── */
  const main = document.getElementById('main-content');
  if (main && !main.hasAttribute('tabindex')) {
    main.setAttribute('tabindex', '-1');
  }

  /* ── Mobile nav ── */
  const navToggle = document.getElementById('nav-toggle');
  const siteNav = document.getElementById('site-nav');

  if (navToggle && siteNav) {
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
  }

  /* ── Spec Rail ── */
  const sectionLabels = {
    hero: 'Hero',
    expertise: 'Domains of expertise',
    work: 'Case studies',
    prototype: 'Interactive prototype',
    contact: 'Contact',
  };

  const sections = document.querySelectorAll('[data-spec-section]');
  const desktopRail = document.querySelector('.spec-rail');
  const mobileRail = document.querySelector('.spec-rail-mobile');
  const railKeys = document.querySelectorAll('.spec-rail-key');

  railKeys.forEach((key) => {
    const id = key.dataset.target;
    const label = sectionLabels[id] || id;
    key.setAttribute('aria-label', `Jump to ${label}`);
  });

  function syncRailVisibility() {
    const mobile = window.matchMedia('(max-width: 960px)').matches;
    if (desktopRail) desktopRail.setAttribute('aria-hidden', mobile ? 'true' : 'false');
    if (mobileRail) mobileRail.setAttribute('aria-hidden', mobile ? 'false' : 'true');
  }

  syncRailVisibility();
  window.addEventListener('resize', syncRailVisibility);

  function setActiveSection(id) {
    railKeys.forEach((key) => {
      const active = key.dataset.target === id;
      key.classList.toggle('is-active', active);
      key.setAttribute('aria-current', active ? 'true' : 'false');
    });
  }

  railKeys.forEach((key) => {
    key.addEventListener('click', () => {
      const el = document.getElementById(key.dataset.target);
      if (el) {
        el.scrollIntoView({ behavior: reducedMotion ? 'auto' : 'smooth', block: 'start' });
      }
    });
  });

  if (sections.length) {
    const observer = new IntersectionObserver(
      (entries) => {
        const visible = entries
          .filter((e) => e.isIntersecting)
          .sort((a, b) => b.intersectionRatio - a.intersectionRatio);
        if (visible[0]) setActiveSection(visible[0].target.id);
      },
      { rootMargin: '-20% 0px -55% 0px', threshold: [0, 0.25, 0.5] }
    );
    sections.forEach((s) => observer.observe(s));
    setActiveSection(sections[0].id);
  }

  /* ── Resume modal ── */
  const modal = document.getElementById('resume-modal');
  const openBtn = document.getElementById('open-resume');
  if (!modal || !openBtn) return;

  const panel = modal.querySelector('.resume-modal-panel');
  const closeBtns = modal.querySelectorAll('[data-close-resume]');
  const canvas = document.getElementById('resume-canvas');
  const liveRegion = document.getElementById('resume-live');
  const prevBtn = document.getElementById('resume-prev');
  const nextBtn = document.getElementById('resume-next');
  const pageInfo = document.getElementById('resume-page-info');
  const pager = document.getElementById('resume-pager');

  let focusBeforeOpen = null;
  let pdfDoc = null;
  let currentPage = 1;
  let renderTask = null;
  const RESUME_URL = 'assets/Brian-Chun-Resume.pdf';

  const focusableSelector =
    'a[href], button:not([disabled]), textarea, input, select, [tabindex]:not([tabindex="-1"])';

  function getFocusables() {
    return Array.from(panel.querySelectorAll(focusableSelector)).filter(
      (el) => el.offsetParent !== null || el === panel.querySelector('.resume-modal-close')
    );
  }

  function trapFocus(e) {
    if (e.key !== 'Tab' || !modal.classList.contains('is-open')) return;
    const focusables = getFocusables();
    if (!focusables.length) return;
    const first = focusables[0];
    const last = focusables[focusables.length - 1];
    if (e.shiftKey && document.activeElement === first) {
      e.preventDefault();
      last.focus();
    } else if (!e.shiftKey && document.activeElement === last) {
      e.preventDefault();
      first.focus();
    }
  }

  async function loadPdf() {
    if (pdfDoc) return pdfDoc;
    if (typeof pdfjsLib === 'undefined') throw new Error('PDF library not loaded');
    pdfjsLib.GlobalWorkerOptions.workerSrc =
      'https://cdnjs.cloudflare.com/ajax/libs/pdf.js/3.11.174/pdf.worker.min.js';
    pdfDoc = await pdfjsLib.getDocument(RESUME_URL).promise;
    return pdfDoc;
  }

  async function renderPage(pageNum) {
    const pdf = await loadPdf();
    const page = await pdf.getPage(pageNum);
    const body = canvas.parentElement;
    const availW = body.clientWidth - 16;
    const base = page.getViewport({ scale: 1 });
    const scale = availW / base.width;
    const dpr = window.devicePixelRatio || 1;
    const viewport = page.getViewport({ scale: scale * dpr });

    canvas.width = viewport.width;
    canvas.height = viewport.height;
    canvas.style.width = `${availW}px`;
    canvas.style.height = `${base.height * scale}px`;
    canvas.setAttribute('role', 'img');
    canvas.setAttribute(
      'aria-label',
      `Resume page ${pageNum} of ${pdf.numPages}. Download the PDF for a text-accessible copy.`
    );

    if (renderTask) renderTask.cancel();
    renderTask = page.render({ canvasContext: canvas.getContext('2d'), viewport });
    await renderTask.promise;

    body.scrollTop = 0;
    currentPage = pageNum;
    const pageText = `Page ${pageNum} of ${pdf.numPages}`;
    pageInfo.textContent = pageText;
    if (liveRegion) liveRegion.textContent = `Showing resume ${pageText}`;
    prevBtn.disabled = pageNum <= 1;
    nextBtn.disabled = pageNum >= pdf.numPages;
    pager.hidden = pdf.numPages <= 1;
  }

  async function openModal() {
    focusBeforeOpen = document.activeElement;
    modal.classList.add('is-open');
    modal.setAttribute('aria-hidden', 'false');
    modal.removeAttribute('inert');
    document.body.classList.add('modal-open');
    document.addEventListener('keydown', trapFocus);
    try {
      await renderPage(1);
    } catch (err) {
      if (liveRegion) liveRegion.textContent = 'Unable to load resume preview. Use Download for the PDF.';
    }
    const closeBtn = panel.querySelector('.resume-modal-close');
    if (closeBtn) closeBtn.focus();
  }

  function closeModal() {
    modal.classList.remove('is-open');
    modal.setAttribute('aria-hidden', 'true');
    modal.setAttribute('inert', '');
    document.body.classList.remove('modal-open');
    document.removeEventListener('keydown', trapFocus);
    if (focusBeforeOpen && typeof focusBeforeOpen.focus === 'function') {
      focusBeforeOpen.focus();
    }
  }

  openBtn.addEventListener('click', openModal);
  closeBtns.forEach((el) => el.addEventListener('click', closeModal));

  if (prevBtn && nextBtn) {
    prevBtn.addEventListener('click', () => renderPage(currentPage - 1));
    nextBtn.addEventListener('click', () => renderPage(currentPage + 1));
  }

  document.addEventListener('keydown', (e) => {
    if (!modal.classList.contains('is-open')) return;
    if (e.key === 'Escape') closeModal();
    if (e.key === 'ArrowLeft' && prevBtn && !prevBtn.disabled) renderPage(currentPage - 1);
    if (e.key === 'ArrowRight' && nextBtn && !nextBtn.disabled) renderPage(currentPage + 1);
  });

  window.addEventListener('resize', () => {
    if (modal.classList.contains('is-open')) renderPage(currentPage);
  });
})();
