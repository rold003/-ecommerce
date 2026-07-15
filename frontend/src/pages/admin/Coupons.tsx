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
  useAdminCoupons,
  useCreateCoupon,
  useDeleteCoupon,
  useUpdateCoupon,
} from '@/hooks/useAdminCoupons';
import type { Cupon } from '@/types/coupon';
import { couponSchema, type CouponFormValues } from '@/utils/couponSchema';
import { formatPrice } from '@/utils/formatPrice';
import { getErrorMessage } from '@/utils/getErrorMessage';

function toDateInputValue(iso?: string): string {
  if (!iso) return '';
  return iso.slice(0, 10);
}

function CouponForm({
  initial,
  onSubmit,
  submitting,
  onCancel,
}: {
  initial?: Cupon;
  onSubmit: (values: CouponFormValues) => Promise<void>;
  submitting?: boolean;
  onCancel: () => void;
}) {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<CouponFormValues>({
    resolver: zodResolver(couponSchema),
    defaultValues: initial
      ? {
          codigo: initial.codigo,
          tipo: initial.tipo,
          valor: Number(initial.valor),
          fechaInicio: toDateInputValue(initial.fechaInicio),
          fechaFin: toDateInputValue(initial.fechaFin),
          usoMaximo: initial.usoMaximo ? String(initial.usoMaximo) : '',
          montoMinimo: initial.montoMinimo ? String(initial.montoMinimo) : '',
        }
      : { tipo: 'PORCENTAJE' },
  });

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-4" noValidate>
      <Input label="Código" error={errors.codigo?.message} {...register('codigo')} />
      <div className="grid grid-cols-2 gap-4">
        <Select label="Tipo" error={errors.tipo?.message} {...register('tipo')}>
          <option value="PORCENTAJE">Porcentaje</option>
          <option value="MONTO_FIJO">Monto fijo</option>
        </Select>
        <Input label="Valor" type="number" step="0.01" error={errors.valor?.message} {...register('valor')} />
      </div>
      <div className="grid grid-cols-2 gap-4">
        <Input
          label="Fecha inicio"
          type="date"
          error={errors.fechaInicio?.message}
          {...register('fechaInicio')}
        />
        <Input label="Fecha fin" type="date" error={errors.fechaFin?.message} {...register('fechaFin')} />
      </div>
      <div className="grid grid-cols-2 gap-4">
        <Input label="Uso máximo (opcional)" type="number" {...register('usoMaximo')} />
        <Input label="Monto mínimo (opcional)" type="number" step="0.01" {...register('montoMinimo')} />
      </div>
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

export default function Coupons() {
  const { data: cupones, isLoading } = useAdminCoupons();
  const createCoupon = useCreateCoupon();
  const updateCoupon = useUpdateCoupon();
  const deleteCoupon = useDeleteCoupon();
  const toast = useToast();

  const [showForm, setShowForm] = useState(false);
  const [editing, setEditing] = useState<Cupon | null>(null);
  const [deleting, setDeleting] = useState<Cupon | null>(null);

  const handleSubmit = async (values: CouponFormValues): Promise<void> => {
    const input = {
      codigo: values.codigo,
      tipo: values.tipo,
      valor: values.valor,
      fechaInicio: values.fechaInicio,
      fechaFin: values.fechaFin,
      usoMaximo: values.usoMaximo ? Number(values.usoMaximo) : undefined,
      montoMinimo: values.montoMinimo ? Number(values.montoMinimo) : undefined,
    };
    try {
      if (editing) {
        await updateCoupon.mutateAsync({ id: editing.id, input });
        toast.success('Cupón actualizado');
      } else {
        await createCoupon.mutateAsync(input);
        toast.success('Cupón creado');
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
      await deleteCoupon.mutateAsync(deleting.id);
      toast.success('Cupón eliminado');
    } catch (err) {
      toast.error(getErrorMessage(err));
    } finally {
      setDeleting(null);
    }
  };

  return (
    <div className="flex flex-col gap-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">Cupones</h1>
        <Button
          onClick={() => {
            setEditing(null);
            setShowForm(true);
          }}
        >
          <Plus className="h-4 w-4" /> Nuevo cupón
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
                <th className="px-4 py-3">Código</th>
                <th className="px-4 py-3">Valor</th>
                <th className="px-4 py-3">Vigencia</th>
                <th className="px-4 py-3">Usos</th>
                <th className="px-4 py-3">Estado</th>
                <th className="px-4 py-3" />
              </tr>
            </thead>
            <tbody>
              {cupones?.map((c) => (
                <tr key={c.id} className="border-b border-neutral-100 last:border-0 dark:border-neutral-800">
                  <td className="px-4 py-3 font-medium">{c.codigo}</td>
                  <td className="px-4 py-3">
                    {c.tipo === 'PORCENTAJE' ? `${c.valor}%` : formatPrice(c.valor)}
                  </td>
                  <td className="px-4 py-3 text-neutral-500 dark:text-neutral-400">
                    {toDateInputValue(c.fechaInicio)} – {toDateInputValue(c.fechaFin)}
                  </td>
                  <td className="px-4 py-3">
                    {c.usosActuales}
                    {c.usoMaximo ? ` / ${c.usoMaximo}` : ''}
                  </td>
                  <td className="px-4 py-3">
                    <Badge variant={c.activo ? 'success' : 'neutral'}>{c.activo ? 'Activo' : 'Inactivo'}</Badge>
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
                        aria-label="Editar cupón"
                      >
                        <Pencil className="h-4 w-4" />
                      </button>
                      <button
                        type="button"
                        onClick={() => setDeleting(c)}
                        className="text-red-500 hover:text-red-700"
                        aria-label="Eliminar cupón"
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

      <Modal open={showForm} onClose={() => setShowForm(false)} title={editing ? 'Editar cupón' : 'Nuevo cupón'}>
        <CouponForm
          initial={editing ?? undefined}
          submitting={createCoupon.isPending || updateCoupon.isPending}
          onSubmit={handleSubmit}
          onCancel={() => setShowForm(false)}
        />
      </Modal>

      <ConfirmDialog
        open={Boolean(deleting)}
        title="Eliminar cupón"
        description={`¿Seguro que quieres eliminar el cupón "${deleting?.codigo}"?`}
        variant="danger"
        confirmLabel="Eliminar"
        onConfirm={handleDelete}
        onCancel={() => setDeleting(null)}
        loading={deleteCoupon.isPending}
      />
    </div>
  );
}
