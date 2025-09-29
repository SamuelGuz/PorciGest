'use client';

import React from 'react';
import { Card, CardContent, Button } from "@mui/material";
import { useRouter } from 'next/navigation';
import GraficoPoblacion from "../ui/dashboard/GraficoPoblacion";
import GraficoAlertas from "../ui/dashboard/GraficoAlertas";
import {
  AddRounded,
  VaccinesRounded,
  AutorenewRounded,
  FitnessCenterRounded,
} from "@mui/icons-material";
import { useReproductoras } from "../../src/hooks/useReproductoras";
import { useSementales } from "../../src/hooks/useSementales";
import { useLechones } from "../../src/hooks/useLechones";
import { useEngorde } from "../../src/hooks/useEngorde";
import { useVeterinaria } from "../../src/hooks/useVeterinaria";

export default function Dashboard() {
  const router = useRouter();
  const { reproductoras } = useReproductoras();
  const { sementales } = useSementales();
  const { camadas } = useLechones();
  const { lotes } = useEngorde();
  const { tratamientos } = useVeterinaria();

  // Calcular estadísticas reales
  const totalAnimales = reproductoras.length + sementales.length + 
    camadas.reduce((sum, camada) => sum + (camada.numero_lechones || 0), 0) +
    lotes.reduce((sum, lote) => sum + (lote.numero_cerdos || 0), 0);

  const cerdasGestantes = reproductoras.filter((cerda) => 
    cerda.estado_reproductivo === 'Gestante' || cerda.estado_reproductivo === 'gestante'
  ).length;

  const tasaNatalidad = reproductoras.length > 0 ? 
    ((camadas.length / reproductoras.length) * 100) : 0;

  const tratamientosRecientes = tratamientos.filter((tratamiento) => {
    const fecha = new Date(tratamiento.fecha);
    const hace30Dias = new Date();
    hace30Dias.setDate(hace30Dias.getDate() - 30);
    return fecha >= hace30Dias;
  }).length;

  return (
    <>
      <h1 className="mt-4 text-2xl font-bold">Panel de control general</h1>
      <section
        id="cards"
        className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-2 mt-4"
      >
        <Card sx={{ minWidth: 200, backgroundColor: 'white', color: 'black', boxShadow: 2 }}>
          <CardContent>
            <h3 className="text-xs uppercase font-bold">Total animales</h3>
            <span className="text-2xl font-semibold">{totalAnimales}</span>
          </CardContent>
        </Card>
        <Card sx={{ minWidth: 200, backgroundColor: 'white', color: 'black', boxShadow: 2 }}>
          <CardContent>
            <h3 className="text-xs uppercase font-bold">Cerdas gestantes</h3>
            <span className="text-2xl font-semibold">{cerdasGestantes}</span>
          </CardContent>
        </Card>
        <Card sx={{ minWidth: 200, backgroundColor: 'white', color: 'black', boxShadow: 2 }}>
          <CardContent>
            <h3 className="text-xs uppercase font-bold">Tasa natalidad</h3>
            <span className="text-2xl font-semibold">{tasaNatalidad.toFixed(1)}%</span>
          </CardContent>
        </Card>
        <Card sx={{ minWidth: 200, backgroundColor: 'white', color: 'black', boxShadow: 2 }}>
          <CardContent>
            <h3 className="text-xs uppercase font-bold">Próximas vacunaciones</h3>
            <span className="text-2xl font-semibold">{tratamientosRecientes}</span>
          </CardContent>
        </Card>
      </section>
      
      <section
        id="actions"
        className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 justify-items-center gap-2 mt-4"
      >
        <Button 
          sx={{ maxWidth: "200px" }} 
          color="secondary" 
          variant="contained"
          onClick={() => router.push('/dashboard/lechones')}
        >
          <AddRounded /> Registrar Parto
        </Button>
        <Button 
          sx={{ maxWidth: "200px" }} 
          color="secondary" 
          variant="contained"
          onClick={() => router.push('/dashboard/veterinaria')}
        >
          <VaccinesRounded /> Nueva Vacunación
        </Button>
        <Button 
          sx={{ maxWidth: "200px" }} 
          color="secondary" 
          variant="contained"
          onClick={() => router.push('/dashboard/reproductoras')}
        >
          <AutorenewRounded /> Registrar Cruce
        </Button>
        <Button 
          sx={{ maxWidth: "200px" }} 
          color="secondary" 
          variant="contained"
          onClick={() => router.push('/dashboard/engorde')}
        >
          <FitnessCenterRounded /> Control de Peso
        </Button>
      </section>

      <section
        id="charts"
        className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-6"
      >
        <div>
          <h2 className="text-xl font-bold mb-2">Población por Categoría</h2>
          <GraficoPoblacion />
        </div>
        <div>
          <h2 className="text-xl font-bold mb-2">Alertas y Estado de Salud</h2>
          <GraficoAlertas />
        </div>
      </section>
    </>
  );
}
