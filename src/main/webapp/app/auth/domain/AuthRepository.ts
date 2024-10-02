import type { LoginCredentials } from './LoginCredentials';

export interface AuthRepository {
  login(credentials: LoginCredentials): Promise<void>;
  logout(): Promise<void>;
  currentUser(): Promise<any>;
  authenticated(): Promise<boolean>;
  token(): Promise<string>;
}
