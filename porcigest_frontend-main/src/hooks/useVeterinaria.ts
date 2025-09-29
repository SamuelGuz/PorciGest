import { useState, useCallback } from 'react';
import porcinoService from '../services/porcinoService';

// Interfaces para Tratamiento Veterinario (coinciden con el backend)
export interface TratamientoVeterinario {
  id: number;
  tipo_intervencion: string;
  medicamento_producto?: string;
  dosis?: string;
  fecha: string;
  veterinario?: string;
  observaciones?: string;
  reproductora_id?: number;
  semental_id?: number;
  lote_engorde_id?: number;
  reproductora?: any;
  semental?: any;
  lote_engorde?: any;
  propietario: {
    id: number;
    nombre: string;
    apellido: string;
    numero_documento: string;
    tipo_documento: string;
  };
}

export interface TratamientoVeterinarioCreate {
  tipo_intervencion: string;
  medicamento_producto?: string;
  dosis?: string;
  fecha: string;
  veterinario?: string;
  observaciones?: string;
  reproductora_id?: number;
  semental_id?: number;
  lote_engorde_id?: number;
}

export interface TratamientoVeterinarioUpdate {
  tipo_intervencion?: string;
  medicamento_producto?: string;
  dosis?: string;
  fecha?: string;
  veterinario?: string;
  observaciones?: string;
  reproductora_id?: number;
  semental_id?: number;
  lote_engorde_id?: number;
}

export const useVeterinaria = () => {
  const [tratamientos, setTratamientos] = useState<TratamientoVeterinario[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Función para limpiar errores
  const clearError = useCallback(() => {
    setError(null);
  }, []);

  // Función para obtener todos los tratamientos
  const obtenerTratamientos = useCallback(async (maxRetries = 3) => {
    for (let attempt = 1; attempt <= maxRetries; attempt++) {
      setLoading(attempt === 1);
      setError(null);

      try {
        const response = await porcinoService.veterinaria.getTratamientos();
        
        if (response) {
          setTratamientos(response);
          setLoading(false);
          return response;
        }
      } catch (err: any) {
        console.error(`Intento ${attempt} falló:`, err);
        
        if (attempt === maxRetries) {
          const errorMessage = err?.response?.data?.detail || 
                             err?.message || 
                             'Error al cargar los tratamientos';
          setError(errorMessage);
          setLoading(false);
        } else {
          // Esperar antes del siguiente intento
          await new Promise(resolve => setTimeout(resolve, 1000 * attempt));
        }
      }
    }
  }, []);

  // Función para crear un nuevo tratamiento
  const crearTratamiento = useCallback(async (tratamientoData: TratamientoVeterinarioCreate) => {
    setLoading(true);
    setError(null);

    try {
      const nuevoTratamiento = await porcinoService.veterinaria.createTratamiento(tratamientoData);
      
      if (nuevoTratamiento) {
        // Actualizar la lista de tratamientos
        await obtenerTratamientos();
        setLoading(false);
        return nuevoTratamiento;
      }
    } catch (err: any) {
      console.error('Error al crear tratamiento:', err);
      const errorMessage = err?.response?.data?.detail || 
                         err?.message || 
                         'Error al crear el tratamiento';
      setError(errorMessage);
      setLoading(false);
      throw err;
    }
  }, [obtenerTratamientos]);

  // Función para actualizar un tratamiento
  const actualizarTratamiento = useCallback(async (id: number, tratamientoData: TratamientoVeterinarioUpdate) => {
    setLoading(true);
    setError(null);

    try {
      const tratamientoActualizado = await porcinoService.veterinaria.updateTratamiento(id, tratamientoData);
      
      if (tratamientoActualizado) {
        // Actualizar la lista de tratamientos
        await obtenerTratamientos();
        setLoading(false);
        return tratamientoActualizado;
      }
    } catch (err: any) {
      console.error('Error al actualizar tratamiento:', err);
      const errorMessage = err?.response?.data?.detail || 
                         err?.message || 
                         'Error al actualizar el tratamiento';
      setError(errorMessage);
      setLoading(false);
      throw err;
    }
  }, [obtenerTratamientos]);

  // Función para eliminar un tratamiento
  const eliminarTratamiento = useCallback(async (id: number) => {
    setLoading(true);
    setError(null);

    try {
      await porcinoService.veterinaria.deleteTratamiento(id);
      
      // Actualizar la lista de tratamientos
      await obtenerTratamientos();
      setLoading(false);
    } catch (err: any) {
      console.error('Error al eliminar tratamiento:', err);
      const errorMessage = err?.response?.data?.detail || 
                         err?.message || 
                         'Error al eliminar el tratamiento';
      setError(errorMessage);
      setLoading(false);
      throw err;
    }
  }, [obtenerTratamientos]);

  // Función para obtener estadísticas
  const obtenerEstadisticas = useCallback(() => {
    if (!tratamientos.length) {
      return {
        totalTratamientos: 0,
        costoTotal: 0,
        tiposMasComunes: [],
        animalesTratados: 0,
        tratamientosRecientes: 0
      };
    }

    // Calcular estadísticas básicas
    const totalTratamientos = tratamientos.length;
    
    // Agrupar por tipo de intervención
    const tiposFrecuencia = tratamientos.reduce((acc: Record<string, number>, t) => {
      acc[t.tipo_intervencion] = (acc[t.tipo_intervencion] || 0) + 1;
      return acc;
    }, {});

    const tiposMasComunes = Object.entries(tiposFrecuencia)
      .sort(([,a], [,b]) => b - a)
      .slice(0, 5)
      .map(([tipo, count]) => ({ tipo, count }));

    // Contar animales únicos tratados
    const animalesUnicos = new Set();
    tratamientos.forEach(t => {
      if (t.reproductora_id) animalesUnicos.add(`reproductora_${t.reproductora_id}`);
      if (t.semental_id) animalesUnicos.add(`semental_${t.semental_id}`);
      if (t.lote_engorde_id) animalesUnicos.add(`lote_${t.lote_engorde_id}`);
    });
    const animalesTratados = animalesUnicos.size;

    // Tratamientos de los últimos 30 días
    const fechaLimite = new Date();
    fechaLimite.setDate(fechaLimite.getDate() - 30);
    
    const tratamientosRecientes = tratamientos.filter(t => 
      new Date(t.fecha) >= fechaLimite
    ).length;

    return {
      totalTratamientos,
      costoTotal: 0, // No tenemos costo en el backend actual
      tiposMasComunes,
      animalesTratados,
      tratamientosRecientes
    };
  }, [tratamientos]);

  return {
    tratamientos,
    loading,
    error,
    clearError,
    obtenerTratamientos,
    crearTratamiento,
    actualizarTratamiento,
    eliminarTratamiento,
    obtenerEstadisticas
  };
};