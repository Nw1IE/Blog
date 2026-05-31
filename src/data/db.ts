import type { PostDTO, UserDTO } from '../types/types.ts';

export const DB = {
    users: [
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
    ] as UserDTO[],

    // Посты загружаются с сервера через api.getAllPosts() при старте
    posts: [] as PostDTO[],

    comments: [] as any[]
};