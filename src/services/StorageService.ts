export class StorageService<T> {
    private readonly key: string;

    constructor(key: string) {
        this.key = key;
    }

    public save(data: T): void {
        localStorage.setItem(this.key, JSON.stringify(data));
    }

    public load(): T | null {
        const item = localStorage.getItem(this.key);
        return item ? JSON.parse(item) : null;
    }
}