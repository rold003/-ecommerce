import { zodResolver } from '@hookform/resolvers/zod';
import { Pencil, Plus, Trash2 } from 'lucide-react';
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { Button } from '@/components/ui/Button';
import { ConfirmDialog } from '@/components/ui/ConfirmDialog';
import { Input } from '@/components/ui/Input';
import { Modal } from '@/components/ui/Modal';
import { Spinner } from '@/components/ui/Spinner';
import { useToast } from '@/context/ToastContext';
import { useAdminBrands, useCreateBrand, useDeleteBrand, useUpdateBrand } from '@/hooks/useAdminBrands';
import type { Marca } from '@/types/product';
import { brandSchema, type BrandFormValues } from '@/utils/brandSchema';
import { getErrorMessage } from '@/utils/getErrorMessage';

function BrandForm({
  initial,
  onSubmit,
  submitting,
  onCancel,
}: {
  initial?: Marca;
  onSubmit: (values: BrandFormValues) => Promise<void>;
  submitting?: boolean;
  onCancel: () => void;
}) {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<BrandFormValues>({
    resolver: zodResolver(brandSchema),
    defaultValues: initial ? { nombre: initial.nombre, logoUrl: initial.logoUrl ?? '' } : undefined,
  });

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-4" noValidate>
      <Input label="Nombre" error={errors.nombre?.message} {...register('nombre')} />
      <Input label="URL de logo (opcional)" error={errors.logoUrl?.message} {...register('logoUrl')} />
      <div className="flex justify-end gap-3">
        <Button type="button" variant="outline" onClick={onCancel}>
          Cancelar
        </Button>
        <Button type="submit" loading={submitting}>
          Guardar
        </Button>
      </div>
    </form>
  );
}

export default function Brands() {
  const { data: marcas, isLoading } = useAdminBrands();
  const createBrand = useCreateBrand();
  const updateBrand = useUpdateBrand();
  const deleteBrand = useDeleteBrand();
  const toast = useToast();

  const [showForm, setShowForm] = useState(false);
  const [editing, setEditing] = useState<Marca | null>(null);
  const [deleting, setDeleting] = useState<Marca | null>(null);

  const handleSubmit = async (values: BrandFormValues): Promise<void> => {
    const input = { nombre: values.nombre, logoUrl: values.logoUrl || undefined };
    try {
      if (editing) {
        await updateBrand.mutateAsync({ id: editing.id, input });
        toast.success('Marca actualizada');
      } else {
        await createBrand.mutateAsync(input);
        toast.success('Marca creada');
      }
      setShowForm(false);
      setEditing(null);
    } catch (err) {
      toast.error(getErrorMessage(err));
    }
  };

  const handleDelete = async (): Promise<void> => {
    if (!deleting) return;
    try {
      await deleteBrand.mutateAsync(deleting.id);
      toast.success('Marca eliminada');
    } catch (err) {
      toast.error(getErrorMessage(err));
    } finally {
      setDeleting(null);
    }
  };

  return (
    <div className="flex flex-col gap-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">Marcas</h1>
        <Button
          onClick={() => {
            setEditing(null);
            setShowForm(true);
          }}
        >
          <Plus className="h-4 w-4" /> Nueva marca
        </Button>
      </div>

      {isLoading ? (
        <div className="flex min-h-[40vh] items-center justify-center">
          <Spinner className="h-8 w-8 text-neutral-400" />
        </div>
      ) : (
        <div className="overflow-x-auto rounded-2xl border border-neutral-200 dark:border-neutral-800">
          <table className="w-full text-sm">
            <thead className="border-b border-neutral-200 bg-neutral-50 text-left text-xs uppercase text-neutral-500 dark:border-neutral-800 dark:bg-neutral-900 dark:text-neutral-400">
              <tr>
                <th className="px-4 py-3">Nombre</th>
                <th className="px-4 py-3">Slug</th>
                <th className="px-4 py-3" />
              </tr>
            </thead>
            <tbody>
              {marcas?.map((m) => (
                <tr key={m.id} className="border-b border-neutral-100 last:border-0 dark:border-neutral-800">
                  <td className="px-4 py-3 font-medium">{m.nombre}</td>
                  <td className="px-4 py-3 text-neutral-500 dark:text-neutral-400">{m.slug}</td>
                  <td className="px-4 py-3">
                    <div className="flex items-center justify-end gap-3">
                      <button
                        type="button"
                        onClick={() => {
                          setEditing(m);
                          setShowForm(true);
                        }}
                        className="text-neutral-400 hover:text-neutral-900 dark:hover:text-white"
                        aria-label="Editar marca"
                      >
                        <Pencil className="h-4 w-4" />
                      </button>
                      <button
                        type="button"
                        onClick={() => setDeleting(m)}
                        className="text-red-500 hover:text-red-700"
                        aria-label="Eliminar marca"
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      <Modal open={showForm} onClose={() => setShowForm(false)} title={editing ? 'Editar marca' : 'Nueva marca'}>
        <BrandForm
          initial={editing ?? undefined}
          submitting={createBrand.isPending || updateBrand.isPending}
          onSubmit={handleSubmit}
          onCancel={() => setShowForm(false)}
        />
      </Modal>

      <ConfirmDialog
        open={Boolean(deleting)}
        title="Eliminar marca"
        description={`¿Seguro que quieres eliminar "${deleting?.nombre}"? Falla si tiene productos asociados.`}
        variant="danger"
        confirmLabel="Eliminar"
        onConfirm={handleDelete}
        onCancel={() => setDeleting(null)}
        loading={deleteBrand.isPending}
      />
    </div>
  );
}
