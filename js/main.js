// Toggle del menú móvil
// Load HTML components into placeholders and initialize behaviors
document.addEventListener('DOMContentLoaded', function () {
    function loadComponent(selector, url) {
        const placeholder = document.querySelector(selector);
        if (!placeholder) return Promise.resolve();
        return fetch(url)
            .then(res => {
                if (!res.ok) throw new Error('Failed to load: ' + url);
                return res.text();
            })
            .then(html => {
                placeholder.innerHTML = html;
            })
            .catch(err => console.error(err));
    }

    // compute components path: if page is inside /pages/ then prefix with ../
    const componentsPrefix = location.pathname.includes('/pages/') || location.pathname.includes('\\pages\\') ? '../' : '';

    Promise.all([
        loadComponent('#site-nav-placeholder', componentsPrefix + 'components/navbar.html'),
        loadComponent('#site-footer-placeholder', componentsPrefix + 'components/footer.html')
    ]).then(() => {
        // Re-bind menu toggle after injecting the nav
        const btn = document.querySelector('.menu-toggle');
        const nav = document.querySelector('nav');
        const navList = document.querySelector('nav ul');

        if (btn && nav && navList) {
            btn.addEventListener('click', function () {
                const expanded = btn.getAttribute('aria-expanded') === 'true';
                btn.setAttribute('aria-expanded', String(!expanded));
                nav.classList.toggle('nav-open');
            });

            // Cerrar menú al clicar fuera (en móvil)
            document.addEventListener('click', function (e) {
                if (!nav.contains(e.target) && nav.classList.contains('nav-open')) {
                    nav.classList.remove('nav-open');
                    btn.setAttribute('aria-expanded', 'false');
                }
            });
        }
    });
});

// cuenta atrás para el próximo gran premio (8 de marzo de 2026 a las 4:00 AM)
const targetDate = new Date(new Date().getFullYear(), 2, 8, 4, 0, 0); // 8 de marzo, 4:00 AM
const daysSpan = document.getElementById('days');
const label = document.getElementById('label');

function updateCountdown() {
    const now = new Date();
    const diff = targetDate - now;

    if (diff <= 0) {
        daysSpan.textContent = "0";
        label.textContent = "¡YA!";
        clearInterval(interval);
        return;
    }

    const days = Math.floor(diff / (1000 * 60 * 60 * 24));
    const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
    const seconds = Math.floor((diff % (1000 * 60)) / 1000);

    // Mostramos días y el resto como "HH:MM:SS"
    daysSpan.textContent = `${days} DÍAS`;
    label.textContent = `${hours}h ${minutes}m ${seconds}s`;
}

const interval = setInterval(updateCountdown, 1000);
updateCountdown();