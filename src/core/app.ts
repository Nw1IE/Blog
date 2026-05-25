import type { User, Post } from '../types/types';
import { DB } from '../data/db';
import { logToServer } from '../api/api';

export class BlogApp {
    private currentUser: User | null = null;
    private isLoginMode = true;
    private currentOpenedPostId: number | null = null;
    private selectedTag: string | null = null;

    constructor() {
        this.initEvents();
        this.renderPosts();
        this.renderQuickTags();
        logToServer('APP_STARTED', this.currentUser, 'Клиент успешно запущен и подключен к серверу');
    }

    private initEvents() {
        document.querySelector('h1')?.addEventListener('click', () => {
            logToServer('NAV_CLICK', this.currentUser, 'Клик по логотипу Блог Геймера (Сброс фильтров)');
            this.selectedTag = null;
            (document.getElementById('search-input') as HTMLInputElement).value = '';
            this.renderPosts();
            this.renderQuickTags();
        });

        document.getElementById('nav-home')!.addEventListener('click', () => {
            logToServer('NAV_CLICK', this.currentUser, 'Переход на вкладку Лента Активности');
            this.renderPosts();
        });

        document.getElementById('btn-open-auth')!.addEventListener('click', () => {
            logToServer('MODAL_OPEN', this.currentUser, 'Открытие модального окна авторизации');
            this.clearAuthError();
            (document.getElementById('auth-modal') as HTMLDialogElement).showModal();
        });

        document.getElementById('close-auth-modal')!.addEventListener('click', () => {
            logToServer('MODAL_CLOSE', this.currentUser, 'Закрытие модального окна авторизации');
            (document.getElementById('auth-modal') as HTMLDialogElement).close();
        });

        document.getElementById('btn-logout')!.addEventListener('click', () => this.logout());
        
        document.getElementById('nav-profile')!.addEventListener('click', () => this.openProfile());
        document.getElementById('close-profile-modal')!.addEventListener('click', () => {
            logToServer('MODAL_CLOSE', this.currentUser, 'Закрытие модального окна профиля');
            (document.getElementById('profile-modal') as HTMLDialogElement).close();
        });

        document.getElementById('nav-admin')!.addEventListener('click', () => this.openAdminPanel());
        document.getElementById('close-admin-modal')!.addEventListener('click', () => {
            logToServer('MODAL_CLOSE', this.currentUser, 'Закрытие модального окна админ-панели');
            (document.getElementById('admin-modal') as HTMLDialogElement).close();
        });

        document.getElementById('btn-open-create-post')!.addEventListener('click', () => {
            logToServer('MODAL_OPEN', this.currentUser, 'Открытие окна создания нового поста');
            (document.getElementById('post-form') as HTMLFormElement).reset();
            (document.getElementById('edit-post-id') as HTMLInputElement).value = '';
            document.getElementById('post-modal-title')!.textContent = 'Новый пост';
            (document.getElementById('post-modal') as HTMLDialogElement).showModal();
        });

        document.getElementById('close-post-modal')!.addEventListener('click', () => {
            logToServer('MODAL_CLOSE', this.currentUser, 'Закрытие модального окна создания поста');
            (document.getElementById('post-modal') as HTMLDialogElement).close();
        });
        
        document.getElementById('close-details-modal')!.addEventListener('click', () => {
            logToServer('MODAL_CLOSE', this.currentUser, `Закрытие просмотра поста ID: ${this.currentOpenedPostId}`);
            this.currentOpenedPostId = null;
            (document.getElementById('post-details-modal') as HTMLDialogElement).close();
        });

        document.getElementById('toggle-auth-mode')!.addEventListener('click', (e) => {
            e.preventDefault();
            this.isLoginMode = !this.isLoginMode;
            logToServer('AUTH_MODE_TOGGLE', this.currentUser, `Переключение режима авторизации на: ${this.isLoginMode ? 'ВХОД' : 'РЕГИСТРАЦИЯ'}`);
            document.getElementById('auth-modal-title')!.textContent = this.isLoginMode ? 'Вход В Сеть' : 'Регистрация в Сети';
            (e.target as HTMLElement).textContent = this.isLoginMode ? 'Регистрация' : 'Уже есть аккаунт? Войти';
            this.clearAuthError();
        });

        document.getElementById('auth-form')!.addEventListener('submit', (e) => this.handleAuthSubmit(e));
        document.getElementById('post-form')!.addEventListener('submit', (e) => this.handlePostSubmit(e));
        document.getElementById('comment-form')!.addEventListener('submit', (e) => this.handleCommentSubmit(e));
        
        document.getElementById('search-input')!.addEventListener('input', (e) => {
            const val = (e.target as HTMLInputElement).value;
            logToServer('SEARCH_INPUT', this.currentUser, { textQuery: val });
            this.renderPosts();
        });
    }

    private clearAuthError() {
        const err = document.getElementById('auth-error')!;
        err.classList.add('hidden-el');
        err.textContent = '';
    }

    private handleAuthSubmit(e: Event) {
        e.preventDefault();
        const username = (document.getElementById('auth-username') as HTMLInputElement).value.trim();
        const password = (document.getElementById('auth-password') as HTMLInputElement).value.trim();
        const err = document.getElementById('auth-error')!;

        logToServer('AUTH_SUBMIT_ATTEMPT', this.currentUser, { username, mode: this.isLoginMode ? 'login' : 'register' });

        if (this.isLoginMode) {
            const user = DB.users.find(u => u.username === username && u.password === password);
            if (user) {
                if (user.isBanned) {
                    err.textContent = `Аккаунт заблокирован. Причина: ${user.banReason}`;
                    err.classList.remove('hidden-el');
                    logToServer('LOGIN_FAILED_BANNED', this.currentUser, { username, reason: user.banReason });
                    return;
                }
                this.login(user);
                (document.getElementById('auth-modal') as HTMLDialogElement).close();
            } else {
                err.textContent = 'Неверный логин или пароль!';
                err.classList.remove('hidden-el');
                logToServer('LOGIN_FAILED_CREDENTIALS', this.currentUser, { username });
            }
        } else {
            if (DB.users.find(u => u.username === username)) {
                err.textContent = 'Логин уже занят!';
                err.classList.remove('hidden-el');
                logToServer('REGISTER_FAILED_TAKEN', this.currentUser, { username });
                return;
            }
            const newUser: User = { id: Date.now(), username, password, role: 'user', isBanned: false };
            DB.users.push(newUser);
            logToServer('REGISTER_SUCCESS', newUser, { username });
            this.login(newUser);
            (document.getElementById('auth-modal') as HTMLDialogElement).close();
        }
    }

    private login(user: User) {
        this.currentUser = user;
        this.updateUIAuth();
        this.renderPosts();
        logToServer('LOGGED_IN', this.currentUser, { status: 'success', session_id: Date.now() });
    }

    private logout() {
        logToServer('LOGGED_OUT', this.currentUser, 'Пользователь вышел из аккаунта');
        this.currentUser = null;
        this.updateUIAuth();
        this.renderPosts();
    }

    private updateUIAuth() {
        const btnAuth = document.getElementById('btn-open-auth')!;
        const userInfo = document.getElementById('user-info')!;
        const navProfile = document.getElementById('nav-profile-container')!;
        const navAdmin = document.getElementById('nav-admin-container')!;
        const btnCreatePost = document.getElementById('btn-open-create-post')!;

        if (this.currentUser) {
            btnAuth.classList.add('hidden-el');
            userInfo.classList.remove('hidden-el');
            document.getElementById('current-username')!.textContent = `Привет, ${this.currentUser.username}!`;
            navProfile.classList.remove('hidden-el');
            btnCreatePost.classList.remove('hidden-el');
            
            if (this.currentUser.role === 'admin') navAdmin.classList.remove('hidden-el');
            else navAdmin.classList.add('hidden-el');
        } else {
            btnAuth.classList.remove('hidden-el');
            userInfo.classList.add('hidden-el');
            navProfile.classList.add('hidden-el');
            navAdmin.classList.add('hidden-el');
            btnCreatePost.classList.add('hidden-el');
        }
    }

    private openProfile() {
        if (!this.currentUser) return;
        document.getElementById('profile-username')!.textContent = this.currentUser.username;
        document.getElementById('profile-role')!.textContent = this.currentUser.role === 'admin' ? 'Администратор' : 'Пользователь';
        const postsCount = DB.posts.filter(p => p.authorId === this.currentUser!.id).length;
        document.getElementById('profile-stats')!.textContent = postsCount.toString();
        
        logToServer('OPENED_PROFILE', this.currentUser, { authoredPostsCount: postsCount });
        (document.getElementById('profile-modal') as HTMLDialogElement).showModal();
    }

    private renderPosts() {
        const query = (document.getElementById('search-input') as HTMLInputElement).value.toLowerCase().trim();
        const feed = document.getElementById('posts-feed')!;
        feed.innerHTML = '';

        const filtered = DB.posts.filter(p => {
            const matchesSearch = p.title.toLowerCase().includes(query) || p.content.toLowerCase().includes(query);
            const matchesTag = this.selectedTag ? p.tags.some(t => t.toLowerCase() === this.selectedTag!.toLowerCase()) : true;
            return matchesSearch && matchesTag;
        });

        if (filtered.length === 0) {
            feed.innerHTML = '<p class="text-gray-400 font-bold uppercase tracking-wider text-center py-12">Постов не обнаружено...</p>';
            return;
        }

        filtered.forEach(post => {
            const hasLiked = this.currentUser ? post.likedBy.includes(this.currentUser.id) : false;

            let highlightedTitle = post.title;
            if (query && post.title.toLowerCase().includes(query)) {
                const regex = new RegExp(`(${query})`, 'gi');
                highlightedTitle = post.title.replace(regex, `<mark class="bg-lime-400 text-black px-1 py-0.5 border border-black font-[950] shadow-[2px_2px_0px_#000]">$1</mark>`);
            }

            const article = document.createElement('article');
            article.className = 'w-full bg-[#1a1c23] border-3 border-black text-white p-6 shadow-[6px_6px_0px_#000] hover:shadow-[8px_8px_0px_#bef264] transition-all duration-150 relative cursor-pointer group';
            
            article.addEventListener('click', (e) => {
                const target = e.target as HTMLElement;
                if (!target.closest('button') && !target.closest('.tag-badge')) {
                    logToServer('POST_CARD_CLICK', this.currentUser, { postId: post.id, title: post.title });
                    this.openPostDetails(post.id);
                }
            });

            article.innerHTML = `
                <header class="flex justify-between items-start mb-4">
                    <section>
                        <h3 class="text-2xl font-[950] uppercase text-white tracking-tight group-hover:text-lime-400 transition-colors">${highlightedTitle}</h3>
                        <span class="text-xs font-bold text-gray-400">Автор: <span class="text-lime-400">${post.authorName}</span></span>
                    </section>
                </header>
                ${post.imageUrl ? `<section class="mb-4 w-full h-64 overflow-hidden border-2 border-black"><img src="${post.imageUrl}" class="w-full h-full object-cover"></section>` : ''}
                <section class="mb-4"><p class="text-gray-300 line-clamp-3 leading-relaxed text-sm font-medium">${post.content}</p></section>
                <section class="mb-5 flex flex-wrap gap-2">
                    ${post.tags.map(t => {
                        const isCurrent = this.selectedTag?.toLowerCase() === t.toLowerCase();
                        return `<span class="tag-badge text-[11px] px-2.5 py-1 font-bold border border-black cursor-pointer transition-colors ${
                            isCurrent 
                            ? 'bg-lime-400 text-black shadow-[2px_2px_0px_#000]' 
                            : 'bg-[#222531] text-gray-300 hover:text-black hover:bg-lime-400'
                        }" data-tag="${t}">#${t}</span>`;
                    }).join('')}
                </section>
                <footer class="flex items-center gap-4 border-t border-black pt-4">
                    <button class="btn-like flex items-center gap-2 py-1.5 px-3 border-2 border-black bg-[#222531] text-white hover:bg-red-500/20 transition-all ${hasLiked ? '!bg-red-600/20 !text-red-400' : 'text-gray-400'}" data-id="${post.id}">
                        <svg class="w-5 h-5 ${hasLiked ? 'fill-current text-red-500' : 'none'}" stroke="currentColor" stroke-width="2.5" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"></path></svg>
                        <span class="font-black text-sm">${post.likesCount}</span>
                    </button>
                </footer>
            `;
            feed.appendChild(article);
        });

        feed.querySelectorAll('.btn-like').forEach(btn => btn.addEventListener('click', (e) => {
            e.stopPropagation();
            this.toggleLike(e);
        }));

        feed.querySelectorAll('.tag-badge').forEach(badge => badge.addEventListener('click', (e) => {
            e.stopPropagation();
            const clickedTag = (e.currentTarget as HTMLElement).dataset.tag!;
            
            if (this.selectedTag?.toLowerCase() === clickedTag.toLowerCase()) {
                this.selectedTag = null;
                logToServer('TAG_FILTER_TOGGLE', this.currentUser, { action: 'disabled_filter', tag: clickedTag });
            } else {
                this.selectedTag = clickedTag;
                logToServer('TAG_FILTER_TOGGLE', this.currentUser, { action: 'enabled_filter', tag: clickedTag });
            }
            
            this.renderPosts();
            this.renderQuickTags();
        }));
    }

    private renderQuickTags() {
        const container = document.getElementById('quick-tags-container');
        if (!container) return;
        container.innerHTML = '';

        const allTags = DB.posts.flatMap(post => post.tags);
        const uniqueTags = [...new Set(allTags)];

        if (uniqueTags.length === 0) {
            container.innerHTML = '<span class="text-[10px] text-gray-500 font-bold uppercase">Тегов нет</span>';
            return;
        }

        uniqueTags.forEach(tag => {
            const isSelected = this.selectedTag?.toLowerCase() === tag.toLowerCase();
            const btn = document.createElement('button');
            
            btn.className = `text-[10px] font-black uppercase px-2 py-1 border transition-all duration-100 ${
                isSelected 
                ? 'bg-lime-400 text-black border-black shadow-[2px_2px_0px_#000]' 
                : 'bg-[#1a1c23] text-gray-400 border-gray-800 hover:border-black hover:text-white'
            }`;
            btn.textContent = `#${tag}`;
            
            btn.addEventListener('click', () => {
                if (isSelected) {
                    this.selectedTag = null;
                    logToServer('QUICK_TAG_CLICK', this.currentUser, { action: 'clear', tag: tag });
                } else {
                    this.selectedTag = tag;
                    logToServer('QUICK_TAG_CLICK', this.currentUser, { action: 'filter', tag: tag });
                }
                
                this.renderPosts();
                this.renderQuickTags();
            });

            container.appendChild(btn);
        });
    }

    private toggleLike(e: Event) {
        if (!this.currentUser) {
            logToServer('LIKE_DENIED', this.currentUser, 'Попытка поставить лайк без авторизации');
            return alert('Войдите в сеть, чтобы ставить лайки!');
        }
        const postId = parseInt((e.currentTarget as HTMLElement).dataset.id!);
        const post = DB.posts.find(p => p.id === postId);
        
        if (post) {
            const hasLiked = post.likedBy.includes(this.currentUser.id);
            if (hasLiked) {
                post.likedBy = post.likedBy.filter(id => id !== this.currentUser!.id);
                post.likesCount--;
                logToServer('POST_UNLIKED', this.currentUser, { postId, newLikesCount: post.likesCount });
            } else {
                post.likedBy.push(this.currentUser.id);
                post.likesCount++;
                logToServer('POST_LIKED', this.currentUser, { postId, newLikesCount: post.likesCount });
            }
            this.renderPosts();
            if (this.currentOpenedPostId === postId) this.openPostDetails(postId); 
        }
    }

    private openPostDetails(id: number) {
        this.currentOpenedPostId = id;
        const post = DB.posts.find(p => p.id === id);
        if (!post) return;

        logToServer('POST_DETAILS_OPEN', this.currentUser, { postId: id, title: post.title });

        document.getElementById('detail-title')!.textContent = post.title;
        document.getElementById('detail-author')!.textContent = `Автор: ${post.authorName}`;
        document.getElementById('detail-content')!.textContent = post.content;
        
        const imgEl = document.getElementById('detail-image') as HTMLImageElement;
        if (post.imageUrl) {
            imgEl.src = post.imageUrl;
            imgEl.classList.remove('hidden-el');
        } else {
            imgEl.classList.add('hidden-el');
            imgEl.src = '';
        }

        const commForm = document.getElementById('comment-form')!;
        const commWarn = document.getElementById('comment-auth-warning')!;
        
        if (this.currentUser) {
            commForm.classList.remove('hidden-el');
            commWarn.classList.add('hidden-el');
        } else {
            commForm.classList.add('hidden-el');
            commWarn.classList.remove('hidden-el');
        }

        this.renderComments(id);
        (document.getElementById('post-details-modal') as HTMLDialogElement).showModal();
    }

    private renderComments(postId: number) {
        const list = document.getElementById('comments-list')!;
        list.innerHTML = '';
        const comments = DB.comments.filter(c => c.postId === postId);

        if (comments.length === 0) {
            list.innerHTML = '<p class="text-gray-400 italic text-xs uppercase font-bold">Здесь пока нет комментариев.</p>';
            return;
        }

        comments.forEach(c => {
            const sec = document.createElement('section');
            sec.className = 'bg-[#222531] p-4 border-2 border-black shadow-[2px_2px_0px_#000]';
            sec.innerHTML = `<span class="font-black text-xs text-lime-400 block mb-1 uppercase tracking-tight">${c.authorName}:</span> <span class="text-gray-200 text-sm font-medium">${c.content}</span>`;
            list.appendChild(sec);
        });
    }

    private handleCommentSubmit(e: Event) {
        e.preventDefault();
        if (!this.currentUser || !this.currentOpenedPostId) return;

        const input = document.getElementById('comment-input') as HTMLInputElement;
        const text = input.value.trim();
        if (!text) return;

        DB.comments.push({ id: Date.now(), postId: this.currentOpenedPostId, authorName: this.currentUser.username, content: text });
        logToServer('COMMENT_ADDED', this.currentUser, { postId: this.currentOpenedPostId, textSnippet: text.substring(0, 30) });
        
        input.value = '';
        this.renderComments(this.currentOpenedPostId);
    }

    private toBase64(file: File): Promise<string> {
        return new Promise((resolve, reject) => {
            const reader = new FileReader();
            reader.readAsDataURL(file);
            reader.onload = () => resolve(reader.result as string);
            reader.onerror = error => reject(error);
        });
    }

    private async handlePostSubmit(e: Event) {
        e.preventDefault();
        if (!this.currentUser) return;

        const title = (document.getElementById('post-title') as HTMLInputElement).value;
        const tags = (document.getElementById('post-tags') as HTMLInputElement).value.split(',').map(t => t.trim()).filter(t => t);
        const content = (document.getElementById('post-content') as HTMLTextAreaElement).value;
        const editId = (document.getElementById('edit-post-id') as HTMLInputElement).value;
        const imageInput = document.getElementById('post-image') as HTMLInputElement;

        let imageUrl = '';
        if (imageInput.files && imageInput.files.length > 0) {
            imageUrl = await this.toBase64(imageInput.files[0]);
        }

        if (editId) {
            const post = DB.posts.find(p => p.id === parseInt(editId));
            if (post && this.currentUser.role === 'admin') {
                post.title = title;
                post.tags = tags;
                post.content = content;
                if (imageUrl) post.imageUrl = imageUrl;
                logToServer('POST_EDIT_CONFIRMED', this.currentUser, { postId: post.id, title });
            }
        } else {
            const newPostId = Date.now();
            DB.posts.unshift({
                id: newPostId, title, content, tags, authorId: this.currentUser.id, authorName: this.currentUser.username, likesCount: 0, likedBy: [], imageUrl: imageUrl || undefined
            });
            logToServer('POST_CREATE_SUCCESS', this.currentUser, { id: newPostId, title, tags });
        }

        (document.getElementById('post-modal') as HTMLDialogElement).close();
        this.renderPosts();
        this.renderQuickTags();
        
        if ((document.getElementById('admin-modal') as HTMLDialogElement).open) {
            this.openAdminPanel();
        }
    }

    private openAdminPanel() {
        if (this.currentUser?.role !== 'admin') return;
        logToServer('ADMIN_PANEL_OPEN', this.currentUser, 'Вход в панель администратора');
        
        const usersList = document.getElementById('users-list')!;
        usersList.innerHTML = '';

        DB.users.forEach(u => {
            if (u.role === 'admin') return;
            const sec = document.createElement('section');
            sec.className = 'flex justify-between items-center p-3 bg-[#222531] border-2 border-black shadow-[2px_2px_0px_#000]';
            sec.innerHTML = `
                <span class="font-bold text-sm truncate ${u.isBanned ? 'line-through text-gray-500' : 'text-white'}">
                    ${u.username} ${u.isBanned ? '<span class="text-red-500 font-black text-xs"> (BAN)</span>' : ''}
                </span>
                <button class="btn-toggle-ban px-3 py-1 text-xs font-black uppercase border border-black transition-colors ${u.isBanned ? 'bg-green-600 hover:bg-green-700 text-white' : 'bg-red-600 hover:bg-red-700 text-white'}" data-id="${u.id}" data-banned="${u.isBanned}">
                    ${u.isBanned ? 'Разбанить' : 'Бан'}
                </button>
            `;
            usersList.appendChild(sec);
        });

        document.querySelectorAll('.btn-toggle-ban').forEach(btn => {
            btn.addEventListener('click', (e) => {
                const id = parseInt((e.currentTarget as HTMLElement).dataset.id!);
                const isBanned = (e.currentTarget as HTMLElement).dataset.banned === 'true';
                const u = DB.users.find(user => user.id === id);
                
                if (u) {
                    if (isBanned) {
                        u.isBanned = false;
                        delete u.banReason;
                        logToServer('ADMIN_USER_UNBAN', this.currentUser, { targetUserId: u.id, targetUsername: u.username });
                        this.openAdminPanel();
                    } else {
                        const reason = prompt('Укажите причину бана:');
                        if (reason !== null) {
                            u.isBanned = true;
                            u.banReason = reason || 'Нарушение правил';
                            logToServer('ADMIN_USER_BAN', this.currentUser, { targetUserId: u.id, targetUsername: u.username, reason: u.banReason });
                            this.openAdminPanel();
                        }
                    }
                }
            });
        });

        const postsList = document.getElementById('admin-posts-list')!;
        postsList.innerHTML = '';

        if (DB.posts.length === 0) {
            postsList.innerHTML = '<p class="text-gray-500 text-xs uppercase font-bold text-center py-4">Постов нет.</p>';
        } else {
            DB.posts.forEach(post => {
                const div = document.createElement('div');
                div.className = 'flex items-center justify-between p-3 bg-[#222531] border-2 border-black shadow-[2px_2px_0px_#000] gap-2';
                div.innerHTML = `
                    <div class="flex flex-col min-w-0 flex-1">
                        <span class="font-black text-sm truncate uppercase text-white">${post.title}</span>
                        <span class="text-[10px] text-gray-400">Автор: ${post.authorName}</span>
                    </div>
                    <div class="flex gap-1.5 flex-shrink-0">
                        <button class="btn-admin-edit px-2 py-1 bg-lime-400 text-black hover:bg-white text-[11px] font-black uppercase border border-black transition-colors" data-id="${post.id}">
                            Изменить
                        </button>
                        <button class="btn-admin-delete px-2 py-1 bg-red-600 hover:bg-red-700 text-white text-[11px] font-black uppercase border border-black transition-colors" data-id="${post.id}">
                            Удалить
                        </button>
                    </div>
                `;
                postsList.appendChild(div);
            });
        }

        document.querySelectorAll('.btn-admin-edit').forEach(btn => {
            btn.addEventListener('click', (e) => {
                this.openEditModalFromAdmin(e);
            });
        });

        document.querySelectorAll('.btn-admin-delete').forEach(btn => {
            btn.addEventListener('click', (e) => {
                this.deletePostFromAdmin(e);
            });
        });

        (document.getElementById('admin-modal') as HTMLDialogElement).showModal();
    }

    private openEditModalFromAdmin(e: Event) {
        const id = parseInt((e.currentTarget as HTMLElement).dataset.id!);
        const post = DB.posts.find(p => p.id === id);
        if (!post || this.currentUser?.role !== 'admin') return;

        logToServer('ADMIN_EDIT_POST_INIT', this.currentUser, { postId: id, title: post.title });

        (document.getElementById('edit-post-id') as HTMLInputElement).value = post.id.toString();
        (document.getElementById('post-title') as HTMLInputElement).value = post.title;
        (document.getElementById('post-tags') as HTMLInputElement).value = post.tags.join(', ');
        (document.getElementById('post-content') as HTMLTextAreaElement).value = post.content;
        (document.getElementById('post-image') as HTMLInputElement).value = '';
        
        document.getElementById('post-modal-title')!.textContent = 'Редактировать пост';
        (document.getElementById('post-modal') as HTMLDialogElement).showModal();
    }

    private deletePostFromAdmin(e: Event) {
        if (this.currentUser?.role !== 'admin') return;
        const id = parseInt((e.currentTarget as HTMLElement).dataset.id!);
        
        const reason = prompt('Укажите причину удаления поста:');
        if (reason !== null) {
            DB.posts = DB.posts.filter(p => p.id !== id);
            logToServer('ADMIN_POST_DELETE', this.currentUser, { postId: id, reason: reason || 'Без причины' });
            alert(`Пост удален. Причина: ${reason || 'Без причины'}`);
            this.renderPosts();
            this.renderQuickTags();
            this.openAdminPanel();
        }
    }
}