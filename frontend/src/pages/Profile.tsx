import { zodResolver } from '@hookform/resolvers/zod';
import { Plus, Star, Trash2 } from 'lucide-react';
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { useNavigate } from 'react-router-dom';
import { AddressForm } from '@/components/checkout/AddressForm';
import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';
import { ConfirmDialog } from '@/components/ui/ConfirmDialog';
import { Input } from '@/components/ui/Input';
import { Modal } from '@/components/ui/Modal';
import { useAuth } from '@/context/AuthContext';
import { useToast } from '@/context/ToastContext';
import { useAddresses, useCreateAddress, useDeleteAddress, useUpdateAddress } from '@/hooks/useAddresses';
import { userService } from '@/services/user.service';
import type { AddressFormValues } from '@/utils/addressSchema';
import { getErrorMessage } from '@/utils/getErrorMessage';
import {
  changePasswordSchema,
  profileSchema,
  type ChangePasswordFormValues,
  type ProfileFormValues,
} from '@/utils/profileSchemas';

export default function Profile() {
  const { usuario, logout, refetchUser } = useAuth();
  const toast = useToast();
  const navigate = useNavigate();

  const profileForm = useForm<ProfileFormValues>({
    resolver: zodResolver(profileSchema),
    defaultValues: {
      nombre: usuario?.nombre ?? '',
      apellido: usuario?.apellido ?? '',
      telefono: usuario?.telefono ?? '',
    },
  });
  const [savingProfile, setSavingProfile] = useState(false);

  const onSaveProfile = async (values: ProfileFormValues): Promise<void> => {
    setSavingProfile(true);
    try {
      await userService.updateProfile({ ...values, telefono: values.telefono || null });
      await refetchUser();
      toast.success('Perfil actualizado');
    } catch (err) {
      toast.error(getErrorMessage(err));
    } finally {
      setSavingProfile(false);
    }
  };

  const passwordForm = useForm<ChangePasswordFormValues>({ resolver: zodResolver(changePasswordSchema) });
  const [changingPassword, setChangingPassword] = useState(false);

  const onChangePassword = async (values: ChangePasswordFormValues): Promise<void> => {
    setChangingPassword(true);
    try {
      await userService.changePassword(values.currentPassword, values.newPassword);
      toast.success('Contraseña actualizada, vuelve a iniciar sesión');
      await logout();
      navigate('/login', { replace: true });
    } catch (err) {
      toast.error(getErrorMessage(err));
      setChangingPassword(false);
    }
  };

  const { data: direcciones } = useAddresses();
  const createAddress = useCreateAddress();
  const updateAddress = useUpdateAddress();
  const deleteAddress = useDeleteAddress();
  const [showAddressModal, setShowAddressModal] = useState(false);
  const [addressToDelete, setAddressToDelete] = useState<string | null>(null);

  const handleCreateAddress = async (values: AddressFormValues): Promise<void> => {
    try {
      await createAddress.mutateAsync(values);
      setShowAddressModal(false);
      toast.success('Dirección agregada');
    } catch (err) {
      toast.error(getErrorMessage(err));
    }
  };

  const handleSetDefault = async (id: string): Promise<void> => {
    try {
      await updateAddress.mutateAsync({ id, input: { predeterminada: true } });
      toast.success('Dirección predeterminada actualizada');
    } catch (err) {
      toast.error(getErrorMessage(err));
    }
  };

  const handleDeleteAddress = async (): Promise<void> => {
    if (!addressToDelete) return;
    try {
      await deleteAddress.mutateAsync(addressToDelete);
      toast.success('Dirección eliminada');
    } catch (err) {
      toast.error(getErrorMessage(err));
    } finally {
      setAddressToDelete(null);
    }
  };

  return (
    <div className="mx-auto max-w-3xl px-4 py-8 sm:px-6 lg:px-8">
      <h1 className="mb-6 text-2xl font-bold">Mi perfil</h1>

      <Card className="mb-6 p-6">
        <h2 className="mb-4 font-semibold">Datos personales</h2>
        <form onSubmit={profileForm.handleSubmit(onSaveProfile)} className="flex flex-col gap-4" noValidate>
          <div className="grid grid-cols-2 gap-4">
            <Input label="Nombre" error={profileForm.formState.errors.nombre?.message} {...profileForm.register('nombre')} />
            <Input
              label="Apellido"
              error={profileForm.formState.errors.apellido?.message}
              {...profileForm.register('apellido')}
            />
          </div>
          <Input
            label="Teléfono"
            error={profileForm.formState.errors.telefono?.message}
            {...profileForm.register('telefono')}
          />
          <Input label="Correo electrónico" value={usuario?.email ?? ''} disabled />
          <Button type="submit" loading={savingProfile} className="self-start">
            Guardar cambios
          </Button>
        </form>
      </Card>

      <Card className="mb-6 p-6">
        <h2 className="mb-4 font-semibold">Cambiar contraseña</h2>
        <form onSubmit={passwordForm.handleSubmit(onChangePassword)} className="flex flex-col gap-4" noValidate>
          <Input
            label="Contraseña actual"
            type="password"
            autoComplete="current-password"
            error={passwordForm.formState.errors.currentPassword?.message}
            {...passwordForm.register('currentPassword')}
          />
          <Input
            label="Nueva contraseña"
            type="password"
            autoComplete="new-password"
            error={passwordForm.formState.errors.newPassword?.message}
            {...passwordForm.register('newPassword')}
          />
          <Input
            label="Confirmar nueva contraseña"
            type="password"
            autoComplete="new-password"
            error={passwordForm.formState.errors.confirmPassword?.message}
            {...passwordForm.register('confirmPassword')}
          />
          <Button type="submit" loading={changingPassword} className="self-start">
            Actualizar contraseña
          </Button>
        </form>
      </Card>

      <Card className="p-6">
        <div className="mb-4 flex items-center justify-between">
          <h2 className="font-semibold">Direcciones</h2>
          <Button variant="ghost" size="sm" onClick={() => setShowAddressModal(true)}>
            <Plus className="h-4 w-4" /> Nueva
          </Button>
        </div>
        <div className="flex flex-col gap-3">
          {direcciones?.map((dir) => (
            <div
              key={dir.id}
              className="flex items-start justify-between rounded-xl border border-neutral-200 p-3 text-sm dark:border-neutral-800"
            >
              <div>
                <p className="font-medium">
                  {dir.etiqueta}{' '}
                  {dir.predeterminada && (
                    <span className="ml-1 text-xs text-emerald-600 dark:text-emerald-400">(Predeterminada)</span>
                  )}
                </p>
                <p className="text-neutral-500 dark:text-neutral-400">
                  {dir.calle} {dir.numero}, {dir.ciudad}, {dir.provincia}
                </p>
              </div>
              <div className="flex items-center gap-2">
                {!dir.predeterminada && (
                  <button
                    type="button"
                    onClick={() => handleSetDefault(dir.id)}
                    title="Marcar como predeterminada"
                    className="text-neutral-400 hover:text-amber-500"
                  >
                    <Star className="h-4 w-4" />
                  </button>
                )}
                <button
                  type="button"
                  onClick={() => setAddressToDelete(dir.id)}
                  className="text-red-500 hover:text-red-700"
                  aria-label="Eliminar dirección"
                >
                  <Trash2 className="h-4 w-4" />
                </button>
              </div>
            </div>
          ))}
          {direcciones?.length === 0 && (
            <p className="text-sm text-neutral-500 dark:text-neutral-400">No tienes direcciones guardadas.</p>
          )}
        </div>
      </Card>

      <Modal open={showAddressModal} onClose={() => setShowAddressModal(false)} title="Nueva dirección">
        <AddressForm
          onSubmit={handleCreateAddress}
          submitting={createAddress.isPending}
          onCancel={() => setShowAddressModal(false)}
        />
      </Modal>

      <ConfirmDialog
        open={Boolean(addressToDelete)}
        title="Eliminar dirección"
        description="¿Seguro que quieres eliminar esta dirección?"
        variant="danger"
        confirmLabel="Eliminar"
        onConfirm={handleDeleteAddress}
        onCancel={() => setAddressToDelete(null)}
        loading={deleteAddress.isPending}
      />
    </div>
  );
}
