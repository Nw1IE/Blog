export class User {
    public readonly id: number;
    public readonly name: string;
    protected role: string;

    constructor(id: number, name: string, role: string = 'reader') {
        this.id = id;
        this.name = name;
        this.role = role;
    }

    public hasRole(role: string): boolean {
        return this.role === role;
    }
}