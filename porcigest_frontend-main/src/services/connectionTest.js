/**
 * Script de prueba para verificar la conexión con la API de PorciGest Pro
 * Ejecutar en la consola del navegador o como componente de prueba
 */

import api from './api';
import { authService } from './authService';
import { getReproductoras } from './porcinoService';

// ===== PRUEBAS DE CONEXIÓN =====

/**
 * Prueba 1: Verificar conectividad básica con la API
 */
export const testBasicConnection = async () => {
  console.log('🔍 Probando conexión básica...');
  
  try {
    // Intentar hacer una petición GET básica
    const response = await api.get('/');
    console.log('✅ Conexión básica exitosa:', response.status);
    return { success: true, status: response.status };
  } catch (error) {
    console.error('❌ Error en conexión básica:', error.message);
    if (error.code === 'ECONNREFUSED') {
      console.log('💡 Sugerencia: Asegúrate de que el backend esté ejecutándose en http://127.0.0.1:8000');
    }
    return { success: false, error: error.message };
  }
};

/**
 * Prueba 2: Verificar endpoint de documentación
 */
export const testDocsEndpoint = async () => {
  console.log('🔍 Probando endpoint de documentación...');
  
  try {
    const response = await api.get('/docs');
    console.log('✅ Endpoint /docs accesible:', response.status);
    return { success: true };
  } catch (error) {
    console.error('❌ Error al acceder a /docs:', error.message);
    return { success: false, error: error.message };
  }
};

/**
 * Prueba 3: Verificar interceptor de tokens
 */
export const testTokenInterceptor = async () => {
  console.log('🔍 Probando interceptor de tokens...');
  
  try {
    // Simular un token falso
    localStorage.setItem('access_token', 'test-token-123');
    
    // Hacer una petición que debería incluir el token
    await api.get('/reproductoras/');
    
  } catch (error) {
    // Es normal que falle con 401 porque el token es falso
    if (error.response?.status === 401) {
      console.log('✅ Interceptor funcionando - Token añadido a la petición');
      console.log('✅ Servidor respondió 401 como se esperaba con token inválido');
      
      // Limpiar el token de prueba
      localStorage.removeItem('access_token');
      
      return { success: true, message: 'Interceptor funciona correctamente' };
    } else {
      console.error('❌ Error inesperado:', error.message);
      localStorage.removeItem('access_token');
      return { success: false, error: error.message };
    }
  }
};

/**
 * Prueba 4: Verificar endpoint de registro (si está disponible públicamente)
 */
export const testSignupEndpoint = async () => {
  console.log('🔍 Probando endpoint de registro...');
  
  try {
    // Intentar hacer una petición POST vacía para ver la respuesta
    await authService.signup({});
  } catch (error) {
    // Es normal que falle con datos vacíos
    if (error.response?.status === 422) {
      console.log('✅ Endpoint /signup accesible - Error 422 esperado con datos vacíos');
      return { success: true, message: 'Endpoint accesible' };
    } else {
      console.error('❌ Error inesperado en /signup:', error.message);
      return { success: false, error: error.message };
    }
  }
  
  // Fallback si no se ejecuta el try-catch
  return { success: false, error: 'Error inesperado en el flujo' };
};

/**
 * Prueba 5: Verificar endpoint de login
 */
export const testLoginEndpoint = async () => {
  console.log('🔍 Probando endpoint de login...');
  
  try {
    // Intentar login con credenciales vacías
    await authService.login('', '');
  } catch (error) {
    // Es normal que falle con credenciales vacías
    if (error.response?.status === 422 || error.response?.status === 401) {
      console.log('✅ Endpoint /token accesible - Error esperado con credenciales vacías');
      return { success: true, message: 'Endpoint accesible' };
    } else {
      console.error('❌ Error inesperado en /token:', error.message);
      return { success: false, error: error.message };
    }
  }
  
  // Fallback si no se ejecuta el try-catch  
  return { success: false, error: 'Error inesperado en el flujo' };
};

/**
 * Ejecutar todas las pruebas de conexión
 */
export const runAllConnectionTests = async () => {
  console.log('🚀 Iniciando pruebas de conexión con PorciGest Pro API...');
  console.log('================================================');
  
  const results = {};
  
  // Ejecutar todas las pruebas
  results.basicConnection = await testBasicConnection();
  results.docsEndpoint = await testDocsEndpoint();
  results.tokenInterceptor = await testTokenInterceptor();
  results.signupEndpoint = await testSignupEndpoint();
  results.loginEndpoint = await testLoginEndpoint();
  
  // Asegurar que todas las pruebas devolvieron un resultado válido
  Object.keys(results).forEach(key => {
    if (!results[key] || typeof results[key].success === 'undefined') {
      results[key] = { success: false, error: 'Resultado undefined o inválido' };
    }
  });
  
  // Resumen de resultados
  console.log('================================================');
  console.log('📊 RESUMEN DE PRUEBAS:');
  
  let passedTests = 0;
  let totalTests = 0;
  
  Object.entries(results).forEach(([testName, result]) => {
    totalTests++;
    if (result.success) {
      passedTests++;
      console.log(`✅ ${testName}: EXITOSO`);
    } else {
      console.log(`❌ ${testName}: FALLÓ - ${result.error}`);
    }
  });
  
  console.log(`\n🎯 Resultado final: ${passedTests}/${totalTests} pruebas exitosas`);
  
  if (passedTests === totalTests) {
    console.log('🎉 ¡Todas las pruebas pasaron! La conexión está funcionando correctamente.');
  } else {
    console.log('⚠️  Algunas pruebas fallaron. Revisa la configuración del backend.');
  }
  
  return results;
};

// ===== PRUEBAS ESPECÍFICAS PARA DESARROLLO =====

/**
 * Prueba de autenticación completa (requiere credenciales válidas)
 */
export const testRealLogin = async (numeroDocumento, password) => {
  console.log('🔍 Probando login real...');
  
  try {
    const result = await authService.login(numeroDocumento, password);
    
    if (result.success) {
      console.log('✅ Login exitoso!');
      console.log('📋 Datos recibidos:', result.data);
      
      // Probar una petición autenticada
      try {
        const reproductoras = await getReproductoras();
        console.log('✅ Petición autenticada exitosa!');
        console.log('📋 Reproductoras obtenidas:', reproductoras.length);
        
        return { success: true, authenticated: true };
      } catch (authError) {
        console.log('⚠️  Login exitoso, pero fallo en petición autenticada:', authError.message);
        return { success: true, authenticated: false, error: authError.message };
      }
    } else {
      console.log('❌ Login falló:', result.error);
      return { success: false, error: result.error };
    }
  } catch (error) {
    console.error('❌ Error en prueba de login:', error.message);
    return { success: false, error: error.message };
  }
};

export default {
  testBasicConnection,
  testDocsEndpoint,
  testTokenInterceptor,
  testSignupEndpoint,
  testLoginEndpoint,
  runAllConnectionTests,
  testRealLogin,
};