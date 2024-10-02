import type { LoginCredentials } from './LoginCredentials';

export interface AuthRepository {
  login(credentials: LoginCredentials): Promise<void>;
  logout(): void;
  getCurrentUser(): Promise<any>;
  isAuthenticated(): Promise<boolean>;
  getToken(): Promise<string>;
}
