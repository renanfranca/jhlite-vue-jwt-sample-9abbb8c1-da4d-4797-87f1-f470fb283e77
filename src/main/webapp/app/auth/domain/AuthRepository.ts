import { LoginCredentials } from './LoginCredentials';
import { LoginResponse } from './LoginResponse';

export interface AuthRepository {
  login(credentials: LoginCredentials): Promise<LoginResponse>;
  logout(): void;
  getCurrentUser(): Promise<any>;
  isAuthenticated(): boolean;
}
