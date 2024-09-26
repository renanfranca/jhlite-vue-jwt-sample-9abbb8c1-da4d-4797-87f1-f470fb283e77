export interface AuthRepository {
  login(username: string, password: string): Promise<void>;
  logout(): Promise<void>;
  getCurrentUser(): Promise<any>;
  isAuthenticated(): boolean;
}
