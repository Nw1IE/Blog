import type { User } from '../types/types';
import { DB } from '../data/db';
import { logToServer } from '../api/api';

export class BlogApp {
    private currentUser: User | null = null;
    private isLoginMode = true;
    private currentOpenedPostId: number | null = null;

    constructor() {
        this.initEvents();
        this.renderPosts();
        logToServer('APP_STARTED', this.currentUser, 'Клиент запущен');
    }

    private initEvents() {
        document.getElementById('btn-open-auth')!.addEventListener('click', () => {
            this.clearAuthError();
            (document.getElementById('auth-modal') as HTMLDialogElement).showModal();
        });
        document.getElementById('close-auth-modal')!.addEventListener('click', () => (document.getElementById('auth-modal') as HTMLDialogElement).close());
        document.getElementById('btn-logout')!.addEventListener('click', () => this.logout());
        
        document.getElementById('nav-profile')!.addEventListener('click', () => this.openProfile());
        document.getElementById('close-profile-modal')!.addEventListener('click', () => (document.getElementById('profile-modal') as HTMLDialogElement).close());

        document.getElementById('nav-admin')!.addEventListener('click', () => this.openAdminPanel());
        document.getElementById('close-admin-modal')!.addEventListener('click', () => (document.getElementById('admin-modal') as HTMLDialogElement).close());

        document.getElementById('btn-open-create-post')!.addEventListener('click', () => {
            (document.getElementById('post-form') as HTMLFormElement).reset();
            (document.getElementById('edit-post-id') as HTMLInputElement).value = '';
            document.getElementById('post-modal-title')!.textContent = 'Новый пост';
            (document.getElementById('post-modal') as HTMLDialogElement).showModal();
        });
        document.getElementById('close-post-modal')!.addEventListener('click', () => (document.getElementById('post-modal') as HTMLDialogElement).close());
        
        document.getElementById('close-details-modal')!.addEventListener('click', () => {
            this.currentOpenedPostId = null;
            (document.getElementById('post-details-modal') as HTMLDialogElement).close();
        });

        document.getElementById('toggle-auth-mode')!.addEventListener('click', (e) => {
            e.preventDefault();
            this.isLoginMode = !this.isLoginMode;
            document.getElementById('auth-modal-title')!.textContent = this.isLoginMode ? 'Вход' : 'Регистрация';
            (e.target as HTMLElement).textContent = this.isLoginMode ? 'Нет аккаунта? Зарегистрироваться' : 'Уже есть аккаунт? Войти';
            this.clearAuthError();
        });

        document.getElementById('auth-form')!.addEventListener('submit', (e) => this.handleAuthSubmit(e));
        document.getElementById('post-form')!.addEventListener('submit', (e) => this.handlePostSubmit(e));
        document.getElementById('comment-form')!.addEventListener('submit', (e) => this.handleCommentSubmit(e));
        document.getElementById('search-input')!.addEventListener('input', () => this.renderPosts());
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

        if (this.isLoginMode) {
            const user = DB.users.find(u => u.username === username && u.password === password);
            if (user) {
                if (user.isBanned) {
                    err.textContent = `Аккаунт заблокирован. Причина: ${user.banReason}`;
                    err.classList.remove('hidden-el');
                    logToServer('LOGIN_FAILED_BANNED', this.currentUser, { username });
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
                return;
            }
            const newUser: User = { id: Date.now(), username, password, role: 'user', isBanned: false };
            DB.users.push(newUser);
            this.login(newUser);
            (document.getElementById('auth-modal') as HTMLDialogElement).close();
            logToServer('REGISTERED', this.currentUser, { username });
        }
    }

    private login(user: User) {
        this.currentUser = user;
        this.updateUIAuth();
        this.renderPosts();
        logToServer('LOGGED_IN', this.currentUser, { id: user.id });
    }

    private logout() {
        logToServer('LOGGED_OUT', this.currentUser, { id: this.currentUser?.id });
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
        logToServer('OPENED_PROFILE', this.currentUser, {});
        (document.getElementById('profile-modal') as HTMLDialogElement).showModal();
    }

private renderPosts() {
        const query = (document.getElementById('search-input') as HTMLInputElement).value.toLowerCase();
        const feed = document.getElementById('posts-feed')!;
        feed.innerHTML = '';

        const filtered = DB.posts.filter(p => 
            p.title.toLowerCase().includes(query) || p.content.toLowerCase().includes(query) || p.tags.some(t => t.toLowerCase().includes(query))
        );

        filtered.forEach(post => {
            const isAdmin = this.currentUser?.role === 'admin';
            const hasLiked = this.currentUser ? post.likedBy.includes(this.currentUser.id) : false;

            const article = document.createElement('article');
            article.className = 'post-card bg-white rounded-xl p-6 shadow-sm border border-slate-200 transition-shadow relative';
            
            article.addEventListener('click', (e) => {
                const target = e.target as HTMLElement;
                if (!target.closest('button')) this.openPostDetails(post.id);
            });

            article.innerHTML = `
                <header class="flex justify-between items-start mb-4">
                    <section>
                        <h3 class="text-xl font-bold text-slate-900 leading-tight">${post.title}</h3>
                        <span class="text-sm text-slate-500 font-medium">Автор: <span class="text-indigo-600">${post.authorName}</span></span>
                    </section>
                    ${isAdmin ? `
                        <section class="flex gap-2 shrink-0 ml-4">
                            <button class="text-indigo-500 hover:text-indigo-700 text-sm font-semibold p-1 btn-edit" data-id="${post.id}">Ред.</button>
                            <button class="text-red-500 hover:text-red-700 text-sm font-semibold p-1 btn-delete" data-id="${post.id}">Удалить</button>
                        </section>
                    ` : ''}
                </header>
                ${post.imageUrl ? `<section class="mb-4"><img src="${post.imageUrl}" class="w-full h-56 object-cover rounded-lg border border-slate-100"></section>` : ''}
                <section class="mb-4"><p class="text-slate-600 line-clamp-3 leading-relaxed">${post.content}</p></section>
                <section class="mb-5 flex flex-wrap gap-2">
                    ${post.tags.map(t => `<span class="bg-indigo-50 text-indigo-700 border border-indigo-100 text-xs px-2.5 py-1 rounded-md font-medium">#${t}</span>`).join('')}
                </section>
                <footer class="flex items-center gap-4 border-t border-slate-100 pt-4">
                    <button class="btn-like flex items-center gap-1.5 ${hasLiked ? 'text-red-500' : 'text-slate-400 hover:text-red-400'} transition-colors" data-id="${post.id}">
                        <svg class="w-6 h-6" fill="${hasLiked ? 'currentColor' : 'none'}" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"></path></svg>
                        <span class="font-bold text-sm">${post.likesCount}</span>
                    </button>
                </footer>
            `;
            feed.appendChild(article);
        });

        document.querySelectorAll('.btn-like').forEach(btn => btn.addEventListener('click', (e) => this.toggleLike(e)));
        document.querySelectorAll('.btn-delete').forEach(btn => btn.addEventListener('click', (e) => this.deletePost(e)));
        document.querySelectorAll('.btn-edit').forEach(btn => btn.addEventListener('click', (e) => this.openEditModal(e)));
    }

    private toggleLike(e: Event) {
        if (!this.currentUser) return alert('Войдите в аккаунт, чтобы ставить лайки!');
        const postId = parseInt((e.currentTarget as HTMLElement).dataset.id!);
        const post = DB.posts.find(p => p.id === postId);
        
        if (post) {
            const hasLiked = post.likedBy.includes(this.currentUser.id);
            if (hasLiked) {
                post.likedBy = post.likedBy.filter(id => id !== this.currentUser!.id);
                post.likesCount--;
                logToServer('POST_UNLIKED', this.currentUser, { postId });
            } else {
                post.likedBy.push(this.currentUser.id);
                post.likesCount++;
                logToServer('POST_LIKED', this.currentUser, { postId });
            }
            this.renderPosts();
            if (this.currentOpenedPostId === postId) this.openPostDetails(postId); 
        }
    }

    private openPostDetails(id: number) {
        this.currentOpenedPostId = id;
        const post = DB.posts.find(p => p.id === id);
        if (!post) return;

        logToServer('OPENED_POST', this.currentUser, { postId: id });

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
            list.innerHTML = '<p class="text-slate-400 italic text-sm">Здесь пока нет комментариев.</p>';
            return;
        }

        comments.forEach(c => {
            const sec = document.createElement('section');
            sec.className = 'bg-slate-50 p-4 rounded-xl border border-slate-100';
            sec.innerHTML = `<span class="font-bold text-sm text-indigo-600 block mb-1">${c.authorName}</span> <span class="text-slate-700">${c.content}</span>`;
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
        logToServer('COMMENT_ADDED', this.currentUser, { postId: this.currentOpenedPostId, length: text.length });
        
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
                logToServer('POST_EDITED', this.currentUser, { postId: post.id });
            }
        } else {
            DB.posts.unshift({
                id: Date.now(), title, content, tags, authorId: this.currentUser.id, authorName: this.currentUser.username, likesCount: 0, likedBy: [], imageUrl: imageUrl || undefined
            });
            logToServer('POST_CREATED', this.currentUser, { title });
        }

        (document.getElementById('post-modal') as HTMLDialogElement).close();
        this.renderPosts();
    }

    private openEditModal(e: Event) {
        const id = parseInt((e.currentTarget as HTMLElement).dataset.id!);
        const post = DB.posts.find(p => p.id === id);
        if (!post || this.currentUser?.role !== 'admin') return;

        (document.getElementById('edit-post-id') as HTMLInputElement).value = post.id.toString();
        (document.getElementById('post-title') as HTMLInputElement).value = post.title;
        (document.getElementById('post-tags') as HTMLInputElement).value = post.tags.join(', ');
        (document.getElementById('post-content') as HTMLTextAreaElement).value = post.content;
        (document.getElementById('post-image') as HTMLInputElement).value = '';
        
        document.getElementById('post-modal-title')!.textContent = 'Редактировать пост';
        (document.getElementById('post-modal') as HTMLDialogElement).showModal();
    }

    private deletePost(e: Event) {
        if (this.currentUser?.role !== 'admin') return;
        const id = parseInt((e.currentTarget as HTMLElement).dataset.id!);
        
        const reason = prompt('Укажите причину удаления поста:');
        if (reason !== null) {
            DB.posts = DB.posts.filter(p => p.id !== id);
            logToServer('POST_DELETED', this.currentUser, { postId: id, reason: reason || 'Без причины' });
            alert(`Пост удален. Причина: ${reason || 'Без причины'}`);
            this.renderPosts();
        }
    }

    private openAdminPanel() {
        if (this.currentUser?.role !== 'admin') return;
        logToServer('OPENED_ADMIN_PANEL', this.currentUser, {});
        
        const list = document.getElementById('users-list')!;
        list.innerHTML = '';

        DB.users.forEach(u => {
            if (u.role === 'admin') return;
            const sec = document.createElement('section');
            sec.className = 'flex justify-between items-center p-3 bg-white/50 rounded-lg border border-gray-200';
            sec.innerHTML = `
                <span class="font-bold">${u.username} ${u.isBanned ? '<span class="text-red-500 text-sm">(Забанен)</span>' : ''}</span>
                <button class="btn-ban py-1 px-3 ${u.isBanned ? 'bg-gray-400' : 'bg-red-500 hover:bg-red-600'} text-white rounded font-bold" data-id="${u.id}" ${u.isBanned ? 'disabled' : ''}>
                    ${u.isBanned ? 'Забанен' : 'Забанить'}
                </button>
            `;
            list.appendChild(sec);
        });

        document.querySelectorAll('.btn-ban').forEach(btn => {
            btn.addEventListener('click', (e) => {
                const id = parseInt((e.currentTarget as HTMLElement).dataset.id!);
                const reason = prompt('Укажите причину бана:');
                if (reason !== null) {
                    const u = DB.users.find(user => user.id === id);
                    if (u) {
                        u.isBanned = true;
                        u.banReason = reason || 'Нарушение правил';
                        logToServer('USER_BANNED', this.currentUser, { bannedId: u.id, reason: u.banReason });
                        this.openAdminPanel();
                    }
                }
            });
        });

        (document.getElementById('admin-modal') as HTMLDialogElement).showModal();
    }
}