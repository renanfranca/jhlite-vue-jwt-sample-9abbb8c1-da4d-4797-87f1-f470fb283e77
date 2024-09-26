import type { AuthRepository } from '@/auth/domain/AuthRepository';
import type { AxiosHttp } from '@/shared/http/infrastructure/secondary/AxiosHttp';

export class JwtAuthRepository implements AuthRepository {
  constructor(private readonly axiosHttp: AxiosHttp) {}

  login(username: string, password: string): Promise<void> {
    return this.axiosHttp.post('/api/auth/login', { username, password })
      .then(response => {
        localStorage.setItem('jwt-token', response.data.token);
      });
  }

  logout(): Promise<void> {
    return new Promise<void>(resolve => {
      localStorage.removeItem('jwt-token');
      resolve();
    });
  }

  getCurrentUser(): Promise<any> {
    return this.axiosHttp.get('/api/auth/user')
      .then(response => response.data);
  }

  isAuthenticated(): boolean {
    return !!localStorage.getItem('jwt-token');
  }
}
