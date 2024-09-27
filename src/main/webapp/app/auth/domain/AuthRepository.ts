import type { LoginCredentials } from './LoginCredentials';

export interface AuthRepository {
  login(credentials: LoginCredentials): Promise<void>;
  logout(): void;
  getCurrentUser(): Promise<any>;
  isAuthenticated(): boolean;
}
