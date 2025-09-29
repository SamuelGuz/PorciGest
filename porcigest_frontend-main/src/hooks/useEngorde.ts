import { useState, useEffect, useCallback } from 'react';
import porcinoService from '../services/porcinoService';

export interface LoteEngorde {
  id: number;
  lote_id_str: string;
  fecha_inicio: string;
  numero_cerdos: number;
  peso_inicial_promedio?: number;
  peso_actual_promedio?: number;
  ganancia_peso_total?: number;
  camada_origen: {
    id: number;
    fecha_nacimiento: string;
    numero_lechones: number;
    madre: {
      id: number;
      codigo_id: string;
      raza: string;
    };
  };
  propietario: {
    id: number;
    nombre: string;
    apellido: string;
    tipo_documento: string;
    numero_documento: string;
  };
}

export interface LoteEngordeCreate {
  lote_id_str: string;
  fecha_inicio: string;
  numero_cerdos: number;
  peso_inicial_promedio?: number;
  peso_actual_promedio?: number;
  camada_origen_id: number;
}

export interface LoteEngordeUpdate {
  lote_id_str?: string;
  fecha_inicio?: string;
  numero_cerdos?: number;
  peso_inicial_promedio?: number;
  peso_actual_promedio?: number;
  camada_origen_id?: number;
}

export const useEngorde = () => {
  const [lotes, setLotes] = useState<LoteEngorde[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Función para obtener todos los lotes
  const obtenerLotes = useCallback(async () => {
    setLoading(true);
    setError(null);
    
    try {
      const lotesData = await porcinoService.engorde.getLotesEngorde();
      setLotes(lotesData);
    } catch (err: any) {
      console.error('Error obteniendo lotes:', err);
      setError(err?.response?.data?.detail || 'Error al obtener los lotes de engorde');
    } finally {
      setLoading(false);
    }
  }, []);

  // Función para obtener un lote por ID
  const obtenerLote = useCallback(async (id: number): Promise<LoteEngorde | null> => {
    setError(null);
    
    try {
      const loteData = await porcinoService.engorde.getLoteEngordeById(id);
      return loteData;
    } catch (err: any) {
      console.error('Error obteniendo lote:', err);
      setError(err?.response?.data?.detail || 'Error al obtener el lote');
      return null;
    }
  }, []);

  // Función para crear un nuevo lote
  const crearLote = useCallback(async (loteData: LoteEngordeCreate): Promise<boolean> => {
    setLoading(true);
    setError(null);
    
    try {
      const nuevoLote = await porcinoService.engorde.createLoteEngorde(loteData);
      
      // Agregar el nuevo lote a la lista local
      setLotes(prev => [...prev, nuevoLote]);
      
      return true;
    } catch (err: any) {
      console.error('Error creando lote:', err);
      setError(err?.response?.data?.detail || 'Error al crear el lote de engorde');
      return false;
    } finally {
      setLoading(false);
    }
  }, []);

  // Función para actualizar un lote
  const actualizarLote = useCallback(async (id: number, loteData: LoteEngordeUpdate): Promise<boolean> => {
    setLoading(true);
    setError(null);
    
    try {
      const loteActualizado = await porcinoService.engorde.updateLoteEngorde(id, loteData);
      
      // Actualizar el lote en la lista local
      setLotes(prev => 
        prev.map(lote => 
          lote.id === id ? loteActualizado : lote
        )
      );
      
      return true;
    } catch (err: any) {
      console.error('Error actualizando lote:', err);
      setError(err?.response?.data?.detail || 'Error al actualizar el lote');
      return false;
    } finally {
      setLoading(false);
    }
  }, []);

  // Función para eliminar un lote con retry logic mejorada
  const eliminarLote = useCallback(async (id: number): Promise<boolean> => {
    setLoading(true);
    setError(null);
    
    const maxAttempts = 2;
    
    try {
      for (let attempt = 1; attempt <= maxAttempts; attempt++) {
        try {
          await porcinoService.engorde.deleteLoteEngorde(id);
          
          // Remover el lote de la lista local
          setLotes(prev => prev.filter(lote => lote.id !== id));
          
          setLoading(false);
          return true;
        } catch (err: any) {
          const statusCode = err?.response?.status;
          const errorDetail = err?.response?.data?.detail || 'Error desconocido';
          
          console.error(`Error eliminando lote (intento ${attempt}):`, err);
          
          // Si es error 404, el lote ya no existe
          if (statusCode === 404) {
            setError('El lote no fue encontrado, puede que ya haya sido eliminado');
            // Aún así removemos de la lista local por consistencia
            setLotes(prev => prev.filter(lote => lote.id !== id));
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
      
      setError('No se pudo eliminar el lote después de varios intentos');
      setLoading(false);
      return false;
    } catch (error) {
      console.error('Error inesperado:', error);
      setError('Error inesperado durante la eliminación');
      setLoading(false);
      return false;
    }
  }, []);

  // Cargar lotes al montar el componente
  useEffect(() => {
    obtenerLotes();
  }, [obtenerLotes]);

  return {
    lotes,
    loading,
    error,
    obtenerLotes,
    obtenerLote,
    crearLote,
    actualizarLote,
    eliminarLote,
    clearError: () => setError(null)
  };
};