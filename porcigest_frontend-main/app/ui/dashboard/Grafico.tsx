'use client';

import React from 'react';
import { useEngorde } from '../../../src/hooks/useEngorde';
import { Typography, LinearProgress } from '@mui/material';

export default function Grafico({ title }: { title: string }) {
  const { lotes } = useEngorde();

  // Calcular rendimiento de engorde
  const lotesConRendimiento = lotes.map((lote: any) => {
    const pesoInicial = lote.peso_inicial || 0;
    const pesoActual = lote.peso_actual || pesoInicial;
    const diasEngorde = lote.dias_engorde || 1;
    const gananciaTotal = pesoActual - pesoInicial;
    const gananciaPromedioDiaria = gananciaTotal / diasEngorde;
    
    return {
      ...lote,
      gananciaTotal,
      gananciaPromedioDiaria,
      porcentajeProgreso: Math.min((gananciaTotal / 50) * 100, 100) // Asumiendo 50kg como objetivo
    };
  });

  const promedioGanancia = lotesConRendimiento.length > 0 
    ? lotesConRendimiento.reduce((sum, lote) => sum + lote.gananciaPromedioDiaria, 0) / lotesConRendimiento.length
    : 0;

  return (
    <article className="h-40 shadow-lg mt-3 py-5 px-4 rounded-sm w-full">
      <div id="header" className="flex justify-between items-center">
        <h5 className="font-bold">{title}</h5>
        <Typography variant="caption" color="textSecondary">
          Promedio: {promedioGanancia.toFixed(2)} kg/día
        </Typography>
      </div>
      <div id="graphic" className="mt-4">
        {lotesConRendimiento.length > 0 ? (
          <div>
            {lotesConRendimiento.slice(0, 3).map((lote, index) => (
              <div key={lote.id} style={{ marginBottom: '8px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '4px' }}>
                  <Typography variant="caption">
                    Lote {lote.id} ({lote.numero_cerdos} cerdos)
                  </Typography>
                  <Typography variant="caption">
                    {lote.gananciaTotal.toFixed(1)} kg
                  </Typography>
                </div>
                <LinearProgress 
                  variant="determinate" 
                  value={lote.porcentajeProgreso}
                  sx={{ 
                    height: 6,
                    borderRadius: 3,
                    backgroundColor: 'rgba(0,0,0,0.1)',
                    '& .MuiLinearProgress-bar': {
                      backgroundColor: lote.porcentajeProgreso > 80 ? '#4caf50' : 
                                     lote.porcentajeProgreso > 50 ? '#ff9800' : '#f44336'
                    }
                  }}
                />
              </div>
            ))}
          </div>
        ) : (
          <Typography variant="body2" color="textSecondary">
            No hay datos de engorde disponibles
          </Typography>
        )}
      </div>
    </article>
  );
}
