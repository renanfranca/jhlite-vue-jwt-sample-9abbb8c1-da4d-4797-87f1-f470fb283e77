import type { AuthenticatedUser } from '@/auth/domain/AuthenticatedUser';
import type { AuthRepository } from '@/auth/domain/AuthRepository';
import type { LoginCredentials } from '@/auth/domain/LoginCredentials';
import type { RestAuthentication } from '@/auth/infrastructure/secondary/RestAuthentication';
import { mapToAuthentication } from '@/auth/infrastructure/secondary/RestAuthentication';
import type { RestLoginCredentials } from '@/auth/infrastructure/secondary/RestLoginCredentials';
import { toRestLoginCredentials } from '@/auth/infrastructure/secondary/RestLoginCredentials';
import type { AxiosHttp } from '@/shared/http/infrastructure/secondary/AxiosHttp';

const STORAGE_KEY_JWT_TOKEN = 'jwtToken';

export class JwtAuthRepository implements AuthRepository {
  constructor(
    private readonly axiosHttp: AxiosHttp,
    private readonly localStorage: Storage,
  ) {}

  login(credentials: LoginCredentials): Promise<void> {
    return this.axiosHttp
      .post<RestAuthentication, RestLoginCredentials>('api/authenticate', toRestLoginCredentials(credentials))
      .then(response => this.localStorage.setItem(STORAGE_KEY_JWT_TOKEN, mapToAuthentication(response).token));
  }

  logout(): void {
    this.localStorage.removeItem(STORAGE_KEY_JWT_TOKEN);
  }

  getCurrentUser(): Promise<AuthenticatedUser> {
    return this.axiosHttp.get<AuthenticatedUser>('api/account').then(response => response.data);
  }

  isAuthenticated(): Promise<boolean> {
    return this.getToken()
      .then(token => !!token)
      .catch(() => false);
  }

  getToken(): Promise<string> {
    return new Promise((resolve, reject) => {
      const token = this.localStorage.getItem(STORAGE_KEY_JWT_TOKEN);
      if (token) {
        resolve(token);
      } else {
        reject(new Error('No authentication token found'));
      }
    });
  }
}
