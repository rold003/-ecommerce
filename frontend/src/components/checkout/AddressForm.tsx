import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { addressSchema, type AddressFormValues } from '@/utils/addressSchema';

interface AddressFormProps {
  onSubmit: (values: AddressFormValues) => Promise<void>;
  submitting?: boolean;
  onCancel?: () => void;
}

export function AddressForm({ onSubmit, submitting, onCancel }: AddressFormProps) {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<AddressFormValues>({ resolver: zodResolver(addressSchema) });

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-4" noValidate>
      <div className="grid grid-cols-2 gap-4">
        <Input label="Etiqueta" placeholder="Casa, Trabajo..." error={errors.etiqueta?.message} {...register('etiqueta')} />
        <Input label="Destinatario" error={errors.destinatario?.message} {...register('destinatario')} />
      </div>
      <div className="grid grid-cols-2 gap-4">
        <Input label="Teléfono" error={errors.telefono?.message} {...register('telefono')} />
        <Input label="Número (opcional)" error={errors.numero?.message} {...register('numero')} />
      </div>
      <Input label="Calle" error={errors.calle?.message} {...register('calle')} />
      <div className="grid grid-cols-2 gap-4">
        <Input label="Ciudad" error={errors.ciudad?.message} {...register('ciudad')} />
        <Input label="Provincia" error={errors.provincia?.message} {...register('provincia')} />
      </div>
      <Input label="Código postal" error={errors.codigoPostal?.message} {...register('codigoPostal')} />
      <Input label="Referencia (opcional)" error={errors.referencia?.message} {...register('referencia')} />
      <div className="flex justify-end gap-3">
        {onCancel && (
          <Button type="button" variant="outline" onClick={onCancel}>
            Cancelar
          </Button>
        )}
        <Button type="submit" loading={submitting}>
          Guardar dirección
        </Button>
      </div>
    </form>
  );
}
