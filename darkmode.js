document.addEventListener('DOMContentLoaded', () => {
    const THEME_KEY = 'gp-theme';
    const linkEl = document.getElementById('themeStylesheet');
    const toggleBtn = document.getElementById('themeToggle');

    const LIGHT_HREF = 'style.css';
    const DARK_HREF = 'darkmode.css';

    function prefersDark() {
        return window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches;
    }

    function getStoredTheme() {
        return localStorage.getItem(THEME_KEY);
    }

    function applyTheme(theme) {
        const isDark = theme === 'dark';
        if (linkEl) {
            linkEl.setAttribute('href', isDark ? DARK_HREF : LIGHT_HREF);
        }

        document.documentElement.setAttribute('data-theme', theme);
        document.documentElement.setAttribute('data-bs-theme', theme);

        if (toggleBtn) {
            toggleBtn.textContent = isDark ? '☀️ Light' : '🌙 Dark';
            toggleBtn.setAttribute('aria-pressed', String(isDark));
            toggleBtn.classList.toggle('btn-outline-light', isDark);
            toggleBtn.classList.toggle('btn-outline-secondary', !isDark);
        }
    }

    function setTheme(theme) {
        localStorage.setItem(THEME_KEY, theme);
        applyTheme(theme);
    }

    function initTheme() {
        const stored = getStoredTheme();
        const startTheme = stored || (prefersDark() ? 'dark' : 'light');
        applyTheme(startTheme);
    }

    if (toggleBtn) {
        toggleBtn.addEventListener('click', () => {
            const current = document.documentElement.getAttribute('data-theme') || 'light';
            const next = current === 'dark' ? 'light' : 'dark';
            setTheme(next);
        });
    }

    if (window.matchMedia) {
        const mql = window.matchMedia('(prefers-color-scheme: dark)');
        mql.addEventListener?.('change', (e) => {
            if (!getStoredTheme()) {
                applyTheme(e.matches ? 'dark' : 'light');
            }
        });
    }

    initTheme();
});


