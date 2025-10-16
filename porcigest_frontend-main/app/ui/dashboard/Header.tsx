"use client";
import { LogoutOutlined } from "@mui/icons-material";
import { Box } from "@mui/material";
import { MenuOutlined } from "@mui/icons-material";

import Link from "next/link";
import Image from "next/image";
import IconButton from "@mui/material/IconButton";

import { useState } from "react";
import NavBarMobile from "./NavBarMobile";
import { useAuth } from "../../../src/contexts/AuthContext";

export default function Header() {
  const [openNav, setOpenNav] = useState(false);
  const { user, logout } = useAuth();

  const handleLogout = () => {
    logout();
  };

  return (
    <>
      <header className="max-w-(--widthApp) mx-auto flex justify-between h-20 items-center">
        <div id="logo" className="flex gap-1 items-center">
          <Image
            src="/logo.jpg"
            width={80}
            height={80}
            alt="logo de porcigest"
            className="rounded-full"
          />
          <div>
            <h3 className="text-2xl">Porcigest</h3>
            <span id="name-user-responsive" className="block md:hidden">
              {user?.nombre || user?.numeroDocumento || user?.numero_documento || 'Usuario'}
            </span>
          </div>
        </div>
        <div id="profile-user" className="flex gap-2">
          <span className="hidden md:block">
            {user?.nombre || user?.numeroDocumento || user?.numero_documento || 'Usuario'}
          </span>
          <div id="logout" className="flex items-center gap-1 font-semibold">
            <Box display={{ xs: "none", md: "block" }}>
              <button 
                onClick={handleLogout}
                className="flex items-center gap-1 hover:text-red-600 transition-colors"
              >
                <span>Cerrar Sesion</span>
                <LogoutOutlined />
              </button>
            </Box>
          </div>
        </div>
        <div id="menu-navbar" className="block md:hidden">
          <IconButton onClick={() => {setOpenNav(!openNav)}}>
            <MenuOutlined />
          </IconButton>
        </div>
      </header>
      <NavBarMobile open={openNav}/>
    </>
  );
}
