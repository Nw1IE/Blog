export interface User {
    id: number;
    username: string;
    password: string;
    role: 'user' | 'admin';
    isBanned: boolean;
    banReason?: string;
}

export interface Comment {
    id: number;
    postId: number;
    authorName: string;
    content: string;
}

export interface Post {
    id: number;
    title: string;
    content: string;
    tags: string[];
    authorId: number;
    authorName: string;
    likesCount: number;
    likedBy: number[];
    imageUrl?: string;
}