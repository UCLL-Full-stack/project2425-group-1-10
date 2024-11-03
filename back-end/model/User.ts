export class User {
    private id?: number;
    private username: string;
    private password: string;
    private email: string;

    constructor(user: {
        id?: number;
        username: string;
        password: string;
        email: string;
    }) {
        this.validate(user);

        this.id = user.id;
        this.username = user.username;
        this.password = user.password;
        this.email = user.email;
    }

    getId(): number | undefined {
        return this.id;
    }

    getUsername(): string {
        return this.username;
    }

    getPassword(): string {
        return this.password;
    }

    getEmail(): string {
        return this.email;
    }

    toPlainObject() {
        return {
            id: this.id,
            username: this.username,
            password: this.password,
            email: this.email,
        };
    }

    private validate(user: {
        username: string;
        password: string;
        email: string;
    }) {
        if (!user.username?.trim()) {
            throw new Error('Username is required');
        }
        if (!user.password?.trim()) {
            throw new Error('Password is required');
        }
        if (!user.email?.trim()) {
            throw new Error('Email is required');
        }
    }
}
