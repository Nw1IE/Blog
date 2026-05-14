import { calculatePostStats, formatSmartDate } from './utils';
import { AdminUser } from './core/AdminUser';
import { truncate, escapeHtml, highlightKeywords } from './text-formatter';

// --- 1. ДАННЫЕ И СОСТОЯНИЕ ---
let mockPosts = [
    { id: 1, title: "Разработка Hospital System на C#", author: "Евгений", content: "Проектирование баз данных для медицинских учреждений требует внимания к безопасности.", date: "2026-05-14T10:00:00", views: 450, category: "IT" },
    { id: 2, title: "React в 2026 году", author: "Admin", content: "Новые серверные компоненты и оптимизация рендеринга делают React мощнейшим инструментом.", date: "2026-05-13T12:00:00", views: 1200, category: "IT" },
    { id: 3, title: "BMW M5 F90: Технологии", author: "Driver", content: "Система полного привода xDrive в сочетании с V8 делает этот автомобиль эталоном драйва.", date: "2026-03-15", views: 2300, category: "Авто" },
    { id: 4, title: "Макс Корж и его музыка", author: "Fan-27", content: "Стадионные туры и искренние тексты — секрет успеха артиста, который собирает тысячи людей.", date: "2026-05-14T21:00:00", views: 800, category: "Music" }
];

const usersDatabase = [
    { login: "admin", pass: "admin123", role: "ADMIN", name: "Евгений" },
    { login: "user", pass: "user123", role: "USER", name: "Читатель" }
];

const currentAdmin = new AdminUser(777, "Евгений");
let activeCategory = "Все";
let isRegistrationMode = false;

// --- 2. ЭЛЕМЕНТЫ DOM ---
const container = document.getElementById('posts-container');
const searchInput = document.getElementById('search-input') as HTMLInputElement;
const authModal = document.getElementById('auth-modal') as HTMLElement;
const adminPanel = document.getElementById('admin-panel') as HTMLElement;
const adminModal = document.getElementById('admin-modal') as HTMLDialogElement;

const authTitle = document.getElementById('auth-title');
const authSubmitBtn = document.getElementById('auth-submit-btn');
const toggleAuthBtn = document.getElementById('toggle-auth-mode');
const loginInput = document.getElementById('auth-login') as HTMLInputElement;
const passInput = document.getElementById('auth-pass') as HTMLInputElement;

// --- 3. СОБЫТИЯ ---

document.getElementById('open-auth-modal')?.addEventListener('click', () => authModal.classList.remove('hidden'));
document.getElementById('close-auth-modal')?.addEventListener('click', () => authModal.classList.add('hidden'));
document.getElementById('open-admin-modal-btn')?.addEventListener('click', () => adminModal.showModal());
document.getElementById('close-admin-modal')?.addEventListener('click', () => adminModal.close());

document.getElementById('admin-logout')?.addEventListener('click', () => {
    adminPanel.classList.add('hidden');
    updateApp();
});

toggleAuthBtn?.addEventListener('click', () => {
    isRegistrationMode = !isRegistrationMode;
    if (authTitle && authSubmitBtn && toggleAuthBtn) {
        authTitle.innerText = isRegistrationMode ? "Регистрация" : "Авторизация";
        authSubmitBtn.innerText = isRegistrationMode ? "Создать аккаунт" : "Войти";
        toggleAuthBtn.innerText = isRegistrationMode ? "Уже есть аккаунт?" : "Создать новый аккаунт";
    }
});

authSubmitBtn?.addEventListener('click', () => {
    const login = loginInput.value.trim();
    const pass = passInput.value.trim();

    if (isRegistrationMode) {
        usersDatabase.push({ login, pass, role: "USER", name: login });
        alert("Аккаунт создан!");
        toggleAuthBtn?.click();
    } else {
        const foundUser = usersDatabase.find(u => u.login === login && u.pass === pass);
        if (foundUser) {
            authModal.classList.add('hidden'); 
            if (foundUser.role === "ADMIN") {
                currentAdmin.grantPermission('manage_users');
                adminPanel.classList.remove('hidden');
            }
            updateApp();
        } else {
            alert("Ошибка входа!");
        }
    }
});

// --- 4. ФУНКЦИИ РЕНДЕРА ---

function renderUserAccounts() {
    const list = document.getElementById('users-list');
    if (!list) return;
    const authors = [...new Set(mockPosts.map(p => p.author))];
    list.innerHTML = authors.map(auth => `
        <span class="bg-black text-white px-2 py-1 text-[10px] font-bold uppercase">${auth}</span>
    `).join('');
}

function updateAdminDashboard() {
    const tableBody = document.getElementById('admin-posts-table');
    const countEl = document.getElementById('admin-total-posts');
    if (!tableBody) return;
    
    tableBody.innerHTML = mockPosts.map(post => `
        <tr class="border-b border-black/10">
            <td class="p-2">${post.id}</td>
            <td class="p-2 italic">${post.author}</td>
            <td class="p-2 uppercase font-bold">${post.title}</td>
            <td class="p-2 text-right">
                <button class="bg-red-600 text-white px-2 py-1 text-[10px] font-black uppercase">Удалить</button>
            </td>
        </tr>
    `).join('');
    if (countEl) countEl.innerText = mockPosts.length.toString();
}

function renderPosts(posts: any[]) {
    if (!container) return;
    const isAdminActive = !adminPanel.classList.contains('hidden');
    
    container.innerHTML = posts.map(post => `
        <article class="relative border-black border-l-2 border-t-2 border-r-4 border-b-4 p-8 bg-white shadow-[10px_10px_0px_0px_rgba(0,0,0,1)]">
            ${isAdminActive ? `<div class="absolute -top-3 -right-3 bg-yellow-400 border-2 border-black px-2 py-1 text-[10px] font-black">ID: ${post.id}</div>` : ''}
            <header class="flex justify-between mb-4 border-b border-black pb-2">
                <span class="text-xs font-black uppercase">${post.category}</span>
                <span class="text-[10px] italic">${post.author}</span>
            </header>
            <h2 class="font-serif text-3xl font-black mb-4 uppercase">${post.title}</h2>
            <p class="text-sm leading-relaxed">${post.content}</p>
        </article>
    `).join('');
}

function updateApp() {
    const query = searchInput?.value.toLowerCase() || "";
    const filtered = mockPosts.filter(p => 
        (activeCategory === "Все" || p.category === activeCategory) && 
        p.title.toLowerCase().includes(query)
    );
    renderPosts(filtered);
    updateAdminDashboard();
    renderUserAccounts();
    
    const footer = document.getElementById('footer-info');
    if (footer) footer.innerText = `© 2026 ${currentAdmin.name} | Статей: ${filtered.length}`;
}

(window as any).setCat = (cat: string) => {
    activeCategory = cat;
    setupCategoryFilters();
    updateApp();
};

const setupCategoryFilters = () => {
    const container = document.getElementById('category-filters');
    if (!container) return;
    container.innerHTML = ["Все", "IT", "Авто", "Music"].map(cat => `
        <button onclick="window.setCat('${cat}')" class="px-4 py-1 border-2 border-black font-black uppercase text-[10px] ${cat === activeCategory ? 'bg-black text-white' : 'bg-white'}">${cat}</button>
    `).join('');
};

searchInput?.addEventListener('input', updateApp);
setupCategoryFilters();
updateApp();