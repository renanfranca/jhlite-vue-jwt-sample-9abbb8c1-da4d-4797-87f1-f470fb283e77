import type { AuthRepository } from '@/auth/domain/AuthRepository';
import type { AxiosHttp } from '@/shared/http/infrastructure/secondary/AxiosHttp';

export class JwtAuthRepository implements AuthRepository {
  constructor(private readonly axiosHttp: AxiosHttp) {}

  login(username: string, password: string): Promise<void> {
    return this.axiosHttp.post('/api/auth/login', { username, password }).then(response => {
      //TODO: makes the response strong typed
      localStorage.setItem('jwt-token', response.data.token);
    });
  }

  logout(): void {
    localStorage.removeItem('jwt-token');
  }

  getCurrentUser(): Promise<any> {
    //TODO: makes the response strong typed
    return this.axiosHttp.get('/api/auth/user').then(response => response.data);
  }

  isAuthenticated(): boolean {
    return !!localStorage.getItem('jwt-token');
  }
}
