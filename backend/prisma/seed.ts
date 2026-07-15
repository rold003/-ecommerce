import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcrypt';

const prisma = new PrismaClient();

async function main(): Promise<void> {
  const adminPasswordHash = await bcrypt.hash('Admin123!', 12);
  const clientePasswordHash = await bcrypt.hash('Cliente123!', 12);

  await prisma.usuario.upsert({
    where: { email: 'admin@ecommerce.local' },
    update: {},
    create: {
      nombre: 'Admin',
      apellido: 'Principal',
      email: 'admin@ecommerce.local',
      passwordHash: adminPasswordHash,
      rol: 'ADMIN',
    },
  });

  const cliente = await prisma.usuario.upsert({
    where: { email: 'cliente@ecommerce.local' },
    update: {},
    create: {
      nombre: 'Cliente',
      apellido: 'Demo',
      email: 'cliente@ecommerce.local',
      passwordHash: clientePasswordHash,
      rol: 'CLIENTE',
    },
  });

  const direccionExistente = await prisma.direccion.findFirst({ where: { usuarioId: cliente.id } });
  if (!direccionExistente) {
    await prisma.direccion.create({
      data: {
        usuarioId: cliente.id,
        etiqueta: 'Casa',
        destinatario: 'Cliente Demo',
        telefono: '0999999999',
        calle: 'Av. Siempre Viva',
        numero: '123',
        ciudad: 'Quito',
        provincia: 'Pichincha',
        codigoPostal: '170101',
        pais: 'Ecuador',
        predeterminada: true,
      },
    });
  }

  const categoriasData = [
    { nombre: 'Tecnología', slug: 'tecnologia' },
    { nombre: 'Calzado', slug: 'calzado' },
    { nombre: 'Ropa', slug: 'ropa' },
    { nombre: 'Hogar', slug: 'hogar' },
  ];
  const categorias: Record<string, string> = {};
  for (const c of categoriasData) {
    const categoria = await prisma.categoria.upsert({
      where: { slug: c.slug },
      update: {},
      create: c,
    });
    categorias[c.slug] = categoria.id;
  }

  const marcasData = [
    { nombre: 'Apple', slug: 'apple' },
    { nombre: 'Nike', slug: 'nike' },
    { nombre: 'Samsung', slug: 'samsung' },
    { nombre: 'Sony', slug: 'sony' },
  ];
  const marcas: Record<string, string> = {};
  for (const m of marcasData) {
    const marca = await prisma.marca.upsert({
      where: { slug: m.slug },
      update: {},
      create: m,
    });
    marcas[m.slug] = marca.id;
  }

  const productosData = [
    {
      nombre: 'iPhone 17 Pro',
      slug: 'iphone-17-pro',
      descripcion: 'El último smartphone de Apple con cámara profesional y chip A19 Pro.',
      precio: 1299.99,
      precioAnterior: 1399.99,
      stock: 25,
      sku: 'APL-IP17P-256',
      color: 'Titanio Natural',
      talla: null,
      categoriaSlug: 'tecnologia',
      marcaSlug: 'apple',
      destacado: true,
      seedImg: 'iphone',
    },
    {
      nombre: 'MacBook Air M4',
      slug: 'macbook-air-m4',
      descripcion: 'Portátil ultraligero con chip M4, hasta 18 horas de batería.',
      precio: 1499.0,
      precioAnterior: null,
      stock: 15,
      sku: 'APL-MBA-M4-512',
      color: 'Plata',
      talla: null,
      categoriaSlug: 'tecnologia',
      marcaSlug: 'apple',
      destacado: true,
      seedImg: 'macbook',
    },
    {
      nombre: 'Nike Air Max 270',
      slug: 'nike-air-max-270',
      descripcion: 'Zapatillas deportivas con amortiguación Air Max visible.',
      precio: 159.99,
      precioAnterior: 189.99,
      stock: 60,
      sku: 'NKE-AM270-42',
      color: 'Negro/Blanco',
      talla: '42',
      categoriaSlug: 'calzado',
      marcaSlug: 'nike',
      destacado: true,
      seedImg: 'sneaker',
    },
    {
      nombre: 'Nike Dri-FIT Camiseta',
      slug: 'nike-dri-fit-camiseta',
      descripcion: 'Camiseta deportiva transpirable de secado rápido.',
      precio: 34.99,
      precioAnterior: null,
      stock: 100,
      sku: 'NKE-DF-TS-M',
      color: 'Azul',
      talla: 'M',
      categoriaSlug: 'ropa',
      marcaSlug: 'nike',
      destacado: false,
      seedImg: 'shirt',
    },
    {
      nombre: 'Samsung Galaxy S25 Ultra',
      slug: 'samsung-galaxy-s25-ultra',
      descripcion: 'Smartphone Android tope de gama con S Pen y cámara de 200MP.',
      precio: 1199.99,
      precioAnterior: 1299.99,
      stock: 30,
      sku: 'SMS-GS25U-256',
      color: 'Negro Titanio',
      talla: null,
      categoriaSlug: 'tecnologia',
      marcaSlug: 'samsung',
      destacado: true,
      seedImg: 'galaxy',
    },
    {
      nombre: 'Samsung QLED 55" 4K',
      slug: 'samsung-qled-55-4k',
      descripcion: 'Smart TV QLED de 55 pulgadas con resolución 4K y HDR.',
      precio: 899.99,
      precioAnterior: null,
      stock: 12,
      sku: 'SMS-TV55-QLED',
      color: 'Negro',
      talla: null,
      categoriaSlug: 'hogar',
      marcaSlug: 'samsung',
      destacado: false,
      seedImg: 'tv',
    },
    {
      nombre: 'Sony WH-1000XM6',
      slug: 'sony-wh-1000xm6',
      descripcion: 'Audífonos inalámbricos con cancelación de ruido líder en la industria.',
      precio: 399.99,
      precioAnterior: 449.99,
      stock: 40,
      sku: 'SNY-WH1000XM6',
      color: 'Negro',
      talla: null,
      categoriaSlug: 'tecnologia',
      marcaSlug: 'sony',
      destacado: true,
      seedImg: 'headphones',
    },
    {
      nombre: 'Sony PlayStation 5 Pro',
      slug: 'sony-playstation-5-pro',
      descripcion: 'Consola de videojuegos de nueva generación con soporte 8K.',
      precio: 699.99,
      precioAnterior: null,
      stock: 18,
      sku: 'SNY-PS5-PRO',
      color: 'Blanco',
      talla: null,
      categoriaSlug: 'tecnologia',
      marcaSlug: 'sony',
      destacado: true,
      seedImg: 'console',
    },
  ];

  for (const p of productosData) {
    const producto = await prisma.producto.upsert({
      where: { slug: p.slug },
      update: {},
      create: {
        nombre: p.nombre,
        slug: p.slug,
        descripcion: p.descripcion,
        precio: p.precio,
        precioAnterior: p.precioAnterior ?? undefined,
        stock: p.stock,
        sku: p.sku,
        color: p.color ?? undefined,
        talla: p.talla ?? undefined,
        destacado: p.destacado,
        categoriaId: categorias[p.categoriaSlug],
        marcaId: marcas[p.marcaSlug],
      },
    });

    const imagenExistente = await prisma.imagen.findFirst({ where: { productoId: producto.id } });
    if (!imagenExistente) {
      await prisma.imagen.create({
        data: {
          productoId: producto.id,
          url: `https://picsum.photos/seed/${p.seedImg}/800/800`,
          altText: p.nombre,
          orden: 0,
          esPrincipal: true,
        },
      });
    }
  }

  await prisma.cupon.upsert({
    where: { codigo: 'BIENVENIDO10' },
    update: {},
    create: {
      codigo: 'BIENVENIDO10',
      tipo: 'PORCENTAJE',
      valor: 10,
      fechaInicio: new Date('2026-01-01'),
      fechaFin: new Date('2027-01-01'),
      usoMaximo: 1000,
      montoMinimo: 20,
    },
  });

  console.log('Seed completado:');
  console.log(`  - Admin: admin@ecommerce.local / Admin123!`);
  console.log(`  - Cliente: cliente@ecommerce.local / Cliente123!`);
  console.log(`  - ${categoriasData.length} categorías, ${marcasData.length} marcas, ${productosData.length} productos`);
  console.log(`  - Cupón: BIENVENIDO10 (10% de descuento)`);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
