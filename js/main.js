// Load HTML components into placeholders and initialize behaviors
document.addEventListener('DOMContentLoaded', function () {

    function loadComponent(selector, url) {
        const placeholder = document.querySelector(selector);
        if (!placeholder) return Promise.resolve(false);

        return fetch(url)
            .then(res => {
                if (!res.ok) throw new Error('Failed to load: ' + url);
                return res.text();
            })
            .then(html => {
                placeholder.innerHTML = html;
                return true;
            })
            .catch(err => {
                console.error(err);
                return false;
            });
    }

    function getBasePath() {
        const script = document.currentScript || document.querySelector('script[src*="js/main.js"]');
        if (!script) return '';

        const src = script.getAttribute('src') || '';
        return src.includes('../') ? '../' : '';
    }

    function initScrollTopButton(btnUp) {
        if (!btnUp) return;

        window.addEventListener('scroll', function () {
            btnUp.classList.toggle('visible', window.scrollY > 200);
        });

        btnUp.addEventListener('click', function () {
            window.scrollTo({
                top: 0,
                behavior: 'smooth'
            });
        });
    }

    function ensureScrollTopButton(basePath) {
        const existingButton = document.querySelector('.ir-arriba');
        if (existingButton) {
            initScrollTopButton(existingButton);
            return Promise.resolve();
        }

        const placeholder = document.querySelector('#scroll-top-placeholder');
        if (placeholder) {
            return loadComponent('#scroll-top-placeholder', basePath + 'components/scroll-top.html')
                .then(() => {
                    initScrollTopButton(document.querySelector('.ir-arriba'));
                });
        }

        return fetch(basePath + 'components/scroll-top.html')
            .then(res => {
                if (!res.ok) throw new Error('Failed to load: ' + (basePath + 'components/scroll-top.html'));
                return res.text();
            })
            .then(html => {
                document.body.insertAdjacentHTML('beforeend', html);
                initScrollTopButton(document.querySelector('.ir-arriba'));
            })
            .catch(err => console.error(err));
    }

    const componentsPrefix = getBasePath();

    Promise.all([
        loadComponent('#site-nav-placeholder', componentsPrefix + 'components/navbar.html'),
        loadComponent('#site-footer-placeholder', componentsPrefix + 'components/footer.html'),
        ensureScrollTopButton(componentsPrefix)
    ]).then(() => {

        // Re-bind menu toggle after injecting the nav
        const btn = document.querySelector('.menu-toggle');
        const nav = document.querySelector('nav');

        if (btn && nav) {
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

        const btnUp = document.querySelector('.ir-arriba');

        if (btnUp) {
            window.addEventListener('scroll', function () {
                btnUp.classList.toggle('visible', window.scrollY > 200);
            });

            btnUp.addEventListener('click', function () {
                window.scrollTo({
                    top: 0,
                    behavior: 'smooth'
                });
            });
        }
    });

    // ==============================
    // Toggle para mostrar más pilotos
    // ==============================

    const button = document.getElementById('toggleDriversBtn');
    const rows = document.querySelectorAll('.drivers-standings-table tbody tr');

    if (button && rows.length > 0) {

        let expanded = false;

        // Ocultar filas desde la 11 (índice 10)
        for (let i = 10; i < rows.length; i++) {
            rows[i].style.display = 'none';
        }

        button.addEventListener('click', function () {

            expanded = !expanded;

            for (let i = 10; i < rows.length; i++) {
                rows[i].style.display = expanded ? 'table-row' : 'none';
            }

            button.textContent = expanded
                ? 'Ver menos pilotos'
                : 'Ver más pilotos';
        });
    }

    const predictionForm = document.getElementById('championshipPredictionForm');
    const predictionMessage = document.getElementById('predictionMessage');

    if (predictionForm && predictionMessage) {
        predictionForm.addEventListener('submit', function (event) {
            event.preventDefault();

            const nameInput = document.getElementById('fanName');
            const driverSelect = document.getElementById('predictedDriver');
            const fanName = (nameInput?.value || '').trim();
            const predictedDriver = driverSelect?.value || '';

            if (!fanName || !predictedDriver) {
                predictionMessage.textContent = 'Completa tu nombre y selecciona un piloto.';
                return;
            }

            predictionMessage.textContent = `${fanName}, tu predicción por ${predictedDriver} ha sido registrada.`;
            predictionForm.reset();
        });
    }
});


// ==============================
// Cuenta atrás para el próximo GP
// ==============================

const targetDate = new Date(new Date().getFullYear(), 2, 8, 4, 0, 0);
const daysSpan = document.getElementById('days');
const label = document.getElementById('label');

function updateCountdown() {

    if (!daysSpan || !label) return;

    const now = new Date();
    const diff = targetDate - now;

    if (diff <= 0) {
        daysSpan.textContent = '0';
        label.textContent = '¡YA!';
        clearInterval(interval);
        return;
    }

    const days = Math.floor(diff / (1000 * 60 * 60 * 24));
    const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
    const seconds = Math.floor((diff % (1000 * 60)) / 1000);

    daysSpan.textContent = `${days} DÍAS`;
    label.textContent = `${hours}h ${minutes}m ${seconds}s`;
}

const interval = setInterval(updateCountdown, 1000);
updateCountdown();
