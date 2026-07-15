import { Pencil, Plus, Trash2 } from 'lucide-react';
import { useState } from 'react';
import type { ProductSubmitValues } from '@/components/admin/ProductForm';
import { ProductForm } from '@/components/admin/ProductForm';
import { Badge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';
import { ConfirmDialog } from '@/components/ui/ConfirmDialog';
import { Modal } from '@/components/ui/Modal';
import { Pagination } from '@/components/ui/Pagination';
import { Spinner } from '@/components/ui/Spinner';
import { useToast } from '@/context/ToastContext';
import { useAdminBrands } from '@/hooks/useAdminBrands';
import { useAdminCategories } from '@/hooks/useAdminCategories';
import {
  useAdminProducts,
  useCreateProduct,
  useDeleteProduct,
  useUpdateProduct,
} from '@/hooks/useAdminProducts';
import type { ProductInput } from '@/services/product.service';
import type { Producto } from '@/types/product';
import { formatPrice } from '@/utils/formatPrice';
import { getErrorMessage } from '@/utils/getErrorMessage';

function toProductInput(values: ProductSubmitValues): ProductInput {
  return {
    nombre: values.nombre,
    descripcion: values.descripcion,
    precio: values.precio,
    precioAnterior: values.precioAnterior ? Number(values.precioAnterior) : undefined,
    stock: values.stock,
    sku: values.sku,
    categoriaId: values.categoriaId,
    marcaId: values.marcaId,
    color: values.color || undefined,
    talla: values.talla || undefined,
    destacado: values.destacado,
    imagenes: values.imagenes,
  };
}

export default function Products() {
  const [page, setPage] = useState(1);
  const { data, isLoading } = useAdminProducts({ page, limit: 10 });
  const { data: categorias } = useAdminCategories();
  const { data: marcas } = useAdminBrands();
  const createProduct = useCreateProduct();
  const updateProduct = useUpdateProduct();
  const deleteProduct = useDeleteProduct();
  const toast = useToast();

  const [showForm, setShowForm] = useState(false);
  const [editing, setEditing] = useState<Producto | null>(null);
  const [deleting, setDeleting] = useState<Producto | null>(null);

  const handleSubmit = async (values: ProductSubmitValues): Promise<void> => {
    const input = toProductInput(values);
    try {
      if (editing) {
        await updateProduct.mutateAsync({ id: editing.id, input });
        toast.success('Producto actualizado');
      } else {
        await createProduct.mutateAsync(input);
        toast.success('Producto creado');
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
      await deleteProduct.mutateAsync(deleting.id);
      toast.success('Producto desactivado');
    } catch (err) {
      toast.error(getErrorMessage(err));
    } finally {
      setDeleting(null);
    }
  };

  return (
    <div className="flex flex-col gap-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">Productos</h1>
        <Button
          onClick={() => {
            setEditing(null);
            setShowForm(true);
          }}
        >
          <Plus className="h-4 w-4" /> Nuevo producto
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
                <th className="px-4 py-3">Producto</th>
                <th className="px-4 py-3">SKU</th>
                <th className="px-4 py-3">Precio</th>
                <th className="px-4 py-3">Stock</th>
                <th className="px-4 py-3">Estado</th>
                <th className="px-4 py-3" />
              </tr>
            </thead>
            <tbody>
              {data?.items.map((p) => (
                <tr key={p.id} className="border-b border-neutral-100 last:border-0 dark:border-neutral-800">
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-3">
                      {p.imagenes[0] && (
                        <img src={p.imagenes[0].url} alt="" className="h-10 w-10 rounded-lg object-cover" />
                      )}
                      <span className="font-medium">{p.nombre}</span>
                    </div>
                  </td>
                  <td className="px-4 py-3 text-neutral-500 dark:text-neutral-400">{p.sku}</td>
                  <td className="px-4 py-3">{formatPrice(p.precio)}</td>
                  <td className="px-4 py-3">{p.stock}</td>
                  <td className="px-4 py-3">
                    <Badge variant={p.estado === 'ACTIVO' ? 'success' : 'neutral'}>{p.estado}</Badge>
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex items-center justify-end gap-3">
                      <button
                        type="button"
                        onClick={() => {
                          setEditing(p);
                          setShowForm(true);
                        }}
                        className="text-neutral-400 hover:text-neutral-900 dark:hover:text-white"
                        aria-label="Editar producto"
                      >
                        <Pencil className="h-4 w-4" />
                      </button>
                      <button
                        type="button"
                        onClick={() => setDeleting(p)}
                        className="text-red-500 hover:text-red-700"
                        aria-label="Desactivar producto"
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

      {data && data.meta.totalPages > 1 && (
        <Pagination page={data.meta.page} totalPages={data.meta.totalPages} onPageChange={setPage} />
      )}

      <Modal
        open={showForm}
        onClose={() => setShowForm(false)}
        title={editing ? 'Editar producto' : 'Nuevo producto'}
        size="lg"
      >
        <ProductForm
          categorias={categorias ?? []}
          marcas={marcas ?? []}
          initial={editing ?? undefined}
          submitting={createProduct.isPending || updateProduct.isPending}
          onSubmit={handleSubmit}
          onCancel={() => setShowForm(false)}
        />
      </Modal>

      <ConfirmDialog
        open={Boolean(deleting)}
        title="Desactivar producto"
        description={`¿Seguro que quieres desactivar "${deleting?.nombre}"? Ya no será visible en la tienda.`}
        variant="danger"
        confirmLabel="Desactivar"
        onConfirm={handleDelete}
        onCancel={() => setDeleting(null)}
        loading={deleteProduct.isPending}
      />
    </div>
  );
}
