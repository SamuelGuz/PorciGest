"use client";

import {
  SportsEsportsRounded,
  SavingsRounded,
  MaleRounded,
  ScaleRounded,
  MedicalServicesRounded,
  StrollerRounded,
  ShuffleRounded,
} from "@mui/icons-material";

import ItemNav from "../utils/ItemNav";
import { useState } from "react";

interface NavBarProps{
  open: boolean,
}

const NavBarMobile = ({open}: NavBarProps) => {
  return (
    <nav className={`${!open? 'hidden': ''} max-w-(--widthApp) mx-auto bg-primary rounded-sm md:hidden`}>
      <ul className="flex flex-col justify-around">
        <ItemNav
          label="Dashboard"
          path="/dashboard"
          icon={<SportsEsportsRounded />}
        />

        <ItemNav
          label="Reproductoras"
          path="/dashboard/reproductoras"
          icon={<SavingsRounded />}
        />

        <ItemNav
          label="Sementales"
          path="/dashboard/sementales"
          icon={<MaleRounded />}
        />

        <ItemNav
          label="Lechones"
          path="/dashboard/lechones"
          icon={<StrollerRounded />}
        />

        <ItemNav
          label="Engorde"
          path="/dashboard/engorde"
          icon={<ScaleRounded />}
        />

        <ItemNav
          label="Veterinaria"
          path="/dashboard/veterinaria"
          icon={<MedicalServicesRounded />}
        />

        <ItemNav
          label="Movimientos"
          path="/dashboard/movimientos"
          icon={<ShuffleRounded />}
        />
      </ul>
    </nav>
  );
};

export default NavBarMobile;
