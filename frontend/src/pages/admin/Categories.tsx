import { zodResolver } from '@hookform/resolvers/zod';
import { Pencil, Plus, Trash2 } from 'lucide-react';
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { Badge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';
import { ConfirmDialog } from '@/components/ui/ConfirmDialog';
import { Input } from '@/components/ui/Input';
import { Modal } from '@/components/ui/Modal';
import { Select } from '@/components/ui/Select';
import { Spinner } from '@/components/ui/Spinner';
import { useToast } from '@/context/ToastContext';
import {
  useAdminCategories,
  useCreateCategory,
  useDeleteCategory,
  useUpdateCategory,
} from '@/hooks/useAdminCategories';
import type { Categoria } from '@/types/product';
import { categorySchema, type CategoryFormValues } from '@/utils/categorySchema';
import { getErrorMessage } from '@/utils/getErrorMessage';

function CategoryForm({
  categorias,
  initial,
  onSubmit,
  submitting,
  onCancel,
}: {
  categorias: Categoria[];
  initial?: Categoria;
  onSubmit: (values: CategoryFormValues) => Promise<void>;
  submitting?: boolean;
  onCancel: () => void;
}) {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<CategoryFormValues>({
    resolver: zodResolver(categorySchema),
    defaultValues: initial
      ? {
          nombre: initial.nombre,
          descripcion: initial.descripcion ?? '',
          imagenUrl: initial.imagenUrl ?? '',
          categoriaPadreId: initial.categoriaPadreId ?? '',
        }
      : undefined,
  });

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-4" noValidate>
      <Input label="Nombre" error={errors.nombre?.message} {...register('nombre')} />
      <Input label="Descripción (opcional)" error={errors.descripcion?.message} {...register('descripcion')} />
      <Input
        label="URL de imagen (opcional)"
        error={errors.imagenUrl?.message}
        {...register('imagenUrl')}
      />
      <Select label="Categoría padre (opcional)" {...register('categoriaPadreId')}>
        <option value="">Ninguna (categoría principal)</option>
        {categorias
          .filter((c) => c.id !== initial?.id)
          .map((c) => (
            <option key={c.id} value={c.id}>
              {c.nombre}
            </option>
          ))}
      </Select>
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

export default function Categories() {
  const { data: categorias, isLoading } = useAdminCategories();
  const createCategory = useCreateCategory();
  const updateCategory = useUpdateCategory();
  const deleteCategory = useDeleteCategory();
  const toast = useToast();

  const [showForm, setShowForm] = useState(false);
  const [editing, setEditing] = useState<Categoria | null>(null);
  const [deleting, setDeleting] = useState<Categoria | null>(null);

  const handleSubmit = async (values: CategoryFormValues): Promise<void> => {
    const input = {
      nombre: values.nombre,
      descripcion: values.descripcion || undefined,
      imagenUrl: values.imagenUrl || undefined,
      categoriaPadreId: values.categoriaPadreId || undefined,
    };
    try {
      if (editing) {
        await updateCategory.mutateAsync({ id: editing.id, input });
        toast.success('Categoría actualizada');
      } else {
        await createCategory.mutateAsync(input);
        toast.success('Categoría creada');
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
      await deleteCategory.mutateAsync(deleting.id);
      toast.success('Categoría eliminada');
    } catch (err) {
      toast.error(getErrorMessage(err));
    } finally {
      setDeleting(null);
    }
  };

  return (
    <div className="flex flex-col gap-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">Categorías</h1>
        <Button
          onClick={() => {
            setEditing(null);
            setShowForm(true);
          }}
        >
          <Plus className="h-4 w-4" /> Nueva categoría
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
                <th className="px-4 py-3">Subcategorías</th>
                <th className="px-4 py-3">Estado</th>
                <th className="px-4 py-3" />
              </tr>
            </thead>
            <tbody>
              {categorias?.map((c) => (
                <tr key={c.id} className="border-b border-neutral-100 last:border-0 dark:border-neutral-800">
                  <td className="px-4 py-3 font-medium">{c.nombre}</td>
                  <td className="px-4 py-3 text-neutral-500 dark:text-neutral-400">{c.slug}</td>
                  <td className="px-4 py-3">{c.subcategorias?.length ?? 0}</td>
                  <td className="px-4 py-3">
                    <Badge variant={c.activa ? 'success' : 'neutral'}>{c.activa ? 'Activa' : 'Inactiva'}</Badge>
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex items-center justify-end gap-3">
                      <button
                        type="button"
                        onClick={() => {
                          setEditing(c);
                          setShowForm(true);
                        }}
                        className="text-neutral-400 hover:text-neutral-900 dark:hover:text-white"
                        aria-label="Editar categoría"
                      >
                        <Pencil className="h-4 w-4" />
                      </button>
                      <button
                        type="button"
                        onClick={() => setDeleting(c)}
                        className="text-red-500 hover:text-red-700"
                        aria-label="Eliminar categoría"
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

      <Modal
        open={showForm}
        onClose={() => setShowForm(false)}
        title={editing ? 'Editar categoría' : 'Nueva categoría'}
      >
        <CategoryForm
          categorias={categorias ?? []}
          initial={editing ?? undefined}
          submitting={createCategory.isPending || updateCategory.isPending}
          onSubmit={handleSubmit}
          onCancel={() => setShowForm(false)}
        />
      </Modal>

      <ConfirmDialog
        open={Boolean(deleting)}
        title="Eliminar categoría"
        description={`¿Seguro que quieres eliminar "${deleting?.nombre}"? Falla si tiene productos asociados.`}
        variant="danger"
        confirmLabel="Eliminar"
        onConfirm={handleDelete}
        onCancel={() => setDeleting(null)}
        loading={deleteCategory.isPending}
      />
    </div>
  );
}
