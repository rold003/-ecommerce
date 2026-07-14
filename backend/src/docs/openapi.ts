/* eslint-disable @typescript-eslint/no-explicit-any */
// Documento OpenAPI 3.0 escrito a mano (sin swagger-jsdoc) para tener control total
// sobre la forma exacta de cada schema, en vez de mantenerlo disperso en comentarios
// JSDoc sobre ~45 endpoints. Se sirve con swagger-ui-express en /api-docs (ver app.ts).

const errorResponse = {
  type: 'object',
  properties: {
    status: { type: 'string', example: 'error' },
    message: { type: 'string' },
  },
};

const paginationMeta = {
  type: 'object',
  properties: {
    page: { type: 'integer', example: 1 },
    limit: { type: 'integer', example: 12 },
    total: { type: 'integer', example: 42 },
    totalPages: { type: 'integer', example: 4 },
  },
};

const usuario = {
  type: 'object',
  properties: {
    id: { type: 'string', format: 'uuid' },
    nombre: { type: 'string' },
    apellido: { type: 'string' },
    email: { type: 'string', format: 'email' },
    telefono: { type: 'string', nullable: true },
    avatarUrl: { type: 'string', nullable: true },
    rol: { type: 'string', enum: ['CLIENTE', 'ADMIN'] },
    activo: { type: 'boolean' },
    createdAt: { type: 'string', format: 'date-time' },
    updatedAt: { type: 'string', format: 'date-time' },
  },
};

const direccion = {
  type: 'object',
  properties: {
    id: { type: 'string', format: 'uuid' },
    etiqueta: { type: 'string', example: 'Casa' },
    destinatario: { type: 'string' },
    telefono: { type: 'string' },
    calle: { type: 'string' },
    numero: { type: 'string', nullable: true },
    ciudad: { type: 'string' },
    provincia: { type: 'string' },
    codigoPostal: { type: 'string' },
    pais: { type: 'string' },
    referencia: { type: 'string', nullable: true },
    predeterminada: { type: 'boolean' },
  },
};

const imagen = {
  type: 'object',
  properties: {
    id: { type: 'string', format: 'uuid' },
    url: { type: 'string', format: 'uri' },
    altText: { type: 'string', nullable: true },
    orden: { type: 'integer' },
    esPrincipal: { type: 'boolean' },
  },
};

const categoria = {
  type: 'object',
  properties: {
    id: { type: 'string', format: 'uuid' },
    nombre: { type: 'string' },
    slug: { type: 'string' },
    descripcion: { type: 'string', nullable: true },
    imagenUrl: { type: 'string', nullable: true },
    activa: { type: 'boolean' },
    categoriaPadreId: { type: 'string', format: 'uuid', nullable: true },
  },
};

const marca = {
  type: 'object',
  properties: {
    id: { type: 'string', format: 'uuid' },
    nombre: { type: 'string' },
    slug: { type: 'string' },
    logoUrl: { type: 'string', nullable: true },
  },
};

const producto = {
  type: 'object',
  properties: {
    id: { type: 'string', format: 'uuid' },
    nombre: { type: 'string' },
    slug: { type: 'string' },
    descripcion: { type: 'string' },
    precio: { type: 'string', example: '1299.99' },
    precioAnterior: { type: 'string', nullable: true },
    stock: { type: 'integer' },
    sku: { type: 'string' },
    peso: { type: 'string', nullable: true },
    color: { type: 'string', nullable: true },
    talla: { type: 'string', nullable: true },
    estado: { type: 'string', enum: ['ACTIVO', 'INACTIVO'] },
    destacado: { type: 'boolean' },
    valoracionProm: { type: 'string', example: '4.5' },
    totalResenas: { type: 'integer' },
    vendidos: { type: 'integer' },
    categoria,
    marca,
    imagenes: { type: 'array', items: imagen },
  },
};

const resena = {
  type: 'object',
  properties: {
    id: { type: 'string', format: 'uuid' },
    usuarioId: { type: 'string', format: 'uuid' },
    productoId: { type: 'string', format: 'uuid' },
    calificacion: { type: 'integer', minimum: 1, maximum: 5 },
    comentario: { type: 'string', nullable: true },
    aprobada: { type: 'boolean' },
    createdAt: { type: 'string', format: 'date-time' },
  },
};

const favorito = {
  type: 'object',
  properties: {
    id: { type: 'string', format: 'uuid' },
    productoId: { type: 'string', format: 'uuid' },
    producto,
    createdAt: { type: 'string', format: 'date-time' },
  },
};

const cupon = {
  type: 'object',
  properties: {
    id: { type: 'string', format: 'uuid' },
    codigo: { type: 'string', example: 'BIENVENIDO10' },
    tipo: { type: 'string', enum: ['PORCENTAJE', 'MONTO_FIJO'] },
    valor: { type: 'string' },
    fechaInicio: { type: 'string', format: 'date-time' },
    fechaFin: { type: 'string', format: 'date-time' },
    usoMaximo: { type: 'integer', nullable: true },
    usosActuales: { type: 'integer' },
    montoMinimo: { type: 'string', nullable: true },
    activo: { type: 'boolean' },
  },
};

const itemCarrito = {
  type: 'object',
  properties: {
    id: { type: 'string', format: 'uuid' },
    productoId: { type: 'string', format: 'uuid' },
    cantidad: { type: 'integer' },
    producto,
  },
};

const carrito = {
  type: 'object',
  properties: {
    id: { type: 'string', format: 'uuid' },
    items: { type: 'array', items: itemCarrito },
    cupon: { ...cupon, nullable: true },
    subtotal: { type: 'number', example: 1299.99 },
    descuento: { type: 'number', example: 0 },
    iva: { type: 'number', example: 195 },
    envio: { type: 'number', example: 0 },
    total: { type: 'number', example: 1494.99 },
  },
};

const detallePedido = {
  type: 'object',
  properties: {
    id: { type: 'string', format: 'uuid' },
    productoId: { type: 'string', format: 'uuid' },
    nombreProducto: { type: 'string' },
    precioUnitario: { type: 'string' },
    cantidad: { type: 'integer' },
    subtotal: { type: 'string' },
  },
};

const pago = {
  type: 'object',
  properties: {
    id: { type: 'string', format: 'uuid' },
    metodo: { type: 'string', enum: ['TARJETA', 'PAYPAL', 'TRANSFERENCIA', 'CONTRA_ENTREGA'] },
    estado: { type: 'string', enum: ['PENDIENTE', 'COMPLETADO', 'FALLIDO', 'REEMBOLSADO'] },
    monto: { type: 'string' },
    pagadoEn: { type: 'string', format: 'date-time', nullable: true },
  },
};

const pedido = {
  type: 'object',
  properties: {
    id: { type: 'string', format: 'uuid' },
    numero: { type: 'string', example: 'PED-000001' },
    subtotal: { type: 'string' },
    iva: { type: 'string' },
    costoEnvio: { type: 'string' },
    descuento: { type: 'string' },
    total: { type: 'string' },
    metodoPago: { type: 'string', enum: ['TARJETA', 'PAYPAL', 'TRANSFERENCIA', 'CONTRA_ENTREGA'] },
    estado: { type: 'string', enum: ['PENDIENTE', 'PAGADO', 'ENVIADO', 'ENTREGADO', 'CANCELADO'] },
    numeroSeguimiento: { type: 'string', nullable: true },
    notas: { type: 'string', nullable: true },
    items: { type: 'array', items: detallePedido },
    pago,
    direccion,
    createdAt: { type: 'string', format: 'date-time' },
  },
};

function jsonBody(schema: unknown) {
  return { required: true, content: { 'application/json': { schema } } };
}

function okResponse(description: string, dataSchema: unknown) {
  return {
    description,
    content: {
      'application/json': {
        schema: {
          type: 'object',
          properties: { status: { type: 'string', example: 'success' }, data: dataSchema },
        },
      },
    },
  };
}

const responses = {
  400: { description: 'Datos inválidos', content: { 'application/json': { schema: errorResponse } } },
  401: { description: 'No autenticado', content: { 'application/json': { schema: errorResponse } } },
  403: { description: 'Sin permisos', content: { 'application/json': { schema: errorResponse } } },
  404: { description: 'No encontrado', content: { 'application/json': { schema: errorResponse } } },
  409: { description: 'Conflicto', content: { 'application/json': { schema: errorResponse } } },
};

const uuidParam = (name: string, description: string) => ({
  name,
  in: 'path',
  required: true,
  schema: { type: 'string', format: 'uuid' },
  description,
});

const pageParams = [
  { name: 'page', in: 'query', schema: { type: 'integer', default: 1 } },
  { name: 'limit', in: 'query', schema: { type: 'integer', default: 12 } },
];

export const openApiDocument: Record<string, any> = {
  openapi: '3.0.3',
  info: {
    title: 'E-commerce API',
    version: '1.0.0',
    description:
      'API REST de la tienda online: catálogo, carrito, checkout, pedidos, reseñas, favoritos y panel administrativo. ' +
      'La autenticación usa cookies httpOnly (accessToken/refreshToken); en Swagger UI hay que loguearse primero ' +
      'desde el navegador (o vía POST /auth/login con "Try it out") para que las cookies viajen en el resto de requests.',
  },
  servers: [{ url: '/api/v1', description: 'Servidor actual' }],
  tags: [
    { name: 'Auth', description: 'Registro, login, refresh, recuperación de contraseña' },
    { name: 'Usuarios', description: 'Perfil y direcciones del usuario autenticado' },
    { name: 'Productos', description: 'Catálogo público y CRUD administrativo' },
    { name: 'Categorías', description: 'Categorías y subcategorías' },
    { name: 'Marcas', description: 'Marcas de productos' },
    { name: 'Subida de imágenes', description: 'Integración con Cloudinary' },
    { name: 'Carrito', description: 'Carrito de compras y cupones' },
    { name: 'Pedidos', description: 'Checkout, historial y gestión de pedidos' },
    { name: 'Reseñas', description: 'Calificaciones y comentarios de productos' },
    { name: 'Favoritos', description: 'Lista de deseos del usuario' },
    { name: 'Cupones', description: 'Gestión administrativa de cupones' },
    { name: 'Administración', description: 'Dashboard, reportes y gestión de usuarios' },
  ],
  components: {
    securitySchemes: {
      cookieAuth: { type: 'apiKey', in: 'cookie', name: 'accessToken' },
    },
    schemas: {
      Usuario: usuario,
      Direccion: direccion,
      Categoria: categoria,
      Marca: marca,
      Producto: producto,
      Resena: resena,
      Favorito: favorito,
      Cupon: cupon,
      Carrito: carrito,
      Pedido: pedido,
      Error: errorResponse,
    },
  },
  paths: {
    '/auth/register': {
      post: {
        tags: ['Auth'],
        summary: 'Registrar un nuevo usuario (rol CLIENTE)',
        requestBody: jsonBody({
          type: 'object',
          required: ['nombre', 'apellido', 'email', 'password'],
          properties: {
            nombre: { type: 'string' },
            apellido: { type: 'string' },
            email: { type: 'string', format: 'email' },
            password: { type: 'string', format: 'password', description: 'Mín. 8 caracteres, mayúscula, minúscula y número' },
          },
        }),
        responses: {
          201: okResponse('Usuario creado, cookies de sesión seteadas', { type: 'object', properties: { usuario: { $ref: '#/components/schemas/Usuario' } } }),
          400: responses[400],
          409: responses[409],
        },
      },
    },
    '/auth/login': {
      post: {
        tags: ['Auth'],
        summary: 'Iniciar sesión',
        requestBody: jsonBody({
          type: 'object',
          required: ['email', 'password'],
          properties: { email: { type: 'string', format: 'email' }, password: { type: 'string', format: 'password' } },
        }),
        responses: {
          200: okResponse('Login exitoso, cookies de sesión seteadas', { type: 'object', properties: { usuario: { $ref: '#/components/schemas/Usuario' } } }),
          401: responses[401],
        },
      },
    },
    '/auth/refresh': {
      post: {
        tags: ['Auth'],
        summary: 'Rota el refresh token y emite un nuevo access token',
        responses: { 200: okResponse('Tokens rotados', {}), 401: responses[401] },
      },
    },
    '/auth/logout': {
      post: { tags: ['Auth'], summary: 'Cierra sesión y revoca el refresh token', responses: { 200: okResponse('Sesión cerrada', {}) } },
    },
    '/auth/me': {
      get: {
        tags: ['Auth'],
        summary: 'Usuario autenticado actual',
        security: [{ cookieAuth: [] }],
        responses: { 200: okResponse('Usuario actual', { type: 'object', properties: { usuario: { $ref: '#/components/schemas/Usuario' } } }), 401: responses[401] },
      },
    },
    '/auth/forgot-password': {
      post: {
        tags: ['Auth'],
        summary: 'Solicita el envío de un enlace de recuperación de contraseña',
        requestBody: jsonBody({ type: 'object', required: ['email'], properties: { email: { type: 'string', format: 'email' } } }),
        responses: { 200: okResponse('Siempre 200 (no revela si el correo existe)', {}) },
      },
    },
    '/auth/reset-password': {
      post: {
        tags: ['Auth'],
        summary: 'Restablece la contraseña con el token recibido por correo',
        requestBody: jsonBody({
          type: 'object',
          required: ['token', 'password'],
          properties: { token: { type: 'string' }, password: { type: 'string', format: 'password' } },
        }),
        responses: { 200: okResponse('Contraseña actualizada', {}), 400: responses[400] },
      },
    },

    '/users/me': {
      patch: {
        tags: ['Usuarios'],
        summary: 'Actualizar perfil propio',
        security: [{ cookieAuth: [] }],
        requestBody: jsonBody({
          type: 'object',
          properties: { nombre: { type: 'string' }, apellido: { type: 'string' }, telefono: { type: 'string', nullable: true }, avatarUrl: { type: 'string', nullable: true } },
        }),
        responses: { 200: okResponse('Perfil actualizado', { type: 'object', properties: { usuario: { $ref: '#/components/schemas/Usuario' } } }), 401: responses[401] },
      },
    },
    '/users/me/password': {
      patch: {
        tags: ['Usuarios'],
        summary: 'Cambiar contraseña (cierra sesión en todos los dispositivos)',
        security: [{ cookieAuth: [] }],
        requestBody: jsonBody({
          type: 'object',
          required: ['currentPassword', 'newPassword'],
          properties: { currentPassword: { type: 'string', format: 'password' }, newPassword: { type: 'string', format: 'password' } },
        }),
        responses: { 200: okResponse('Contraseña actualizada', {}), 401: responses[401] },
      },
    },
    '/users/me/addresses': {
      get: {
        tags: ['Usuarios'],
        summary: 'Listar direcciones propias',
        security: [{ cookieAuth: [] }],
        responses: { 200: okResponse('Listado de direcciones', { type: 'object', properties: { direcciones: { type: 'array', items: { $ref: '#/components/schemas/Direccion' } } } }) },
      },
      post: {
        tags: ['Usuarios'],
        summary: 'Crear dirección (la primera o marcada predeterminada desmarca las demás)',
        security: [{ cookieAuth: [] }],
        requestBody: jsonBody({ type: 'object', properties: direccion.properties }),
        responses: { 201: okResponse('Dirección creada', { type: 'object', properties: { direccion: { $ref: '#/components/schemas/Direccion' } } }), 400: responses[400] },
      },
    },
    '/users/me/addresses/{id}': {
      patch: {
        tags: ['Usuarios'],
        summary: 'Actualizar dirección propia',
        security: [{ cookieAuth: [] }],
        parameters: [uuidParam('id', 'ID de la dirección')],
        requestBody: jsonBody({ type: 'object', properties: direccion.properties }),
        responses: { 200: okResponse('Dirección actualizada', { type: 'object', properties: { direccion: { $ref: '#/components/schemas/Direccion' } } }), 404: responses[404] },
      },
      delete: {
        tags: ['Usuarios'],
        summary: 'Eliminar dirección propia',
        security: [{ cookieAuth: [] }],
        parameters: [uuidParam('id', 'ID de la dirección')],
        responses: { 204: { description: 'Eliminada' }, 404: responses[404] },
      },
    },

    '/products': {
      get: {
        tags: ['Productos'],
        summary: 'Catálogo público (solo productos ACTIVO)',
        parameters: [
          { name: 'categoria', in: 'query', schema: { type: 'string' }, description: 'slug de categoría' },
          { name: 'marca', in: 'query', schema: { type: 'string' }, description: 'slug de marca' },
          { name: 'precioMin', in: 'query', schema: { type: 'number' } },
          { name: 'precioMax', in: 'query', schema: { type: 'number' } },
          { name: 'valoracionMin', in: 'query', schema: { type: 'number' } },
          { name: 'disponible', in: 'query', schema: { type: 'boolean' } },
          { name: 'destacado', in: 'query', schema: { type: 'boolean' } },
          { name: 'q', in: 'query', schema: { type: 'string' }, description: 'búsqueda de texto' },
          { name: 'sort', in: 'query', schema: { type: 'string', enum: ['precio_asc', 'precio_desc', 'mas_vendidos', 'mas_recientes', 'mejor_valorados'] } },
          ...pageParams,
        ],
        responses: {
          200: {
            description: 'Listado paginado',
            content: { 'application/json': { schema: { type: 'object', properties: { status: { type: 'string' }, data: { type: 'array', items: { $ref: '#/components/schemas/Producto' } }, meta: paginationMeta } } } },
          },
        },
      },
      post: {
        tags: ['Productos'],
        summary: 'Crear producto (admin)',
        security: [{ cookieAuth: [] }],
        requestBody: jsonBody({
          type: 'object',
          required: ['nombre', 'descripcion', 'precio', 'stock', 'sku', 'categoriaId', 'marcaId'],
          properties: {
            nombre: { type: 'string' },
            descripcion: { type: 'string' },
            precio: { type: 'number' },
            precioAnterior: { type: 'number' },
            stock: { type: 'integer' },
            sku: { type: 'string' },
            peso: { type: 'number' },
            color: { type: 'string' },
            talla: { type: 'string' },
            categoriaId: { type: 'string', format: 'uuid' },
            marcaId: { type: 'string', format: 'uuid' },
            destacado: { type: 'boolean' },
            imagenes: { type: 'array', items: { type: 'object', properties: { url: { type: 'string' }, publicId: { type: 'string' }, esPrincipal: { type: 'boolean' } } } },
          },
        }),
        responses: { 201: okResponse('Producto creado', { type: 'object', properties: { producto: { $ref: '#/components/schemas/Producto' } } }), 401: responses[401], 403: responses[403], 409: responses[409] },
      },
    },
    '/products/search/autocomplete': {
      get: {
        tags: ['Productos'],
        summary: 'Sugerencias de búsqueda (mín. 2 caracteres)',
        parameters: [{ name: 'q', in: 'query', schema: { type: 'string' } }],
        responses: { 200: okResponse('Sugerencias', { type: 'object', properties: { productos: { type: 'array', items: { $ref: '#/components/schemas/Producto' } } } }) },
      },
    },
    '/products/admin': {
      get: {
        tags: ['Productos'],
        summary: 'Listado administrativo (incluye INACTIVO)',
        security: [{ cookieAuth: [] }],
        parameters: pageParams,
        responses: { 200: okResponse('Listado', {}), 401: responses[401], 403: responses[403] },
      },
    },
    '/products/{slug}': {
      get: {
        tags: ['Productos'],
        summary: 'Detalle de producto por slug',
        parameters: [{ name: 'slug', in: 'path', required: true, schema: { type: 'string' } }],
        responses: { 200: okResponse('Producto', { type: 'object', properties: { producto: { $ref: '#/components/schemas/Producto' } } }), 404: responses[404] },
      },
    },
    '/products/{id}': {
      put: {
        tags: ['Productos'],
        summary: 'Actualizar producto (admin)',
        security: [{ cookieAuth: [] }],
        parameters: [uuidParam('id', 'ID del producto')],
        responses: { 200: okResponse('Producto actualizado', { type: 'object', properties: { producto: { $ref: '#/components/schemas/Producto' } } }), 401: responses[401], 403: responses[403], 404: responses[404] },
      },
      delete: {
        tags: ['Productos'],
        summary: 'Eliminar producto (soft delete a INACTIVO, admin)',
        security: [{ cookieAuth: [] }],
        parameters: [uuidParam('id', 'ID del producto')],
        responses: { 204: { description: 'Desactivado' }, 401: responses[401], 403: responses[403], 404: responses[404] },
      },
    },
    '/products/{id}/images/{imageId}': {
      delete: {
        tags: ['Productos'],
        summary: 'Eliminar una imagen puntual del producto (admin)',
        security: [{ cookieAuth: [] }],
        parameters: [uuidParam('id', 'ID del producto'), uuidParam('imageId', 'ID de la imagen')],
        responses: { 204: { description: 'Eliminada' }, 404: responses[404] },
      },
    },

    '/categories': {
      get: { tags: ['Categorías'], summary: 'Listar categorías activas (con subcategorías)', responses: { 200: okResponse('Listado', { type: 'object', properties: { categorias: { type: 'array', items: { $ref: '#/components/schemas/Categoria' } } } }) } },
      post: {
        tags: ['Categorías'],
        summary: 'Crear categoría (admin)',
        security: [{ cookieAuth: [] }],
        requestBody: jsonBody({ type: 'object', required: ['nombre'], properties: { nombre: { type: 'string' }, descripcion: { type: 'string' }, imagenUrl: { type: 'string' }, categoriaPadreId: { type: 'string', format: 'uuid' } } }),
        responses: { 201: okResponse('Categoría creada', { type: 'object', properties: { categoria: { $ref: '#/components/schemas/Categoria' } } }), 401: responses[401], 403: responses[403] },
      },
    },
    '/categories/{slug}': {
      get: { tags: ['Categorías'], summary: 'Detalle de categoría por slug', parameters: [{ name: 'slug', in: 'path', required: true, schema: { type: 'string' } }], responses: { 200: okResponse('Categoría', {}), 404: responses[404] } },
    },
    '/categories/{id}': {
      put: { tags: ['Categorías'], summary: 'Actualizar categoría (admin)', security: [{ cookieAuth: [] }], parameters: [uuidParam('id', 'ID de la categoría')], responses: { 200: okResponse('Actualizada', {}), 404: responses[404] } },
      delete: { tags: ['Categorías'], summary: 'Eliminar categoría (admin, 409 si tiene productos)', security: [{ cookieAuth: [] }], parameters: [uuidParam('id', 'ID de la categoría')], responses: { 204: { description: 'Eliminada' }, 409: responses[409] } },
    },

    '/brands': {
      get: { tags: ['Marcas'], summary: 'Listar marcas', responses: { 200: okResponse('Listado', { type: 'object', properties: { marcas: { type: 'array', items: { $ref: '#/components/schemas/Marca' } } } }) } },
      post: {
        tags: ['Marcas'],
        summary: 'Crear marca (admin)',
        security: [{ cookieAuth: [] }],
        requestBody: jsonBody({ type: 'object', required: ['nombre'], properties: { nombre: { type: 'string' }, logoUrl: { type: 'string' } } }),
        responses: { 201: okResponse('Marca creada', { type: 'object', properties: { marca: { $ref: '#/components/schemas/Marca' } } }), 401: responses[401], 403: responses[403] },
      },
    },
    '/brands/{slug}': {
      get: { tags: ['Marcas'], summary: 'Detalle de marca por slug', parameters: [{ name: 'slug', in: 'path', required: true, schema: { type: 'string' } }], responses: { 200: okResponse('Marca', {}), 404: responses[404] } },
    },
    '/brands/{id}': {
      put: { tags: ['Marcas'], summary: 'Actualizar marca (admin)', security: [{ cookieAuth: [] }], parameters: [uuidParam('id', 'ID de la marca')], responses: { 200: okResponse('Actualizada', {}), 404: responses[404] } },
      delete: { tags: ['Marcas'], summary: 'Eliminar marca (admin, 409 si tiene productos)', security: [{ cookieAuth: [] }], parameters: [uuidParam('id', 'ID de la marca')], responses: { 204: { description: 'Eliminada' }, 409: responses[409] } },
    },

    '/uploads/image': {
      post: {
        tags: ['Subida de imágenes'],
        summary: 'Sube una imagen a Cloudinary (admin, multipart/form-data, campo "image")',
        security: [{ cookieAuth: [] }],
        requestBody: { required: true, content: { 'multipart/form-data': { schema: { type: 'object', properties: { image: { type: 'string', format: 'binary' } } } } } },
        responses: {
          201: okResponse('Imagen subida', { type: 'object', properties: { url: { type: 'string' }, publicId: { type: 'string' } } }),
          400: responses[400],
          503: { description: 'Cloudinary no configurado en el servidor' },
        },
      },
    },

    '/cart': {
      get: { tags: ['Carrito'], summary: 'Obtener carrito propio (se crea si no existe)', security: [{ cookieAuth: [] }], responses: { 200: okResponse('Carrito', { type: 'object', properties: { carrito: { $ref: '#/components/schemas/Carrito' } } }) } },
      delete: { tags: ['Carrito'], summary: 'Vaciar carrito', security: [{ cookieAuth: [] }], responses: { 200: okResponse('Carrito vacío', { type: 'object', properties: { carrito: { $ref: '#/components/schemas/Carrito' } } }) } },
    },
    '/cart/items': {
      post: {
        tags: ['Carrito'],
        summary: 'Agregar producto al carrito (acumula cantidad si ya existe)',
        security: [{ cookieAuth: [] }],
        requestBody: jsonBody({ type: 'object', required: ['productoId'], properties: { productoId: { type: 'string', format: 'uuid' }, cantidad: { type: 'integer', default: 1 } } }),
        responses: { 201: okResponse('Carrito actualizado', { type: 'object', properties: { carrito: { $ref: '#/components/schemas/Carrito' } } }), 400: responses[400], 404: responses[404] },
      },
    },
    '/cart/items/{productoId}': {
      patch: { tags: ['Carrito'], summary: 'Cambiar cantidad de un item', security: [{ cookieAuth: [] }], parameters: [uuidParam('productoId', 'ID del producto')], requestBody: jsonBody({ type: 'object', required: ['cantidad'], properties: { cantidad: { type: 'integer' } } }), responses: { 200: okResponse('Actualizado', {}), 400: responses[400], 404: responses[404] } },
      delete: { tags: ['Carrito'], summary: 'Quitar item del carrito', security: [{ cookieAuth: [] }], parameters: [uuidParam('productoId', 'ID del producto')], responses: { 200: okResponse('Actualizado', {}) } },
    },
    '/cart/coupon': {
      post: { tags: ['Carrito'], summary: 'Aplicar cupón al carrito', security: [{ cookieAuth: [] }], requestBody: jsonBody({ type: 'object', required: ['codigo'], properties: { codigo: { type: 'string' } } }), responses: { 200: okResponse('Cupón aplicado', {}), 400: responses[400] } },
      delete: { tags: ['Carrito'], summary: 'Quitar cupón del carrito', security: [{ cookieAuth: [] }], responses: { 200: okResponse('Cupón removido', {}) } },
    },

    '/orders/checkout': {
      post: {
        tags: ['Pedidos'],
        summary: 'Convertir el carrito actual en un pedido',
        security: [{ cookieAuth: [] }],
        requestBody: jsonBody({
          type: 'object',
          required: ['direccionId', 'metodoPago'],
          properties: { direccionId: { type: 'string', format: 'uuid' }, metodoPago: { type: 'string', enum: ['TARJETA', 'PAYPAL', 'TRANSFERENCIA', 'CONTRA_ENTREGA'] }, notas: { type: 'string' } },
        }),
        responses: { 201: okResponse('Pedido creado', { type: 'object', properties: { pedido: { $ref: '#/components/schemas/Pedido' } } }), 400: responses[400], 404: responses[404], 409: responses[409] },
      },
    },
    '/orders': {
      get: { tags: ['Pedidos'], summary: 'Historial de pedidos propio', security: [{ cookieAuth: [] }], parameters: [{ name: 'estado', in: 'query', schema: { type: 'string' } }, ...pageParams], responses: { 200: okResponse('Listado', {}) } },
    },
    '/orders/admin': {
      get: { tags: ['Pedidos'], summary: 'Listado de todos los pedidos (admin)', security: [{ cookieAuth: [] }], parameters: [{ name: 'estado', in: 'query', schema: { type: 'string' } }, ...pageParams], responses: { 200: okResponse('Listado', {}), 403: responses[403] } },
    },
    '/orders/{id}': {
      get: { tags: ['Pedidos'], summary: 'Detalle de pedido (propio o cualquiera si es admin)', security: [{ cookieAuth: [] }], parameters: [uuidParam('id', 'ID del pedido')], responses: { 200: okResponse('Pedido', { type: 'object', properties: { pedido: { $ref: '#/components/schemas/Pedido' } } }), 404: responses[404] } },
    },
    '/orders/{id}/status': {
      patch: {
        tags: ['Pedidos'],
        summary: 'Cambiar estado del pedido (admin, respeta máquina de estados)',
        security: [{ cookieAuth: [] }],
        parameters: [uuidParam('id', 'ID del pedido')],
        requestBody: jsonBody({ type: 'object', required: ['estado'], properties: { estado: { type: 'string', enum: ['PENDIENTE', 'PAGADO', 'ENVIADO', 'ENTREGADO', 'CANCELADO'] }, numeroSeguimiento: { type: 'string' } } }),
        responses: { 200: okResponse('Pedido actualizado', {}), 400: responses[400], 403: responses[403] },
      },
    },
    '/orders/{id}/cancel': {
      post: { tags: ['Pedidos'], summary: 'Cancelar pedido propio (solo PENDIENTE/PAGADO, restituye stock)', security: [{ cookieAuth: [] }], parameters: [uuidParam('id', 'ID del pedido')], responses: { 200: okResponse('Pedido cancelado', {}), 400: responses[400], 404: responses[404] } },
    },

    '/products/{productId}/reviews': {
      get: { tags: ['Reseñas'], summary: 'Listar reseñas aprobadas de un producto', parameters: [uuidParam('productId', 'ID del producto'), ...pageParams], responses: { 200: okResponse('Listado', {}) } },
      post: {
        tags: ['Reseñas'],
        summary: 'Crear reseña (una por usuario y producto)',
        security: [{ cookieAuth: [] }],
        parameters: [uuidParam('productId', 'ID del producto')],
        requestBody: jsonBody({ type: 'object', required: ['calificacion'], properties: { calificacion: { type: 'integer', minimum: 1, maximum: 5 }, comentario: { type: 'string' } } }),
        responses: { 201: okResponse('Reseña creada', { type: 'object', properties: { resena: { $ref: '#/components/schemas/Resena' } } }), 401: responses[401], 409: responses[409] },
      },
    },
    '/reviews/{id}': {
      put: { tags: ['Reseñas'], summary: 'Editar reseña propia', security: [{ cookieAuth: [] }], parameters: [uuidParam('id', 'ID de la reseña')], responses: { 200: okResponse('Actualizada', {}), 404: responses[404] } },
      delete: { tags: ['Reseñas'], summary: 'Eliminar reseña propia (o cualquiera si es admin)', security: [{ cookieAuth: [] }], parameters: [uuidParam('id', 'ID de la reseña')], responses: { 204: { description: 'Eliminada' }, 404: responses[404] } },
    },
    '/reviews/{id}/moderate': {
      patch: {
        tags: ['Reseñas'],
        summary: 'Aprobar u ocultar una reseña (admin)',
        security: [{ cookieAuth: [] }],
        parameters: [uuidParam('id', 'ID de la reseña')],
        requestBody: jsonBody({ type: 'object', required: ['aprobada'], properties: { aprobada: { type: 'boolean' } } }),
        responses: { 200: okResponse('Reseña moderada', {}), 403: responses[403] },
      },
    },

    '/favorites': {
      get: { tags: ['Favoritos'], summary: 'Listar favoritos propios', security: [{ cookieAuth: [] }], responses: { 200: okResponse('Listado', { type: 'object', properties: { favoritos: { type: 'array', items: { $ref: '#/components/schemas/Favorito' } } } }) } },
    },
    '/favorites/{productId}': {
      post: { tags: ['Favoritos'], summary: 'Agregar producto a favoritos', security: [{ cookieAuth: [] }], parameters: [uuidParam('productId', 'ID del producto')], responses: { 201: okResponse('Agregado', {}), 409: responses[409] } },
      delete: { tags: ['Favoritos'], summary: 'Quitar producto de favoritos', security: [{ cookieAuth: [] }], parameters: [uuidParam('productId', 'ID del producto')], responses: { 204: { description: 'Eliminado' }, 404: responses[404] } },
    },

    '/coupons': {
      get: { tags: ['Cupones'], summary: 'Listar cupones (admin)', security: [{ cookieAuth: [] }], responses: { 200: okResponse('Listado', { type: 'object', properties: { cupones: { type: 'array', items: { $ref: '#/components/schemas/Cupon' } } } }), 403: responses[403] } },
      post: {
        tags: ['Cupones'],
        summary: 'Crear cupón (admin)',
        security: [{ cookieAuth: [] }],
        requestBody: jsonBody({
          type: 'object',
          required: ['codigo', 'tipo', 'valor', 'fechaInicio', 'fechaFin'],
          properties: { codigo: { type: 'string' }, tipo: { type: 'string', enum: ['PORCENTAJE', 'MONTO_FIJO'] }, valor: { type: 'number' }, fechaInicio: { type: 'string', format: 'date' }, fechaFin: { type: 'string', format: 'date' }, usoMaximo: { type: 'integer' }, montoMinimo: { type: 'number' } },
        }),
        responses: { 201: okResponse('Cupón creado', { type: 'object', properties: { cupon: { $ref: '#/components/schemas/Cupon' } } }), 400: responses[400], 409: responses[409] },
      },
    },
    '/coupons/{id}': {
      put: { tags: ['Cupones'], summary: 'Actualizar cupón (admin)', security: [{ cookieAuth: [] }], parameters: [uuidParam('id', 'ID del cupón')], responses: { 200: okResponse('Actualizado', {}), 404: responses[404] } },
      delete: { tags: ['Cupones'], summary: 'Eliminar cupón (admin)', security: [{ cookieAuth: [] }], parameters: [uuidParam('id', 'ID del cupón')], responses: { 204: { description: 'Eliminado' }, 404: responses[404] } },
    },

    '/admin/dashboard': {
      get: {
        tags: ['Administración'],
        summary: 'Estadísticas del panel administrativo',
        security: [{ cookieAuth: [] }],
        responses: {
          200: okResponse('Estadísticas', {
            type: 'object',
            properties: {
              ventasHoy: { type: 'object', properties: { total: { type: 'number' }, pedidos: { type: 'integer' } } },
              ventasMes: { type: 'object', properties: { total: { type: 'number' }, pedidos: { type: 'integer' } } },
              pedidosPendientes: { type: 'integer' },
              clientesNuevosMes: { type: 'integer' },
              totalProductos: { type: 'integer' },
              totalClientes: { type: 'integer' },
              pedidosPorEstado: { type: 'array', items: { type: 'object', properties: { estado: { type: 'string' }, cantidad: { type: 'integer' } } } },
              productosMasVendidos: { type: 'array', items: { $ref: '#/components/schemas/Producto' } },
              ventasDiarias: { type: 'array', items: { type: 'object', properties: { fecha: { type: 'string' }, total: { type: 'number' } } } },
            },
          }),
          403: responses[403],
        },
      },
    },
    '/admin/reports/sales': {
      get: {
        tags: ['Administración'],
        summary: 'Reporte de ventas por rango de fechas',
        security: [{ cookieAuth: [] }],
        parameters: [
          { name: 'desde', in: 'query', required: true, schema: { type: 'string', format: 'date' } },
          { name: 'hasta', in: 'query', required: true, schema: { type: 'string', format: 'date' } },
        ],
        responses: {
          200: okResponse('Reporte', {
            type: 'object',
            properties: {
              totalVentas: { type: 'number' },
              totalPedidos: { type: 'integer' },
              productosMasVendidos: { type: 'array', items: { type: 'object', properties: { productoId: { type: 'string' }, nombre: { type: 'string' }, unidadesVendidas: { type: 'integer' }, ingresos: { type: 'number' } } } },
            },
          }),
          400: responses[400],
          403: responses[403],
        },
      },
    },
    '/admin/users': {
      get: {
        tags: ['Administración'],
        summary: 'Listar usuarios (admin)',
        security: [{ cookieAuth: [] }],
        parameters: [{ name: 'rol', in: 'query', schema: { type: 'string', enum: ['CLIENTE', 'ADMIN'] } }, { name: 'q', in: 'query', schema: { type: 'string' } }, ...pageParams],
        responses: { 200: okResponse('Listado', {}), 403: responses[403] },
      },
    },
    '/admin/users/{id}': {
      patch: {
        tags: ['Administración'],
        summary: 'Activar/desactivar o cambiar rol de un usuario (admin, no permite auto-bloqueo)',
        security: [{ cookieAuth: [] }],
        parameters: [uuidParam('id', 'ID del usuario')],
        requestBody: jsonBody({ type: 'object', properties: { activo: { type: 'boolean' }, rol: { type: 'string', enum: ['CLIENTE', 'ADMIN'] } } }),
        responses: { 200: okResponse('Usuario actualizado', { type: 'object', properties: { usuario: { $ref: '#/components/schemas/Usuario' } } }), 400: responses[400], 403: responses[403], 404: responses[404] },
      },
    },
  },
};
