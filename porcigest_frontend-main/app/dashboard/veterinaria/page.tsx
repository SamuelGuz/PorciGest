"use client";

import Grafico from "@/ui/dashboard/Grafico";
import HeaderGestion from "@/ui/utils/HeaderGestion";
import NuevoTratamiento from "@/ui/veterinaria/NuevoTratamiento";
import ProximosEvents from "@/ui/veterinaria/ProximosEvents";
import TableVacunacion from "@/ui/veterinaria/TableVacunacion";
import { useState } from "react";

export default function Veterinaria() {
  const [openForm, setOpenForm] = useState(false);

  const handleClick = () => {
    setOpenForm(!openForm);
  };

  return (
    <>
      <HeaderGestion
        title="Gestion Veterinaria"
        textButton="Nuevo tratamiento"
        setShowForm={handleClick}
      />
      {openForm && <NuevoTratamiento setOpenForm={setOpenForm}/>}
      <aside id="graphics" className="flex flex-col md:flex-row gap-2">
        <Grafico title="Vacunaciones por mes"/>
        <Grafico title="Tipos de tratamiento"/>
      </aside>
      <TableVacunacion/>
      <ProximosEvents/>
    </>
  );
}
