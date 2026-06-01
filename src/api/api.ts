import type {
    PostDTO, CategoryDTO, CommentDTO,
    LoginBody, RegisterBody, UpdatePostBody,
    CreateCommentBody, GetAllPostsBody,
    CreatePostBody
} from '../types/types';

class ApiService {
    private baseUrl = 'http://localhost:8083/api';

    private log(method: string, endpoint: string, status: number, data: any, isError = false) {
        const badgeStyle = isError
            ? 'background: #ef4444; color: white; padding: 2px 4px; border-radius: 3px;'
            : 'background: #bef264; color: black; padding: 2px 4px; border-radius: 3px;';
        console.groupCollapsed(
            `%cAPI ${method}%c ${endpoint} [Status: ${status}]`,
            badgeStyle,
            'color: gray; font-weight: normal;'
        );
        isError ? console.error('Детали ошибки:', data) : console.log('Ответ сервера:', data);
        console.groupEnd();
    }

    

    private async request<T>(endpoint: string, method: string, body?: any): Promise<T> {
        const url = `${this.baseUrl}${endpoint}`;
        const apiKey = localStorage.getItem('server_api_key') ?? '';
        const userJwt = localStorage.getItem('app_jwt_token') ?? '';

        const headers: Record<string, string> = {
            'Accept': 'application/json',
            'Content-Type': 'application/json',
        };

        if (apiKey) headers['X-API-Key'] = apiKey;

        if (userJwt && endpoint !== '/users/auth' && !endpoint.startsWith('/keys')) {
            headers['Authorization'] = `Bearer ${userJwt}`;
        }

        const options: RequestInit = { method, headers };
        if (body !== undefined) {
            options.body = JSON.stringify(body);
        }

        let response = await fetch(url, options);

        // Если 401 — пробуем переполучить токен автоматически
        if (response.status === 401) {
            const savedLogin = localStorage.getItem('current_login');
            const savedPass  = localStorage.getItem('current_password');
            if (savedLogin && savedPass && endpoint !== '/users/auth') {
                console.warn('🔄 JWT протух, переавторизуемся...');
                try {
                    await this.loginUser({ login: savedLogin, password: savedPass });
                    const newJwt = localStorage.getItem('app_jwt_token') ?? '';
                    headers['Authorization'] = `Bearer ${newJwt}`;
                    const retryOptions: RequestInit = { method, headers };
                    if (body !== undefined) retryOptions.body = JSON.stringify(body);
                    response = await fetch(url, retryOptions);
                } catch {
                    console.error('❌ Переавторизация не удалась');
                    localStorage.removeItem('app_jwt_token');
                }
            }
        }

        

        const responseText = await response.text();
        let data: any;
        try { data = responseText ? JSON.parse(responseText) : null; } catch { data = responseText; }

        if (!response.ok) {
            this.log(method, endpoint, response.status, data, true);
            throw new Error(typeof data === 'object' ? JSON.stringify(data) : String(data));
        }

        this.log(method, endpoint, response.status, data, false);
        return data as T;
    }

    // ─── API КЛЮЧ ──────────────────────────────────────────────────────────────
    async createApiKey(): Promise<string> {
        const key = await this.request<string>('/keys', 'PUT', {
            bio: 'Blog frontend app',
            group: 'BlogApp'
        });
        if (key) localStorage.setItem('server_api_key', key);
        return key;
    }

    // ─── АВТОРИЗАЦИЯ ───────────────────────────────────────────────────────────
    async loginUser(body: LoginBody): Promise<string> {
        const result = await this.request<any>('/users/auth', 'POST', body);
        const token = typeof result === 'string' ? result : (result?.token || result?.key || '');
        if (token) localStorage.setItem('app_jwt_token', token);
        return token;
    }

    async registerUser(body: RegisterBody): Promise<any> {
        return this.request<any>('/users', 'PUT', body);
    }

    

    // ─── ПОСТЫ ─────────────────────────────────────────────────────────────────
    async getAllPosts(body?: Partial<GetAllPostsBody>): Promise<PostDTO[]> {
        return this.request<PostDTO[]>('/posts/getall', 'POST', body ?? {});
    }

    

    async getPostById(id: number): Promise<PostDTO> {
        return this.request<PostDTO>(`/posts/${id}`, 'GET');
    }

    async createPost(data: CreatePostBody): Promise<PostDTO> {
        return this.request<PostDTO>('/posts', 'PUT', data);
    }

    async updatePost(id: number, data: UpdatePostBody): Promise<PostDTO> {
        return this.request<PostDTO>(`/posts/${id}`, 'POST', data);
    }

    async deletePost(id: number): Promise<any> {
        return this.request(`/posts/${id}`, 'DELETE');
    }

    async toggleLike(id: number): Promise<string> {
        return this.request<string>(`/posts/${id}/likes`, 'POST');
    }

    // ─── КОММЕНТАРИИ ───────────────────────────────────────────────────────────
    async createComment(body: CreateCommentBody): Promise<CommentDTO> {
        return this.request<CommentDTO>('/posts/comments', 'PUT', body);
    }

    async deleteComment(id: number): Promise<any> {
        return this.request(`/posts/comments/${id}`, 'DELETE');
    }

    // ─── КАТЕГОРИИ ─────────────────────────────────────────────────────────────
    async getCategories(): Promise<CategoryDTO[]> {
        return this.request<CategoryDTO[]>('/categories', 'GET');
    }

    // ─── ПОЛЬЗОВАТЕЛИ ──────────────────────────────────────────────────────────
    async banUser(id: number, reason: string): Promise<any> {
        return this.request(`/users/${id}/ban`, 'POST', { reason });
    }

    // ─── ЗАГРУЗКА КАРТИНКИ (base64 → отправляем как поле) ─────────────────────
    // Сервер не имеет отдельного endpoint для загрузки файлов,
    // поэтому imageUrl передаём вместе с постом как строку (data-url).
    async fileToDataUrl(file: File): Promise<string> {
        return new Promise((resolve, reject) => {
            const reader = new FileReader();
            reader.onload = () => resolve(reader.result as string);
            reader.onerror = reject;
            reader.readAsDataURL(file);
        });
    }
}

export const api = new ApiService();

