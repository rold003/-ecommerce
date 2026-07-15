import { describe, expect, it } from 'vitest';
import { prisma } from '../../src/database/prisma';
import { authService } from '../../src/services/auth.service';
import { orderService } from '../../src/services/order.service';
import { AppError } from '../../src/utils/AppError';

async function crearFixture(stockInicial = 5) {
  const { usuario } = await authService.register({
    nombre: 'Cliente',
    apellido: 'Test',
    email: 'checkout@test.local',
    password: 'Password123',
  });

  const categoria = await prisma.categoria.create({
    data: { nombre: 'Categoria Test', slug: `cat-${Date.now()}-${Math.random()}` },
  });
  const marca = await prisma.marca.create({
    data: { nombre: 'Marca Test', slug: `marca-${Date.now()}-${Math.random()}` },
  });
  const producto = await prisma.producto.create({
    data: {
      nombre: 'Producto Test',
      slug: `producto-${Date.now()}-${Math.random()}`,
      descripcion: 'Descripcion',
      precio: 20,
      stock: stockInicial,
      sku: `SKU-${Date.now()}-${Math.random()}`,
      categoriaId: categoria.id,
      marcaId: marca.id,
    },
  });
  const direccion = await prisma.direccion.create({
    data: {
      usuarioId: usuario.id,
      etiqueta: 'Casa',
      destinatario: 'Cliente Test',
      telefono: '0999999999',
      calle: 'Calle 123',
      ciudad: 'Quito',
      provincia: 'Pichincha',
      codigoPostal: '170101',
    },
  });
  const carrito = await prisma.carrito.findUniqueOrThrow({ where: { usuarioId: usuario.id } });

  return { usuario, categoria, marca, producto, direccion, carrito };
}

async function agregarAlCarrito(carritoId: string, productoId: string, cantidad: number) {
  await prisma.itemCarrito.create({ data: { carritoId, productoId, cantidad } });
}

describe('orderService.checkout', () => {
  it('descuenta el stock, marca vendidos, crea el pedido con el total correcto y vacia el carrito', async () => {
    const { usuario, producto, direccion, carrito } = await crearFixture(5);
    await agregarAlCarrito(carrito.id, producto.id, 2);

    const pedido = await orderService.checkout(usuario.id, direccion.id, 'TARJETA');

    // subtotal = 20*2 = 40; iva = 40*0.15 = 6; envio = 5 (40 < 50); total = 51
    expect(Number(pedido.subtotal)).toBe(40);
    expect(Number(pedido.iva)).toBe(6);
    expect(Number(pedido.costoEnvio)).toBe(5);
    expect(Number(pedido.total)).toBe(51);
    expect(pedido.estado).toBe('PAGADO'); // TARJETA se marca COMPLETADO de inmediato

    const productoActualizado = await prisma.producto.findUniqueOrThrow({ where: { id: producto.id } });
    expect(productoActualizado.stock).toBe(3); // 5 - 2
    expect(productoActualizado.vendidos).toBe(2);

    const itemsRestantes = await prisma.itemCarrito.count({ where: { carritoId: carrito.id } });
    expect(itemsRestantes).toBe(0);
  });

  it('deja el pedido PENDIENTE para metodos sin cobro inmediato (transferencia/contra entrega)', async () => {
    const { usuario, producto, direccion, carrito } = await crearFixture(5);
    await agregarAlCarrito(carrito.id, producto.id, 1);

    const pedido = await orderService.checkout(usuario.id, direccion.id, 'CONTRA_ENTREGA');
    expect(pedido.estado).toBe('PENDIENTE');
  });

  it('bloquea la venta si se pide mas cantidad de la que hay en stock, y no descuenta nada', async () => {
    const { usuario, producto, direccion, carrito } = await crearFixture(2);
    await agregarAlCarrito(carrito.id, producto.id, 5); // pide mas de lo que hay

    await expect(orderService.checkout(usuario.id, direccion.id, 'TARJETA')).rejects.toMatchObject({
      statusCode: 409,
    } satisfies Partial<AppError>);

    const productoSinCambios = await prisma.producto.findUniqueOrThrow({ where: { id: producto.id } });
    expect(productoSinCambios.stock).toBe(2); // intacto, la transaccion se revirtio
    expect(await prisma.pedido.count()).toBe(0);
  });

  it('bloquea la compra de un producto inactivo', async () => {
    const { usuario, producto, direccion, carrito } = await crearFixture(5);
    await prisma.producto.update({ where: { id: producto.id }, data: { estado: 'INACTIVO' } });
    await agregarAlCarrito(carrito.id, producto.id, 1);

    await expect(orderService.checkout(usuario.id, direccion.id, 'TARJETA')).rejects.toMatchObject({
      statusCode: 409,
    } satisfies Partial<AppError>);
  });

  it('rechaza el checkout con el carrito vacio', async () => {
    const { usuario, direccion } = await crearFixture(5);

    await expect(orderService.checkout(usuario.id, direccion.id, 'TARJETA')).rejects.toMatchObject({
      statusCode: 400,
    } satisfies Partial<AppError>);
  });

  it('rechaza una direccion que no pertenece al usuario', async () => {
    const { usuario, producto, carrito } = await crearFixture(5);
    await agregarAlCarrito(carrito.id, producto.id, 1);

    const { usuario: otroUsuario } = await authService.register({
      nombre: 'Otro',
      apellido: 'Usuario',
      email: 'otro@test.local',
      password: 'Password123',
    });
    const direccionAjena = await prisma.direccion.create({
      data: {
        usuarioId: otroUsuario.id,
        etiqueta: 'Casa',
        destinatario: 'Otro',
        telefono: '0999999999',
        calle: 'Calle 456',
        ciudad: 'Quito',
        provincia: 'Pichincha',
        codigoPostal: '170101',
      },
    });

    await expect(orderService.checkout(usuario.id, direccionAjena.id, 'TARJETA')).rejects.toMatchObject({
      statusCode: 404,
    } satisfies Partial<AppError>);
  });
});
