export const getAppTemplate = (): string => `
    <section class="flex h-screen w-full bg-[#121318] text-white font-sans antialiased border-4 border-black overflow-hidden relative selection:bg-lime-400 selection:text-black">
        
        <div class="absolute inset-0 opacity-[0.02] pointer-events-none z-0" style="background-image: linear-gradient(#fff 2px, transparent 2px), linear-gradient(90deg, #fff 2px, transparent 2px); background-size: 40px 40px;"></div>

        <section class="flex flex-col md:flex-row w-full h-full z-10 overflow-hidden relative">
            
            <aside class="w-full md:w-80 flex-shrink-0 bg-[#1a1c23] border-b-4 md:border-b-0 md:border-r-4 border-black flex flex-col relative h-auto md:h-full overflow-y-auto z-20">
                <section class="p-6 flex-1">
                    <header class="mb-10 relative pt-4 flex justify-center md:justify-start">
                        <h1 class="text-xl sm:text-2xl md:text-3xl font-[950] tracking-tighter text-black uppercase relative inline-block select-none py-2 px-3 bg-lime-400 border-3 border-black shadow-[4px_4px_0px_#000] break-words max-w-full text-center md:text-left transition-all duration-200 ease-out -rotate-2 hover:-rotate-1 hover:-translate-x-1 hover:-translate-y-1 hover:shadow-[7px_7px_0px_#000] cursor-pointer">
                            Блог Геймера
                        </h1>
                    </header>
                    <nav class="mt-6">
                        <ul class="space-y-3">
                            <li>
                                <button id="nav-home" class="w-full flex items-center gap-4 text-left px-4 py-3 border-2 border-black bg-[#222531] text-white hover:bg-lime-400 hover:text-black font-bold text-base transition-all duration-100 hover:translate-x-1 hover:-translate-y-1 hover:shadow-[4px_4px_0px_rgba(0,0,0,1)]">
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

                    <!-- СТАТИСТИКА БЛОГА -->
                    <section id="blog-stats-section" class="mt-8">
                        <h2 class="text-[10px] font-black uppercase tracking-widest text-gray-500 mb-3">● Статистика блога</h2>
                        <div class="grid grid-cols-3 gap-2 mb-4">
                            <div class="bg-[#15171e] border-2 border-black p-2 text-center">
                                <div class="text-[10px] font-bold uppercase text-gray-500 mb-1">Постов</div>
                                <div id="stat-posts" class="text-xl font-black text-indigo-400">0</div>
                            </div>
                            <div class="bg-[#15171e] border-2 border-black p-2 text-center">
                                <div class="text-[10px] font-bold uppercase text-gray-500 mb-1">Лайков</div>
                                <div id="stat-likes" class="text-xl font-black text-red-400">0</div>
                            </div>
                            <div class="bg-[#15171e] border-2 border-black p-2 text-center">
                                <div class="text-[10px] font-bold uppercase text-gray-500 mb-1">Коммент.</div>
                                <div id="stat-comments" class="text-xl font-black text-lime-400">0</div>
                            </div>
                        </div>
                        <div class="text-[10px] font-black uppercase text-gray-500 mb-2">Активность за 7 дней</div>
                        <div id="stat-activity" class="space-y-1.5"></div>
                    </section>
                </section>

                <section id="auth-section" class="p-6 border-t-4 border-black bg-[#15171e]">
                    <button id="btn-open-auth" class="w-full py-3 px-4 bg-lime-400 text-black font-black text-lg uppercase tracking-wider border-2 border-black transition-all duration-100 hover:bg-white hover:shadow-[4px_4px_0px_#000] hover:-translate-x-1 hover:-translate-y-1">
                        Войти В Систему
                    </button>
                    <section id="user-info" class="hidden-el flex flex-col gap-3">
                        <section class="flex items-center justify-center gap-3 py-2.5 px-4 bg-[#222531] border-2 border-black shadow-[4px_4px_0px_rgba(0,0,0,1)]">
                            <div class="w-2.5 h-2.5 bg-lime-400 border border-black animate-pulse flex-shrink-0"></div>
                            <span id="current-username" class="font-black text-base text-white truncate uppercase tracking-tight"></span>
                        </section>
                        <button id="btn-logout" class="w-full py-2 px-4 bg-transparent text-gray-400 font-bold hover:text-red-400 border-2 border-black hover:border-red-500 transition-all text-sm">
                            Выйти()
                        </button>
                    </section>
                    <footer class="mt-4 pt-3 border-t border-gray-800 text-center">
                        <p class="text-[10px] font-black text-gray-600 uppercase tracking-widest leading-relaxed">
                            Жека &mdash; Сделано на микроволновке!
                            <span class="text-red-500">♥</span>
                        </p>
                    </footer>
                </section>
            </aside>

            <main class="flex-1 min-w-0 flex flex-col bg-[#121318] h-full overflow-y-auto">
                <header class="h-auto min-h-[6rem] bg-[#1a1c23] border-b-4 border-black flex items-center justify-between p-6 gap-6 z-10 sticky top-0">
                    <section class="w-full max-w-xl">
                        <div class="relative w-full flex items-center">
                            <div class="absolute left-4 pointer-events-none text-gray-400 z-10">
                                <svg class="w-5 h-5" fill="none" stroke="currentColor" stroke-width="3" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" d="M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 5.196a7.5 7.5 0 0010.604 10.604z"></path></svg>
                            </div>
                            <input type="text" id="search-input" placeholder="Поиск По Базе" class="w-full py-3 pl-12 pr-4 bg-[#222531] border-2 border-black text-base focus:bg-[#2c2f3f] focus:outline-none focus:shadow-[4px_4px_0px_#bef264] transition-all text-white placeholder-gray-500 font-bold">
                        </div>
                        <!-- Теги-фильтры (категории) -->
                        <section id="quick-tags-container" class="mt-3 flex flex-wrap gap-1.5"></section>
                    </section>
                    <button id="btn-open-create-post" class="hidden-el py-3 px-6 bg-lime-400 hover:bg-white text-black font-black text-base uppercase tracking-tight border-2 border-black transition-all whitespace-nowrap hover:shadow-[4px_4px_0px_rgba(0,0,0,1)] hover:-translate-x-0.5 hover:-translate-y-0.5">
                        + Создать Пост
                    </button>
                </header>
                
                <section class="p-6 sm:p-8 flex-1 w-full overflow-y-auto">
                    <section id="posts-feed" class="w-full max-w-5xl mx-auto space-y-8"></section>
                </section>
            </main>
        </section>

        <style>
            .hidden-el { display: none !important; }
            dialog::backdrop { background: rgba(0,0,0,0.85); backdrop-filter: blur(6px); }
            dialog[open] { animation: modalPopIn 0.15s cubic-bezier(0.18,0.89,0.32,1.28) forwards; }
            @keyframes modalPopIn { from { opacity:0; transform:scale(0.95) translateY(10px); } to { opacity:1; transform:scale(1) translateY(0); } }
            ::-webkit-scrollbar { width: 10px; }
            ::-webkit-scrollbar-track { background: #1a1c23; border-left: 2px solid #000; }
            ::-webkit-scrollbar-thumb { background: #000; border: 2px solid #bef264; }
            ::-webkit-scrollbar-thumb:hover { background: #bef264; }
        </style>

        <!-- AUTH MODAL -->
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

        <!-- POST CREATE/EDIT MODAL -->
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
                <textarea id="post-content" placeholder="Текст поста" rows="5" required class="p-3 bg-[#222531] border-2 border-black focus:outline-none focus:shadow-[4px_4px_0px_#bef264] text-white font-medium resize-none"></textarea>

                <!-- КАТЕГОРИЯ + ТЕГИ -->
                <section class="space-y-2">
                    <label class="text-xs text-gray-400 font-bold uppercase block">Категория / Тег</label>
                    <input
                        type="text"
                        id="post-category"
                        placeholder="Введи или выбери тег ниже"
                        list="categories-datalist"
                        autocomplete="off"
                        class="w-full p-3 bg-[#222531] border-2 border-black focus:outline-none focus:shadow-[4px_4px_0px_#bef264] text-white font-medium"
                    >
                    <datalist id="categories-datalist"></datalist>
                    <!-- Кнопки существующих тегов -->
                    <div id="tag-selector" class="flex flex-wrap gap-1.5 mt-1"></div>
                </section>

                <section class="border-2 border-dashed border-gray-600 p-3 bg-[#15171e] space-y-2">
                    <label class="text-xs text-gray-400 font-bold uppercase block">Картинка поста (необязательно)</label>
                    <input type="file" id="post-image" accept="image/*" class="w-full text-sm text-gray-400 file:mr-4 file:py-2 file:px-4 file:border-2 file:border-black file:bg-lime-400 file:text-black file:font-bold hover:file:bg-white cursor-pointer">
                    <section id="image-preview-container" class="hidden-el mt-2">
                        <img id="image-preview" src="" alt="preview" class="w-full max-h-48 object-cover border-2 border-black" />
                    </section>
                </section>
                <button type="submit" class="py-3 bg-lime-400 text-black font-black text-lg uppercase border-2 border-black transition-all hover:bg-white hover:shadow-[4px_4px_0px_#000] hover:-translate-x-0.5 hover:-translate-y-0.5">ОПУБЛИКОВАТЬ В СЕТЬ</button>
            </form>
        </dialog>

        <!-- POST DETAILS MODAL -->
        <dialog id="post-details-modal" class="rounded-none bg-[#1a1c23] text-white shadow-[12px_12px_0px_#000] p-6 sm:p-8 w-full max-w-[800px] max-h-[90vh] overflow-y-auto border-3 border-black m-auto outline-none">
            <header class="flex justify-between items-start border-b-2 border-black pb-4 mb-6">
                <section class="space-y-2 max-w-[80%]">
                    <h2 id="detail-title" class="text-2xl sm:text-3xl font-black text-white uppercase tracking-tighter leading-tight"></h2>
                    <span id="detail-author" class="inline-block text-xs font-bold text-black bg-lime-400 px-2 py-1 border border-black shadow-[2px_2px_0px_#000]"></span>
                </section>
                <button id="close-details-modal" class="p-1.5 border-2 border-black bg-[#222531] text-white hover:bg-red-500 transition-all">
                    <svg class="w-5 h-5" fill="none" stroke="currentColor" stroke-width="3" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" d="M6 18L18 6M6 6l12 12"></path></svg>
                </button>
            </header>
            <section id="detail-image-container" class="hidden-el w-full overflow-hidden border-2 border-black mb-6">
                <img id="detail-image" src="" alt="post image" class="w-full max-h-96 object-cover" />
            </section>
            <article id="detail-content" class="text-base text-gray-200 whitespace-pre-wrap mb-6 leading-relaxed bg-[#15171e] p-4 border-2 border-black"></article>
            <section class="border-t-2 border-black pt-6">
                <h3 class="text-xl font-black uppercase mb-4 text-lime-400">Комментарии</h3>
                <section id="comments-list" class="space-y-3 mb-6"></section>
                <form id="comment-form" class="hidden-el flex gap-3">
                    <input type="text" id="comment-input" placeholder="Добавить Комментарий..." required class="flex-1 p-3 bg-[#222531] border-2 border-black text-white focus:outline-none focus:shadow-[4px_4px_0px_#bef264]">
                    <button type="submit" class="py-3 px-5 bg-black text-lime-400 font-black uppercase border-2 border-lime-400 hover:bg-lime-400 hover:text-black transition-all">Отправить</button>
                </form>
                <p id="comment-auth-warning" class="text-xs font-bold text-yellow-500 bg-yellow-950/30 p-3 border border-yellow-600">Войдите в сеть, чтобы оставить комментарий.</p>
            </section>
        </dialog>

        <!-- PROFILE MODAL -->
        <dialog id="profile-modal" class="rounded-none bg-[#1a1c23] text-white shadow-[8px_8px_0px_#000] p-6 w-full max-w-[380px] text-center border-3 border-black m-auto outline-none">
            <header class="flex justify-between items-center mb-4 pb-2 border-b border-black">
                <h2 class="text-xl font-black uppercase text-lime-400">Профиль</h2>
                <button id="close-profile-modal" class="p-1 border-2 border-black bg-[#222531] hover:bg-red-500">
                    <svg class="w-4 h-4" fill="none" stroke="currentColor" stroke-width="3" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" d="M6 18L18 6M6 6l12 12"></path></svg>
                </button>
            </header>
            <p id="profile-username" class="text-lg font-black bg-lime-400 text-black px-4 py-1 border-2 border-black inline-block my-2"></p>
            <div class="my-2"><p id="profile-role" class="inline-block text-[10px] font-bold bg-[#222531] px-2 py-1 border border-black"></p></div>
            <section class="my-4 p-4 bg-[#15171e] border-2 border-black">
                <p class="text-xs text-gray-400 font-bold uppercase">Постов в ленте</p>
                <span id="profile-stats" class="font-black text-4xl text-white block mt-1"></span>
            </section>
        </dialog>

        <!-- ADMIN MODAL -->
        <dialog id="admin-modal" class="rounded-none bg-[#1a1c23] text-white shadow-[12px_12px_0px_#ef4444] p-6 sm:p-8 w-full max-w-[850px] max-h-[85vh] overflow-y-auto border-3 border-red-500 m-auto outline-none">
            <header class="flex justify-between items-center mb-6 pb-4 border-b-2 border-red-500/30">
                <h2 class="text-2xl font-black text-red-400 uppercase tracking-tighter">Панель Разработчика</h2>
                <button id="close-admin-modal" class="p-1.5 border-2 border-red-500 bg-[#222531] text-red-400 hover:bg-red-500 hover:text-white transition-all">
                    <svg class="w-5 h-5" fill="none" stroke="currentColor" stroke-width="3" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" d="M6 18L18 6M6 6l12 12"></path></svg>
                </button>
            </header>
            <section class="grid grid-cols-1 lg:grid-cols-2 gap-8">
                <section>
                    <h3 class="text-base font-black uppercase text-red-400 mb-3">● База Пользователей</h3>
                    <section id="users-list" class="space-y-2 max-h-80 overflow-y-auto pr-1 bg-[#15171e] p-3 border-2 border-black"></section>
                </section>
                <section>
                    <h3 class="text-base font-black uppercase text-gray-300 mb-3">● Управление Постами</h3>
                    <section id="admin-posts-list" class="space-y-2 max-h-80 overflow-y-auto pr-1 bg-[#15171e] p-3 border-2 border-black"></section>
                </section>
            </section>
        </dialog>
    </section>
`;