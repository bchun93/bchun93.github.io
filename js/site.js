(() => {
  const navToggle = document.getElementById('nav-toggle');
  const siteNav = document.getElementById('site-nav');

  if (navToggle && siteNav) {
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
  }

  const applyInnerScale = (iframe, scale) => {
    const doc = iframe.contentDocument;
    if (!doc) return false;
    const root = doc.getElementById('dc-root');
    if (!root) return false;
    root.style.transformOrigin = 'top left';
    root.style.transform = `scale(${scale})`;
    doc.documentElement.style.overflow = 'hidden';
    doc.body.style.overflow = 'hidden';
    doc.body.style.minHeight = '0';
    return true;
  };

  const scaleArchitectureFrame = (frame) => {
    const iframe = frame.querySelector('.architecture-embed');
    if (!iframe) return;
    const nativeW = Number.parseFloat(getComputedStyle(frame).getPropertyValue('--arch-w')) || 1600;
    const width = frame.clientWidth;
    if (!width || !nativeW) return;
    const scale = width / nativeW;
    const tryApply = () => applyInnerScale(iframe, scale);
    if (!tryApply()) {
      const doc = iframe.contentDocument;
      if (!doc) return;
      const observer = new MutationObserver(() => {
        if (tryApply()) observer.disconnect();
      });
      observer.observe(doc.documentElement, { childList: true, subtree: true });
      setTimeout(() => observer.disconnect(), 8000);
    }
  };

  const scaleArchitectureFrames = () => {
    document.querySelectorAll('.embed-arch').forEach(scaleArchitectureFrame);
  };

  scaleArchitectureFrames();
  window.addEventListener('resize', scaleArchitectureFrames);
  document.querySelectorAll('iframe.architecture-embed').forEach((iframe) => {
    iframe.addEventListener('load', scaleArchitectureFrames);
  });

  document.querySelectorAll('[data-image-dialog]').forEach((trigger) => {
    const dialog = document.getElementById(trigger.dataset.imageDialog);
    if (!dialog) return;

    trigger.addEventListener('click', () => {
      const frame = dialog.querySelector('iframe[data-src]');
      if (frame && !frame.getAttribute('src')) {
        frame.src = frame.dataset.src;
        frame.addEventListener('load', scaleArchitectureFrames, { once: true });
      }
      dialog.showModal();
      requestAnimationFrame(scaleArchitectureFrames);
    });
    dialog.querySelector('[data-close-dialog]')?.addEventListener('click', () => dialog.close());
    dialog.addEventListener('click', (event) => {
      if (event.target === dialog) dialog.close();
    });
  });
})();
