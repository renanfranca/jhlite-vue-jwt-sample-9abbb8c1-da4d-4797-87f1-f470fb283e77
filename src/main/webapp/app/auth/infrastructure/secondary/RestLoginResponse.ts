import type { LoginResponse } from '@/auth/domain/LoginResponse';

type RestLoginResponseIdToken = string;

export type RestLoginResponse = {
  id_token: RestLoginResponseIdToken;
};

export const mapToLoginResponse = (restLoginResponse: RestLoginResponse): LoginResponse => ({
  token: restLoginResponse.id_token,
});
