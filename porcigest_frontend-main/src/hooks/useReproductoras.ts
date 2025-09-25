import { useState, useEffect } from 'react';
import { 
  getReproductoras, 
  getReproductoraById, 
  createReproductora, 
  updateReproductora, 
  deleteReproductora 
} from '../services/porcinoService';
import { CerdaReproductora, CerdaCreate, CerdaUpdate } from '../../lib/definitions';

/**
 * Hook personalizado para manejar operaciones CRUD de reproductoras
 */
export function useReproductoras() {
  const [reproductoras, setReproductoras] = useState<CerdaReproductora[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Cargar todas las reproductoras
  const fetchReproductoras = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await getReproductoras();
      setReproductoras(data);
    } catch (err: any) {
      setError(err.message || 'Error al cargar reproductoras');
    } finally {
      setLoading(false);
    }
  };

  // Crear una nueva reproductora
  const crearReproductora = async (data: CerdaCreate): Promise<boolean> => {
    try {
      setLoading(true);
      setError(null);
      const nuevaReproductora = await createReproductora(data) as CerdaReproductora;
      setReproductoras(prev => [...prev, nuevaReproductora]);
      return true;
    } catch (err: any) {
      setError(err.response?.data?.detail || err.message || 'Error al crear reproductora');
      return false;
    } finally {
      setLoading(false);
    }
  };

  // Actualizar una reproductora existente
  const actualizarReproductora = async (id: number, data: CerdaUpdate): Promise<boolean> => {
    try {
      setLoading(true);
      setError(null);
      const reproductoraActualizada = await updateReproductora(id, data) as CerdaReproductora;
      setReproductoras(prev => 
        prev.map(item => item.id === id ? reproductoraActualizada : item)
      );
      return true;
    } catch (err: any) {
      setError(err.response?.data?.detail || err.message || 'Error al actualizar reproductora');
      return false;
    } finally {
      setLoading(false);
    }
  };

  // Eliminar una reproductora
  const eliminarReproductora = async (id: number): Promise<boolean> => {
    try {
      setLoading(true);
      setError(null);
      
      // Intentar eliminar con reintento automático
      let success = false;
      let attempts = 0;
      const maxAttempts = 2;
      let lastError: any = null;
      
      while (!success && attempts < maxAttempts) {
        try {
          await deleteReproductora(id);
          success = true;
        } catch (attemptError: any) {
          lastError = attemptError;
          attempts++;
          
          // Si es un error de servidor (500) o red, reintentar
          if (attempts < maxAttempts && (
            attemptError.response?.status === 500 || 
            attemptError.code === 'ERR_NETWORK' ||
            attemptError.message.includes('CORS')
          )) {
            console.log(`Intento ${attempts} falló, reintentando en 1 segundo...`);
            await new Promise(resolve => setTimeout(resolve, 1000));
          } else {
            throw attemptError; // No reintentar para errores 404 u otros
          }
        }
      }
      
      if (success) {
        setReproductoras(prev => prev.filter(item => item.id !== id));
        return true;
      } else {
        throw lastError;
      }
      
    } catch (err: any) {
      let errorMessage = 'Error al eliminar reproductora';
      
      if (err.response?.status === 404) {
        errorMessage = 'La reproductora ya no existe o fue eliminada';
      } else if (err.response?.status === 500) {
        errorMessage = 'Error interno del servidor. Verifica que la base de datos esté funcionando.';
      } else if (err.code === 'ERR_NETWORK' || err.message.includes('CORS')) {
        errorMessage = 'Error de conexión. Verifica que el servidor esté ejecutándose en http://127.0.0.1:8000';
      } else if (err.response?.data?.detail) {
        errorMessage = err.response.data.detail;
      } else if (err.message) {
        errorMessage = err.message;
      }
      
      console.error(`Error al eliminar reproductora ${id}:`, errorMessage);
      setError(errorMessage);
      return false;
    } finally {
      setLoading(false);
    }
  };

  // Obtener una reproductora por ID
  const obtenerReproductora = async (id: number): Promise<CerdaReproductora | null> => {
    try {
      setLoading(true);
      setError(null);
      const reproductora = await getReproductoraById(id) as CerdaReproductora;
      return reproductora;
    } catch (err: any) {
      setError(err.response?.data?.detail || err.message || 'Error al obtener reproductora');
      return null;
    } finally {
      setLoading(false);
    }
  };

  // Limpiar errores
  const clearError = () => {
    setError(null);
  };

  // Cargar datos iniciales
  useEffect(() => {
    fetchReproductoras();
  }, []); // Sin dependencias para evitar bucle infinito

  return {
    reproductoras,
    loading,
    error,
    fetchReproductoras,
    crearReproductora,
    actualizarReproductora,
    eliminarReproductora,
    obtenerReproductora,
    clearError,
  };
}