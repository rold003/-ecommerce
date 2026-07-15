import path from 'path';
import dotenv from 'dotenv';
import { afterAll, beforeEach } from 'vitest';

// Se carga ANTES de importar cualquier modulo de la app (con import() dinamico
// mas abajo), para que config/env.ts lea el DATABASE_URL de la base de datos
// de pruebas y no el de desarrollo.
dotenv.config({ path: path.resolve(__dirname, '../.env.test'), override: true });

const { prisma } = await import('../src/database/prisma');

// Deja cada test con una base limpia. Orden: de hijos a padres, para no violar
// llaves foraneas.
beforeEach(async () => {
  await prisma.$transaction([
    prisma.detallePedido.deleteMany(),
    prisma.pago.deleteMany(),
    prisma.pedido.deleteMany(),
    prisma.itemCarrito.deleteMany(),
    prisma.resena.deleteMany(),
    prisma.favorito.deleteMany(),
    prisma.imagen.deleteMany(),
    prisma.producto.deleteMany(),
    prisma.categoria.deleteMany(),
    prisma.marca.deleteMany(),
    prisma.cupon.deleteMany(),
    prisma.refreshToken.deleteMany(),
    prisma.passwordResetToken.deleteMany(),
    prisma.direccion.deleteMany(),
    prisma.carrito.deleteMany(),
    prisma.usuario.deleteMany(),
  ]);
});

afterAll(async () => {
  await prisma.$disconnect();
});
