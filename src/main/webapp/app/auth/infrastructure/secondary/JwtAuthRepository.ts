import type { AuthenticatedUser } from '@/auth/domain/AuthenticatedUser';
import type { AuthRepository } from '@/auth/domain/AuthRepository';
import type { LoginCredentials } from '@/auth/domain/LoginCredentials';
import type { LoginResponse } from '@/auth/domain/LoginResponse';
import type { RestLoginCredentials } from '@/auth/infrastructure/secondary/RestLoginCredentials';
import { toRestLoginCredentials } from '@/auth/infrastructure/secondary/RestLoginCredentials';
import type { AxiosHttp } from '@/shared/http/infrastructure/secondary/AxiosHttp';

export class JwtAuthRepository implements AuthRepository {
  constructor(
    private readonly axiosHttp: AxiosHttp,
    private readonly localStorage: Storage,
  ) {}

  login(credentials: LoginCredentials): Promise<void> {
    return this.axiosHttp
      .post<LoginResponse, RestLoginCredentials>('api/authenticate', toRestLoginCredentials(credentials))
      .then(response => {
        const loginResponse = response.data;
        this.localStorage.setItem('jwt-token', loginResponse.token);
      });
  }

  logout(): void {
    this.localStorage.removeItem('jwt-token');
  }

  getCurrentUser(): Promise<AuthenticatedUser> {
    return this.axiosHttp.get<AuthenticatedUser>('api/account').then(response => response.data);
  }

  isAuthenticated(): boolean {
    return !!this.localStorage.getItem('jwt-token');
  }

  getToken(): string | null {
    return this.localStorage.getItem('jwt-token');
  }
}
