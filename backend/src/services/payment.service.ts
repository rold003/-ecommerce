import type { EstadoPago, MetodoPago } from '@prisma/client';

// Punto de extensión para integrar proveedores reales de pago:
//  - Stripe: crear un PaymentIntent por `pricing.total`, devolver su client_secret al
//    frontend, y confirmar el pago desde un webhook ("payment_intent.succeeded") en vez
//    de marcarlo COMPLETADO de inmediato como se hace aquí.
//  - PayPal: crear una Order vía PayPal Orders API, redirigir al checkout de PayPal, y
//    capturar el pago en el endpoint de retorno.
//  - Transferencia / contra entrega: no hay proveedor externo. El pago queda PENDIENTE
//    hasta que un admin lo confirme manualmente (ver PATCH /orders/:id/status).
export const paymentService = {
  resolveInitialStatus(metodo: MetodoPago): EstadoPago {
    return metodo === 'TARJETA' || metodo === 'PAYPAL' ? 'COMPLETADO' : 'PENDIENTE';
  },
};
