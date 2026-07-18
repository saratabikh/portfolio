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
