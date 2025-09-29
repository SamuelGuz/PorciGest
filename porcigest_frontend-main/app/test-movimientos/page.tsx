// Componente de prueba para verificar conexión con el backend
"use client";

import { useState } from 'react';
import { Button, Box, Typography, Alert } from '@mui/material';

export default function TestMovimientos() {
  const [resultado, setResultado] = useState<string>('');
  const [loading, setLoading] = useState(false);

  const testConexion = async () => {
    setLoading(true);
    setResultado('');
    
    try {
      const token = localStorage.getItem('access_token');
      const headers = {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      };

      const response = await fetch('http://localhost:8000/movimientos/estadisticas?dias=30', {
        method: 'GET',
        headers: headers,
      });

      if (response.ok) {
        const data = await response.json();
        setResultado(`✅ Conexión exitosa! Total movimientos: ${data.total_movimientos}`);
      } else {
        setResultado(`❌ Error: ${response.status} - ${response.statusText}`);
      }
    } catch (error) {
      setResultado(`❌ Error de conexión: ${error}`);
    } finally {
      setLoading(false);
    }
  };

  const crearMovimientoPrueba = async () => {
    setLoading(true);
    setResultado('');
    
    try {
      const token = localStorage.getItem('access_token');
      const headers = {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      };

      const movimientoData = {
        accion: "Prueba de conexión",
        modulo: "Test",
        descripcion: "Movimiento de prueba creado desde frontend",
        tipo_movimiento: "crear"
      };

      const response = await fetch('http://localhost:8000/movimientos/', {
        method: 'POST',
        headers: headers,
        body: JSON.stringify(movimientoData)
      });

      if (response.ok) {
        const data = await response.json();
        setResultado(`✅ Movimiento creado! ID: ${data.id}`);
      } else {
        const errorText = await response.text();
        setResultado(`❌ Error: ${response.status} - ${errorText}`);
      }
    } catch (error) {
      setResultado(`❌ Error: ${error}`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box sx={{ p: 3 }}>
      <Typography variant="h5" sx={{ mb: 2 }}>
        Test de Conexión - Movimientos
      </Typography>
      
      <Box sx={{ display: 'flex', gap: 2, mb: 2 }}>
        <Button 
          variant="contained" 
          onClick={testConexion}
          disabled={loading}
        >
          Test Conexión
        </Button>
        
        <Button 
          variant="outlined" 
          onClick={crearMovimientoPrueba}
          disabled={loading}
        >
          Crear Movimiento Prueba
        </Button>
      </Box>

      {resultado && (
        <Alert severity={resultado.includes('✅') ? 'success' : 'error'}>
          {resultado}
        </Alert>
      )}
    </Box>
  );
}