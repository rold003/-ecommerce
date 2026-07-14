import { zodResolver } from '@hookform/resolvers/zod';
import { CheckCircle2 } from 'lucide-react';
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { useToast } from '@/context/ToastContext';
import { authService } from '@/services/auth.service';
import {
  forgotPasswordSchema,
  resetPasswordSchema,
  type ForgotPasswordFormValues,
  type ResetPasswordFormValues,
} from '@/utils/authSchemas';
import { getErrorMessage } from '@/utils/getErrorMessage';

function ForgotPasswordForm() {
  const [submitting, setSubmitting] = useState(false);
  const [sent, setSent] = useState(false);
  const toast = useToast();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<ForgotPasswordFormValues>({ resolver: zodResolver(forgotPasswordSchema) });

  const onSubmit = async (values: ForgotPasswordFormValues): Promise<void> => {
    setSubmitting(true);
    try {
      await authService.forgotPassword(values.email);
      setSent(true);
    } catch (err) {
      toast.error(getErrorMessage(err));
    } finally {
      setSubmitting(false);
    }
  };

  if (sent) {
    return (
      <div className="flex flex-col items-center gap-3 text-center">
        <CheckCircle2 className="h-10 w-10 text-emerald-500" />
        <h1 className="text-xl font-bold">Revisa tu correo</h1>
        <p className="text-sm text-neutral-500 dark:text-neutral-400">
          Si el correo existe en nuestro sistema, te enviamos un enlace para restablecer tu contraseña.
        </p>
      </div>
    );
  }

  return (
    <>
      <h1 className="text-2xl font-bold">Recuperar contraseña</h1>
      <p className="mt-1 text-sm text-neutral-500 dark:text-neutral-400">
        Ingresa tu correo y te enviaremos instrucciones para restablecerla.
      </p>
      <form onSubmit={handleSubmit(onSubmit)} className="mt-8 flex flex-col gap-4" noValidate>
        <Input
          label="Correo electrónico"
          type="email"
          autoComplete="email"
          error={errors.email?.message}
          {...register('email')}
        />
        <Button type="submit" fullWidth loading={submitting}>
          Enviar instrucciones
        </Button>
      </form>
    </>
  );
}

function ResetPasswordForm({ token }: { token: string }) {
  const [submitting, setSubmitting] = useState(false);
  const toast = useToast();
  const navigate = useNavigate();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<ResetPasswordFormValues>({ resolver: zodResolver(resetPasswordSchema) });

  const onSubmit = async (values: ResetPasswordFormValues): Promise<void> => {
    setSubmitting(true);
    try {
      await authService.resetPassword(token, values.password);
      toast.success('Contraseña actualizada, ya puedes iniciar sesión');
      navigate('/login', { replace: true });
    } catch (err) {
      toast.error(getErrorMessage(err, 'El enlace expiró o no es válido'));
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <>
      <h1 className="text-2xl font-bold">Elige una nueva contraseña</h1>
      <form onSubmit={handleSubmit(onSubmit)} className="mt-8 flex flex-col gap-4" noValidate>
        <Input
          label="Nueva contraseña"
          type="password"
          autoComplete="new-password"
          hint="Mínimo 8 caracteres, con mayúscula, minúscula y número"
          error={errors.password?.message}
          {...register('password')}
        />
        <Input
          label="Confirmar nueva contraseña"
          type="password"
          autoComplete="new-password"
          error={errors.confirmPassword?.message}
          {...register('confirmPassword')}
        />
        <Button type="submit" fullWidth loading={submitting}>
          Restablecer contraseña
        </Button>
      </form>
    </>
  );
}

export default function RecuperarPassword() {
  const [searchParams] = useSearchParams();
  const token = searchParams.get('token');

  return (
    <div className="mx-auto flex min-h-[70vh] max-w-md flex-col justify-center px-4 py-16">
      {token ? <ResetPasswordForm token={token} /> : <ForgotPasswordForm />}
      <p className="mt-6 text-center text-sm text-neutral-500 dark:text-neutral-400">
        <Link to="/login" className="font-medium text-neutral-900 hover:underline dark:text-white">
          Volver a iniciar sesión
        </Link>
      </p>
    </div>
  );
}
