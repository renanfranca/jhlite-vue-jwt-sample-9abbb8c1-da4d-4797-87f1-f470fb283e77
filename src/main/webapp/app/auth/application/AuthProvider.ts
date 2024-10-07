import { key } from 'piqure';
import { provide } from '@/injections';
import type { AuthRepository } from '@/auth/domain/AuthRepository';
import { JwtAuthRepository } from '@/auth/infrastructure/secondary/JwtAuthRepository';
import type { AxiosHttp } from '@/shared/http/infrastructure/secondary/AxiosHttp';

export const AUTH_REPOSITORY = key<AuthRepository>('AuthRepository');

export const provideForAuth = (axiosHttp: AxiosHttp): void => {
  provide(AUTH_REPOSITORY, new JwtAuthRepository(axiosHttp, localStorage));
};
