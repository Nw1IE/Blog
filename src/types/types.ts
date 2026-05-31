// Комментарий (CommentDTO)
export interface CommentDTO {
    id: number;
    content: string;
    authorLogin: string;
    createdAt: string;
    updatedAt: string;
}

// Пост (PostDTO)
export interface PostDTO {
    id: number;
    title: string;
    content: string;
    authorLogin: string;
    categoryName: string | null;
    createdAt: string;
    updatedAt: string;
    likesCount: number;
    comments: CommentDTO[];
    imageUrl?: string | null; // ✅ Добавлено поле для фото
}

// Категория (CategoryDTO)
export interface CategoryDTO {
    id: number;
    name: string;
    slug: string;
}

// Пользователь (User)
export interface UserDTO {
    id: number;
    username: string;
    password?: string;
    role: string;
    isBanned: boolean;
    banReason?: string;
    email: string;
    bio: string;
}

export interface CreateApiKeyBody {
    bio: string;
    group: string;
    name?: string;
}

export interface GetAllPostsBody {
    page: number;
    limit: number;
    category?: string;
}

export interface LoginBody {
    login: string;
    password: string;
}

export interface RegisterBody {
    login: string;
    email: string;
    password: string;
    bio: string;
}

export interface CreateCategoryBody {
    name: string;
    slug: string;
}

export interface CreateCommentBody {
    content: string;
    postId: number;
    authorId: number;
}

export interface UpdatePostBody {
    title: string;
    content: string;
    categoryid: string;
    imageUrl?: string | null; // ✅ Добавлено
}

export interface UpdateProfileBody {
    login: string;
    email: string;
    bio: string;
    password?: string;
}

export interface CreatePostBody {
    title: string;
    content: string;
    categoryid: number;
    imageUrl?: string | null; // ✅ Добавлено
}