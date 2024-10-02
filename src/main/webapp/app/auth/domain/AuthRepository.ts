import type { LoginCredentials } from './LoginCredentials';
import type { AuthenticatedUser } from '@/auth/domain/AuthenticatedUser';

export interface AuthRepository {
  login(credentials: LoginCredentials): Promise<void>;
  logout(): Promise<void>;
  currentUser(): Promise<AuthenticatedUser>;
  authenticated(): Promise<boolean>;
  token(): Promise<string>;
}
