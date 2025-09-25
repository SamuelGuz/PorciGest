'use client';

import React, { useState, useEffect } from 'react';
import { runAllConnectionTests, testRealLogin } from '../services/connectionTest';
import { authService } from '../services/authService';

/**
 * Componente para probar la conexión con la API
 * Usar temporalmente para verificar que todo funcione
 */
export default function ConnectionTester() {
  const [testResults, setTestResults] = useState(null);
  const [loading, setLoading] = useState(false);
  const [loginTest, setLoginTest] = useState({
    numeroDocumento: '',
    password: '',
    result: null
  });

  const handleRunTests = async () => {
    setLoading(true);
    try {
      const results = await runAllConnectionTests();
      setTestResults(results);
    } catch (error) {
      console.error('Error ejecutando pruebas:', error);
    }
    setLoading(false);
  };

  const handleLoginTest = async () => {
    if (!loginTest.numeroDocumento || !loginTest.password) {
      alert('Por favor ingresa número de documento y contraseña');
      return;
    }

    setLoading(true);
    try {
      const result = await testRealLogin(loginTest.numeroDocumento, loginTest.password);
      setLoginTest(prev => ({ ...prev, result }));
    } catch (error) {
      console.error('Error en prueba de login:', error);
    }
    setLoading(false);
  };

  const handleLogout = () => {
    authService.logout();
    setLoginTest(prev => ({ ...prev, result: null }));
  };

  return (
    <div style={{ padding: '20px', fontFamily: 'monospace', maxWidth: '800px', margin: '0 auto' }}>
      <h1>🔧 PorciGest Pro - Pruebas de Conexión</h1>
      
      {/* Pruebas Automáticas */}
      <div style={{ marginBottom: '30px', padding: '20px', border: '1px solid #ddd', borderRadius: '5px' }}>
        <h2>🧪 Pruebas Automáticas de Conexión</h2>
        <button 
          onClick={handleRunTests}
          disabled={loading}
          style={{
            padding: '10px 20px',
            backgroundColor: '#007bff',
            color: 'white',
            border: 'none',
            borderRadius: '5px',
            cursor: loading ? 'not-allowed' : 'pointer'
          }}
        >
          {loading ? '🔄 Ejecutando...' : '🚀 Ejecutar Pruebas'}
        </button>

        {testResults && (
          <div style={{ marginTop: '20px' }}>
            <h3>📊 Resultados:</h3>
            {Object.entries(testResults).map(([testName, result]) => (
              <div 
                key={testName}
                style={{
                  padding: '10px',
                  margin: '5px 0',
                  backgroundColor: result.success ? '#d4edda' : '#f8d7da',
                  border: `1px solid ${result.success ? '#c3e6cb' : '#f5c6cb'}`,
                  borderRadius: '3px'
                }}
              >
                <strong>{result.success ? '✅' : '❌'} {testName}</strong>
                {result.message && <div>📝 {result.message}</div>}
                {result.error && <div>⚠️ {result.error}</div>}
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Prueba de Login */}
      <div style={{ marginBottom: '30px', padding: '20px', border: '1px solid #ddd', borderRadius: '5px' }}>
        <h2>🔐 Prueba de Autenticación</h2>
        <div style={{ marginBottom: '15px' }}>
          <label>
            Número de Documento:
            <input
              type="text"
              value={loginTest.numeroDocumento}
              onChange={(e) => setLoginTest(prev => ({ ...prev, numeroDocumento: e.target.value }))}
              style={{ marginLeft: '10px', padding: '5px', width: '200px' }}
              placeholder="Ej: 12345678"
            />
          </label>
        </div>
        <div style={{ marginBottom: '15px' }}>
          <label>
            Contraseña:
            <input
              type="password"
              value={loginTest.password}
              onChange={(e) => setLoginTest(prev => ({ ...prev, password: e.target.value }))}
              style={{ marginLeft: '10px', padding: '5px', width: '200px' }}
              placeholder="Tu contraseña"
            />
          </label>
        </div>
        <button 
          onClick={handleLoginTest}
          disabled={loading}
          style={{
            padding: '10px 20px',
            backgroundColor: '#28a745',
            color: 'white',
            border: 'none',
            borderRadius: '5px',
            cursor: loading ? 'not-allowed' : 'pointer',
            marginRight: '10px'
          }}
        >
          {loading ? '🔄 Probando...' : '🔑 Probar Login'}
        </button>
        
        {authService.isAuthenticated() && (
          <button 
            onClick={handleLogout}
            style={{
              padding: '10px 20px',
              backgroundColor: '#dc3545',
              color: 'white',
              border: 'none',
              borderRadius: '5px',
              cursor: 'pointer'
            }}
          >
            🚪 Logout
          </button>
        )}

        {loginTest.result && (
          <div style={{ marginTop: '15px' }}>
            <h4>🎯 Resultado del Login:</h4>
            <div 
              style={{
                padding: '10px',
                backgroundColor: loginTest.result.success ? '#d4edda' : '#f8d7da',
                border: `1px solid ${loginTest.result.success ? '#c3e6cb' : '#f5c6cb'}`,
                borderRadius: '3px'
              }}
            >
              {loginTest.result.success ? (
                <>
                  <div>✅ Login exitoso!</div>
                  {loginTest.result.authenticated ? (
                    <div>✅ Peticiones autenticadas funcionando</div>
                  ) : (
                    <div>⚠️ Login exitoso pero problemas con peticiones autenticadas</div>
                  )}
                </>
              ) : (
                <div>❌ Login falló: {loginTest.result.error}</div>
              )}
            </div>
          </div>
        )}
      </div>

      {/* Estado actual */}
      <div style={{ padding: '20px', border: '1px solid #ddd', borderRadius: '5px', backgroundColor: '#f8f9fa' }}>
        <h2>📋 Estado Actual</h2>
        <div>🔐 Autenticado: {authService.isAuthenticated() ? '✅ Sí' : '❌ No'}</div>
        <div>🎫 Token: {authService.getAccessToken() ? '✅ Presente' : '❌ Ausente'}</div>
        <div>👤 Usuario: {authService.getUserData() ? '✅ Datos cargados' : '❌ Sin datos'}</div>
      </div>

      {/* Instrucciones */}
      <div style={{ marginTop: '30px', padding: '20px', border: '1px solid #007bff', borderRadius: '5px', backgroundColor: '#e7f1ff' }}>
        <h2>📖 Instrucciones</h2>
        <ol>
          <li><strong>Ejecutar Pruebas Automáticas:</strong> Haz clic en "Ejecutar Pruebas" para verificar la conectividad básica</li>
          <li><strong>Probar Autenticación:</strong> Ingresa credenciales válidas y prueba el login</li>
          <li><strong>Revisar Consola:</strong> Abre las DevTools (F12) y revisa la consola para ver logs detallados</li>
          <li><strong>Backend:</strong> Asegúrate de que uvicorn esté corriendo en http://127.0.0.1:8000</li>
        </ol>
      </div>
    </div>
  );
}