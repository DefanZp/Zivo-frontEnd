import { User } from "./user.model";

export interface AuthResponse {
    message: string;
    token: string;
    // import dari model user
    user: User;
}