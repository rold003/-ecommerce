import { prisma } from '../database/prisma';
import { env } from '../config/env';

function frontendUrl(): string {
  return (env.CORS_ORIGIN.split(',')[0] ?? env.CORS_ORIGIN).trim().replace(/\/$/, '');
}

function urlEntry(loc: string, lastmod?: Date, priority = '0.5'): string {
  const lastmodTag = lastmod ? `<lastmod>${lastmod.toISOString().slice(0, 10)}</lastmod>` : '';
  return `<url><loc>${loc}</loc>${lastmodTag}<priority>${priority}</priority></url>`;
}

export const sitemapService = {
  async build(): Promise<string> {
    const base = frontendUrl();

    // Las categorias no tienen una ruta propia en el frontend: se filtran por
    // query param (/catalogo?categoria=slug), asi que no van como URL aparte
    // en el sitemap (Google no recomienda indexar URLs con filtros como
    // paginas independientes).
    const productos = await prisma.producto.findMany({
      where: { estado: 'ACTIVO' },
      select: { slug: true, updatedAt: true },
    });

    const entries = [
      urlEntry(`${base}/`, undefined, '1.0'),
      urlEntry(`${base}/catalogo`, undefined, '0.8'),
      urlEntry(`${base}/categorias`, undefined, '0.6'),
      ...productos.map((p) => urlEntry(`${base}/productos/${p.slug}`, p.updatedAt, '0.7')),
    ];

    return `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${entries.join('\n')}\n</urlset>`;
  },
};
