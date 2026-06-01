import type { PostDTO, UserDTO } from '../types/types.ts';

const REGISTERED_USERS_KEY = 'blog_registered_users';

function loadRegisteredUsers(): UserDTO[] {
    try {
        const raw = localStorage.getItem(REGISTERED_USERS_KEY);
        return raw ? JSON.parse(raw) : [];
    } catch { return []; }
}

export function saveRegisteredUser(user: UserDTO) {
    const users = loadRegisteredUsers();
    const exists = users.find(u => u.username === user.username);
    if (!exists) {
        users.push(user);
        localStorage.setItem(REGISTERED_USERS_KEY, JSON.stringify(users));
    }
    // Добавляем в рантайм DB, если ещё нет
    if (!DB.users.find(u => u.username === user.username)) {
        DB.users.push(user);
    }
}

const baseUsers: UserDTO[] = [
    {
        id: 1,
        username: 'admin',
        password: '123',
        role: 'admin',
        isBanned: false,
        email: 'admin@blog.ru',
        bio: 'Главный администратор'
    },
    {
        id: 2,
        username: 'user1',
        password: '123',
        role: 'user',
        isBanned: false,
        email: 'user1@blog.ru',
        bio: 'Обычный читатель'
    },
    {
        id: 3,
        username: 'user2',
        password: '123',
        role: 'user',
        isBanned: false,
        email: 'user2@blog.ru',
        bio: 'Второй пользователь'
    }
];

// Мёрджим базовых юзеров + зарегистрированных через сайт
const registeredUsers = loadRegisteredUsers();
const mergedUsers: UserDTO[] = [...baseUsers];
registeredUsers.forEach(ru => {
    if (!mergedUsers.find(u => u.username === ru.username)) {
        mergedUsers.push(ru);
    }
});

export const DB = {
    users: mergedUsers as UserDTO[],
    posts: [] as PostDTO[],
    comments: [] as any[]
};