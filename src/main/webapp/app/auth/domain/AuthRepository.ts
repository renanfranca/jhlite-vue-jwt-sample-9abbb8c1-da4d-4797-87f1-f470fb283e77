import type { LoginCredentials } from './LoginCredentials';
import type { LoginResponse } from './LoginResponse';

export interface AuthRepository {
  login(credentials: LoginCredentials): Promise<LoginResponse>;
  logout(): void;
  getCurrentUser(): Promise<any>;
  isAuthenticated(): boolean;
}
