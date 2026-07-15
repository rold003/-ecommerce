import { LegalLayout, LegalList, LegalSection } from '@/components/legal/LegalLayout';
import { businessInfo } from '@/config/business';

const ULTIMA_ACTUALIZACION = '15 de julio de 2026';

export default function Devoluciones() {
  return (
    <LegalLayout title="Política de Envíos y Devoluciones" updatedAt={ULTIMA_ACTUALIZACION}>
      <LegalSection title="1. Envíos">
        <p>
          El costo y tiempo estimado de entrega se calculan según tu dirección y se muestran de forma
          desglosada en el carrito y el checkout antes de confirmar la compra. Los pedidos se procesan una vez
          confirmado el pago.
        </p>
      </LegalSection>

      <LegalSection title="2. Derecho de retracto">
        <p>
          Conforme a la Ley Orgánica de Defensa del Consumidor del Ecuador, tienes derecho a devolver tu
          compra dentro de un plazo de {businessInfo.plazoDevolucionDias} días hábiles contados desde la
          recepción del producto, sin necesidad de justificar tu decisión.
        </p>
      </LegalSection>

      <LegalSection title="3. Condiciones para la devolución">
        <p>Para que aceptemos una devolución, el producto debe cumplir con lo siguiente:</p>
        <LegalList>
          <li>No haber sido usado y conservar sus condiciones originales.</li>
          <li>Incluir el empaque, etiquetas y accesorios originales, en la medida de lo posible.</li>
          <li>Ir acompañado del número de pedido.</li>
        </LegalList>
      </LegalSection>

      <LegalSection title="4. Excepciones al derecho de devolución">
        <p>
          Por razones de higiene o naturaleza del producto, no se aceptan devoluciones de artículos de higiene
          personal desprecintados, productos personalizados o hechos a medida, y contenido digital ya
          entregado, salvo que el producto presente un defecto de fábrica.
        </p>
      </LegalSection>

      <LegalSection title="5. Cómo solicitar una devolución">
        <p>
          Escríbenos a {businessInfo.correoContacto} indicando tu número de pedido y el motivo de la
          devolución. Te confirmaremos el procedimiento de retiro o envío del producto.
        </p>
      </LegalSection>

      <LegalSection title="6. Reembolsos">
        <p>
          Una vez recibido y verificado el producto devuelto, procesamos el reembolso por el mismo medio de
          pago utilizado en la compra, dentro de un plazo razonable. Si el envío original tuvo costo, este no
          es reembolsable salvo que la devolución se deba a un error nuestro o a un producto defectuoso.
        </p>
      </LegalSection>

      <LegalSection title="7. Productos defectuosos o dañados">
        <p>
          Si tu producto llega defectuoso o dañado, contáctanos dentro de las 48 horas siguientes a la entrega
          con fotos del producto y el empaque; cubriremos el costo de la devolución y te enviaremos un
          reemplazo o reembolso completo, conforme a la garantía legal que ampara al consumidor.
        </p>
      </LegalSection>

      <LegalSection title="8. Contacto">
        <p>
          Para cualquier consulta sobre envíos o devoluciones, escríbenos a {businessInfo.correoContacto} o
          llámanos al {businessInfo.telefonoContacto}.
        </p>
      </LegalSection>
    </LegalLayout>
  );
}
