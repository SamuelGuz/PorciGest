import api from './api';

/**
 * Servicio de autenticación para PorciGest Pro
 * Maneja el login, registro y logout de usuarios
 */
export const authService = {
  
  /**
   * Iniciar sesión con número de documento y contraseña
   * @param {string} numeroDocumento - Número de documento del usuario
   * @param {string} password - Contraseña del usuario
   * @returns {Promise<Object>} Datos del usuario y token de acceso
   */
  async login(numeroDocumento, password) {
    try {
      // Crear FormData para el endpoint de token
      const formData = new FormData();
      formData.append('username', numeroDocumento);
      formData.append('password', password);

      // Hacer petición POST al endpoint /token
      const response = await api.post('/token', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });

      // Extraer el token y datos del usuario de la respuesta
      const { access_token, token_type, nombre, apellido, numero_documento, tipo_documento } = response.data;

      // Guardar el token en localStorage
      if (access_token) {
        localStorage.setItem('access_token', access_token);
        localStorage.setItem('token_type', token_type || 'bearer');
        
        // Guardar información del usuario
        const userData = {
          nombre,
          apellido,
          numeroDocumento: numero_documento,
          tipoDocumento: tipo_documento
        };
        
        localStorage.setItem('user_data', JSON.stringify(userData));
      }

      return {
        success: true,
        data: {
          access_token,
          token_type,
          nombre,
          apellido,
          numeroDocumento: numero_documento,
          tipoDocumento: tipo_documento
        },
      };

    } catch (error) {
      console.error('Error en login:', error);
      
      // Manejar diferentes tipos de errores
      let errorMessage = 'Error desconocido al iniciar sesión';
      
      if (error.response) {
        // Error de respuesta del servidor
        if (error.response.status === 401) {
          errorMessage = 'Credenciales incorrectas';
        } else if (error.response.status === 422) {
          errorMessage = 'Datos de entrada inválidos';
        } else {
          errorMessage = error.response.data?.detail || 'Error del servidor';
        }
      } else if (error.request) {
        // Error de conexión
        errorMessage = 'No se pudo conectar con el servidor';
      }

      return {
        success: false,
        error: errorMessage,
      };
    }
  },

  /**
   * Registrar un nuevo usuario
   * @param {Object} userData - Datos del nuevo usuario
   * @returns {Promise<Object>} Resultado del registro
   */
  async signup(userData) {
    try {
      const response = await api.post('/signup', userData);

      return {
        success: true,
        data: response.data,
        message: 'Usuario registrado exitosamente',
      };

    } catch (error) {
      console.error('Error en registro:', error);
      
      let errorMessage = 'Error desconocido al registrar usuario';
      
      if (error.response) {
        if (error.response.status === 400) {
          errorMessage = 'El usuario ya existe o datos inválidos';
        } else if (error.response.status === 422) {
          errorMessage = 'Datos de entrada inválidos';
        } else {
          errorMessage = error.response.data?.detail || 'Error del servidor';
        }
      } else if (error.request) {
        errorMessage = 'No se pudo conectar con el servidor';
      }

      return {
        success: false,
        error: errorMessage,
      };
    }
  },

  /**
   * Cerrar sesión del usuario
   * Limpia el localStorage y elimina todos los datos de autenticación
   */
  logout() {
    try {
      // Eliminar todos los datos relacionados con la autenticación
      localStorage.removeItem('access_token');
      localStorage.removeItem('token_type');
      localStorage.removeItem('user_data');
      
      return {
        success: true,
        message: 'Sesión cerrada exitosamente',
      };

    } catch (error) {
      console.error('Error al cerrar sesión:', error);
      return {
        success: false,
        error: 'Error al cerrar sesión',
      };
    }
  },

  /**
   * Verificar si el usuario está autenticado
   * @returns {boolean} True si hay un token válido
   */
  isAuthenticated() {
    const token = localStorage.getItem('access_token');
    return !!token;
  },

  /**
   * Obtener el token de acceso actual
   * @returns {string|null} Token de acceso o null si no existe
   */
  getAccessToken() {
    return localStorage.getItem('access_token');
  },

  /**
   * Obtener los datos del usuario almacenados
   * @returns {Object|null} Datos del usuario o null si no existen
   */
  getUserData() {
    const userData = localStorage.getItem('user_data');
    return userData ? JSON.parse(userData) : null;
  },

};

export default authService;