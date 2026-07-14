import axios, { AxiosError, type InternalAxiosRequestConfig } from 'axios';

// withCredentials: true es necesario para que las cookies httpOnly de sesión
// (accessToken/refreshToken) viajen en cada request al backend.
export const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL ?? 'http://localhost:4000/api/v1',
  withCredentials: true,
});

interface RetryableRequestConfig extends InternalAxiosRequestConfig {
  _retry?: boolean;
}

let isRefreshing = false;
let pendingRequests: Array<() => void> = [];

const AUTH_ENDPOINTS_WITHOUT_RETRY = ['/auth/login', '/auth/register', '/auth/refresh', '/auth/logout'];

// Si un request cualquiera responde 401 (access token vencido), se intenta refrescar
// la sesión una sola vez (aunque lleguen varios 401 en paralelo, solo se dispara un
// /auth/refresh) y se reintenta el request original. Si el refresh falla, se deja
// que el 401 se propague normalmente (AuthContext lo interpreta como sesión cerrada).
api.interceptors.response.use(
  (response) => response,
  async (error: AxiosError) => {
    const originalRequest = error.config as RetryableRequestConfig | undefined;
    const status = error.response?.status;
    const url = originalRequest?.url ?? '';
    const isAuthEndpoint = AUTH_ENDPOINTS_WITHOUT_RETRY.some((path) => url.includes(path));

    if (status === 401 && originalRequest && !originalRequest._retry && !isAuthEndpoint) {
      if (isRefreshing) {
        return new Promise((resolve) => {
          pendingRequests.push(() => resolve(api(originalRequest)));
        });
      }

      originalRequest._retry = true;
      isRefreshing = true;

      try {
        await api.post('/auth/refresh');
        pendingRequests.forEach((run) => run());
        pendingRequests = [];
        return await api(originalRequest);
      } catch (refreshError) {
        pendingRequests = [];
        return await Promise.reject(refreshError);
      } finally {
        isRefreshing = false;
      }
    }

    return Promise.reject(error);
  },
);
