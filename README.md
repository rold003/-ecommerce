# 🛍️ E-commerce — Tienda Online

Tienda online full-stack completa: catálogo con filtros y búsqueda, carrito, checkout,
pedidos, reseñas, favoritos y un panel administrativo con dashboard, reportes y CRUD
completo de productos/categorías/marcas/cupones/usuarios. Backend con arquitectura por
capas, autenticación JWT + refresh token en cookies httpOnly, y frontend en React 19
con modo oscuro/claro.

## Capturas de pantalla

> Marcadores de posición — reemplazar por capturas reales antes de publicar.

| Inicio | Catálogo | Detalle de producto |
|---|---|---|
| `docs/screenshots/home.png` | `docs/screenshots/catalogo.png` | `docs/screenshots/producto.png` |

| Carrito / Checkout | Panel admin — Dashboard | Panel admin — Productos |
|---|---|---|
| `docs/screenshots/checkout.png` | `docs/screenshots/admin-dashboard.png` | `docs/screenshots/admin-productos.png` |

## Tabla de contenido

- [Tecnologías](#tecnologías)
- [Estructura del proyecto](#estructura-del-proyecto)
- [Decisiones de arquitectura](#decisiones-de-arquitectura)
- [Instalación](#instalación)
- [Variables de entorno](#variables-de-entorno)
- [Prisma y migraciones](#prisma-y-migraciones)
- [Scripts disponibles](#scripts-disponibles)
- [Tests](#tests)
- [Documentación de la API](#documentación-de-la-api)
- [Cuentas de prueba (seed)](#cuentas-de-prueba-seed)
- [Despliegue](#despliegue)
- [SEO y observabilidad](#seo-y-observabilidad)
- [Seguridad](#seguridad)

## Tecnologías

**Frontend** — React 19 · Vite 6 · TypeScript estricto · Tailwind CSS v4 · React Router 7 ·
Axios · React Hook Form · Zod · TanStack Query · Framer Motion · lucide-react

**Backend** — Node.js · Express 5 · TypeScript estricto

**Base de datos** — PostgreSQL 16 (Docker Compose para desarrollo local)

**ORM** — Prisma

**Autenticación** — JWT (access + refresh) en cookies httpOnly, rotación de refresh
token, bcrypt para contraseñas

**Almacenamiento de imágenes** — Cloudinary (con fallback a URL manual si no está
configurado)

**Validación** — Zod (frontend y backend, mismas reglas)

**Seguridad** — Helmet, CORS con credenciales, rate limiting (general + estricto en
auth), bcrypt, Prisma parametriza todas las consultas (sin inyección SQL)

**Documentación de API** — OpenAPI 3 / Swagger UI

## Estructura del proyecto

```
ecommerce/
├── backend/
│   ├── prisma/
│   │   ├── schema.prisma       # 15 modelos normalizados
│   │   ├── migrations/
│   │   └── seed.ts             # datos de prueba (admin, cliente, catálogo, cupón)
│   └── src/
│       ├── config/             # env (validado con Zod), CORS
│       ├── database/           # cliente Prisma (singleton)
│       ├── validators/         # esquemas Zod por módulo
│       ├── middlewares/        # auth, validate, rateLimiter, errorHandler, upload
│       ├── repositories/       # acceso a datos (Prisma)
│       ├── services/           # lógica de negocio
│       ├── controllers/        # handlers HTTP
│       ├── routes/             # definición de endpoints
│       ├── docs/               # spec OpenAPI
│       ├── app.ts / server.ts
│       └── ...
└── frontend/
    └── src/
        ├── components/
        │   ├── ui/             # Button, Input, Modal, Toast, Pagination...
        │   ├── layout/         # Header, Footer, Layout, AdminLayout
        │   ├── product/        # ProductCard, FilterSidebar, SearchAutocomplete
        │   ├── checkout/       # AddressForm
        │   └── admin/          # StatTile, gráficos del dashboard, ProductForm
        ├── pages/               # rutas públicas, auth/, admin/
        ├── context/             # AuthContext, ThemeContext, ToastContext
        ├── hooks/               # hooks de TanStack Query por dominio
        ├── services/            # clientes Axios por recurso
        ├── routes/              # ProtectedRoute / AdminRoute
        ├── types/ · utils/
        └── App.tsx / main.tsx
```

## Decisiones de arquitectura

- **Monorepo sin npm workspaces**: `backend/` y `frontend/` son proyectos npm
  independientes (se despliegan por separado: Render y Vercel).
- **Arquitectura por capas** en el backend: `routes → controllers → services →
  repositories → Prisma`. Los controllers nunca acceden a Prisma directamente.
- **Prisma vive en `backend/prisma/`**, no dentro de `src/`, por ser la ubicación por
  defecto que espera el CLI de Prisma.
- **Auth por cookies httpOnly**, no localStorage: mitiga robo de tokens vía XSS. El
  frontend usa un interceptor de Axios que refresca la sesión automáticamente ante un
  401 (con cola de requests concurrentes) antes de propagar el error.
- **Carrito y favoritos como cache de TanStack Query**, no un Context propio: cualquier
  componente que llame `useCart()`/`useFavorites()` ve el mismo dato cacheado, así el
  badge del header se actualiza solo cuando cualquier página muta el carrito.
- **Precios calculados en un solo lugar** (`pricing.service.ts` en el backend): el
  carrito y el checkout aplican exactamente la misma fórmula de IVA/envío/descuento.
- **Borrado de productos = soft delete** (`estado: INACTIVO`) para no romper la
  integridad referencial con pedidos históricos.

## Instalación

### Requisitos previos

- Node.js 20+
- Docker Desktop (para PostgreSQL local) — o una instancia de Postgres propia
- npm

### Pasos

```bash
# 1. Clonar el repositorio
git clone https://github.com/rold003/-ecommerce.git
cd ecommerce

# 2. Levantar PostgreSQL local
npm run db:up

# 3. Configurar variables de entorno
cp backend/.env.example backend/.env
cp frontend/.env.example frontend/.env
# Editar backend/.env: generar secretos JWT reales, ver sección siguiente

# 4. Instalar dependencias
npm run install:all

# 5. Migrar y poblar la base de datos
cd backend
npm run prisma:migrate
npm run prisma:seed
cd ..

# 6. Levantar ambos servidores (en dos terminales)
npm run backend:dev    # http://localhost:4000
npm run frontend:dev   # http://localhost:5173
```

Genera secretos JWT reales con:

```bash
node -e "console.log(require('crypto').randomBytes(48).toString('hex'))"
```

## Variables de entorno

### `backend/.env`

| Variable | Descripción | Default |
|---|---|---|
| `NODE_ENV` | `development` \| `production` \| `test` | `development` |
| `PORT` | Puerto del servidor | `4000` |
| `DATABASE_URL` | Cadena de conexión de PostgreSQL | — |
| `JWT_ACCESS_SECRET` | Secreto del access token (mín. 16 caracteres) | — |
| `JWT_REFRESH_SECRET` | Secreto del refresh token (mín. 16 caracteres) | — |
| `JWT_ACCESS_EXPIRES_IN` | Vigencia del access token | `15m` |
| `JWT_REFRESH_EXPIRES_IN` | Vigencia del refresh token | `7d` |
| `COOKIE_DOMAIN` | Dominio de las cookies de sesión | `localhost` |
| `CORS_ORIGIN` | Origen(es) permitido(s), separados por coma | `http://localhost:5173` |
| `CLOUDINARY_CLOUD_NAME` / `_API_KEY` / `_API_SECRET` | Credenciales de Cloudinary (opcional; sin ellas, la subida de imágenes responde 503 y el admin puede pegar URLs directas) | — |
| `SMTP_HOST` / `_PORT` / `_USER` / `_PASSWORD` | Credenciales SMTP (opcional; sin ellas, los correos se imprimen en consola) | — |
| `EMAIL_FROM` | Remitente de los correos | `no-reply@ecommerce.local` |
| `RATE_LIMIT_WINDOW_MS` / `RATE_LIMIT_MAX` | Rate limit general | `900000` / `100` |
| `TAX_RATE` | Tasa de IVA aplicada en carrito/checkout | `0.15` |
| `SHIPPING_FLAT_RATE` | Costo de envío plano | `5` |
| `FREE_SHIPPING_THRESHOLD` | Monto desde el cual el envío es gratis | `50` |
| `SENTRY_DSN` | DSN de Sentry (opcional; sin él, Sentry no se activa) | — |

### `frontend/.env`

| Variable | Descripción | Default |
|---|---|---|
| `VITE_API_URL` | URL base de la API del backend | `http://localhost:4000/api/v1` |
| `VITE_SENTRY_DSN` | DSN de Sentry (opcional; sin él, Sentry no se activa) | — |
| `VITE_GA_MEASUREMENT_ID` | Measurement ID de Google Analytics 4 (opcional; sin él, GA4 no se activa) | — |

## Prisma y migraciones

```bash
cd backend

npm run prisma:generate   # regenerar el cliente de Prisma
npm run prisma:migrate    # crear y aplicar una migración en desarrollo
npm run prisma:deploy     # aplicar migraciones pendientes (producción)
npm run prisma:studio     # explorador visual de la base de datos
npm run prisma:seed       # poblar con datos de prueba
```

El schema define 15 modelos normalizados: `Usuario`, `RefreshToken`,
`PasswordResetToken`, `Direccion`, `Categoria` (con subcategorías), `Marca`,
`Producto`, `Imagen`, `Resena`, `Favorito`, `Carrito`, `ItemCarrito`, `Cupon`,
`Pedido`, `DetallePedido`, `Pago`.

## Scripts disponibles

### Raíz del monorepo

| Script | Descripción |
|---|---|
| `npm run db:up` / `db:down` | Levanta / detiene PostgreSQL (Docker Compose) |
| `npm run install:all` | Instala dependencias de backend y frontend |
| `npm run backend:dev` / `frontend:dev` | Arranca cada servidor en modo desarrollo |

### `backend/`

| Script | Descripción |
|---|---|
| `npm run dev` | Servidor con recarga en caliente (`tsx watch`) |
| `npm run build` | Compila TypeScript a `dist/` |
| `npm start` | Arranca el build de producción |
| `npm run lint` | ESLint |
| `npm test` | Corre los tests (crea/sincroniza `ecommerce_test` y luego corre Vitest) |
| `npm run test:watch` | Tests en modo watch |

### `frontend/`

| Script | Descripción |
|---|---|
| `npm run dev` | Servidor de desarrollo de Vite |
| `npm run build` | Type-check + build de producción |
| `npm run preview` | Sirve el build de producción localmente |
| `npm run lint` | ESLint |

## Tests

```bash
cd backend
npm test          # una sola corrida
npm run test:watch
```

Cubre lo más crítico del negocio (no hay tests de UI todavía):

- **`tests/unit/pricing.service.test.ts`**: cálculo de IVA, envío y descuentos — funciones
  puras, sin base de datos.
- **`tests/integration/auth.service.test.ts`**: registro, login, credenciales inválidas,
  usuario desactivado.
- **`tests/integration/order.service.test.ts`**: checkout — descuento atómico de stock,
  bloqueo de sobreventa, productos inactivos, carrito vacío, direcciones ajenas.

Los tests de integración corren contra una base de datos Postgres **real** (no mocks), en
`ecommerce_test` — la misma instancia de Docker del desarrollo local, pero una base
separada para no tocar los datos de desarrollo/seed. El script `pretest` (`prisma db
push`) la crea/sincroniza automáticamente antes de cada corrida; no hace falta preparación
manual más allá de tener `npm run db:up` levantado.

## Documentación de la API

Con el backend corriendo, la documentación interactiva (Swagger UI) está disponible en:

```
http://localhost:4000/api-docs
```

El spec crudo en JSON: `http://localhost:4000/api-docs.json`.

## Cuentas de prueba (seed)

| Rol | Correo | Contraseña |
|---|---|---|
| Administrador | `admin@ecommerce.local` | `Admin123!` |
| Cliente | `cliente@ecommerce.local` | `Cliente123!` |

El seed también crea 4 categorías, 4 marcas, 8 productos con imágenes y el cupón
`BIENVENIDO10` (10% de descuento, monto mínimo $20).

## Despliegue

### Base de datos — Supabase (PostgreSQL)

1. Crear un proyecto en [Supabase](https://supabase.com).
2. Copiar la cadena de conexión (modo *connection pooling* recomendado para
   producción) y usarla como `DATABASE_URL` del backend.
3. Aplicar las migraciones contra la base remota: `npm run prisma:deploy`.

### Backend — Render

1. Crear un *Web Service* apuntando a la carpeta `backend/`.
2. Build command: `npm install && npm run build && npx prisma generate`.
3. Start command: `npm start`.
4. Configurar todas las variables de entorno de `backend/.env.example` (con secretos
   reales y `DATABASE_URL` de Supabase).
5. Ajustar `CORS_ORIGIN` a la URL del frontend desplegado en Vercel.

### Frontend — Vercel

1. Importar el repositorio, con **Root Directory** = `frontend/`.
2. Build command: `npm run build` — Output directory: `dist/`.
3. Variables de entorno: `VITE_API_URL` apuntando a la URL del backend en Render
   (ej. `https://tu-backend.onrender.com/api/v1`), y opcionalmente `VITE_SENTRY_DSN` /
   `VITE_GA_MEASUREMENT_ID`.
4. Actualizar `frontend/vercel.json` con la URL real del backend en Render (reemplaza
   `https://tu-backend.onrender.com`) — redirige `/sitemap.xml` al backend, que es quien
   genera el sitemap dinámicamente. También reemplazar el dominio placeholder en
   `frontend/public/robots.txt`.

### Cloudinary y SMTP (opcional)

Sin estas credenciales, la subida de imágenes responde `503` (el admin puede pegar
URLs directas) y los correos se imprimen en el log del servidor en vez de enviarse.
Para habilitarlos en producción, configura `CLOUDINARY_*` y `SMTP_*` con credenciales
reales.

## SEO y observabilidad

- **`GET /sitemap.xml`** (backend): generado en cada request a partir de los productos
  activos y las páginas estáticas — no hay que regenerarlo a mano al agregar productos.
  Las categorías no tienen URL propia (se filtran por query param en `/catalogo`), así
  que no aparecen como entradas separadas.
- **`frontend/public/robots.txt`**: permite todo salvo las páginas privadas
  (`/admin`, `/perfil`, `/pedidos`, `/carrito`, `/checkout`, `/favoritos`).
- **`<title>`/meta description por página**: `useDocumentMeta` (sin dependencias nuevas)
  actualiza el título y la descripción al navegar — ayuda a Google (que sí ejecuta JS),
  pero **no** genera vistas previas para compartir en redes (WhatsApp/Facebook/Twitter no
  ejecutan JS): eso requeriría SSR/prerender, que esta SPA no tiene.
- **Sentry** (`@sentry/node` en el backend, `@sentry/react` en el frontend): opcional,
  desactivado por completo si `SENTRY_DSN`/`VITE_SENTRY_DSN` no están configurados. En el
  backend solo se reportan errores 500 no manejados (`errorHandler.ts`), nunca errores
  esperables como 400/404/409 — así no se gasta la cuota gratuita en ruido.
- **Google Analytics 4** (`frontend/src/config/analytics.ts`): opcional, desactivado por
  completo si `VITE_GA_MEASUREMENT_ID` no está configurado (el script de Google ni
  siquiera se carga). Trackea vistas de página en cada cambio de ruta (SPA, no recarga
  completa) y el embudo de conversión de e-commerce: `add_to_cart` (ProductDetail),
  `begin_checkout` y `purchase` (Checkout) — con `items`/`value`/`currency` en el formato
  que espera GA4 para sus reportes de e-commerce.

## Seguridad

- Contraseñas con bcrypt (12 rounds), nunca se devuelven en ninguna respuesta.
- JWT de acceso de corta duración en cookie httpOnly + refresh token rotado en cada
  uso (el usado se revoca; solo se guarda su hash SHA-256 en la base de datos).
- Recuperación de contraseña con token de un solo uso y expiración de 1 hora; no
  revela si un correo existe o no.
- Rate limiting general y uno más estricto en endpoints de autenticación.
- Helmet (headers de seguridad), CORS restringido por origen con credenciales.
- Validación estricta con Zod en cada endpoint (protección contra payloads
  malformados/XSS vía JSON).
- Prisma parametriza todas las consultas: sin inyección SQL por diseño.
- Límite de tamaño de payload (10kb) para mitigar ataques de negación de servicio
  simples por payload grande.
