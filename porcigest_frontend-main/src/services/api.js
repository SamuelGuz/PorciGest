import axios from 'axios';

// Crear una instancia de Axios con configuración base
const api = axios.create({
  baseURL: 'http://localhost:8000',
  timeout: 10000, // Timeout de 10 segundos
  headers: {
    'Content-Type': 'application/json',
  },
});

// Interceptor de peticiones para añadir automáticamente el token de autenticación
api.interceptors.request.use(
  (config) => {
    // Verificar si hay un token almacenado en localStorage
    const token = localStorage.getItem('access_token');
    
    if (token) {
      // Añadir el token a la cabecera de autorización
      config.headers.Authorization = `Bearer ${token}`;
    }
    
    return config;
  },
  (error) => {
    // Manejar errores en la configuración de la petición
    return Promise.reject(error);
  }
);

// Interceptor de respuestas para manejar errores globales
api.interceptors.response.use(
  (response) => {
    // Si la respuesta es exitosa, simplemente devolverla
    return response;
  },
  (error) => {
    // Manejar errores comunes
    if (error.response?.status === 401) {
      // Token expirado o inválido - limpiar localStorage y redirigir al login
      localStorage.removeItem('access_token');
      console.warn('Token expirado. Sesión cerrada.');
    } else if (error.code === 'ERR_NETWORK' || error.message.includes('CORS')) {
      // Error de red o CORS - crear un error más descriptivo
      const corsError = new Error('Error de conexión con el servidor. Verifica que el backend esté ejecutándose.');
      corsError.code = 'CORS_ERROR';
      corsError.originalError = error;
      return Promise.reject(corsError);
    } else if (!error.response) {
      // Error de red sin respuesta del servidor
      const networkError = new Error('No se pudo conectar con el servidor. Verifica tu conexión a internet.');
      networkError.code = 'NETWORK_ERROR';
      networkError.originalError = error;
      return Promise.reject(networkError);
    }
    
    return Promise.reject(error);
  }
);

export default api;