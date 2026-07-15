export interface Direccion {
  id: string;
  etiqueta: string;
  destinatario: string;
  telefono: string;
  calle: string;
  numero: string | null;
  ciudad: string;
  provincia: string;
  codigoPostal: string;
  pais: string;
  referencia: string | null;
  predeterminada: boolean;
}
