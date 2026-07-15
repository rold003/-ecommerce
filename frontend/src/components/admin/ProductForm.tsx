import { zodResolver } from '@hookform/resolvers/zod';
import { Upload, X } from 'lucide-react';
import { useState, type ChangeEvent } from 'react';
import { useForm } from 'react-hook-form';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Select } from '@/components/ui/Select';
import { Textarea } from '@/components/ui/Textarea';
import { useToast } from '@/context/ToastContext';
import { productService, type ProductImageInput } from '@/services/product.service';
import type { Categoria, Marca, Producto } from '@/types/product';
import { getErrorMessage } from '@/utils/getErrorMessage';
import { productSchema, type ProductFormValues } from '@/utils/productSchema';

export interface ProductSubmitValues extends ProductFormValues {
  imagenes: ProductImageInput[];
}

interface ProductFormProps {
  categorias: Categoria[];
  marcas: Marca[];
  initial?: Producto;
  onSubmit: (values: ProductSubmitValues) => Promise<void>;
  submitting?: boolean;
  onCancel: () => void;
}

export function ProductForm({ categorias, marcas, initial, onSubmit, submitting, onCancel }: ProductFormProps) {
  const toast = useToast();
  const [imagenes, setImagenes] = useState<ProductImageInput[]>(
    initial?.imagenes.map((img) => ({
      url: img.url,
      altText: img.altText ?? undefined,
      orden: img.orden,
      esPrincipal: img.esPrincipal,
    })) ?? [],
  );
  const [imageUrlInput, setImageUrlInput] = useState('');
  const [uploading, setUploading] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<ProductFormValues>({
    resolver: zodResolver(productSchema),
    defaultValues: initial
      ? {
          nombre: initial.nombre,
          descripcion: initial.descripcion,
          precio: Number(initial.precio),
          precioAnterior: initial.precioAnterior ? String(initial.precioAnterior) : '',
          stock: initial.stock,
          sku: initial.sku,
          categoriaId: initial.categoriaId,
          marcaId: initial.marcaId,
          color: initial.color ?? '',
          talla: initial.talla ?? '',
          destacado: initial.destacado,
        }
      : { precio: 0, stock: 0 },
  });

  const handleFileUpload = async (e: ChangeEvent<HTMLInputElement>): Promise<void> => {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploading(true);
    try {
      const result = await productService.uploadImage(file);
      setImagenes((prev) => [
        ...prev,
        { url: result.url, publicId: result.publicId, esPrincipal: prev.length === 0 },
      ]);
      toast.success('Imagen subida');
    } catch (err) {
      toast.error(getErrorMessage(err, 'No se pudo subir la imagen'));
    } finally {
      setUploading(false);
      e.target.value = '';
    }
  };

  const handleAddImageUrl = (): void => {
    if (!imageUrlInput.trim()) return;
    setImagenes((prev) => [...prev, { url: imageUrlInput.trim(), esPrincipal: prev.length === 0 }]);
    setImageUrlInput('');
  };

  const handleRemoveImage = (index: number): void => {
    setImagenes((prev) => prev.filter((_, i) => i !== index));
  };

  const submit = async (values: ProductFormValues): Promise<void> => {
    await onSubmit({ ...values, imagenes });
  };

  return (
    <form
      onSubmit={handleSubmit(submit)}
      className="flex max-h-[70vh] flex-col gap-4 overflow-y-auto pr-1"
      noValidate
    >
      <Input label="Nombre" error={errors.nombre?.message} {...register('nombre')} />
      <Textarea label="Descripción" error={errors.descripcion?.message} {...register('descripcion')} />
      <div className="grid grid-cols-2 gap-4">
        <Input
          label="Precio"
          type="number"
          step="0.01"
          error={errors.precio?.message}
          {...register('precio')}
        />
        <Input
          label="Precio anterior (opcional)"
          type="number"
          step="0.01"
          error={errors.precioAnterior?.message}
          {...register('precioAnterior')}
        />
      </div>
      <div className="grid grid-cols-2 gap-4">
        <Input label="Stock" type="number" error={errors.stock?.message} {...register('stock')} />
        <Input label="SKU" error={errors.sku?.message} {...register('sku')} />
      </div>
      <div className="grid grid-cols-2 gap-4">
        <Select label="Categoría" error={errors.categoriaId?.message} {...register('categoriaId')}>
          <option value="">Selecciona...</option>
          {categorias.map((c) => (
            <option key={c.id} value={c.id}>
              {c.nombre}
            </option>
          ))}
        </Select>
        <Select label="Marca" error={errors.marcaId?.message} {...register('marcaId')}>
          <option value="">Selecciona...</option>
          {marcas.map((m) => (
            <option key={m.id} value={m.id}>
              {m.nombre}
            </option>
          ))}
        </Select>
      </div>
      <div className="grid grid-cols-2 gap-4">
        <Input label="Color (opcional)" {...register('color')} />
        <Input label="Talla (opcional)" {...register('talla')} />
      </div>
      <label className="flex items-center gap-2 text-sm">
        <input type="checkbox" {...register('destacado')} className="h-4 w-4" />
        Producto destacado
      </label>

      <div>
        <span className="mb-2 block text-sm font-medium text-neutral-700 dark:text-neutral-300">Imágenes</span>
        {imagenes.length > 0 && (
          <div className="mb-3 flex flex-wrap gap-2">
            {imagenes.map((img, i) => (
              <div
                key={img.url + i}
                className="relative h-20 w-20 overflow-hidden rounded-lg border border-neutral-200 dark:border-neutral-700"
              >
                <img src={img.url} alt="" className="h-full w-full object-cover" />
                <button
                  type="button"
                  onClick={() => handleRemoveImage(i)}
                  className="absolute right-0.5 top-0.5 rounded-full bg-black/60 p-0.5 text-white"
                  aria-label="Quitar imagen"
                >
                  <X className="h-3 w-3" />
                </button>
              </div>
            ))}
          </div>
        )}
        <div className="flex flex-col gap-2 sm:flex-row">
          <label className="flex h-10 cursor-pointer items-center justify-center gap-2 rounded-lg border border-dashed border-neutral-300 px-3 text-sm text-neutral-500 hover:bg-neutral-50 dark:border-neutral-700 dark:text-neutral-400 dark:hover:bg-neutral-800">
            <Upload className="h-4 w-4" />
            {uploading ? 'Subiendo...' : 'Subir imagen'}
            <input
              type="file"
              accept="image/*"
              className="hidden"
              onChange={handleFileUpload}
              disabled={uploading}
            />
          </label>
          <div className="flex flex-1 gap-2">
            <input
              value={imageUrlInput}
              onChange={(e) => setImageUrlInput(e.target.value)}
              placeholder="O pega una URL de imagen"
              className="h-10 flex-1 rounded-lg border border-neutral-300 px-3 text-sm dark:border-neutral-700 dark:bg-neutral-900"
            />
            <Button type="button" variant="outline" onClick={handleAddImageUrl}>
              Agregar
            </Button>
          </div>
        </div>
      </div>

      <div className="sticky bottom-0 flex justify-end gap-3 border-t border-neutral-200 bg-white pt-4 dark:border-neutral-800 dark:bg-neutral-900">
        <Button type="button" variant="outline" onClick={onCancel}>
          Cancelar
        </Button>
        <Button type="submit" loading={submitting}>
          Guardar producto
        </Button>
      </div>
    </form>
  );
}
