import { Card, CardContent, Button } from "@mui/material";
import theme from "@/theme/theme";
import GraficoPoblacion from "../ui/dashboard/GraficoPoblacion";
import Grafico from "@/ui/dashboard/Grafico";
import {
  AddRounded,
  VaccinesRounded,
  AutorenewRounded,
  FitnessCenterRounded,
} from "@mui/icons-material";

const { main, contrastText } = theme.palette.secondary;

export default function Dashboard() {
  return (
    <>
      <h1 className="mt-4 text-2xl font-bold">Panel de control general</h1>
      <section
        id="cards"
        className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-2 mt-4"
      >
        <Card
          sx={{ minWidth: 200, backgroundColor: main, color: contrastText }}
        >
          <CardContent>
            <h3 className="text-xs uppercase font-bold">Total animales</h3>
            <span className="text-2xl font-semibold">847</span>
          </CardContent>
        </Card>
        <Card
          sx={{ minWidth: 200, backgroundColor: main, color: contrastText }}
        >
          <CardContent>
            <h3 className="text-xs uppercase font-bold">Cerdas gestantes</h3>
            <span className="text-2xl font-semibold">124</span>
          </CardContent>
        </Card>
        <Card
          sx={{ minWidth: 200, backgroundColor: main, color: contrastText }}
        >
          <CardContent>
            <h3 className="text-xs uppercase font-bold">Tasa natalidad</h3>
            <span className="text-2xl font-semibold">92%</span>
          </CardContent>
        </Card>
        <Card
          sx={{ minWidth: 200, backgroundColor: main, color: contrastText }}
        >
          <CardContent>
            <h3 className="text-xs uppercase font-bold">Prox. Vacunaciones</h3>
            <span className="text-2xl font-semibold">28</span>
          </CardContent>
        </Card>
      </section>
      <section
        id="actions"
        className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 justify-items-center gap-2 mt-4"
      >
        <Button sx={{ maxWidth: "200px" }} color="secondary">
          <AddRounded />
          Registrar Parto
        </Button>
        <Button sx={{ maxWidth: "200px" }} color="secondary">
          <VaccinesRounded />
          Nueva Vacunación
        </Button>
        <Button sx={{ maxWidth: "200px" }} color="secondary">
          <AutorenewRounded />
          Registrar cruce
        </Button>
        <Button sx={{ maxWidth: "200px" }} color="secondary">
          <FitnessCenterRounded />
          Control de peso
        </Button>
      </section>
      <GraficoPoblacion />
      <aside className="flex flex-col md:flex-row gap-2 max-w-5xl">
        <Grafico title="Distribución por categoría" />
        <Grafico title="Rendimiento de engorde" />
      </aside>
    </>
  );
}
