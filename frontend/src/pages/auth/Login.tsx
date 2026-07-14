import { zodResolver } from '@hookform/resolvers/zod';
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { Link, Navigate, useLocation, useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { useAuth } from '@/context/AuthContext';
import { useToast } from '@/context/ToastContext';
import { getErrorMessage } from '@/utils/getErrorMessage';
import { loginSchema, type LoginFormValues } from '@/utils/authSchemas';

export default function Login() {
  const { usuario, login } = useAuth();
  const toast = useToast();
  const navigate = useNavigate();
  const location = useLocation();
  const [submitting, setSubmitting] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginFormValues>({ resolver: zodResolver(loginSchema) });

  if (usuario) return <Navigate to="/" replace />;

  const from = (location.state as { from?: string } | null)?.from ?? '/';

  const onSubmit = async (values: LoginFormValues): Promise<void> => {
    setSubmitting(true);
    try {
      await login(values.email, values.password);
      toast.success('Sesión iniciada correctamente');
      navigate(from, { replace: true });
    } catch (err) {
      toast.error(getErrorMessage(err, 'Credenciales inválidas'));
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="mx-auto flex min-h-[70vh] max-w-md flex-col justify-center px-4 py-16">
      <h1 className="text-2xl font-bold">Iniciar sesión</h1>
      <p className="mt-1 text-sm text-neutral-500 dark:text-neutral-400">
        Ingresa tus datos para acceder a tu cuenta.
      </p>
      <form onSubmit={handleSubmit(onSubmit)} className="mt-8 flex flex-col gap-4" noValidate>
        <Input
          label="Correo electrónico"
          type="email"
          autoComplete="email"
          error={errors.email?.message}
          {...register('email')}
        />
        <Input
          label="Contraseña"
          type="password"
          autoComplete="current-password"
          error={errors.password?.message}
          {...register('password')}
        />
        <Link
          to="/recuperar-password"
          className="self-end text-sm font-medium text-neutral-600 hover:text-neutral-900 dark:text-neutral-400 dark:hover:text-white"
        >
          ¿Olvidaste tu contraseña?
        </Link>
        <Button type="submit" fullWidth loading={submitting}>
          Iniciar sesión
        </Button>
      </form>
      <p className="mt-6 text-center text-sm text-neutral-500 dark:text-neutral-400">
        ¿No tienes cuenta?{' '}
        <Link to="/registro" className="font-medium text-neutral-900 hover:underline dark:text-white">
          Regístrate
        </Link>
      </p>
    </div>
  );
}
