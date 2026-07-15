import { describe, expect, it } from 'vitest';
import { prisma } from '../../src/database/prisma';
import { sitemapService } from '../../src/services/sitemap.service';

async function crearProducto(overrides: Partial<{ estado: 'ACTIVO' | 'INACTIVO' }> = {}) {
  const categoria = await prisma.categoria.create({
    data: { nombre: 'Cat', slug: `cat-${Date.now()}-${Math.random()}` },
  });
  const marca = await prisma.marca.create({
    data: { nombre: 'Marca', slug: `marca-${Date.now()}-${Math.random()}` },
  });
  return prisma.producto.create({
    data: {
      nombre: 'Producto',
      slug: `producto-${Date.now()}-${Math.random()}`,
      descripcion: 'Desc',
      precio: 10,
      sku: `SKU-${Date.now()}-${Math.random()}`,
      categoriaId: categoria.id,
      marcaId: marca.id,
      estado: overrides.estado ?? 'ACTIVO',
    },
  });
}

describe('sitemapService.build', () => {
  it('genera XML valido con las paginas estaticas y los productos activos', async () => {
    const producto = await crearProducto({ estado: 'ACTIVO' });
    const xml = await sitemapService.build();

    expect(xml.startsWith('<?xml version="1.0" encoding="UTF-8"?>')).toBe(true);
    expect(xml).toContain('<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">');
    expect(xml).toContain('/catalogo</loc>');
    expect(xml).toContain(`/productos/${producto.slug}</loc>`);
  });

  it('no incluye productos inactivos', async () => {
    const producto = await crearProducto({ estado: 'INACTIVO' });
    const xml = await sitemapService.build();

    expect(xml).not.toContain(`/productos/${producto.slug}</loc>`);
  });
});
