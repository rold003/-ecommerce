# E-commerce

Tienda online completa (catálogo, carrito, checkout, pedidos, panel administrativo) construida como monorepo con backend y frontend independientes.

> Este README se irá completando a medida que se desarrolle cada módulo. Al final del proyecto tendrá la documentación completa (instalación, variables de entorno, migraciones, scripts, despliegue).

## Estructura del repositorio

```
ecommerce/
├── backend/          # API REST (Node.js + Express + TypeScript + Prisma)
├── frontend/          # SPA (React 19 + Vite + TypeScript + Tailwind)
├── docker-compose.yml # PostgreSQL local para desarrollo
└── package.json       # scripts de conveniencia para orquestar ambos proyectos
```

## Decisiones de arquitectura

- **Monorepo sin workspaces de npm**: `backend/` y `frontend/` son dos proyectos npm independientes (cada uno con su propio `package.json` y `node_modules`). El `package.json` raíz solo expone scripts de conveniencia (`npm run backend:dev`, `npm run frontend:dev`, etc.) que delegan con `npm --prefix`. Se evitó workspaces para mantener el desacoplamiento total entre despliegues (el frontend va a Vercel, el backend a Render).
- **Prisma vive en `backend/prisma/`** (no dentro de `src/`), porque es la ubicación por defecto que espera el CLI de Prisma (`./prisma/schema.prisma` relativo a la raíz del paquete) y evita tener que configurar rutas custom.
- **Arquitectura por capas** en el backend: `routes → controllers → services → repositories → database (Prisma)`, con `middlewares/`, `validators/` (Zod) y `utils/` transversales. Los controllers no acceden a Prisma directamente, siempre pasan por `services`/`repositories`.
- **PostgreSQL local vía Docker Compose** (`docker-compose.yml` en la raíz) para no depender de una instalación nativa de Postgres en Windows. Puerto 5432 expuesto (parametrizable con `.env` si llegara a chocar con otra instancia).

## Próximos pasos

1. Backend: configuración base (Express + TS + seguridad + conexión a DB).
2. Backend: schema de Prisma con todas las tablas normalizadas.
3. Desarrollo del backend módulo por módulo (auth, usuarios, productos, carrito, pedidos, reseñas, admin).
4. Documentación Swagger de la API.
5. Frontend: configuración base y UI kit.
6. Desarrollo del frontend módulo por módulo.
7. README final con instrucciones completas de instalación y despliegue.
