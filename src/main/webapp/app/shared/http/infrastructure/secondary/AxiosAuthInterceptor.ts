import { AUTH_REPOSITORY } from '@/auth/application/AuthProvider';
import { inject } from '@/injections';
import type { AxiosError, AxiosInstance, AxiosResponse, InternalAxiosRequestConfig } from 'axios';

export const setupAxiosInterceptors = (axios: AxiosInstance): void => {
  const auths = inject(AUTH_REPOSITORY);

  axios.interceptors.request.use(async (config: InternalAxiosRequestConfig) => {
    return auths
      .authenticated()
      .then(authenticated => {
        if (authenticated) {
          return auths.token().then(token => {
            config.headers = config.headers || {};
            config.headers['Authorization'] = `Bearer ${token}`;
            return config;
          });
        }

        return config;
      })
      .catch(error => {
        console.error('Failed to set Authorization header:', error);
        return config;
      });
  });

  axios.interceptors.response.use(
    (response: AxiosResponse): AxiosResponse => response,
    async (error: AxiosError): Promise<never> => {
      if (error.response && error.response.status === 401) {
        auths.logout().then(() => {
          //TODO: Redirect to login page or update application state
        });
      }
      return Promise.reject(error);
    },
  );
};
