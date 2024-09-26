import type { AuthRepository } from '@/auth/domain/AuthRepository';
import type { AxiosHttp } from '@/shared/http/infrastructure/secondary/AxiosHttp';

export class JwtAuthRepository implements AuthRepository {
  constructor(private readonly axiosHttp: AxiosHttp) {}

  login(username: string, password: string): Promise<void> {
    return this.axiosHttp.post('/api/auth/login', { username, password })
      .then(response => {
        localStorage.setItem('jwt-token', response.data.token);
      })
      .catch(error => {
        console.error('Login failed:', error);
        throw error;
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
      .then(response => response.data)
      .catch(error => {
        console.error('Failed to get current user:', error);
        throw error;
      });
  }

  isAuthenticated(): Promise<boolean> {
    return new Promise<boolean>(resolve => {
      resolve(!!localStorage.getItem('jwt-token'));
    });
  }
}
