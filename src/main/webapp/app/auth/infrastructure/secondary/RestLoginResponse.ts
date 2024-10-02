import type { Authentication } from '@/auth/domain/Authentication';

type RestLoginResponseIdToken = string;

export type RestLoginResponse = {
  id_token: RestLoginResponseIdToken;
};

export const mapToAuthentication = (restLoginResponse: RestLoginResponse): Authentication => ({
  token: restLoginResponse.id_token,
});
