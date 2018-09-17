import { User } from './user';

export interface Session {
    user: User;
    expiresDate: string;
}
