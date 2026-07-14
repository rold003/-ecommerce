import { zodResolver } from '@hookform/resolvers/zod';
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { Link, Navigate, useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { useAuth } from '@/context/AuthContext';
import { useToast } from '@/context/ToastContext';
import { registerSchema, type RegisterFormValues } from '@/utils/authSchemas';
import { getErrorMessage } from '@/utils/getErrorMessage';

export default function Register() {
  const { usuario, register: registerUser } = useAuth();
  const toast = useToast();
  const navigate = useNavigate();
  const [submitting, setSubmitting] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<RegisterFormValues>({ resolver: zodResolver(registerSchema) });

  if (usuario) return <Navigate to="/" replace />;

  const onSubmit = async (values: RegisterFormValues): Promise<void> => {
    setSubmitting(true);
    try {
      await registerUser({
        nombre: values.nombre,
        apellido: values.apellido,
        email: values.email,
        password: values.password,
      });
      toast.success('Cuenta creada correctamente');
      navigate('/', { replace: true });
    } catch (err) {
      toast.error(getErrorMessage(err, 'No se pudo crear la cuenta'));
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="mx-auto flex min-h-[70vh] max-w-md flex-col justify-center px-4 py-16">
      <h1 className="text-2xl font-bold">Crear cuenta</h1>
      <p className="mt-1 text-sm text-neutral-500 dark:text-neutral-400">
        Regístrate para comprar, guardar favoritos y ver tus pedidos.
      </p>
      <form onSubmit={handleSubmit(onSubmit)} className="mt-8 flex flex-col gap-4" noValidate>
        <div className="grid grid-cols-2 gap-4">
          <Input label="Nombre" autoComplete="given-name" error={errors.nombre?.message} {...register('nombre')} />
          <Input
            label="Apellido"
            autoComplete="family-name"
            error={errors.apellido?.message}
            {...register('apellido')}
          />
        </div>
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
          autoComplete="new-password"
          hint="Mínimo 8 caracteres, con mayúscula, minúscula y número"
          error={errors.password?.message}
          {...register('password')}
        />
        <Input
          label="Confirmar contraseña"
          type="password"
          autoComplete="new-password"
          error={errors.confirmPassword?.message}
          {...register('confirmPassword')}
        />
        <Button type="submit" fullWidth loading={submitting}>
          Crear cuenta
        </Button>
      </form>
      <p className="mt-6 text-center text-sm text-neutral-500 dark:text-neutral-400">
        ¿Ya tienes cuenta?{' '}
        <Link to="/login" className="font-medium text-neutral-900 hover:underline dark:text-white">
          Inicia sesión
        </Link>
      </p>
    </div>
  );
}
