import { Link } from 'react-router-dom';
import { LegalLayout, LegalSection } from '@/components/legal/LegalLayout';
import { businessInfo } from '@/config/business';

const ULTIMA_ACTUALIZACION = '15 de julio de 2026';

export default function Terminos() {
  return (
    <LegalLayout title="Términos y Condiciones" updatedAt={ULTIMA_ACTUALIZACION}>
      <LegalSection title="1. Objeto y aceptación">
        <p>
          Estos Términos y Condiciones regulan el uso del sitio web y la compra de productos ofrecidos por{' '}
          {businessInfo.nombreComercial} (en adelante, "la Tienda"). Al registrarte, navegar o realizar una
          compra en este sitio, aceptas quedar vinculado por estos términos en su totalidad.
        </p>
      </LegalSection>

      <LegalSection title="2. Identificación del proveedor">
        <p>
          {businessInfo.razonSocial}, con RUC {businessInfo.ruc}, domicilio en {businessInfo.direccionFiscal}
          , correo de contacto {businessInfo.correoContacto} y teléfono {businessInfo.telefonoContacto}.
        </p>
      </LegalSection>

      <LegalSection title="3. Registro de usuario">
        <p>
          Para comprar es necesario crear una cuenta con un correo electrónico válido y una contraseña. Eres
          responsable de mantener la confidencialidad de tus credenciales y de toda actividad realizada desde
          tu cuenta. Debes notificarnos de inmediato ante cualquier uso no autorizado.
        </p>
      </LegalSection>

      <LegalSection title="4. Productos, precios y disponibilidad">
        <p>
          Los precios se muestran en dólares de los Estados Unidos (USD) y no incluyen impuestos; el IVA
          aplicable y el costo de envío se calculan y muestran de forma desglosada antes de confirmar la
          compra, en el carrito y en el checkout. Nos reservamos el derecho de corregir errores de precio o
          disponibilidad, incluso después de recibido un pedido, notificándote antes de procesar el cobro.
        </p>
        <p>
          La disponibilidad de stock se confirma únicamente al momento de finalizar la compra; un producto
          visible en el catálogo no garantiza su existencia si el inventario se agotó entre tanto.
        </p>
      </LegalSection>

      <LegalSection title="5. Proceso de compra y pago">
        <p>
          El pedido se considera confirmado cuando recibes un correo electrónico de confirmación con el número
          de pedido. Los medios de pago aceptados se muestran en el checkout.
        </p>
      </LegalSection>

      <LegalSection title="6. Envíos">
        <p>
          Los tiempos y costos de envío se muestran antes de confirmar la compra y dependen de la dirección de
          entrega. Consulta la <Link to="/devoluciones" className="underline">Política de Envíos y Devoluciones</Link>{' '}
          para más detalle.
        </p>
      </LegalSection>

      <LegalSection title="7. Derecho de retracto y devoluciones">
        <p>
          Como consumidor tienes derecho a devolver tu compra dentro del plazo indicado en la{' '}
          <Link to="/devoluciones" className="underline">Política de Envíos y Devoluciones</Link>, conforme a
          la Ley Orgánica de Defensa del Consumidor del Ecuador.
        </p>
      </LegalSection>

      <LegalSection title="8. Propiedad intelectual">
        <p>
          Todo el contenido de este sitio (textos, imágenes, marca, diseño) es propiedad de{' '}
          {businessInfo.nombreComercial} o de sus proveedores y está protegido por la legislación de propiedad
          intelectual aplicable. Su reproducción total o parcial sin autorización está prohibida.
        </p>
      </LegalSection>

      <LegalSection title="9. Responsabilidad">
        <p>
          {businessInfo.nombreComercial} no será responsable por retrasos o incumplimientos causados por
          circunstancias fuera de su control razonable (caso fortuito o fuerza mayor). Nos esforzamos por
          mantener la información del catálogo exacta, pero no garantizamos que esté libre de errores en todo
          momento.
        </p>
      </LegalSection>

      <LegalSection title="10. Protección de datos">
        <p>
          El tratamiento de tus datos personales se rige por nuestra{' '}
          <Link to="/privacidad" className="underline">Política de Privacidad</Link>.
        </p>
      </LegalSection>

      <LegalSection title="11. Modificaciones">
        <p>
          Podemos actualizar estos términos en cualquier momento; la fecha de "Última actualización" al inicio
          de esta página refleja la versión vigente. El uso continuado del sitio tras una actualización implica
          la aceptación de los nuevos términos.
        </p>
      </LegalSection>

      <LegalSection title="12. Ley aplicable y jurisdicción">
        <p>
          Estos términos se rigen por las leyes de la República del Ecuador. Cualquier controversia se someterá
          a los jueces y tribunales competentes del Ecuador, sin perjuicio de los derechos que la ley reconozca
          al consumidor para acudir a otras instancias.
        </p>
      </LegalSection>

      <LegalSection title="13. Contacto">
        <p>
          Para consultas sobre estos términos, escríbenos a {businessInfo.correoContacto}.
        </p>
      </LegalSection>
    </LegalLayout>
  );
}
