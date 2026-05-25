import type { User, Post, Comment } from '../types/types';

export const DB = {
    users: [
        { id: 1, username: 'admin', password: '123', role: 'admin', isBanned: false },
        { id: 2, username: 'user1', password: '123', role: 'user', isBanned: false },
        { id: 3, username: 'user2', password: '123', role: 'user', isBanned: false }
    ] as User[],
    
    posts: [
        { id: 1, title: 'Как я начал учить TS', content: 'Привет! Это мой первый пост.', tags: ['TypeScript', 'Новичок'], authorId: 2, authorName: 'user1', likesCount: 0, likedBy: [] }
    ] as Post[],
    
    comments: [] as Comment[]
};