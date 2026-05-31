import { DB } from '../data/db';
import { api } from '../api/api.ts';
import type { UserDTO, PostDTO, CommentDTO } from '../types/types.ts';

// Ключ для хранения удалённых постов между сессиями
const DELETED_POSTS_KEY = 'blog_deleted_post_ids';
// Ключ для хранения imageUrl постов (сервер не хранит, храним локально)
const IMAGE_STORE_KEY = 'blog_post_images';

function getDeletedIds(): Set<number> {
    try {
        const raw = localStorage.getItem(DELETED_POSTS_KEY);
        return raw ? new Set(JSON.parse(raw) as number[]) : new Set();
    } catch { return new Set(); }
}

function saveDeletedIds(ids: Set<number>) {
    localStorage.setItem(DELETED_POSTS_KEY, JSON.stringify([...ids]));
}

/** Хранилище base64-картинок постов: { postId: dataUrl } */
function getImageStore(): Record<number, string> {
    try {
        const raw = localStorage.getItem(IMAGE_STORE_KEY);
        return raw ? JSON.parse(raw) : {};
    } catch { return {}; }
}

function saveImageStore(store: Record<number, string>) {
    try {
        localStorage.setItem(IMAGE_STORE_KEY, JSON.stringify(store));
    } catch (e) {
        // localStorage может переполниться при большом кол-ве base64 — молча игнорируем
        console.warn('⚠️ Не удалось сохранить картинки в localStorage:', e);
    }
}

function getImageForPost(postId: number): string | null {
    return getImageStore()[postId] ?? null;
}

function saveImageForPost(postId: number, dataUrl: string) {
    const store = getImageStore();
    store[postId] = dataUrl;
    saveImageStore(store);
}

function removeImageForPost(postId: number) {
    const store = getImageStore();
    delete store[postId];
    saveImageStore(store);
}

export class BlogApp {
    private currentUser: UserDTO | null = null;
    private isLoginMode = true;
    private currentOpenedPostId: number | null = null;
    private selectedCategory: string | null = null;
    private categories: any[] = [];
    private isInitialized = false;
    private likedPostIds: Set<number> = new Set();
    private deletedPostIds: Set<number> = getDeletedIds();

    constructor() {
        this.init();
    }

    public async init() {
        if (this.isInitialized) return;
        this.isInitialized = true;

        // ШАГ 1: API-ключ
        if (!localStorage.getItem('server_api_key')) {
            try { await api.createApiKey(); } catch (e) { console.error('❌ API ключ:', e); }
        }

        // ШАГ 2: Восстанавливаем сессию
        const savedJwt   = localStorage.getItem('app_jwt_token');
        const savedLogin = localStorage.getItem('current_login');
        const savedRole  = (localStorage.getItem('current_role') as 'admin' | 'user') || 'user';

        if (savedJwt && savedLogin) {
            const localUser = DB.users.find(u => u.username === savedLogin);
            if (!localUser?.isBanned) {
                this.currentUser = {
                    id: localUser?.id ?? 1,
                    username: savedLogin,
                    role: savedRole,
                    isBanned: false,
                    email: `${savedLogin}@mail.ru`,
                    bio: localUser?.bio ?? ''
                };
                this.updateUIAuth();
            }
        }

        // ШАГ 3: Данные
        await this.loadPostsFromServer();
        await this.loadCategories();

        // ШАГ 4: Рендер
        this.renderPosts();
        this.renderCategories();
        this.initEvents();
    }

    // ─── ЗАГРУЗКА ДАННЫХ ─────────────────────────────────────────────────────

    private async loadPostsFromServer() {
        try {
            const posts = await api.getAllPosts({ page: 1, limit: 50 });
            DB.posts = posts
                .filter(p => !this.deletedPostIds.has(p.id))
                .map(p => ({
                    ...p,
                    comments:     p.comments    ?? [],
                    likesCount:   p.likesCount  ?? 0,
                    categoryName: p.categoryName ?? null,
                    // Подтягиваем сохранённую картинку из localStorage
                    imageUrl: p.imageUrl ?? getImageForPost(p.id) ?? null,
                }));
            console.log(`✅ Загружено ${DB.posts.length} постов с сервера`);
        } catch (e) {
            console.warn('⚠️ Не удалось загрузить посты:', e);
        }
    }

    private async loadCategories() {
        try {
            this.categories = await api.getCategories();
            console.log('✅ Категории:', this.categories);
        } catch {
            console.warn('⚠️ Не удалось загрузить категории');
        }
    }

    // ─── СОБЫТИЯ ─────────────────────────────────────────────────────────────

    private initEvents() {
        document.querySelector('h1')?.addEventListener('click', () => {
            this.selectedCategory = null;
            const s = document.getElementById('search-input') as HTMLInputElement;
            if (s) s.value = '';
            this.renderPosts();
            this.renderCategories();
        });

        document.getElementById('nav-home')?.addEventListener('click', () => this.renderPosts());
        document.getElementById('btn-open-auth')?.addEventListener('click', () => {
            this.clearAuthError();
            (document.getElementById('auth-modal') as HTMLDialogElement).showModal();
        });
        document.getElementById('close-auth-modal')?.addEventListener('click', () =>
            (document.getElementById('auth-modal') as HTMLDialogElement).close());
        document.getElementById('btn-logout')?.addEventListener('click', () => this.logout());
        document.getElementById('nav-profile')?.addEventListener('click', () => this.openProfile());
        document.getElementById('close-profile-modal')?.addEventListener('click', () =>
            (document.getElementById('profile-modal') as HTMLDialogElement).close());
        document.getElementById('nav-admin')?.addEventListener('click', () => this.openAdminPanel());
        document.getElementById('close-admin-modal')?.addEventListener('click', () =>
            (document.getElementById('admin-modal') as HTMLDialogElement).close());
        document.getElementById('btn-open-create-post')?.addEventListener('click', () => {
            (document.getElementById('post-form') as HTMLFormElement).reset();
            (document.getElementById('edit-post-id') as HTMLInputElement).value = '';
            const t = document.getElementById('post-modal-title');
            if (t) t.textContent = 'Новый пост';
            this.clearImagePreview();
            (document.getElementById('post-modal') as HTMLDialogElement).showModal();
        });
        document.getElementById('close-post-modal')?.addEventListener('click', () =>
            (document.getElementById('post-modal') as HTMLDialogElement).close());
        document.getElementById('close-details-modal')?.addEventListener('click', () => {
            this.currentOpenedPostId = null;
            (document.getElementById('post-details-modal') as HTMLDialogElement).close();
        });
        document.getElementById('toggle-auth-mode')?.addEventListener('click', (e) => {
            e.preventDefault();
            this.isLoginMode = !this.isLoginMode;
            const t = document.getElementById('auth-modal-title');
            if (t) t.textContent = this.isLoginMode ? 'Вход В Сеть' : 'Регистрация в Сети';
            (e.target as HTMLElement).textContent = this.isLoginMode ? 'Регистрация' : 'Уже есть аккаунт? Войти';
            this.clearAuthError();
        });

        document.getElementById('auth-form')?.addEventListener('submit', (e) => this.handleAuthSubmit(e));
        document.getElementById('post-form')?.addEventListener('submit', (e) => this.handlePostSubmit(e));
        document.getElementById('comment-form')?.addEventListener('submit', (e) => this.handleCommentSubmit(e));
        document.getElementById('search-input')?.addEventListener('input', () => this.renderPosts());

        // Превью картинки при выборе файла
        document.getElementById('post-image')?.addEventListener('change', (e) => {
            const file = (e.target as HTMLInputElement).files?.[0];
            if (file) this.showImagePreview(file);
            else this.clearImagePreview();
        });
    }

    private showImagePreview(file: File) {
        const preview = document.getElementById('image-preview') as HTMLImageElement | null;
        const container = document.getElementById('image-preview-container');
        if (!preview || !container) return;
        preview.src = URL.createObjectURL(file);
        container.classList.remove('hidden-el');
    }

    private clearImagePreview() {
        const preview = document.getElementById('image-preview') as HTMLImageElement | null;
        const container = document.getElementById('image-preview-container');
        if (preview) preview.src = '';
        container?.classList.add('hidden-el');
    }

    private clearAuthError() {
        const err = document.getElementById('auth-error');
        if (err) { err.classList.add('hidden-el'); err.textContent = ''; }
    }

    // ─── АВТОРИЗАЦИЯ ─────────────────────────────────────────────────────────

    private async handleAuthSubmit(e: Event) {
        e.preventDefault();
        const username = (document.getElementById('auth-username') as HTMLInputElement).value.trim();
        const password = (document.getElementById('auth-password') as HTMLInputElement).value.trim();
        const err = document.getElementById('auth-error')!;

        if (!username || !password) {
            err.textContent = 'Введите логин и пароль';
            err.classList.remove('hidden-el');
            return;
        }

        try {
            if (this.isLoginMode) {
                const token = await api.loginUser({ login: username, password });
                if (!token) throw new Error('Токен не получен от сервера');

                const role: 'admin' | 'user' = username === 'admin' ? 'admin' : 'user';
                localStorage.setItem('current_login', username);
                localStorage.setItem('current_password', password);
                localStorage.setItem('current_role', role);

                const localUser = DB.users.find(u => u.username === username);
                await this.login({
                    id: localUser?.id ?? 1,
                    username,
                    role,
                    isBanned: false,
                    email: `${username}@mail.ru`,
                    bio: localUser?.bio ?? ''
                });
                (document.getElementById('auth-modal') as HTMLDialogElement).close();
            } else {
                await api.registerUser({
                    login: username,
                    password,
                    email: `${username}@mail.ru`,
                    bio: 'Новый пользователь'
                });
                if (!DB.users.find(u => u.username === username)) {
                    DB.users.push({ id: DB.users.length + 1, username, role: 'user', isBanned: false, email: `${username}@mail.ru`, bio: 'Новый пользователь' });
                }
                alert('✅ Регистрация успешна! Теперь войдите.');
                this.isLoginMode = true;
                const t = document.getElementById('auth-modal-title');
                if (t) t.textContent = 'Вход В Сеть';
                const tb = document.getElementById('toggle-auth-mode');
                if (tb) tb.textContent = 'Регистрация';
            }
        } catch (error: any) {
            err.textContent = error.message || 'Ошибка аутентификации';
            err.classList.remove('hidden-el');
        }
    }

    private async login(user: UserDTO) {
        this.currentUser = user;
        this.updateUIAuth();
        await this.loadPostsFromServer();
        await this.loadCategories();
        this.renderPosts();
        this.renderCategories();
        // Обновляем счётчик постов в профиле сразу после входа
        this.updateProfileStats();
    }

    private logout() {
        this.currentUser = null;
        this.categories = [];
        this.likedPostIds.clear();
        localStorage.removeItem('app_jwt_token');
        localStorage.removeItem('current_login');
        localStorage.removeItem('current_role');
        localStorage.removeItem('current_password');
        this.updateUIAuth();
        this.renderPosts();
        this.renderCategories();
    }

    private updateUIAuth() {
        const btnAuth       = document.getElementById('btn-open-auth');
        const userInfo      = document.getElementById('user-info');
        const navProfile    = document.getElementById('nav-profile-container') || document.getElementById('nav-profile');
        const navAdmin      = document.getElementById('nav-admin-container') || document.getElementById('nav-admin');
        const btnCreatePost = document.getElementById('btn-open-create-post');

        if (this.currentUser) {
            btnAuth?.classList.add('hidden-el');
            userInfo?.classList.remove('hidden-el');
            const u = document.getElementById('current-username');
            if (u) u.textContent = `Привет, ${this.currentUser.username}!`;
            navProfile?.classList.remove('hidden-el');
            btnCreatePost?.classList.remove('hidden-el');
            navAdmin?.classList.toggle('hidden-el', this.currentUser.role !== 'admin');
        } else {
            btnAuth?.classList.remove('hidden-el');
            userInfo?.classList.add('hidden-el');
            navProfile?.classList.add('hidden-el');
            navAdmin?.classList.add('hidden-el');
            btnCreatePost?.classList.add('hidden-el');
        }
    }

    /** Обновляет счётчик постов прямо в DOM профиля (без открытия модалки) */
    private updateProfileStats() {
        const s = document.getElementById('profile-stats');
        if (s && this.currentUser) {
            s.textContent = DB.posts.filter(p => p.authorLogin === this.currentUser!.username).length.toString();
        }
    }

    private openProfile() {
        if (!this.currentUser) return;
        const u = document.getElementById('profile-username');
        const r = document.getElementById('profile-role');
        const s = document.getElementById('profile-stats');
        if (u) u.textContent = this.currentUser.username;
        if (r) r.textContent = this.currentUser.role === 'admin' ? 'Администратор' : 'Пользователь';
        // Считаем актуально в момент открытия
        if (s) s.textContent = DB.posts.filter(p => p.authorLogin === this.currentUser!.username).length.toString();
        (document.getElementById('profile-modal') as HTMLDialogElement).showModal();
    }

    // ─── ADMIN ───────────────────────────────────────────────────────────────

    private openAdminPanel() {
        if (this.currentUser?.role !== 'admin') return;
        this.renderAdminUsers();
        this.renderAdminPosts();
        (document.getElementById('admin-modal') as HTMLDialogElement).showModal();
    }

    private renderAdminUsers() {
        const list = document.getElementById('users-list');
        if (!list) return;
        list.innerHTML = '';
        DB.users.forEach((user: UserDTO) => {
            const isSelf = user.username === this.currentUser?.username;
            const div = document.createElement('div');
            div.className = 'flex items-center justify-between p-3 border-2 border-black bg-[#222531]';
            div.innerHTML = `
                <section>
                    <span class="font-black text-sm ${user.isBanned ? 'text-red-400 line-through' : 'text-white'}">${user.username}</span>
                    <span class="ml-2 text-[10px] font-bold px-1.5 py-0.5 border border-black ${user.role === 'admin' ? 'bg-lime-400 text-black' : 'bg-[#333] text-gray-400'}">${user.role}</span>
                    ${user.isBanned ? `<span class="ml-2 text-[10px] font-bold text-red-400 uppercase">ЗАБАНЕН${user.banReason ? ': ' + user.banReason : ''}</span>` : ''}
                </section>
                ${!isSelf ? `
                <button class="btn-ban text-[11px] font-black px-2 py-1 border-2 border-black ${user.isBanned ? 'bg-lime-400 text-black' : 'bg-red-500 text-white'}" data-username="${user.username}">
                    ${user.isBanned ? 'РАЗБАНИТЬ' : 'ЗАБАНИТЬ'}
                </button>` : '<span class="text-[10px] text-gray-500 font-bold">ВЫ</span>'}
            `;
            list.appendChild(div);
        });
        list.querySelectorAll('.btn-ban').forEach(btn => {
            btn.addEventListener('click', (e) => {
                const username = (e.currentTarget as HTMLElement).dataset.username!;
                this.toggleBanUser(username);
            });
        });
    }

    private toggleBanUser(username: string) {
        const user = DB.users.find(u => u.username === username);
        if (!user) return;
        if (!user.isBanned) {
            const reason = prompt(`Причина блокировки "${username}":`);
            if (reason === null) return;
            user.isBanned = true;
            user.banReason = reason || 'Нарушение правил';
            // Вызов API бана
            const userId = user.id;
            api.banUser(userId, user.banReason).catch(err => console.warn('ban API:', err));
        } else {
            user.isBanned = false;
            user.banReason = undefined;
        }
        this.renderAdminUsers();
        this.renderAdminPosts();
    }

    private renderAdminPosts() {
        const list = document.getElementById('admin-posts-list');
        if (!list) return;
        list.innerHTML = '';
        if (DB.posts.length === 0) {
            list.innerHTML = '<p class="text-gray-500 text-xs font-bold uppercase text-center py-4">Постов нет</p>';
            return;
        }
        DB.posts.forEach((post: PostDTO) => {
            const div = document.createElement('div');
            div.className = 'p-3 border-2 border-black bg-[#222531] space-y-2';
            div.innerHTML = `
                <section class="flex items-start justify-between gap-2">
                    <section class="flex-1 min-w-0">
                        <p class="font-black text-sm text-white truncate">${post.title || '—'}</p>
                        <p class="text-[10px] text-gray-400 font-bold">Автор: <span class="text-lime-400">${post.authorLogin}</span> · 👍 ${post.likesCount ?? 0} · 💬 ${post.comments?.length ?? 0}</p>
                    </section>
                    <section class="flex gap-1.5 shrink-0">
                        <button class="btn-admin-edit text-[11px] font-black px-2 py-1 border-2 border-black bg-indigo-500 text-white" data-id="${post.id}">РЕД.</button>
                        <button class="btn-admin-delete text-[11px] font-black px-2 py-1 border-2 border-black bg-red-500 text-white" data-id="${post.id}">УДАЛИТЬ</button>
                    </section>
                </section>
            `;
            list.appendChild(div);
        });
        list.querySelectorAll('.btn-admin-delete').forEach(btn => {
            btn.addEventListener('click', async (e) => {
                const id = parseInt((e.currentTarget as HTMLElement).dataset.id!);
                if (!confirm('Удалить этот пост?')) return;
                try {
                    await api.deletePost(id);
                    this.markPostDeleted(id);
                    this.renderAdminPosts();
                    this.renderPosts();
                    this.updateProfileStats();
                } catch (err: any) { alert(`Ошибка: ${err.message}`); }
            });
        });
        list.querySelectorAll('.btn-admin-edit').forEach(btn => {
            btn.addEventListener('click', (e) => {
                const id = parseInt((e.currentTarget as HTMLElement).dataset.id!);
                const post = DB.posts.find(p => p.id === id);
                if (!post) return;
                (document.getElementById('admin-modal') as HTMLDialogElement).close();
                (document.getElementById('edit-post-id') as HTMLInputElement).value = id.toString();
                (document.getElementById('post-title') as HTMLInputElement).value = post.title || '';
                (document.getElementById('post-content') as HTMLTextAreaElement).value = post.content || '';
                const t = document.getElementById('post-modal-title');
                if (t) t.textContent = 'Редактировать пост';
                // Если у поста есть картинка — показываем превью
                if (post.imageUrl) {
                    const preview = document.getElementById('image-preview') as HTMLImageElement | null;
                    const container = document.getElementById('image-preview-container');
                    if (preview && container) {
                        preview.src = post.imageUrl;
                        container.classList.remove('hidden-el');
                    }
                } else {
                    this.clearImagePreview();
                }
                (document.getElementById('post-modal') as HTMLDialogElement).showModal();
            });
        });
    }

    // ─── ЛЕНТА ПОСТОВ ────────────────────────────────────────────────────────

    private renderPosts() {
        const searchInput = document.getElementById('search-input') as HTMLInputElement;
        const query = searchInput ? searchInput.value.toLowerCase().trim() : '';
        const feed = document.getElementById('posts-feed');
        if (!feed) return;
        const isAdmin = this.currentUser?.role === 'admin';
        feed.innerHTML = '';

        const filtered = DB.posts.filter((p: PostDTO) => {
            const matchSearch = p.title?.toLowerCase().includes(query) || p.content?.toLowerCase().includes(query);
            const matchCat    = this.selectedCategory
                ? p.categoryName?.toLowerCase() === this.selectedCategory.toLowerCase()
                : true;
            return matchSearch && matchCat;
        });

        if (filtered.length === 0) {
            feed.innerHTML = '<p class="text-gray-400 font-bold uppercase tracking-wider text-center py-12">Постов не обнаружено...</p>';
            return;
        }

        filtered.forEach((post: PostDTO) => {
            let highlightedTitle = post.title || '';
            if (query && highlightedTitle.toLowerCase().includes(query)) {
                const escaped = query.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
                highlightedTitle = highlightedTitle.replace(
                    new RegExp(`(${escaped})`, 'gi'),
                    `<mark class="bg-lime-400 text-black px-1">$1</mark>`
                );
            }

            const isLiked = this.likedPostIds.has(post.id);
            // Счётчик комментов: если сервер вернул массив — берём длину, иначе 0
            const commentsCount = Array.isArray(post.comments) ? post.comments.length : 0;

            const article = document.createElement('article');
            article.className = 'w-full bg-[#1a1c23] border-3 border-black text-white p-6 shadow-[6px_6px_0px_#000] hover:shadow-[8px_8px_0px_#bef264] transition-all duration-150 cursor-pointer group';
            article.dataset.postId = String(post.id);

            article.addEventListener('click', (e) => {
                if (!(e.target as HTMLElement).closest('button, .category-badge')) {
                    this.openPostDetails(post.id);
                }
            });

            const categoryBadgeHtml = post.categoryName ? `
                <section class="mb-4 flex flex-wrap gap-2">
                    <span class="category-badge text-[11px] px-2.5 py-1 font-bold border border-black cursor-pointer transition-colors ${
                        this.selectedCategory?.toLowerCase() === post.categoryName.toLowerCase()
                        ? 'bg-lime-400 text-black shadow-[2px_2px_0px_#000]'
                        : 'bg-[#222531] text-gray-300 hover:text-black hover:bg-lime-400'
                    }" data-category="${post.categoryName}">${post.categoryName}</span>
                </section>` : '';

            article.innerHTML = `
                <header class="flex justify-between items-start mb-3">
                    <section>
                        <h3 class="text-xl font-[950] uppercase text-white tracking-tight group-hover:text-lime-400 transition-colors">${highlightedTitle}</h3>
                        <span class="text-xs font-bold text-gray-400">Автор: <span class="text-lime-400">${post.authorLogin || 'Аноним'}</span></span>
                    </section>
                    ${isAdmin ? `
                        <section class="flex gap-2 shrink-0 ml-4">
                            <button class="text-indigo-400 hover:text-indigo-300 text-sm font-semibold p-1 btn-edit" data-id="${post.id}">Ред.</button>
                            <button class="text-red-500 hover:text-red-300 text-sm font-semibold p-1 btn-delete" data-id="${post.id}">Удалить</button>
                        </section>` : ''}
                </header>
                ${categoryBadgeHtml}
                <section class="mb-4"><p class="text-gray-300 line-clamp-3 leading-relaxed text-sm font-medium">${post.content || ''}</p></section>
                <footer class="flex items-center gap-4 border-t border-black pt-4">
                    <button class="btn-like flex items-center gap-2 py-1.5 px-3 border-2 border-black transition-all ${
                        isLiked ? 'bg-red-500/30 border-red-500 text-red-400' : 'bg-[#222531] text-gray-400 hover:bg-red-500/20'
                    }" data-id="${post.id}">
                        <svg class="w-5 h-5 ${isLiked ? 'fill-red-500 stroke-red-500' : 'fill-none stroke-current'}" stroke-width="2.5" viewBox="0 0 24 24">
                            <path stroke-linecap="round" stroke-linejoin="round" d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"/>
                        </svg>
                        <span class="font-black text-sm like-count">${post.likesCount ?? 0}</span>
                    </button>
                    <span class="text-xs text-gray-500 font-bold comment-count-badge" data-post-id="${post.id}">💬 ${commentsCount}</span>
                </footer>
            `;

            // Картинку вставляем через DOM (не через innerHTML) чтобы base64 не ломался
            if (post.imageUrl) {
                const img = document.createElement('img');
                img.src = post.imageUrl.startsWith('data:')
                    ? post.imageUrl
                    : 'http://localhost:8083' + post.imageUrl;
                img.alt = 'post image';
                img.className = 'w-full h-52 object-cover mb-4 border-2 border-black';
                // Вставляем картинку перед categoryBadgeHtml секцией или перед контентом
                const contentSection = article.querySelector('section.mb-4');
                if (contentSection) {
                    article.insertBefore(img, contentSection);
                } else {
                    article.appendChild(img);
                }
            }

            feed.appendChild(article);
        });

        // Лайки
        feed.querySelectorAll('.btn-like').forEach(btn =>
            btn.addEventListener('click', (e) => { e.stopPropagation(); this.toggleLike(e); }));

        // Удаление / редактирование (admin)
        if (isAdmin) {
            feed.querySelectorAll('.btn-delete').forEach(btn =>
                btn.addEventListener('click', (e) => { e.stopPropagation(); this.deletePost(e); }));
            feed.querySelectorAll('.btn-edit').forEach(btn =>
                btn.addEventListener('click', (e) => { e.stopPropagation(); this.openEditModal(e); }));
        }

        // Категории-бейджи
        feed.querySelectorAll('.category-badge').forEach(badge =>
            badge.addEventListener('click', (e) => {
                e.stopPropagation();
                const cat = (e.currentTarget as HTMLElement).dataset.category!;
                this.selectedCategory = this.selectedCategory?.toLowerCase() === cat.toLowerCase() ? null : cat;
                this.renderPosts();
                this.renderCategories();
            }));
    }

    private renderCategories() {
        const container = document.getElementById('quick-tags-container');
        if (!container) return;
        container.innerHTML = '';

        const localCats  = DB.posts.map(p => p.categoryName).filter((c): c is string => !!c);
        const serverCats = this.categories.map(c => c.name || c.title).filter(Boolean);
        const unique = [...new Set([...serverCats, ...localCats])];

        if (unique.length === 0) {
            container.innerHTML = '<span class="text-[10px] text-gray-500 font-bold uppercase">Войдите чтобы увидеть категории</span>';
            return;
        }
        unique.forEach((cat: string) => {
            const isSelected = this.selectedCategory?.toLowerCase() === cat.toLowerCase();
            const btn = document.createElement('button');
            btn.className = `text-[10px] font-black uppercase px-2 py-1 border transition-all ${
                isSelected ? 'bg-lime-400 text-black border-black shadow-[2px_2px_0px_#000]' : 'bg-[#1a1c23] text-gray-400 border-gray-800 hover:border-black hover:text-white'
            }`;
            btn.textContent = cat;
            btn.addEventListener('click', () => {
                this.selectedCategory = isSelected ? null : cat;
                this.renderPosts();
                this.renderCategories();
            });
            container.appendChild(btn);
        });
    }

    // ─── ЛАЙКИ ───────────────────────────────────────────────────────────────

    private async toggleLike(e: Event) {
        if (!this.currentUser) { alert('Войдите, чтобы ставить лайки!'); return; }
        const btn = e.currentTarget as HTMLElement;
        const postId = parseInt(btn.dataset.id!);
        const post = DB.posts.find(p => p.id === postId);
        if (!post) return;

        try {
            const result = await api.toggleLike(postId);
            const newCount = parseInt(result);
            post.likesCount = isNaN(newCount) ? (post.likesCount ?? 0) + 1 : newCount;

            if (this.likedPostIds.has(postId)) {
                this.likedPostIds.delete(postId);
            } else {
                this.likedPostIds.add(postId);
            }
            const isLiked = this.likedPostIds.has(postId);

            // Обновляем только кнопку — без перерендера страницы
            btn.setAttribute('class', `btn-like flex items-center gap-2 py-1.5 px-3 border-2 border-black transition-all ${
                isLiked ? 'bg-red-500/30 border-red-500 text-red-400' : 'bg-[#222531] text-gray-400 hover:bg-red-500/20'
            }`);
            const svg = btn.querySelector('svg');
            if (svg) svg.setAttribute('class', `w-5 h-5 ${isLiked ? 'fill-red-500 stroke-red-500' : 'fill-none stroke-current'}`);
            const countSpan = btn.querySelector('.like-count');
            if (countSpan) countSpan.textContent = String(post.likesCount);

            // Обновляем детали если пост открыт
            if (this.currentOpenedPostId === postId) this.openPostDetails(postId);
        } catch (err: any) {
            alert(`Не удалось поставить лайк: ${err.message}`);
        }
    }

    // ─── ДЕТАЛИ ПОСТА ────────────────────────────────────────────────────────

    private async openPostDetails(id: number) {
        this.currentOpenedPostId = id;
        let post: PostDTO | undefined = DB.posts.find(p => p.id === id);

        try {
            const fresh = await api.getPostById(id);
            if (fresh) {
                // Сохраняем imageUrl из кэша если сервер не вернул
                const cachedImage = post?.imageUrl ?? getImageForPost(id);
                const merged: PostDTO = {
                    ...fresh,
                    comments: fresh.comments ?? [],
                    imageUrl: fresh.imageUrl ?? cachedImage ?? null,
                };
                const idx = DB.posts.findIndex(p => p.id === id);
                if (idx !== -1) DB.posts[idx] = merged;
                post = merged;
                // Обновляем счётчик комментов в ленте сразу
                this.updateCommentCountBadge(id, merged.comments.length);
            }
        } catch { /* используем кэш */ }

        if (!post) return;

        const detailTitle   = document.getElementById('detail-title');
        const detailAuthor  = document.getElementById('detail-author');
        const detailContent = document.getElementById('detail-content');

        if (detailTitle) detailTitle.textContent   = post.title || '';
        if (detailAuthor) detailAuthor.textContent = `Автор: ${post.authorLogin || 'Аноним'}`;
        if (detailContent) detailContent.textContent = post.content || '';

        // Картинка в деталях — через DOM а не innerHTML чтобы base64 работал
        const detailImageContainer = document.getElementById('detail-image-container');
        let detailImage = document.getElementById('detail-image') as HTMLImageElement | null;

        if (detailImageContainer) {
            if (post.imageUrl) {
                if (!detailImage) {
                    detailImage = document.createElement('img');
                    detailImage.id = 'detail-image';
                    detailImage.className = 'w-full max-h-96 object-cover';
                    detailImage.alt = 'post image';
                    detailImageContainer.innerHTML = '';
                    detailImageContainer.appendChild(detailImage);
                }
                detailImage.src = post.imageUrl.startsWith('data:')
                    ? post.imageUrl
                    : 'http://localhost:8083' + post.imageUrl;
                detailImageContainer.classList.remove('hidden-el');
            } else {
                detailImageContainer.classList.add('hidden-el');
                if (detailImage) detailImage.src = '';
            }
        }

        const commForm = document.getElementById('comment-form');
        const commWarn = document.getElementById('comment-auth-warning');
        if (this.currentUser) {
            commForm?.classList.remove('hidden-el');
            commWarn?.classList.add('hidden-el');
        } else {
            commForm?.classList.add('hidden-el');
            commWarn?.classList.remove('hidden-el');
        }

        this.renderComments(id);
        (document.getElementById('post-details-modal') as HTMLDialogElement).showModal();
    }

    /** Обновить бейдж 💬 N в ленте без полного перерендера */
    private updateCommentCountBadge(postId: number, count: number) {
        const badge = document.querySelector(`.comment-count-badge[data-post-id="${postId}"]`);
        if (badge) badge.textContent = `💬 ${count}`;
    }

    private renderComments(postId: number) {
        const list = document.getElementById('comments-list');
        if (!list) return;
        list.innerHTML = '';

        const post = DB.posts.find(p => p.id === postId);
        const comments = post?.comments ?? [];
        const isAdmin = this.currentUser?.role === 'admin';

        if (comments.length === 0) {
            list.innerHTML = '<p class="text-gray-400 italic text-xs uppercase font-bold">Комментариев пока нет.</p>';
            return;
        }

        comments.forEach((c: CommentDTO) => {
            const sec = document.createElement('section');
            sec.className = 'bg-[#222531] p-4 border-2 border-black shadow-[2px_2px_0px_#000] flex justify-between items-start gap-2';
            sec.innerHTML = `
                <section class="flex-1 min-w-0">
                    <span class="font-black text-xs text-lime-400 block mb-1 uppercase">${c.authorLogin ?? 'Аноним'}:</span>
                    <span class="text-gray-200 text-sm">${c.content ?? ''}</span>
                </section>
                ${isAdmin ? `<button class="btn-delete-comment text-[10px] font-black px-2 py-1 border border-red-500 text-red-400 hover:bg-red-500 hover:text-white" data-id="${c.id}">✕</button>` : ''}
            `;
            list.appendChild(sec);
        });

        if (isAdmin) {
            list.querySelectorAll('.btn-delete-comment').forEach(btn => {
                btn.addEventListener('click', async (e) => {
                    const commentId = parseInt((e.currentTarget as HTMLElement).dataset.id!);
                    try {
                        await api.deleteComment(commentId);
                        const p = DB.posts.find(p => p.id === postId);
                        if (p) p.comments = p.comments.filter((c: CommentDTO) => c.id !== commentId);
                        this.renderComments(postId);
                        this.updateCommentCountBadge(postId, p?.comments.length ?? 0);
                    } catch (err: any) { alert(`Ошибка: ${err.message}`); }
                });
            });
        }
    }

    private async handleCommentSubmit(e: Event) {
        e.preventDefault();
        if (!this.currentUser || !this.currentOpenedPostId) return;

        const input = document.getElementById('comment-input') as HTMLInputElement;
        const text = input.value.trim();
        if (!text) return;

        try {
            const serverComment = await api.createComment({
                postId: this.currentOpenedPostId,
                content: text,
                authorId: this.currentUser.id
            });

            const post = DB.posts.find(p => p.id === this.currentOpenedPostId);
            if (post) {
                if (!post.comments) post.comments = [];
                post.comments.push(serverComment);
                // Обновляем счётчик в ленте без перерендера
                this.updateCommentCountBadge(this.currentOpenedPostId, post.comments.length);
            }

            input.value = '';
            // Только перерисовываем список комментов — никакого обновления страницы
            this.renderComments(this.currentOpenedPostId);
        } catch (err: any) {
            alert(`Ошибка отправки: ${err.message}`);
        }
    }

    // ─── CRUD ПОСТОВ ─────────────────────────────────────────────────────────

    private openEditModal(e: Event) {
        const id   = parseInt((e.currentTarget as HTMLElement).dataset.id!);
        const post = DB.posts.find(p => p.id === id);
        if (!post) return;
        (document.getElementById('edit-post-id') as HTMLInputElement).value    = id.toString();
        (document.getElementById('post-title') as HTMLInputElement).value      = post.title || '';
        (document.getElementById('post-content') as HTMLTextAreaElement).value = post.content || '';
        const t = document.getElementById('post-modal-title');
        if (t) t.textContent = 'Редактировать пост';
        // Показываем существующую картинку в превью
        if (post.imageUrl) {
            const preview = document.getElementById('image-preview') as HTMLImageElement | null;
            const container = document.getElementById('image-preview-container');
            if (preview && container) {
                preview.src = post.imageUrl;
                container.classList.remove('hidden-el');
            }
        } else {
            this.clearImagePreview();
        }
        (document.getElementById('post-modal') as HTMLDialogElement).showModal();
    }

    private markPostDeleted(id: number) {
        this.deletedPostIds.add(id);
        saveDeletedIds(this.deletedPostIds);
        DB.posts = DB.posts.filter(p => p.id !== id);
        removeImageForPost(id);
    }

    private async deletePost(e: Event) {
        const id = parseInt((e.currentTarget as HTMLElement).dataset.id!);
        if (!confirm('Удалить этот пост?')) return;
        try {
            await api.deletePost(id);
            this.markPostDeleted(id);
            this.renderPosts();
            this.updateProfileStats();
        } catch (err: any) { alert(`Ошибка: ${err.message}`); }
    }

    private async handlePostSubmit(e: Event) {
        e.preventDefault();
        if (!this.currentUser) return;

        const title     = (document.getElementById('post-title') as HTMLInputElement).value.trim();
        const content   = (document.getElementById('post-content') as HTMLTextAreaElement).value.trim();
        const editId    = (document.getElementById('edit-post-id') as HTMLInputElement).value;
        const imageFile = (document.getElementById('post-image') as HTMLInputElement).files?.[0];

        if (!title || !content) { alert('Заполните заголовок и текст'); return; }

        // Конвертируем картинку в base64 если выбрана
        let imageUrl: string | null = null;
        if (imageFile) {
            try { imageUrl = await api.fileToDataUrl(imageFile); }
            catch { imageUrl = null; }
        }

        try {
            if (editId) {
                // Редактирование
                const id   = parseInt(editId);
                const post = DB.posts.find(p => p.id === id);
                const updated = await api.updatePost(id, {
                    title,
                    content,
                    categoryid: String((post as any)?.categoryid ?? 1),
                    imageUrl
                });
                if (post) {
                    post.title   = updated.title   || title;
                    post.content = updated.content || content;
                    if (imageUrl) {
                        post.imageUrl = imageUrl;
                        saveImageForPost(id, imageUrl);
                    }
                }
            } else {
                // Создание — пост добавляем в НАЧАЛО (unshift)
                const newPost = await api.createPost({ title, content, categoryid: 1, imageUrl });

                // Убираем из deletedIds если вдруг совпал id
                if (this.deletedPostIds.has(newPost.id)) {
                    this.deletedPostIds.delete(newPost.id);
                    saveDeletedIds(this.deletedPostIds);
                }

                // Сохраняем картинку в localStorage чтобы не терялась при перезагрузке
                const finalImageUrl = imageUrl ?? newPost.imageUrl ?? null;
                if (finalImageUrl && newPost.id) {
                    saveImageForPost(newPost.id, finalImageUrl);
                }

                DB.posts.unshift({
                    ...newPost,
                    title:        newPost.title        ?? title,
                    content:      newPost.content      ?? content,
                    comments:     newPost.comments     ?? [],
                    likesCount:   newPost.likesCount   ?? 0,
                    authorLogin:  newPost.authorLogin  ?? this.currentUser!.username,
                    categoryName: newPost.categoryName ?? null,
                    imageUrl:     finalImageUrl,
                });
            }

            (document.getElementById('post-modal') as HTMLDialogElement).close();
            this.clearImagePreview();
            this.renderPosts();
            this.updateProfileStats(); // ← обновляем счётчик постов в профиле сразу
        } catch (err: any) {
            alert(`Ошибка сохранения: ${err.message}`);
        }
    }
}