import { User } from './User';

export class AdminUser extends User {

    private readonly adminPass: string = "123"; // Твой секретный пароль

    public static readonly MAX_PERMISSIONS = 5;
    private permissions: Set<string>;

    checkPassword(pass: string): boolean {
        return pass === this.adminPass;
    }

    constructor(id: number, name: string) {
        super(id, name, 'admin');
        this.permissions = new Set<string>();
    }

    public grantPermission(permission: string): boolean {
        if (this.permissions.size >= AdminUser.MAX_PERMISSIONS) return false;
        this.permissions.add(permission);
        return true;
    }

    public getPermissions(): string[] {
        return Array.from(this.permissions);
    }

    public override hasRole(role: string): boolean {
        if (this.permissions.has(role)) return true;
        return super.hasRole(role);
    }

    public banUser(userId: number, reason: string): string {
        if (!this.permissions.has('manage_users')) return "Недостаточно прав";
        return `ГАЗЕТНЫЙ БАН: Юзер #${userId} удален. Причина: ${reason}`;
    }

    canManageUsers(): boolean {
        // Проверяем, есть ли в массиве разрешений нужная строка
        return this.permissions.has('manage_users');
    }
}