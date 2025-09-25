import { Dayjs } from "dayjs"

// Tipos para formularios
export type FormData = {
  codigo: string,
  fechaNacimiento: Dayjs | null
  raza: string,
  estado: string
}

// Tipos alineados con el backend para Reproductoras
export interface CerdaReproductora {
  id: number;
  codigo_id: string;
  fecha_nacimiento: string; // formato ISO string desde el backend
  raza: string;
  estado_reproductivo: string;
  propietario?: {
    id: number;
    nombre: string;
    apellido: string;
    numero_documento: string;
  };
}

export interface CerdaCreate {
  codigo_id: string;
  fecha_nacimiento: string; // formato ISO string para enviar al backend
  raza: string;
  estado_reproductivo: string;
}

export interface CerdaUpdate {
  codigo_id?: string;
  fecha_nacimiento?: string;
  raza?: string;
  estado_reproductivo?: string;
}

// Tipos legacy (mantener por compatibilidad)
export interface RegistroCerda{
    codigo: string,
    edad: number,
    raza: string
    estado: string
}

export interface RegistroVacuna{
  fecha: Dayjs | null,
  tipo: string,
  animal: string
  producto: string
  veterinario: string
  estado: string
}

export interface RegistroSemental{
  codigo: string,
  nombre: string
  edad: number
  raza: string
}