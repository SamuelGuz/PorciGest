'use client';

import React from 'react';
import { Typography, Chip } from '@mui/material';
import { useReproductoras } from '../../../src/hooks/useReproductoras';
import { useSementales } from '../../../src/hooks/useSementales';
import { useLechones } from '../../../src/hooks/useLechones';
import { useEngorde } from '../../../src/hooks/useEngorde';

export default function GraficoPoblacion() {
  const { reproductoras } = useReproductoras();
  const { sementales } = useSementales();
  const { camadas } = useLechones();
  const { lotes } = useEngorde();

  // Calcular totales
  const totalReproductoras = reproductoras.length;
  const totalSementales = sementales.length;
  const totalLechones = camadas.reduce((sum: number, camada: any) => sum + (camada.numero_lechones || 0), 0);
  const totalEngorde = lotes.reduce((sum: number, lote: any) => sum + (lote.numero_cerdos || 0), 0);
  const total = totalReproductoras + totalSementales + totalLechones + totalEngorde;

  const categorias = [
    { 
      nombre: 'Reproductoras', 
      cantidad: totalReproductoras, 
      porcentaje: total > 0 ? (totalReproductoras / total) * 100 : 0,
      color: '#99775C'
    },
    { 
      nombre: 'Sementales', 
      cantidad: totalSementales, 
      porcentaje: total > 0 ? (totalSementales / total) * 100 : 0,
      color: '#4caf50'
    },
    { 
      nombre: 'Lechones', 
      cantidad: totalLechones, 
      porcentaje: total > 0 ? (totalLechones / total) * 100 : 0,
      color: '#2196f3'
    },
    { 
      nombre: 'Engorde', 
      cantidad: totalEngorde, 
      porcentaje: total > 0 ? (totalEngorde / total) * 100 : 0,
      color: '#ff9800'
    },
  ];

  return (
    <article className="w-full h-96 shadow-lg mt-3 py-4 px-6 rounded-sm overflow-hidden">
      <div id="header" className='mb-4'>
        <h5 className="font-bold text-base">Evolución de la población porcina</h5>
      </div>

      <div id="graphic" className="h-80 overflow-hidden">
        {total > 0 ? (
          <div style={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
            <div style={{ marginBottom: '16px', textAlign: 'center' }}>
              <Typography variant="h6" fontWeight="bold">
                Total: {total} animales
              </Typography>
            </div>
            
            {/* Contenedor principal del gráfico */}
            <div style={{ 
              flex: 1,
              display: 'flex',
              flexDirection: 'column',
              position: 'relative',
              backgroundColor: '#fafafa',
              border: '2px solid #e0e0e0',
              borderRadius: '8px',
              padding: '16px'
            }}>
              
              {/* Área del gráfico con líneas de referencia */}
              <div style={{
                flex: 1,
                display: 'flex',
                alignItems: 'end',
                justifyContent: 'space-around',
                gap: '16px',
                position: 'relative',
                backgroundImage: 'linear-gradient(to top, #e0e0e0 1px, transparent 1px)',
                backgroundSize: '100% 20%',
                paddingBottom: '16px'
              }}>
                
                {categorias.map((categoria, index) => {
                  const maxHeight = 180; // altura máxima disponible
                  const barHeight = Math.max((categoria.porcentaje / 100) * maxHeight, 15);
                  
                  return (
                    <div key={index} style={{ 
                      display: 'flex', 
                      flexDirection: 'column', 
                      alignItems: 'center',
                      minWidth: '80px',
                      height: '100%',
                      justifyContent: 'flex-end' // Alinea todo hacia abajo
                    }}>
                      
                      {/* Valor encima de la barra */}
                      <div style={{ 
                        fontSize: '1.1rem',
                        fontWeight: 'bold',
                        marginBottom: '8px',
                        color: categoria.color,
                        textShadow: '0 1px 2px rgba(0,0,0,0.1)'
                      }}>
                        {categoria.cantidad}
                      </div>
                      
                      {/* Barra principal */}
                      <div style={{
                        width: '50px',
                        height: `${barHeight}px`,
                        background: `linear-gradient(to top, ${categoria.color}, ${categoria.color}cc)`,
                        borderRadius: '6px 6px 0 0',
                        transition: 'all 0.5s ease',
                        display: 'flex',
                        flexDirection: 'column',
                        justifyContent: 'center',
                        alignItems: 'center',
                        boxShadow: `0 -2px 8px ${categoria.color}30, inset 0 1px 0 rgba(255,255,255,0.3)`,
                        border: `1px solid ${categoria.color}`,
                        borderBottom: 'none',
                        position: 'relative',
                        cursor: 'pointer'
                      }}
                      onMouseEnter={(e) => {
                        e.currentTarget.style.transform = 'scaleY(1.05)';
                        e.currentTarget.style.boxShadow = `0 -4px 12px ${categoria.color}50, inset 0 1px 0 rgba(255,255,255,0.4)`;
                      }}
                      onMouseLeave={(e) => {
                        e.currentTarget.style.transform = 'scaleY(1)';
                        e.currentTarget.style.boxShadow = `0 -2px 8px ${categoria.color}30, inset 0 1px 0 rgba(255,255,255,0.3)`;
                      }}
                      >
                        
                        {/* Porcentaje dentro de la barra */}
                        <span style={{
                          color: 'white',
                          fontSize: '0.8rem',
                          fontWeight: 'bold',
                          textShadow: '0 1px 2px rgba(0,0,0,0.5)',
                          transform: 'rotate(0deg)'
                        }}>
                          {categoria.porcentaje.toFixed(0)}%
                        </span>
                        
                        {/* Efecto de brillo */}
                        <div style={{
                          position: 'absolute',
                          top: 0,
                          left: '20%',
                          width: '60%',
                          height: '40%',
                          background: 'linear-gradient(to bottom, rgba(255,255,255,0.4), transparent)',
                          borderRadius: '4px 4px 0 0',
                          pointerEvents: 'none'
                        }} />
                      </div>
                      
                      {/* Línea base */}
                      <div style={{
                        width: '54px',
                        height: '3px',
                        backgroundColor: '#333',
                        marginBottom: '8px'
                      }} />
                      
                    </div>
                  );
                })}
              </div>
              
              {/* Etiquetas en la parte inferior */}
              <div style={{
                display: 'flex',
                justifyContent: 'space-around',
                gap: '16px',
                paddingTop: '8px',
                borderTop: '2px solid #333'
              }}>
                {categorias.map((categoria, index) => (
                  <div key={index} style={{ 
                    minWidth: '80px',
                    textAlign: 'center'
                  }}>
                    <Typography variant="body2" sx={{ 
                      fontSize: '0.85rem', 
                      fontWeight: 'bold',
                      color: '#333',
                      lineHeight: 1.2
                    }}>
                      {categoria.nombre}
                    </Typography>
                  </div>
                ))}
              </div>
            </div>
          </div>
        ) : (
          <Typography variant="h6" color="textSecondary" textAlign="center" sx={{ mt: 4 }}>
            No hay datos disponibles
          </Typography>
        )}
      </div>
    </article>
  );
}
