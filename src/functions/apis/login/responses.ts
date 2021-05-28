import { HttpResponse } from '../../../libs/Contracts/HttpResponse';

export class Responses {
    static STATUS_200: HttpResponse = {
        code: 200,
        message: 'Login successful',
    };
}

export class AuthAccessDeniedByUsername {
    public code = 401;
    public message = 'Invalid username';
}

export class AuthAccessDeniedByPassword {
    public code = 401;
    public attempt = 0;
    public message = '';

    constructor(attempt: number) {
        this.attempt = attempt;
        this.message = `Invalid password. ${this.attempt} remaining attempt(s)`;
    }
}

export class AuthAccessDeniedByLockedAccount {
    public code = 401;
    public message = 'Too many login attempts. Please try again after 10 minutes.';
}
