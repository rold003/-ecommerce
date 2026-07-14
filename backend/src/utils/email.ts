import nodemailer from 'nodemailer';
import { env } from '../config/env';

interface EmailOptions {
  to: string;
  subject: string;
  html: string;
}

const transporter = env.SMTP_HOST
  ? nodemailer.createTransport({
      host: env.SMTP_HOST,
      port: env.SMTP_PORT ?? 587,
      secure: env.SMTP_PORT === 465,
      auth: env.SMTP_USER ? { user: env.SMTP_USER, pass: env.SMTP_PASSWORD } : undefined,
    })
  : null;

// Si no hay SMTP configurado (desarrollo local sin credenciales reales), el correo se
// imprime en consola en vez de fallar, para no bloquear registro/checkout/recuperación.
export async function sendEmail({ to, subject, html }: EmailOptions): Promise<void> {
  if (!transporter) {
    console.log('--- EMAIL (modo desarrollo, SMTP no configurado) ---');
    console.log(`Para: ${to}`);
    console.log(`Asunto: ${subject}`);
    console.log(html);
    console.log('-----------------------------------------------------');
    return;
  }

  await transporter.sendMail({ from: env.EMAIL_FROM, to, subject, html });
}
