// hooks/useMovimientos.ts
import { useState, useEffect } from 'react';

export interface Movimiento {
  id: number;
  usuario_id: number;
  usuario_nombre: string;
  accion: string;
  modulo: string;
  descripcion: string;
  entidad_tipo?: string;
  entidad_id?: number;
  tipo_movimiento: 'crear' | 'editar' | 'eliminar';
  fecha_movimiento: string;
  ip_address?: string;
  user_agent?: string;
}

export interface MovimientoFilters {
  search?: string;
  modulo?: string;
  tipo_movimiento?: string;
  fecha_inicio?: string;
  fecha_fin?: string;
  usuario_id?: number;
  page?: number;
  size?: number;
}

export interface MovimientosResponse {
  movimientos: Movimiento[];
  total: number;
  page: number;
  size: number;
  total_pages: number;
}

export interface EstadisticasMovimientos {
  total_movimientos: number;
  movimientos_por_tipo: Array<{ tipo: string; cantidad: number }>;
  movimientos_por_modulo: Array<{ modulo: string; cantidad: number }>;
  usuarios_activos: Array<{ usuario: string; cantidad: number }>;
  periodo_dias: number;
}

export function useMovimientos() {
  const [movimientos, setMovimientos] = useState<Movimiento[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [totalPages, setTotalPages] = useState(0);
  const [totalMovimientos, setTotalMovimientos] = useState(0);

  const getAuthHeaders = () => {
    const token = localStorage.getItem('access_token');
    return {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`
    };
  };

  const fetchMovimientos = async (filters: MovimientoFilters = {}, retryCount = 0) => {
    setLoading(true);
    setError(null);
    
    try {
      const queryParams = new URLSearchParams();
      
      if (filters.search) queryParams.append('search', filters.search);
      if (filters.modulo) queryParams.append('modulo', filters.modulo);
      if (filters.tipo_movimiento) queryParams.append('tipo_movimiento', filters.tipo_movimiento);
      if (filters.fecha_inicio) queryParams.append('fecha_inicio', filters.fecha_inicio);
      if (filters.fecha_fin) queryParams.append('fecha_fin', filters.fecha_fin);
      if (filters.usuario_id) queryParams.append('usuario_id', filters.usuario_id.toString());
      if (filters.page) queryParams.append('page', filters.page.toString());
      if (filters.size) queryParams.append('size', filters.size.toString());

      const response = await fetch(
        `http://localhost:8000/movimientos/?${queryParams.toString()}`,
        {
          method: 'GET',
          headers: getAuthHeaders(),
        }
      );

      if (!response.ok) {
        throw new Error(`Error: ${response.status}`);
      }

      const data: MovimientosResponse = await response.json();
      setMovimientos(data.movimientos);
      setTotalPages(data.total_pages);
      setTotalMovimientos(data.total);
      
      return data;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Error desconocido';
      
      // Retry logic para errores de CORS intermitentes
      if (retryCount < 2 && (errorMessage.includes('Failed to fetch') || errorMessage.includes('CORS'))) {
        console.log(`Reintentando fetch de movimientos... (intento ${retryCount + 1})`);
        await new Promise(resolve => setTimeout(resolve, 1000)); // Esperar 1 segundo
        return fetchMovimientos(filters, retryCount + 1);
      }
      
      setError(errorMessage);
      console.error('Error fetching movimientos:', err);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const createMovimiento = async (movimientoData: {
    accion: string;
    modulo: string;
    descripcion?: string;
    entidad_tipo?: string;
    entidad_id?: number;
    tipo_movimiento: string;
  }) => {
    try {
      const response = await fetch('http://localhost:8000/movimientos/', {
        method: 'POST',
        headers: getAuthHeaders(),
        body: JSON.stringify(movimientoData),
      });

      if (!response.ok) {
        throw new Error(`Error: ${response.status}`);
      }

      const newMovimiento: Movimiento = await response.json();
      
      // Actualizar la lista local agregando el nuevo movimiento al inicio
      setMovimientos(prev => [newMovimiento, ...prev]);
      setTotalMovimientos(prev => prev + 1);
      
      return newMovimiento;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Error desconocido';
      setError(errorMessage);
      console.error('Error creating movimiento:', err);
      throw err;
    }
  };

  const getEstadisticas = async (dias: number = 30): Promise<EstadisticasMovimientos> => {
    try {
      const response = await fetch(
        `http://localhost:8000/movimientos/estadisticas?dias=${dias}`,
        {
          method: 'GET',
          headers: getAuthHeaders(),
        }
      );

      if (!response.ok) {
        throw new Error(`Error: ${response.status}`);
      }

      return await response.json();
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Error desconocido';
      setError(errorMessage);
      console.error('Error fetching estadísticas:', err);
      throw err;
    }
  };

  const getMovimientosUsuario = async (usuarioId: number, page: number = 1, size: number = 10) => {
    return fetchMovimientos({ usuario_id: usuarioId, page, size });
  };

  const getModulosDisponibles = async (): Promise<string[]> => {
    try {
      const response = await fetch('http://localhost:8000/movimientos/opciones/modulos', {
        method: 'GET',
        headers: getAuthHeaders(),
      });

      if (!response.ok) {
        throw new Error(`Error: ${response.status}`);
      }

      const data = await response.json();
      return data.modulos;
    } catch (err) {
      console.error('Error fetching módulos:', err);
      return ['Reproductoras', 'Sementales', 'Lechones', 'Engorde', 'Veterinaria'];
    }
  };

  const getTiposDisponibles = async (): Promise<string[]> => {
    try {
      const response = await fetch('http://localhost:8000/movimientos/opciones/tipos', {
        method: 'GET',
        headers: getAuthHeaders(),
      });

      if (!response.ok) {
        throw new Error(`Error: ${response.status}`);
      }

      const data = await response.json();
      return data.tipos;
    } catch (err) {
      console.error('Error fetching tipos:', err);
      return ['crear', 'editar', 'eliminar'];
    }
  };

  // Función auxiliar para registrar movimientos automáticamente
  const registrarMovimiento = async (
    accion: string,
    modulo: string,
    descripcion: string,
    tipo: 'crear' | 'editar' | 'eliminar',
    entidadTipo?: string,
    entidadId?: number
  ) => {
    try {
      await createMovimiento({
        accion,
        modulo,
        descripcion,
        tipo_movimiento: tipo,
        entidad_tipo: entidadTipo,
        entidad_id: entidadId
      });
    } catch (error) {
      // No mostrar errores de logging al usuario, solo registrar en consola
      console.warn('No se pudo registrar el movimiento:', error);
    }
  };

  return {
    movimientos,
    loading,
    error,
    totalPages,
    totalMovimientos,
    fetchMovimientos,
    createMovimiento,
    getEstadisticas,
    getMovimientosUsuario,
    getModulosDisponibles,
    getTiposDisponibles,
    registrarMovimiento,
    refresh: () => fetchMovimientos()
  };
}