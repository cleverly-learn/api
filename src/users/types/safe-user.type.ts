import { User } from 'users/entities/user.entity';

export type SafeUser = Omit<User, 'password'>;
