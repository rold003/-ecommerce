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

// Este formulario se monta dentro de un <Modal> (portal a document.body) que puede
// convivir en la misma página con otro formulario que también tenga un campo
// "telefono" (ej. la página de Perfil). Los ids se prefijan con "address-" para que
// nunca choquen con el id de otro input del documento (duplicar id rompe la
// asociación label->input y confunde a selectores/CSS/pruebas basadas en id).
export function AddressForm({ onSubmit, submitting, onCancel }: AddressFormProps) {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<AddressFormValues>({ resolver: zodResolver(addressSchema) });

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-4" noValidate>
      <div className="grid grid-cols-2 gap-4">
        <Input
          id="address-etiqueta"
          label="Etiqueta"
          placeholder="Casa, Trabajo..."
          error={errors.etiqueta?.message}
          {...register('etiqueta')}
        />
        <Input
          id="address-destinatario"
          label="Destinatario"
          error={errors.destinatario?.message}
          {...register('destinatario')}
        />
      </div>
      <div className="grid grid-cols-2 gap-4">
        <Input
          id="address-telefono"
          label="Teléfono"
          error={errors.telefono?.message}
          {...register('telefono')}
        />
        <Input
          id="address-numero"
          label="Número (opcional)"
          error={errors.numero?.message}
          {...register('numero')}
        />
      </div>
      <Input id="address-calle" label="Calle" error={errors.calle?.message} {...register('calle')} />
      <div className="grid grid-cols-2 gap-4">
        <Input id="address-ciudad" label="Ciudad" error={errors.ciudad?.message} {...register('ciudad')} />
        <Input
          id="address-provincia"
          label="Provincia"
          error={errors.provincia?.message}
          {...register('provincia')}
        />
      </div>
      <Input
        id="address-codigoPostal"
        label="Código postal"
        error={errors.codigoPostal?.message}
        {...register('codigoPostal')}
      />
      <Input
        id="address-referencia"
        label="Referencia (opcional)"
        error={errors.referencia?.message}
        {...register('referencia')}
      />
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
