import type { AuthRepository } from '@/auth/domain/AuthRepository';
import type { AxiosHttp } from '@/shared/http/infrastructure/secondary/AxiosHttp';

export class JwtAuthRepository implements AuthRepository {
  constructor(private readonly axiosHttp: AxiosHttp) {}

  async login(username: string, password: string): Promise<void> {
    const response = await this.axiosHttp.post('/api/auth/login', { username, password });
    localStorage.setItem('jwt-token', response.data.token);
  }

  async logout(): Promise<void> {
    localStorage.removeItem('jwt-token');
  }

  async getCurrentUser(): Promise<any> {
    const response = await this.axiosHttp.get('/api/auth/user');
    return response.data;
  }

  async isAuthenticated(): Promise<boolean> {
    return !!localStorage.getItem('jwt-token');
  }
}
