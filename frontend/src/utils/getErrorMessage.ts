import axios from 'axios';

interface ApiErrorBody {
  message?: string;
  errors?: Record<string, string[]>;
}

export function getErrorMessage(error: unknown, fallback = 'Ocurrió un error inesperado'): string {
  if (axios.isAxiosError<ApiErrorBody>(error)) {
    const body = error.response?.data;
    if (body?.errors) {
      const first = Object.values(body.errors)[0]?.[0];
      if (first) return first;
    }
    if (body?.message) return body.message;
  }
  if (error instanceof Error) return error.message;
  return fallback;
}
