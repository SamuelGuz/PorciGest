import { useState, useEffect, useCallback } from 'react';
import porcinoService from '../services/porcinoService';

export interface Camada {
  id: number;
  fecha_nacimiento: string;
  numero_lechones: number;
  peso_promedio_kg?: number;
  madre: {
    id: number;
    codigo_id: string;
    nombre?: string;
    raza: string;
  };
  padre: {
    id: number;
    nombre: string;
    raza: string;
  };
  propietario: {
    id: number;
    nombre: string;
    apellido: string;
    tipo_documento: string;
    numero_documento: string;
  };
}

export interface CamadaCreate {
  fecha_nacimiento: string;
  numero_lechones: number;
  peso_promedio_kg?: number;
  madre_id: number;
  padre_id: number;
}

export interface CamadaUpdate {
  fecha_nacimiento?: string;
  numero_lechones?: number;
  peso_promedio_kg?: number;
  madre_id?: number;
  padre_id?: number;
}

export const useLechones = () => {
  const [camadas, setCamadas] = useState<Camada[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Función para obtener todas las camadas
  const obtenerCamadas = useCallback(async () => {
    setLoading(true);
    setError(null);
    
    try {
      const camadasData = await porcinoService.lechones.getLechones();
      setCamadas(camadasData);
    } catch (err: any) {
      console.error('Error obteniendo camadas:', err);
      setError(err?.response?.data?.detail || 'Error al obtener las camadas');
    } finally {
      setLoading(false);
    }
  }, []);

  // Función para obtener una camada por ID
  const obtenerCamada = useCallback(async (id: number): Promise<Camada | null> => {
    setError(null);
    
    try {
      const camadaData = await porcinoService.lechones.getLechonById(id);
      return camadaData;
    } catch (err: any) {
      console.error('Error obteniendo camada:', err);
      setError(err?.response?.data?.detail || 'Error al obtener la camada');
      return null;
    }
  }, []);

  // Función para crear una nueva camada
  const crearCamada = useCallback(async (camadaData: CamadaCreate): Promise<boolean> => {
    setLoading(true);
    setError(null);
    
    try {
      const nuevaCamada = await porcinoService.lechones.createLechon(camadaData);
      
      // Agregar la nueva camada a la lista local
      setCamadas(prev => [...prev, nuevaCamada]);
      
      return true;
    } catch (err: any) {
      console.error('Error creando camada:', err);
      setError(err?.response?.data?.detail || 'Error al crear la camada');
      return false;
    } finally {
      setLoading(false);
    }
  }, []);

  // Función para actualizar una camada
  const actualizarCamada = useCallback(async (id: number, camadaData: CamadaUpdate): Promise<boolean> => {
    setLoading(true);
    setError(null);
    
    try {
      const camadaActualizada = await porcinoService.lechones.updateLechon(id, camadaData);
      
      // Actualizar la camada en la lista local
      setCamadas(prev => 
        prev.map(camada => 
          camada.id === id ? camadaActualizada : camada
        )
      );
      
      return true;
    } catch (err: any) {
      console.error('Error actualizando camada:', err);
      setError(err?.response?.data?.detail || 'Error al actualizar la camada');
      return false;
    } finally {
      setLoading(false);
    }
  }, []);

  // Función para eliminar una camada con retry logic mejorada
  const eliminarCamada = useCallback(async (id: number): Promise<boolean> => {
    setLoading(true);
    setError(null);
    
    const maxAttempts = 2;
    
    try {
      for (let attempt = 1; attempt <= maxAttempts; attempt++) {
        try {
          await porcinoService.lechones.deleteLechon(id);
          
          // Remover la camada de la lista local
          setCamadas(prev => prev.filter(camada => camada.id !== id));
          
          setLoading(false);
          return true;
        } catch (err: any) {
          const statusCode = err?.response?.status;
          const errorDetail = err?.response?.data?.detail || 'Error desconocido';
          
          console.error(`Error eliminando camada (intento ${attempt}):`, err);
          
          // Si es error 404, la camada ya no existe
          if (statusCode === 404) {
            setError('La camada no fue encontrada, puede que ya haya sido eliminada');
            // Aún así removemos de la lista local por consistencia
            setCamadas(prev => prev.filter(camada => camada.id !== id));
            setLoading(false);
            return false;
          }
          
          // Si es el último intento o error definitivo (400, 403, etc.)
          if (attempt === maxAttempts || (statusCode && statusCode < 500)) {
            setError(errorDetail);
            setLoading(false);
            return false;
          }
          
          // Para errores 500+ esperamos antes del siguiente intento
          if (statusCode >= 500) {
            await new Promise(resolve => setTimeout(resolve, 1000));
            continue;
          }
          
          // Error de red o conexión
          if (!statusCode) {
            if (attempt < maxAttempts) {
              console.log(`Reintentando eliminación en 1 segundo...`);
              await new Promise(resolve => setTimeout(resolve, 1000));
              continue;
            }
            setError('Error de conexión. Verifique que el servidor esté funcionando.');
            setLoading(false);
            return false;
          }
        }
      }
      
      setError('No se pudo eliminar la camada después de varios intentos');
      setLoading(false);
      return false;
    } catch (error) {
      console.error('Error inesperado:', error);
      setError('Error inesperado durante la eliminación');
      setLoading(false);
      return false;
    }
  }, []);

  // Cargar camadas al montar el componente
  useEffect(() => {
    obtenerCamadas();
  }, [obtenerCamadas]);

  return {
    camadas,
    loading,
    error,
    obtenerCamadas,
    obtenerCamada,
    crearCamada,
    actualizarCamada,
    eliminarCamada,
    clearError: () => setError(null)
  };
};