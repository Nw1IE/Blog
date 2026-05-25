export const getAppTemplate = (): string => `
<<<<<<< HEAD
    <div class="flex h-screen w-full bg-[#121318] text-white font-sans antialiased border-4 border-black overflow-hidden relative selection:bg-lime-400 selection:text-black">
        
        <div class="absolute inset-0 opacity-[0.02] pointer-events-none z-0" style="background-image: linear-gradient(#fff 2px, transparent 2px), linear-gradient(90deg, #fff 2px, transparent 2px); background-size: 40px 40px;"></div>

        <div class="flex flex-col md:flex-row w-full h-full z-10 overflow-hidden relative">
            
            <aside class="w-full md:w-80 flex-shrink-0 bg-[#1a1c23] border-b-4 md:border-b-0 md:border-r-4 border-black flex flex-col justify-between relative h-auto md:h-full overflow-y-auto z-20">
                <section class="p-6">
                    <header class="mb-10 relative pt-4 flex justify-center md:justify-start">
                        <h1 class="text-xl sm:text-2xl md:text-3xl font-[950] tracking-tighter text-black uppercase relative inline-block select-none py-2 px-3 bg-lime-400 border-3 border-black shadow-[4px_4px_0px_#000] break-words max-w-full text-center md:text-left transition-all duration-200 ease-out -rotate-2 hover:-rotate-1 hover:-translate-x-1 hover:-translate-y-1 hover:shadow-[7px_7px_0px_#000] cursor-pointer">
                            Блог Геймера
                        </h1>
                    </header>
                    <nav class="mt-6">
                        <ul class="space-y-3">
                            <li>
                                <button id="nav-home" class="w-full flex items-center gap-4 text-left px-4 py-3 border-2 border-black bg-[#222531] text-white hover:bg-lime-400 hover:text-black font-bold text-base transition-all duration-100 hover:translate-x-1 hover:-translate-y-1 hover:shadow-[4px_4px_0px_rgba(0,0,0,1)] active:translate-x-0 active:-translate-y-0">
                                    <svg class="w-5 h-5 flex-shrink-0" fill="none" stroke="currentColor" stroke-width="2.5" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" d="M19.5 12c0-1.232-.046-2.453-.138-3.662a4.006 4.006 0 00-3.7-3.7 48.678 48.678 0 00-7.324 0 4.006 4.006 0 00-3.7 3.7c-.017.22-.032.441-.046.662M19.5 12l3-3m-3 3l-3-3m-12 3c0 1.232.046 2.453.138 3.662a4.006 4.006 0 003.7 3.7 48.656 48.656 0 007.324 0 4.006 4.006 0 003.7-3.7c.017-.22.032-.441.046-.662M4.5 12l3 3m-3-3l-3 3"></path></svg>
                                    <span class="truncate">Лента Активности</span>
                                </button>
                            </li>
                            <li id="nav-profile-container" class="hidden-el">
                                <button id="nav-profile" class="w-full flex items-center gap-4 text-left px-4 py-3 border-2 border-black bg-[#222531] text-white hover:bg-lime-400 hover:text-black font-bold text-base transition-all duration-100 hover:translate-x-1 hover:-translate-y-1 hover:shadow-[4px_4px_0px_rgba(0,0,0,1)]">
                                    <svg class="w-5 h-5 flex-shrink-0" fill="none" stroke="currentColor" stroke-width="2.5" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" d="M15.75 6a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0zM4.501 20.118a7.5 7.5 0 0114.998 0A17.933 17.933 0 0112 21.75c-2.676 0-5.216-.584-7.499-1.632z"></path></svg>
                                    <span class="truncate">Личный Кабинет</span>
                                </button>
                            </li>
                            <li id="nav-admin-container" class="hidden-el">
                                <button id="nav-admin" class="w-full flex items-center gap-4 text-left px-4 py-3 border-2 border-black bg-[#222531] text-red-400 hover:bg-red-500 hover:text-white font-bold text-base transition-all duration-100 hover:translate-x-1 hover:-translate-y-1 hover:shadow-[4px_4px_0px_#ef4444]">
                                    <svg class="w-5 h-5 flex-shrink-0" fill="none" stroke="currentColor" stroke-width="2.5" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" d="M9 12.75L11.25 15 15 9.75m-3-7.036A11.959 11.959 0 013.598 6 11.99 11.99 0 003 9.749c0 5.592 3.824 10.29 9 11.623 5.176-1.334 9-6.03 9-11.622 0-1.31-.21-2.571-.598-3.751h-.152c-3.196 0-6.1-1.248-8.25-3.285z"></path></svg>
                                    <span class="truncate">Админка!</span>
                                </button>
                            </li>
                        </ul>
                    </nav>
                </section>
                
                <section id="auth-section" class="p-6 border-t-4 border-black bg-[#15171e]">
                    <button id="btn-open-auth" class="w-full py-3 px-4 bg-lime-400 text-black font-black text-lg uppercase tracking-wider border-2 border-black transition-all duration-100 hover:bg-white hover:shadow-[4px_4px_0px_#000] hover:-translate-x-1 hover:-translate-y-1">
                        Войти В Систему
                    </button>
                    <section id="user-info" class="hidden-el flex flex-col gap-3">
                        <div class="flex items-center justify-center gap-3 py-2.5 px-4 bg-[#222531] border-2 border-black shadow-[4px_4px_0px_rgba(0,0,0,1)]">
                            <div class="w-2.5 h-2.5 bg-lime-400 border border-black animate-pulse flex-shrink-0"></div>
                            <span id="current-username" class="font-black text-base text-white truncate uppercase tracking-tight"></span>
                        </div>
                        <button id="btn-logout" class="w-full py-2 px-4 bg-transparent text-gray-400 font-bold hover:text-red-400 border-2 border-black hover:border-red-500 transition-all text-sm">
                            Выйти()
                        </button>
                    </section>
                </section>
            </aside>

            <main class="flex-1 min-w-0 flex flex-col bg-[#121318] h-full overflow-y-auto">
                <header class="h-24 bg-[#1a1c23] border-b-4 border-black flex items-center justify-between p-6 gap-6 z-10 sticky top-0">
                    <form id="search-form" class="w-full max-w-xl m-0" onsubmit="event.preventDefault()">
                        <div class="relative w-full flex items-center">
                            <div class="absolute left-4 pointer-events-none text-gray-400 z-10">
                                <svg class="w-5 h-5" fill="none" stroke="currentColor" stroke-width="3" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" d="M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 5.196a7.5 7.5 0 0010.604 10.604z"></path></svg>
                            </div>
                            <input type="text" id="search-input" placeholder="Поиск По Базе" class="w-full py-3 pl-12 pr-4 bg-[#222531] border-2 border-black text-base focus:bg-[#2c2f3f] focus:outline-none focus:shadow-[4px_4px_0px_#bef264] transition-all text-white placeholder-gray-500 font-bold">
                            <div id="quick-tags-container" class="mt-3 flex flex-wrap gap-1.5">
                            </div>
                        </div>
                    </form>
                    <button id="btn-open-create-post" class="hidden-el py-3 px-6 bg-lime-400 hover:bg-white text-black font-black text-base uppercase tracking-tight border-2 border-black transition-all whitespace-nowrap hover:shadow-[4px_4px_0px_rgba(0,0,0,1)] hover:-translate-x-0.5 hover:-translate-y-0.5">
                        + Создать Пост
                    </button>
                </header>
                
                <section class="p-6 sm:p-8 flex-1 w-full overflow-y-auto">
                    <div id="posts-feed" class="w-full max-w-5xl mx-auto space-y-8"></div>
                </section>
            </main>
        </div>

        <style>
            dialog::backdrop { background: rgba(0, 0, 0, 0.85); backdrop-filter: blur(6px); }
            dialog[open] { animation: modalPopIn 0.15s cubic-bezier(0.18, 0.89, 0.32, 1.28) forwards; }
            @keyframes modalPopIn { from { opacity: 0; transform: scale(0.95) translateY(10px); } to { opacity: 1; transform: scale(1) translateY(0); } }
            ::-webkit-scrollbar { width: 10px; }
            ::-webkit-scrollbar-track { background: #1a1c23; border-left: 2px solid #000; }
            ::-webkit-scrollbar-thumb { background: #000; border: 2px solid #bef264; }
            ::-webkit-scrollbar-thumb:hover { background: #bef264; }
        </style>

        <dialog id="auth-modal" class="rounded-none bg-[#1a1c23] text-white shadow-[8px_8px_0px_#000] p-6 sm:p-8 w-full max-w-[400px] border-3 border-black m-auto outline-none relative">
            <header class="flex justify-between items-center mb-6 pb-3 border-b-2 border-black">
                <h2 id="auth-modal-title" class="text-2xl font-black text-black uppercase tracking-tighter bg-lime-400 px-3 py-1 border-2 border-black shadow-[2px_2px_0px_#000]">Вход В Сеть</h2>
                <button id="close-auth-modal" class="p-1.5 border-2 border-black bg-[#222531] text-white hover:bg-red-500 transition-all">
                    <svg class="w-5 h-5" fill="none" stroke="currentColor" stroke-width="3" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" d="M6 18L18 6M6 6l12 12"></path></svg>
                </button>
            </header>
            <form id="auth-form" class="flex flex-col gap-4">
                <input type="text" id="auth-username" placeholder="Логин" required class="p-3 bg-[#222531] border-2 border-black focus:outline-none focus:shadow-[4px_4px_0px_#bef264] text-white font-medium">
                <input type="password" id="auth-password" placeholder="Пароль" required class="p-3 bg-[#222531] border-2 border-black focus:outline-none focus:shadow-[4px_4px_0px_#bef264] text-white font-medium">
                <p id="auth-error" class="text-red-400 text-sm hidden-el font-bold bg-red-950/50 p-3 border-2 border-red-500"></p>
                <button type="submit" class="py-3 bg-lime-400 text-black font-black text-lg uppercase border-2 border-black transition-all hover:bg-white hover:shadow-[4px_4px_0px_#000] hover:-translate-x-0.5 hover:-translate-y-0.5">Подтвердить</button>
            </form>
            <footer class="mt-6 text-center pt-3 border-t border-black">
                <button id="toggle-auth-mode" class="text-xs text-gray-400 hover:text-lime-400 font-bold uppercase tracking-tight underline">Регистрация</button>
            </footer>
        </dialog>

        <dialog id="post-modal" class="rounded-none bg-[#1a1c23] text-white shadow-[12px_12px_0px_#000] p-6 sm:p-8 w-full max-w-[650px] border-3 border-black m-auto outline-none">
            <header class="flex justify-between items-center mb-6 pb-3 border-b-2 border-black">
                <h2 id="post-modal-title" class="text-2xl font-black text-black uppercase tracking-tighter bg-lime-400 px-3 py-1 border-2 border-black shadow-[2px_2px_0px_#000]">Опубликовать Контент</h2>
                <button id="close-post-modal" class="p-1.5 border-2 border-black bg-[#222531] text-white hover:bg-red-500 transition-all">
                    <svg class="w-5 h-5" fill="none" stroke="currentColor" stroke-width="3" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" d="M6 18L18 6M6 6l12 12"></path></svg>
                </button>
            </header>
            <form id="post-form" class="flex flex-col gap-4">
                <input type="hidden" id="edit-post-id">
                <input type="text" id="post-title" placeholder="Заголовок поста" required class="p-3 bg-[#222531] border-2 border-black focus:outline-none focus:shadow-[4px_4px_0px_#bef264] text-white font-bold">
                <input type="text" id="post-tags" placeholder="Теги (FPS, RPG, STEAM)" class="p-3 bg-[#222531] border-2 border-black focus:outline-none focus:shadow-[4px_4px_0px_#bef264] text-white font-medium">
                <textarea id="post-content" placeholder="Текст поста" rows="5" required class="p-3 bg-[#222531] border-2 border-black focus:outline-none focus:shadow-[4px_4px_0px_#bef264] text-white font-medium resize-none"></textarea>
                <div class="border-2 border-black border-dashed p-3 bg-[#15171e]">
                    <input type="file" id="post-image" accept="image/*" class="w-full text-sm text-gray-400 file:mr-4 file:py-2 file:px-4 file:border-2 file:border-black file:bg-lime-400 file:text-black file:font-bold hover:file:bg-white cursor-pointer">
                </div>
                <button type="submit" class="py-3 bg-lime-400 text-black font-black text-lg uppercase border-2 border-black transition-all hover:bg-white hover:shadow-[4px_4px_0px_#000] hover:-translate-x-0.5 hover:-translate-y-0.5">ОПУБЛИКОВАТЬ В СЕТЬ</button>
            </form>
        </dialog>

        <dialog id="post-details-modal" class="rounded-none bg-[#1a1c23] text-white shadow-[12px_12px_0px_#000] p-6 sm:p-8 w-full max-w-[800px] max-h-[90vh] overflow-y-auto border-3 border-black m-auto outline-none">
            <header class="flex justify-between items-start border-b-2 border-black pb-4 mb-6">
                <div class="space-y-2 max-w-[80%]">
                    <h2 id="detail-title" class="text-2xl sm:text-3xl font-black text-white uppercase tracking-tighter leading-tight"></h2>
                    <span id="detail-author" class="inline-block text-xs font-bold text-black bg-lime-400 px-2 py-1 border border-black shadow-[2px_2px_0px_#000]"></span>
                </div>
                <button id="close-details-modal" class="p-1.5 border-2 border-black bg-[#222531] text-white hover:bg-red-500 transition-all">
                    <svg class="w-5 h-5" fill="none" stroke="currentColor" stroke-width="3" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" d="M6 18L18 6M6 6l12 12"></path></svg>
                </button>
            </header>
            <div class="w-full max-h-[380px] overflow-hidden border-2 border-black mb-6">
                <img id="detail-image" class="hidden-el w-full h-full object-cover">
            </div>
            <article id="detail-content" class="text-base text-gray-200 whitespace-pre-wrap mb-6 leading-relaxed bg-[#15171e] p-4 border-2 border-black"></article>
            
            <section class="border-t-2 border-black pt-6">
                <h3 class="text-xl font-black uppercase mb-4 flex items-center gap-2 text-lime-400">Комментарии</h3>
                <section id="comments-list" class="space-y-3 mb-6"></section>
                <form id="comment-form" class="hidden-el flex gap-3">
                    <input type="text" id="comment-input" placeholder="Добавить Комментарий..." required class="flex-1 p-3 bg-[#222531] border-2 border-black text-white focus:outline-none focus:shadow-[4px_4px_0px_#bef264]">
                    <button type="submit" class="py-3 px-5 bg-black text-lime-400 font-black uppercase border-2 border-lime-400 hover:bg-lime-400 hover:text-black transition-all">Отправить</button>
                </form>
                <p id="comment-auth-warning" class="text-xs font-bold text-yellow-500 bg-yellow-950/30 p-3 border border-yellow-600">Войдите в сеть, чтобы оставить комментарий.</p>
            </section>
        </dialog>

        <dialog id="profile-modal" class="rounded-none bg-[#1a1c23] text-white shadow-[8px_8px_0px_#000] p-6 w-full max-w-[380px] text-center border-3 border-black m-auto outline-none">
            <header class="flex justify-between items-center mb-4 pb-2 border-b border-black">
                <h2 class="text-xl font-black uppercase text-lime-400">Профиль</h2>
                <button id="close-profile-modal" class="p-1 border-2 border-black bg-[#222531] hover:bg-red-500">
                    <svg class="w-4 h-4" fill="none" stroke="currentColor" stroke-width="3" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" d="M6 18L18 6M6 6l12 12"></path></svg>
                </button>
            </header>
            <p id="profile-username" class="text-lg font-black bg-lime-400 text-black px-4 py-1 border-2 border-black inline-block my-2"></p>
            <div class="my-2"><p id="profile-role" class="inline-block text-[10px] font-bold bg-[#222531] px-2 py-1 border border-black"></p></div>
            <div class="my-4 p-4 bg-[#15171e] border-2 border-black">
                <p class="text-xs text-gray-400 font-bold uppercase">Постов в ленте</p>
                <span id="profile-stats" class="font-black text-4xl text-white block mt-1"></span>
            </div>
        </dialog>

        <dialog id="admin-modal" class="rounded-none bg-[#1a1c23] text-white shadow-[12px_12px_0px_#ef4444] p-6 sm:p-8 w-full max-w-[850px] max-h-[85vh] overflow-y-auto border-3 border-red-500 m-auto outline-none">
            <header class="flex justify-between items-center mb-6 pb-4 border-b-2 border-red-500/30">
                <h2 class="text-2xl font-black text-red-400 uppercase tracking-tighter flex items-center gap-2">Панель Разработчика</h2>
                <button id="close-admin-modal" class="p-1.5 border-2 border-red-500 bg-[#222531] text-red-400 hover:bg-red-500 hover:text-white transition-all">
                    <svg class="w-5 h-5" fill="none" stroke="currentColor" stroke-width="3" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" d="M6 18L18 6M6 6l12 12"></path></svg>
                </button>
            </header>
            
            <div class="grid grid-cols-1 lg:grid-cols-2 gap-8">
                <section>
                    <h3 class="text-base font-black uppercase text-red-400 mb-3 flex items-center gap-2"><span>●</span> База Пользователей</h3>
                    <div id="users-list" class="space-y-2 max-h-80 overflow-y-auto pr-1 bg-[#15171e] p-3 border-2 border-black"></div>
                </section>
                <section>
                    <h3 class="text-base font-black uppercase text-gray-300 mb-3 flex items-center gap-2"><span>●</span> Управление Постами</h3>
                    <div id="admin-posts-list" class="space-y-2 max-h-80 overflow-y-auto pr-1 bg-[#15171e] p-3 border-2 border-black"></div>
                </section>
            </div>
        </dialog>
    </div>
=======
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
>>>>>>> 9a9714a6e53131407cac6a555236384881661d4d
`;