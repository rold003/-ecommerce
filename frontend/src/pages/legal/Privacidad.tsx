import { LegalLayout, LegalList, LegalSection } from '@/components/legal/LegalLayout';
import { businessInfo } from '@/config/business';

const ULTIMA_ACTUALIZACION = '15 de julio de 2026';

export default function Privacidad() {
  return (
    <LegalLayout title="Política de Privacidad" updatedAt={ULTIMA_ACTUALIZACION}>
      <LegalSection title="1. Responsable del tratamiento">
        <p>
          {businessInfo.razonSocial} (RUC {businessInfo.ruc}), con domicilio en{' '}
          {businessInfo.direccionFiscal}, es responsable del tratamiento de los datos personales recopilados a
          través de este sitio. Contacto: {businessInfo.correoContacto}.
        </p>
      </LegalSection>

      <LegalSection title="2. Qué datos recopilamos">
        <LegalList>
          <li>Datos de identificación y contacto: nombre, apellido, correo electrónico, teléfono.</li>
          <li>Direcciones de envío y facturación.</li>
          <li>Historial de pedidos, carrito, favoritos y reseñas de productos.</li>
          <li>
            Datos técnicos de navegación (cookies de sesión) necesarios para mantener tu sesión iniciada.
          </li>
        </LegalList>
        <p>No almacenamos datos de tarjetas de pago en nuestros servidores.</p>
      </LegalSection>

      <LegalSection title="3. Finalidad del tratamiento">
        <LegalList>
          <li>Gestionar tu cuenta, tus pedidos y el proceso de compra.</li>
          <li>Enviar comunicaciones transaccionales (confirmación de pedido, recuperación de contraseña).</li>
          <li>Cumplir obligaciones legales y fiscales.</li>
          <li>Mejorar el catálogo y la experiencia de compra.</li>
        </LegalList>
      </LegalSection>

      <LegalSection title="4. Base legal">
        <p>
          Tratamos tus datos con base en la ejecución del contrato de compraventa, el cumplimiento de
          obligaciones legales y, cuando corresponda, tu consentimiento expreso.
        </p>
      </LegalSection>

      <LegalSection title="5. Con quién compartimos tus datos">
        <p>
          No vendemos tus datos personales. Los compartimos únicamente con proveedores estrictamente
          necesarios para operar la tienda:
        </p>
        <LegalList>
          <li>Procesador de pagos, para completar el cobro de tu pedido.</li>
          <li>Proveedor de almacenamiento de imágenes (Cloudinary), para las imágenes de producto.</li>
          <li>Proveedor de envío de correo transaccional, para notificaciones de pedido y de cuenta.</li>
          <li>Empresa de mensajería/transporte, para la entrega de tu pedido.</li>
        </LegalList>
      </LegalSection>

      <LegalSection title="6. Cookies">
        <p>
          Usamos cookies estrictamente necesarias (httpOnly) para mantener tu sesión iniciada de forma segura.
          No usamos cookies de publicidad ni de rastreo de terceros salvo que lo indiquemos expresamente en
          este sitio.
        </p>
      </LegalSection>

      <LegalSection title="7. Tus derechos">
        <p>
          Conforme a la Ley Orgánica de Protección de Datos Personales del Ecuador, puedes ejercer en
          cualquier momento tus derechos de acceso, rectificación, actualización, eliminación, oposición y
          portabilidad sobre tus datos, escribiendo a {businessInfo.correoContacto}. También puedes eliminar
          o modificar tus datos personales y direcciones directamente desde tu perfil de usuario.
        </p>
      </LegalSection>

      <LegalSection title="8. Seguridad de los datos">
        <p>
          Aplicamos medidas técnicas razonables para proteger tus datos: contraseñas cifradas, sesión mediante
          tokens en cookies httpOnly, y acceso restringido a la información en nuestros sistemas. Ningún
          sistema es 100% infalible, pero trabajamos activamente para minimizar riesgos.
        </p>
      </LegalSection>

      <LegalSection title="9. Conservación de datos">
        <p>
          Conservamos tus datos mientras mantengas una cuenta activa y, tras su eliminación, durante el plazo
          adicional que exijan nuestras obligaciones legales y fiscales (por ejemplo, el historial de pedidos
          para efectos tributarios).
        </p>
      </LegalSection>

      <LegalSection title="10. Menores de edad">
        <p>Este sitio no está dirigido a menores de 18 años y no recopilamos conscientemente sus datos.</p>
      </LegalSection>

      <LegalSection title="11. Cambios a esta política">
        <p>
          Podemos actualizar esta política; la fecha de "Última actualización" al inicio de esta página refleja
          la versión vigente.
        </p>
      </LegalSection>

      <LegalSection title="12. Contacto">
        <p>Para cualquier consulta sobre esta política, escríbenos a {businessInfo.correoContacto}.</p>
      </LegalSection>
    </LegalLayout>
  );
}
