"use client";

import * as React from "react";
import {
  Table, TableBody, TableCell, TableContainer,
  TableHead, TableRow, Paper, Typography
} from "@mui/material";

export default function Movimientos() {
  // Datos de ejemplo con el campo "pagina"
  const movimientos = [
    { id: 1, usuario: "Juan Pérez", accion: "Creó un nuevo cliente", pagina: "Clientes", fecha: "2025-09-10 09:30" },
    { id: 2, usuario: "Ana López", accion: "Editó un pedido", pagina: "Pedidos", fecha: "2025-09-10 10:15" },
    { id: 3, usuario: "Carlos Ruiz", accion: "Eliminó un producto", pagina: "Productos", fecha: "2025-09-10 11:00" },
  ];

  return (
    <TableContainer component={Paper} sx={{ mt: 4 }}>
      <Typography variant="h6" sx={{ m: 2 }}>
        Movimientos de Usuarios
      </Typography>
      <Table>
        <TableHead>
          <TableRow>
            <TableCell>ID</TableCell>
            <TableCell>Usuario</TableCell>
            <TableCell>Acción</TableCell>
            <TableCell>Página</TableCell>
            <TableCell>Fecha</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {movimientos.map((mov) => (
            <TableRow key={mov.id}>
              <TableCell>{mov.id}</TableCell>
              <TableCell>{mov.usuario}</TableCell>
              <TableCell>{mov.accion}</TableCell>
              <TableCell>{mov.pagina}</TableCell>
              <TableCell>{mov.fecha}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
}
