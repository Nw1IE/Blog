export const getAppTemplate = (): string => `
    <aside class="w-72 flex-shrink-0 bg-white border-r border-slate-200 h-full flex flex-col justify-between shadow-sm z-20">
        <section class="p-6">
            <header class="mb-10">
                <h1 class="text-3xl font-extrabold text-indigo-600 tracking-tight">TechBlog</h1>
            </header>
            <nav>
                <ul class="space-y-2">
                    <li><button id="nav-home" class="w-full text-left px-4 py-2 rounded-lg text-slate-600 hover:bg-indigo-50 hover:text-indigo-600 font-medium transition-colors">Лента постов</button></li>
                    <li id="nav-profile-container" class="hidden-el"><button id="nav-profile" class="w-full text-left px-4 py-2 rounded-lg text-slate-600 hover:bg-indigo-50 hover:text-indigo-600 font-medium transition-colors">Мой профиль</button></li>
                    <li id="nav-admin-container" class="hidden-el"><button id="nav-admin" class="w-full text-left px-4 py-2 rounded-lg text-red-500 hover:bg-red-50 hover:text-red-600 font-medium transition-colors">Админ-панель</button></li>
                </ul>
            </nav>
        </section>
        
        <section id="auth-section" class="p-6 border-t border-slate-100">
            <button id="btn-open-auth" class="w-full py-2.5 px-4 bg-indigo-600 text-white rounded-lg font-medium shadow hover:bg-indigo-700 transition-colors">
                Войти / Создать
            </button>
            <section id="user-info" class="hidden-el flex flex-col gap-3">
                <span id="current-username" class="font-bold text-center text-slate-800"></span>
                <button id="btn-logout" class="w-full py-2 px-4 bg-slate-100 text-slate-700 rounded-lg font-medium hover:bg-slate-200 transition-colors">
                    Выйти
                </button>
            </section>
        </section>
    </aside>

    <main class="flex-1 h-full flex flex-col relative min-w-0">
        <header class="h-16 bg-white border-b border-slate-200 flex items-center justify-between px-8 z-10 flex-shrink-0">
            <form id="search-form" class="w-full max-w-md relative" onsubmit="event.preventDefault()">
                <input type="text" id="search-input" placeholder="Поиск по статьям и тегам..." class="w-full py-2 px-4 rounded-lg bg-slate-100 border-transparent focus:bg-white focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 transition-all outline-none">
            </form>
            <button id="btn-open-create-post" class="hidden-el py-2 px-5 bg-indigo-600 text-white rounded-lg font-medium shadow-sm hover:bg-indigo-700 transition-colors whitespace-nowrap ml-4">
                + Написать пост
            </button>
        </header>
        
        <section id="posts-feed" class="flex-1 overflow-y-auto p-8 space-y-6 bg-slate-50"></section>
    </main>

    <dialog id="auth-modal" class="rounded-2xl bg-white shadow-2xl p-8 w-96 border-0 m-auto">
        <header class="flex justify-between items-center mb-6">
            <h2 id="auth-modal-title" class="text-2xl font-bold text-slate-900">Вход</h2>
            <button id="close-auth-modal" class="text-slate-400 hover:text-red-500 font-bold text-xl">&times;</button>
        </header>
        <form id="auth-form" class="flex flex-col gap-4">
            <input type="text" id="auth-username" placeholder="Логин" required class="p-3 rounded-lg bg-slate-50 border border-slate-200 focus:outline-none focus:ring-2 focus:ring-indigo-500">
            <input type="password" id="auth-password" placeholder="Пароль" required class="p-3 rounded-lg bg-slate-50 border border-slate-200 focus:outline-none focus:ring-2 focus:ring-indigo-500">
            <p id="auth-error" class="text-red-500 text-sm hidden-el font-medium"></p>
            <button type="submit" class="py-3 bg-indigo-600 text-white rounded-lg font-bold shadow-md hover:bg-indigo-700 transition-colors mt-2">Подтвердить</button>
        </form>
        <footer class="mt-6 text-center text-sm">
            <button id="toggle-auth-mode" class="text-indigo-600 hover:text-indigo-800 font-medium">Нет аккаунта? Зарегистрироваться</button>
        </footer>
    </dialog>

    <dialog id="post-modal" class="rounded-2xl bg-white shadow-2xl p-8 w-[600px] border-0 m-auto">
        <header class="flex justify-between items-center mb-6">
            <h2 id="post-modal-title" class="text-2xl font-bold text-slate-900">Новый пост</h2>
            <button id="close-post-modal" class="text-slate-400 hover:text-red-500 font-bold text-xl">&times;</button>
        </header>
        <form id="post-form" class="flex flex-col gap-4">
            <input type="hidden" id="edit-post-id">
            <input type="text" id="post-title" placeholder="Название поста" required class="p-3 rounded-lg bg-slate-50 border border-slate-200 focus:outline-none focus:ring-2 focus:ring-indigo-500">
            <input type="text" id="post-tags" placeholder="Теги (через запятую)" class="p-3 rounded-lg bg-slate-50 border border-slate-200 focus:outline-none focus:ring-2 focus:ring-indigo-500">
            <textarea id="post-content" placeholder="Текст поста..." rows="6" required class="p-3 rounded-lg bg-slate-50 border border-slate-200 focus:outline-none focus:ring-2 focus:ring-indigo-500 resize-none"></textarea>
            <input type="file" id="post-image" accept="image/*" class="p-2 border border-slate-200 rounded-lg bg-slate-50 text-sm text-slate-600">
            <button type="submit" class="py-3 bg-indigo-600 text-white rounded-lg font-bold shadow hover:bg-indigo-700 transition-colors mt-2">Опубликовать</button>
        </form>
    </dialog>

    <dialog id="post-details-modal" class="rounded-2xl bg-white shadow-2xl p-8 w-[800px] max-h-[90vh] overflow-y-auto border-0 m-auto">
        <header class="flex justify-between items-start border-b border-slate-100 pb-5 mb-5">
            <section>
                <h2 id="detail-title" class="text-3xl font-bold text-slate-900 mb-2"></h2>
                <span id="detail-author" class="text-sm font-medium text-slate-500 bg-slate-100 px-3 py-1 rounded-full"></span>
            </section>
            <button id="close-details-modal" class="text-slate-400 hover:text-red-500 font-bold text-2xl">&times;</button>
        </header>
        <img id="detail-image" class="hidden-el w-full max-h-96 object-cover rounded-xl mb-6 shadow-sm border border-slate-100">
        <article id="detail-content" class="text-lg text-slate-700 whitespace-pre-wrap mb-8 leading-relaxed"></article>
        
        <section class="border-t border-slate-100 pt-6">
            <h3 class="text-xl font-bold text-slate-900 mb-4">Комментарии</h3>
            <section id="comments-list" class="space-y-4 mb-6"></section>
            <form id="comment-form" class="hidden-el flex gap-3">
                <input type="text" id="comment-input" placeholder="Написать комментарий..." required class="flex-1 p-3 rounded-lg bg-slate-50 border border-slate-200 focus:outline-none focus:ring-2 focus:ring-indigo-500">
                <button type="submit" class="py-3 px-6 bg-indigo-600 text-white rounded-lg font-bold hover:bg-indigo-700 transition-colors">Отправить</button>
            </form>
            <p id="comment-auth-warning" class="text-sm font-medium text-amber-600 bg-amber-50 p-3 rounded-lg border border-amber-200">Войдите в аккаунт, чтобы оставить комментарий.</p>
        </section>
    </dialog>

    <dialog id="profile-modal" class="rounded-2xl bg-white shadow-2xl p-8 w-96 text-center border-0 m-auto">
        <h2 class="text-2xl font-bold text-slate-900 mb-2">Мой профиль</h2>
        <p id="profile-username" class="text-xl text-indigo-600 font-bold mb-1"></p>
        <p id="profile-role" class="text-sm font-medium text-slate-500 mb-6 uppercase tracking-wider"></p>
        <p class="mb-8 text-slate-700">Опубликовано постов: <span id="profile-stats" class="font-bold text-xl text-slate-900"></span></p>
        <button id="close-profile-modal" class="w-full py-2 px-6 bg-slate-100 text-slate-700 font-medium rounded-lg hover:bg-slate-200 transition-colors">Закрыть</button>
    </dialog>

    <dialog id="admin-modal" class="rounded-2xl bg-white shadow-2xl p-8 w-[600px] border-0 m-auto">
        <header class="flex justify-between items-center mb-6">
            <h2 class="text-2xl font-bold text-red-600">Панель администратора</h2>
            <button id="close-admin-modal" class="text-slate-400 hover:text-red-500 font-bold text-xl">&times;</button>
        </header>
        <section id="users-list" class="space-y-3"></section>
    </dialog>
`;