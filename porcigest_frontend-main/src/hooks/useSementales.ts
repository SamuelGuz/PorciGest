import { useState, useEffect, useCallback } from 'react';
import porcinoService from '../services/porcinoService';

export interface Semental {
  id: number;
  nombre: string;
  raza: string;
  tasa_fertilidad: number;
  propietario: {
    id: number;
    nombre: string;
    apellido: string;
    tipo_documento: string;
    numero_documento: string;
  };
}

export interface SementalCreate {
  nombre: string;
  raza: string;
  tasa_fertilidad?: number;
}

export interface SementalUpdate {
  nombre?: string;
  raza?: string;
  tasa_fertilidad?: number;
}

export const useSementales = () => {
  const [sementales, setSementales] = useState<Semental[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Función para obtener todos los sementales
  const obtenerSementales = useCallback(async () => {
    setLoading(true);
    setError(null);
    
    try {
      const sementalesData = await porcinoService.sementales.getSementales();
      setSementales(sementalesData);
    } catch (err: any) {
      console.error('Error obteniendo sementales:', err);
      setError(err?.response?.data?.detail || 'Error al obtener los sementales');
    } finally {
      setLoading(false);
    }
  }, []); // Removemos la dependencia para que siempre haga refresh

  // Función para obtener un semental por ID
  const obtenerSemental = useCallback(async (id: number): Promise<Semental | null> => {
    setError(null);
    
    try {
      const sementalData = await porcinoService.sementales.getSementalById(id);
      return sementalData;
    } catch (err: any) {
      console.error('Error obteniendo semental:', err);
      setError(err?.response?.data?.detail || 'Error al obtener el semental');
      return null;
    }
  }, []);

  // Función para crear un nuevo semental
  const crearSemental = useCallback(async (sementalData: SementalCreate): Promise<boolean> => {
    setLoading(true);
    setError(null);
    
    try {
      const nuevoSemental = await porcinoService.sementales.createSemental(sementalData);
      
      // Agregar el nuevo semental a la lista local
      setSementales(prev => [...prev, nuevoSemental]);
      
      return true;
    } catch (err: any) {
      console.error('Error creando semental:', err);
      setError(err?.response?.data?.detail || 'Error al crear el semental');
      return false;
    } finally {
      setLoading(false);
    }
  }, []);

  // Función para actualizar un semental
  const actualizarSemental = useCallback(async (id: number, sementalData: SementalUpdate): Promise<boolean> => {
    setLoading(true);
    setError(null);
    
    try {
      const sementalActualizado = await porcinoService.sementales.updateSemental(id, sementalData);
      
      // Actualizar el semental en la lista local
      setSementales(prev => 
        prev.map(semental => 
          semental.id === id ? sementalActualizado : semental
        )
      );
      
      return true;
    } catch (err: any) {
      console.error('Error actualizando semental:', err);
      setError(err?.response?.data?.detail || 'Error al actualizar el semental');
      return false;
    } finally {
      setLoading(false);
    }
  }, []);

  // Función para eliminar un semental con retry logic mejorada
  const eliminarSemental = useCallback(async (id: number): Promise<boolean> => {
    setLoading(true);
    setError(null);
    
    const maxAttempts = 2;
    
    try {
      for (let attempt = 1; attempt <= maxAttempts; attempt++) {
        try {
          await porcinoService.sementales.deleteSemental(id);
          
          // Remover el semental de la lista local
          setSementales(prev => prev.filter(semental => semental.id !== id));
          
          setLoading(false);
          return true;
        } catch (err: any) {
          const statusCode = err?.response?.status;
          const errorDetail = err?.response?.data?.detail || 'Error desconocido';
          
          console.error(`Error eliminando semental (intento ${attempt}):`, err);
          
          // Si es error 404, el semental ya no existe
          if (statusCode === 404) {
            setError('El semental no fue encontrado, puede que ya haya sido eliminado');
            // Aún así removemos de la lista local por consistencia
            setSementales(prev => prev.filter(semental => semental.id !== id));
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
      
      setError('No se pudo eliminar el semental después de varios intentos');
      setLoading(false);
      return false;
    } catch (error) {
      console.error('Error inesperado:', error);
      setError('Error inesperado durante la eliminación');
      setLoading(false);
      return false;
    }
  }, []);

  // Cargar sementales al montar el componente
  useEffect(() => {
    obtenerSementales(); // Hacer refresh inicial
  }, [obtenerSementales]);

  return {
    sementales,
    loading,
    error,
    obtenerSementales,
    obtenerSemental,
    crearSemental,
    actualizarSemental,
    eliminarSemental,
    clearError: () => setError(null)
  };
};