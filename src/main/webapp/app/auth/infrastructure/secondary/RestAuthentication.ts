import type { Authentication } from '@/auth/domain/Authentication';

type RestAuthenticationIdToken = string;

export type RestAuthentication = {
  id_token: RestAuthenticationIdToken;
};

export const mapToAuthentication = (restAuthentication: RestAuthentication): Authentication => ({
  token: restAuthentication.id_token,
});
