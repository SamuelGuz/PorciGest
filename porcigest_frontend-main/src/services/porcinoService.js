import api from './api';

/**
 * Servicio para la gestión de datos porcinos
 * Incluye funciones CRUD para todos los módulos: reproductoras, sementales, lechones, engorde y veterinaria
 */

// ===== MÓDULO REPRODUCTORAS =====
export const reproductorasService = {
  
  /**
   * Obtener todas las reproductoras
   * @returns {Promise<Array>} Lista de reproductoras
   */
  async getReproductoras() {
    try {
      const response = await api.get('/reproductoras/');
      return response.data;
    } catch (error) {
      console.error('Error al obtener reproductoras:', error);
      throw error;
    }
  },

  /**
   * Obtener una reproductora por ID
   * @param {number} id - ID de la reproductora
   * @returns {Promise<Object>} Datos de la reproductora
   */
  async getReproductoraById(id) {
    try {
      const response = await api.get(`/reproductoras/${id}`);
      return response.data;
    } catch (error) {
      console.error(`Error al obtener reproductora ${id}:`, error);
      throw error;
    }
  },

  /**
   * Crear una nueva reproductora
   * @param {Object} data - Datos de la reproductora
   * @returns {Promise<Object>} Reproductora creada
   */
  async createReproductora(data) {
    try {
      const response = await api.post('/reproductoras/', data);
      return response.data;
    } catch (error) {
      console.error('Error al crear reproductora:', error);
      throw error;
    }
  },

  /**
   * Actualizar una reproductora existente
   * @param {number} id - ID de la reproductora
   * @param {Object} data - Nuevos datos de la reproductora
   * @returns {Promise<Object>} Reproductora actualizada
   */
  async updateReproductora(id, data) {
    try {
      const response = await api.put(`/reproductoras/${id}`, data);
      return response.data;
    } catch (error) {
      console.error(`Error al actualizar reproductora ${id}:`, error);
      throw error;
    }
  },

  /**
   * Eliminar una reproductora
   * @param {number} id - ID de la reproductora
   * @returns {Promise<Object>} Resultado de la eliminación
   */
  async deleteReproductora(id) {
    try {
      const response = await api.delete(`/reproductoras/${id}`);
      return response.data;
    } catch (error) {
      console.error(`Error al eliminar reproductora ${id}:`, error);
      throw error;
    }
  },

};

// ===== MÓDULO SEMENTALES =====
export const sementalesService = {
  
  async getSementales() {
    try {
      const response = await api.get('/sementales/');
      return response.data;
    } catch (error) {
      console.error('Error al obtener sementales:', error);
      throw error;
    }
  },

  async getSementalById(id) {
    try {
      const response = await api.get(`/sementales/${id}`);
      return response.data;
    } catch (error) {
      console.error(`Error al obtener semental ${id}:`, error);
      throw error;
    }
  },

  async createSemental(data) {
    try {
      const response = await api.post('/sementales/', data);
      return response.data;
    } catch (error) {
      console.error('Error al crear semental:', error);
      throw error;
    }
  },

  async updateSemental(id, data) {
    try {
      const response = await api.put(`/sementales/${id}`, data);
      return response.data;
    } catch (error) {
      console.error(`Error al actualizar semental ${id}:`, error);
      throw error;
    }
  },

  async deleteSemental(id) {
    try {
      const response = await api.delete(`/sementales/${id}`);
      return response.data;
    } catch (error) {
      console.error(`Error al eliminar semental ${id}:`, error);
      throw error;
    }
  },

};

// ===== MÓDULO LECHONES =====
export const lechonesService = {
  
  async getLechones() {
    try {
      const response = await api.get('/lechones/');
      return response.data;
    } catch (error) {
      console.error('Error al obtener lechones:', error);
      throw error;
    }
  },

  async getLechonById(id) {
    try {
      const response = await api.get(`/lechones/${id}`);
      return response.data;
    } catch (error) {
      console.error(`Error al obtener lechón ${id}:`, error);
      throw error;
    }
  },

  async createLechon(data) {
    try {
      const response = await api.post('/lechones/', data);
      return response.data;
    } catch (error) {
      console.error('Error al crear lechón:', error);
      throw error;
    }
  },

  async updateLechon(id, data) {
    try {
      const response = await api.put(`/lechones/${id}`, data);
      return response.data;
    } catch (error) {
      console.error(`Error al actualizar lechón ${id}:`, error);
      throw error;
    }
  },

  async deleteLechon(id) {
    try {
      const response = await api.delete(`/lechones/${id}`);
      return response.data;
    } catch (error) {
      console.error(`Error al eliminar lechón ${id}:`, error);
      throw error;
    }
  },

};

// ===== MÓDULO ENGORDE =====
export const engordeService = {
  
  async getLotesEngorde() {
    try {
      const response = await api.get('/engorde/');
      return response.data;
    } catch (error) {
      console.error('Error al obtener lotes de engorde:', error);
      throw error;
    }
  },

  async getLoteEngordeById(id) {
    try {
      const response = await api.get(`/engorde/${id}`);
      return response.data;
    } catch (error) {
      console.error(`Error al obtener lote de engorde ${id}:`, error);
      throw error;
    }
  },

  async createLoteEngorde(data) {
    try {
      const response = await api.post('/engorde/', data);
      return response.data;
    } catch (error) {
      console.error('Error al crear lote de engorde:', error);
      throw error;
    }
  },

  async updateLoteEngorde(id, data) {
    try {
      const response = await api.put(`/engorde/${id}`, data);
      return response.data;
    } catch (error) {
      console.error(`Error al actualizar lote de engorde ${id}:`, error);
      throw error;
    }
  },

  async deleteLoteEngorde(id) {
    try {
      const response = await api.delete(`/engorde/${id}`);
      return response.data;
    } catch (error) {
      console.error(`Error al eliminar lote de engorde ${id}:`, error);
      throw error;
    }
  },

};

// ===== MÓDULO VETERINARIA =====
export const veterinariaService = {
  
  async getTratamientos() {
    try {
      const response = await api.get('/veterinaria/');
      return response.data;
    } catch (error) {
      console.error('Error al obtener tratamientos:', error);
      throw error;
    }
  },

  async getTratamientoById(id) {
    try {
      const response = await api.get(`/veterinaria/${id}`);
      return response.data;
    } catch (error) {
      console.error(`Error al obtener tratamiento ${id}:`, error);
      throw error;
    }
  },

  async createTratamiento(data) {
    try {
      const response = await api.post('/veterinaria/', data);
      return response.data;
    } catch (error) {
      console.error('Error al crear tratamiento:', error);
      throw error;
    }
  },

  async updateTratamiento(id, data) {
    try {
      const response = await api.put(`/veterinaria/${id}`, data);
      return response.data;
    } catch (error) {
      console.error(`Error al actualizar tratamiento ${id}:`, error);
      throw error;
    }
  },

  async deleteTratamiento(id) {
    try {
      const response = await api.delete(`/veterinaria/${id}`);
      return response.data;
    } catch (error) {
      console.error(`Error al eliminar tratamiento ${id}:`, error);
      throw error;
    }
  },

};

// ===== EXPORTACIONES PARA COMPATIBILIDAD CON TU EJEMPLO =====
// Funciones individuales para facilitar la importación
export const getReproductoras = reproductorasService.getReproductoras;
export const getReproductoraById = reproductorasService.getReproductoraById;
export const createReproductora = reproductorasService.createReproductora;
export const updateReproductora = reproductorasService.updateReproductora;
export const deleteReproductora = reproductorasService.deleteReproductora;

export const getSementales = sementalesService.getSementales;
export const getSementalById = sementalesService.getSementalById;
export const createSemental = sementalesService.createSemental;
export const updateSemental = sementalesService.updateSemental;
export const deleteSemental = sementalesService.deleteSemental;

export const getLechones = lechonesService.getLechones;
export const getLechonById = lechonesService.getLechonById;
export const createLechon = lechonesService.createLechon;
export const updateLechon = lechonesService.updateLechon;
export const deleteLechon = lechonesService.deleteLechon;

export const getLotesEngorde = engordeService.getLotesEngorde;
export const getLoteEngordeById = engordeService.getLoteEngordeById;
export const createLoteEngorde = engordeService.createLoteEngorde;
export const updateLoteEngorde = engordeService.updateLoteEngorde;
export const deleteLoteEngorde = engordeService.deleteLoteEngorde;

export const getTratamientos = veterinariaService.getTratamientos;
export const getTratamientoById = veterinariaService.getTratamientoById;
export const createTratamiento = veterinariaService.createTratamiento;
export const updateTratamiento = veterinariaService.updateTratamiento;
export const deleteTratamiento = veterinariaService.deleteTratamiento;

// Exportar todos los servicios como un objeto principal
const porcinoService = {
  reproductoras: reproductorasService,
  sementales: sementalesService,
  lechones: lechonesService,
  engorde: engordeService,
  veterinaria: veterinariaService,
};

export default porcinoService;