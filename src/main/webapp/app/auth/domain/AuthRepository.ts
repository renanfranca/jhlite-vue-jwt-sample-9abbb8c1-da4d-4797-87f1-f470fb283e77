export interface AuthRepository {
  login(username: string, password: string): Promise<void>;
  logout(): void;
  getCurrentUser(): Promise<any>;
  isAuthenticated(): boolean;
}
