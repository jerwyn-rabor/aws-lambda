import { HttpRequest } from '../../../libs/Contracts/HttpRequest';

export class LoginRequest implements HttpRequest {
    mobile: string;
    email: string;
    password: string;
}
