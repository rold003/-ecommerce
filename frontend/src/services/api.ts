import axios from 'axios';

// withCredentials: true es necesario para que las cookies httpOnly de sesión
// (accessToken/refreshToken) viajen en cada request al backend.
export const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL ?? 'http://localhost:4000/api/v1',
  withCredentials: true,
});
