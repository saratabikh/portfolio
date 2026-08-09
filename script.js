document.documentElement.classList.add('js');

const dropdown = document.querySelector('.nav-dropdown');
const dropdownMenu = document.querySelector('.dropdown-menu');

if (dropdown && dropdownMenu) {
    dropdown.addEventListener('click', event => {
        if (window.innerWidth <= 768) {
            event.preventDefault();
            dropdownMenu.style.display = dropdownMenu.style.display === 'block' ? 'none' : 'block';
        }
    });
}

document.addEventListener('click', event => {
    if (!event.target.closest('.nav-dropdown') && window.innerWidth <= 768) {
        document.querySelectorAll('.dropdown-menu').forEach(menu => menu.style.display = 'none');
    }
});

window.addEventListener('resize', () => {
    if (window.innerWidth > 768) {
        document.querySelectorAll('.dropdown-menu').forEach(menu => menu.style.display = '');
    }
});

window.addEventListener('scroll', () => {
    const navbar = document.querySelector('.navbar');
    if (navbar) {
        navbar.style.boxShadow = window.scrollY > 20 ? '0 4px 20px rgba(0, 0, 0, 0.12)' : '0 4px 12px var(--shadow)';
    }
});

/* Homepage carousel: 3-up auto scroll */
(function() {
    const carousel = document.getElementById('homepage-carousel');
    if (!carousel) return;

    const track = carousel.querySelector('.carousel-track');
    const items = Array.from(carousel.querySelectorAll('.carousel-item'));
    let visible = 3;
    let index = 0;
    let intervalId = null;
    let dots = [];

    function computeVisible() {
        const w = carousel.clientWidth;
        if (w < 560) return 1;
        if (w < 900) return 2;
        return 3;
    }

    function updateLayout() {
        visible = computeVisible();
        items.forEach(it => it.style.flex = `0 0 calc(100% / ${visible})`);
        moveTo(index, false);
        updateDots();
    }

    function moveTo(i, animate = true) {
        const maxIndex = Math.max(0, items.length - visible);
        if (i > maxIndex) i = 0;
        if (i < 0) i = maxIndex;
        index = i;
        const shift = (index * 100) / visible;
        if (!animate) track.style.transition = 'none'; else track.style.transition = '';
        requestAnimationFrame(() => {
            track.style.transform = `translateX(-${shift}%)`;
            if (!animate) {
                // force reflow then restore
                void track.offsetWidth;
                track.style.transition = '';
            }
            updateDots();
        });
    }

    function next() { moveTo(index + 1); }
    function prev() { moveTo(index - 1); }

    function start() {
        stop();
        intervalId = setInterval(next, 4000);
    }

    function stop() {
        if (intervalId) { clearInterval(intervalId); intervalId = null; }
    }

    // controls
    const btnPrev = carousel.querySelector('.carousel-control.left');
    const btnNext = carousel.querySelector('.carousel-control.right');
    if (btnPrev) btnPrev.addEventListener('click', e => { e.stopPropagation(); prev(); start(); });
    if (btnNext) btnNext.addEventListener('click', e => { e.stopPropagation(); next(); start(); });

    // dots
    const dotsContainer = carousel.querySelector('.carousel-dots');
    if (dotsContainer) {
        // clear existing
        dotsContainer.innerHTML = '';
        for (let i = 0; i < items.length; i++) {
            const d = document.createElement('button');
            d.type = 'button';
            d.className = 'dot';
            d.setAttribute('aria-label', `Show image ${i+1}`);
            d.addEventListener('click', (e) => {
                e.stopPropagation();
                // want clicked image to become the middle/focus
                const target = i - Math.floor(visible/2);
                const maxIndex = Math.max(0, items.length - visible);
                let dest = Math.max(0, Math.min(maxIndex, target));
                moveTo(dest);
                start();
            });
            dotsContainer.appendChild(d);
            dots.push(d);
        }
    }

    function updateDots() {
        if (!dots || !dots.length) return;
        const focus = Math.min(items.length - 1, index + Math.floor(visible / 2));
        dots.forEach((d, idx) => {
            if (idx === focus) d.classList.add('active'); else d.classList.remove('active');
        });
    }

    carousel.addEventListener('mouseenter', stop);
    carousel.addEventListener('mouseleave', start);
    window.addEventListener('resize', () => { updateLayout(); });

    // init
    updateLayout();
    start();
})();

    /* Scroll reveal: content rises into view as you scroll */
(function() {
    const selectors = '.summary-card, .skill-card, .project-tile, .project-section, .info-card, .carousel-section, .footer';
    const targets = document.querySelectorAll(selectors);
    if (!targets.length) return;

    if (!('IntersectionObserver' in window)) {
        targets.forEach(el => el.classList.add('in-view'));
        return;
    }

    targets.forEach(el => {
        el.classList.add('reveal');
        const siblings = Array.from(el.parentElement.children).filter(c => c.classList.contains('reveal'));
        const idx = Math.min(siblings.indexOf(el), 8);
        el.style.transitionDelay = `${idx * 80}ms`;
    });

    // reveal anything already on screen immediately (entrance animation)
    const rect = target => (target.getBoundingClientRect().top < window.innerHeight - 30);
    targets.forEach(el => { if (rect(el)) el.classList.add('in-view'); });

    const io = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('in-view');
                io.unobserve(entry.target);
            }
        });
    }, { threshold: 0.1, rootMargin: '0px 0px -30px 0px' });

    targets.forEach(el => io.observe(el));
})();
