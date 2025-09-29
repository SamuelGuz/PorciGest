'use client';

import React, { useEffect } from 'react';
import { Typography, Chip } from '@mui/material';
import { 
  WarningRounded, 
  MonitorWeightRounded, 
  PregnantWomanRounded,
  FeedRounded,
  PetsRounded 
} from '@mui/icons-material';
import { useReproductoras } from '../../../src/hooks/useReproductoras';
import { useVeterinaria } from '../../../src/hooks/useVeterinaria';
import { useEngorde } from '../../../src/hooks/useEngorde';
import { useLechones } from '../../../src/hooks/useLechones';
import { useSementales } from '../../../src/hooks/useSementales';

export default function GraficoAlertas() {
  const { reproductoras } = useReproductoras();
  const { sementales } = useSementales();
  const { camadas } = useLechones();
  const { lotes } = useEngorde();
  const { tratamientos } = useVeterinaria();

  // Calcular métricas sencillas y útiles
  const proximosPartos = reproductoras.filter((cerda) => {
    return cerda.estado_reproductivo === 'Gestante' || cerda.estado_reproductivo === 'gestante';
  }).length;

  // Promedio de peso en engorde
  const promediopesoEngorde = (() => {
    const lotesConPeso = lotes.filter(lote => lote.peso_actual_promedio && lote.peso_actual_promedio > 0);
    if (lotesConPeso.length === 0) return 0;
    
    const sumaTotal = lotesConPeso.reduce((sum, lote) => sum + (lote.peso_actual_promedio || 0), 0);
    return Math.round(sumaTotal / lotesConPeso.length);
  })();

  const lotesEnRiesgo = lotes.filter((lote) => {
    // Lotes con bajo peso promedio o que llevan mucho tiempo
    return (lote.peso_actual_promedio && lote.peso_actual_promedio < 50) || lote.numero_cerdos > 20;
  }).length;

  // Distribución por raza - encontrar la raza más común
  const infoRazaDominante = (() => {
    const conteoRazas: { [key: string]: number } = {};
    
    // Contar razas de reproductoras
    reproductoras.forEach(cerda => {
      const raza = cerda.raza || 'Sin especificar';
      conteoRazas[raza] = (conteoRazas[raza] || 0) + 1;
    });
    
    // Contar razas de sementales
    sementales.forEach(semental => {
      const raza = semental.raza || 'Sin especificar';
      conteoRazas[raza] = (conteoRazas[raza] || 0) + 1;
    });
    
    // Contar razas de camadas (de las madres)
    camadas.forEach(camada => {
      if (camada.madre && camada.madre.raza) {
        const raza = camada.madre.raza;
        conteoRazas[raza] = (conteoRazas[raza] || 0) + camada.numero_lechones;
      }
    });
    
    // Encontrar la raza más común
    let razaDominante = 'Sin datos';
    let maxConteo = 0;
    
    Object.entries(conteoRazas).forEach(([raza, conteo]) => {
      if (conteo > maxConteo) {
        maxConteo = conteo;
        razaDominante = raza;
      }
    });
    
    return { raza: razaDominante, cantidad: maxConteo, distribuciones: conteoRazas };
  })();

  const alertas = [
    {
      titulo: 'Cerdas Gestantes',
      cantidad: proximosPartos,
      color: '#ff9800',
      icono: <PregnantWomanRounded />
    },
    {
      titulo: 'Promedio Peso Engorde',
      cantidad: promediopesoEngorde,
      color: '#4caf50',
      icono: <MonitorWeightRounded />,
      unidad: 'kg'
    },
    {
      titulo: 'Lotes que Requieren Atención',
      cantidad: lotesEnRiesgo,
      color: '#ff5722',
      icono: <FeedRounded />
    },
    {
      titulo: 'Raza Dominante',
      cantidad: infoRazaDominante.cantidad,
      color: '#9c27b0',
      icono: <PetsRounded />,
      etiqueta: infoRazaDominante.raza
    }
  ];

  // Debug: mostrar valores en consola para verificar
  useEffect(() => {
    console.log('Datos del dashboard:', {
      reproductoras: reproductoras.length,
      sementales: sementales.length,
      camadas: camadas.length,
      lotes: lotes.length,
      proximosPartos,
      promediopesoEngorde,
      lotesEnRiesgo,
      infoRazaDominante: infoRazaDominante,
      distribucionCompleta: infoRazaDominante.distribuciones
    });
  }, [reproductoras, sementales, camadas, lotes, proximosPartos, promediopesoEngorde, lotesEnRiesgo, infoRazaDominante]);

  return (
    <article className="w-full h-96 shadow-lg mt-3 py-4 px-6 rounded-sm overflow-hidden">
      <div id="header" className='flex justify-between items-center mb-4'>
        <h5 className="font-bold text-base">Estado de Salud y Alertas</h5>
      </div>

      <div id="alerts" className="h-80 overflow-y-auto">
        <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
          {alertas.map((alerta, index) => (
            <div key={index} style={{ 
              display: 'flex', 
              alignItems: 'center', 
              justifyContent: 'space-between',
              padding: '12px 16px',
              backgroundColor: 'white',
              borderRadius: '10px',
              borderLeft: `6px solid ${alerta.color}`,
              boxShadow: '0 3px 8px rgba(0,0,0,0.12)',
              transition: 'transform 0.2s ease',
              cursor: 'pointer'
            }}
            onMouseEnter={(e) => e.currentTarget.style.transform = 'translateX(3px)'}
            onMouseLeave={(e) => e.currentTarget.style.transform = 'translateX(0px)'}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                <div style={{ color: alerta.color, fontSize: '1.4rem' }}>
                  {alerta.icono}
                </div>
                <Typography variant="body2" fontWeight="bold" sx={{ fontSize: '0.9rem' }}>
                  {alerta.titulo}
                </Typography>
              </div>
              <Chip 
                label={alerta.etiqueta ? `${alerta.cantidad} (${alerta.etiqueta})` : `${alerta.cantidad}${alerta.unidad ? ' ' + alerta.unidad : ''}`}
                size="medium"
                sx={{ 
                  backgroundColor: alerta.color,
                  color: 'white',
                  fontWeight: 'bold',
                  fontSize: '0.8rem',
                  height: '30px',
                  minWidth: '50px'
                }}
              />
            </div>
          ))}
        </div>

        {/* Resumen general */}
        <div style={{ 
          marginTop: '16px', 
          padding: '12px', 
          backgroundColor: '#99775C', 
          borderRadius: '8px',
          textAlign: 'center'
        }}>
          <Typography variant="body2" fontWeight="bold" sx={{ color: 'white', fontSize: '0.9rem' }}>
            Total de alertas activas: {alertas.reduce((sum, alerta) => sum + alerta.cantidad, 0)}
          </Typography>
        </div>
      </div>
    </article>
  );
}