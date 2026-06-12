// ============================================================
//  CAREFLOW THEME SYSTEM — theme.js
//  Injects a floating 🌙/☀️ toggle button on every page.
//  Persists the chosen theme in localStorage.
//  Usage: add <script src="theme.js"></script> to any page.
// ============================================================

(function () {
  const STORAGE_KEY = 'cf_theme';

  // ── Apply theme immediately (before render) to avoid flash ──
  function applyTheme(t) {
    document.documentElement.setAttribute('data-theme', t);
  }

  const saved = localStorage.getItem(STORAGE_KEY) || 'light';
  applyTheme(saved);

  // ── Inject the floating toggle button once DOM is ready ──
  function injectButton() {
    if (document.getElementById('cf-theme-btn')) return;

    const btn = document.createElement('button');
    btn.id = 'cf-theme-btn';
    btn.title = 'Toggle Light / Dark mode';
    btn.setAttribute('aria-label', 'Toggle colour theme');

    // Style
    Object.assign(btn.style, {
      position:     'fixed',
      bottom:       '28px',
      right:        '28px',
      zIndex:       '9999',
      width:        '48px',
      height:       '48px',
      borderRadius: '50%',
      border:       'none',
      cursor:       'pointer',
      fontSize:     '22px',
      display:      'flex',
      alignItems:   'center',
      justifyContent: 'center',
      boxShadow:    '0 4px 18px rgba(0,0,0,0.25)',
      transition:   'transform 0.2s, box-shadow 0.2s',
      outline:      'none',
    });

    function updateBtn(t) {
      btn.textContent = t === 'dark' ? '☀️' : '🌙';
      btn.style.background = t === 'dark'
        ? 'rgba(30,41,59,0.92)'
        : 'rgba(255,255,255,0.95)';
    }

    updateBtn(saved);

    btn.addEventListener('click', () => {
      const current = document.documentElement.getAttribute('data-theme') || 'light';
      const next = current === 'dark' ? 'light' : 'dark';
      applyTheme(next);
      localStorage.setItem(STORAGE_KEY, next);
      updateBtn(next);
      btn.style.transform = 'scale(1.15) rotate(20deg)';
      setTimeout(() => { btn.style.transform = 'scale(1) rotate(0deg)'; }, 200);
    });

    btn.addEventListener('mouseenter', () => {
      btn.style.boxShadow = '0 6px 24px rgba(0,0,0,0.35)';
      btn.style.transform = 'scale(1.08)';
    });
    btn.addEventListener('mouseleave', () => {
      btn.style.boxShadow = '0 4px 18px rgba(0,0,0,0.25)';
      btn.style.transform = 'scale(1)';
    });

    document.body.appendChild(btn);
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', injectButton);
  } else {
    injectButton();
  }
})();
