import { createContext, useContext, useEffect, useState, type ReactNode } from 'react';
import { authService, type RegisterInput } from '@/services/auth.service';
import type { Usuario } from '@/types/user';

interface AuthContextValue {
  usuario: Usuario | null;
  loading: boolean;
  login: (email: string, password: string) => Promise<void>;
  register: (input: RegisterInput) => Promise<void>;
  logout: () => Promise<void>;
  refetchUser: () => Promise<void>;
}

const AuthContext = createContext<AuthContextValue | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [usuario, setUsuario] = useState<Usuario | null>(null);
  const [loading, setLoading] = useState(true);

  const fetchUser = async (): Promise<void> => {
    try {
      const u = await authService.me();
      setUsuario(u);
    } catch {
      setUsuario(null);
    }
  };

  useEffect(() => {
    void (async () => {
      await fetchUser();
      setLoading(false);
    })();
  }, []);

  const login = async (email: string, password: string): Promise<void> => {
    const u = await authService.login({ email, password });
    setUsuario(u);
  };

  const register = async (input: RegisterInput): Promise<void> => {
    const u = await authService.register(input);
    setUsuario(u);
  };

  const logout = async (): Promise<void> => {
    await authService.logout();
    setUsuario(null);
  };

  return (
    <AuthContext.Provider value={{ usuario, loading, login, register, logout, refetchUser: fetchUser }}>
      {children}
    </AuthContext.Provider>
  );
}

// eslint-disable-next-line react-refresh/only-export-components -- hook co-ubicado a proposito con su Provider; separarlo tocaria 10 imports solo por HMR
export function useAuth(): AuthContextValue {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth debe usarse dentro de <AuthProvider>');
  return ctx;
}
