export function highlightActiveLink(): void {
    const currentPath = window.location.pathname;
    const navLinks = document.querySelectorAll<HTMLAnchorElement>('.nav-link');

    navLinks.forEach(link => {
        link.classList.remove('active');
        
        const linkPath = new URL(link.href).pathname;
        
        // Учитываем точное совпадение (особенно для главной '/')
        if (currentPath === linkPath || (currentPath === '/index.html' && linkPath === '/')) {
            link.classList.add('active');
        }
    });
}