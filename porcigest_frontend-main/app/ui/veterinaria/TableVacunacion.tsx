import {
  Table,
  TableHead,
  TableRow,
  TableCell,
  TableBody,
  Chip,
  Tooltip,
  IconButton,
  TableContainer,
} from "@mui/material";

import {
  DeleteRounded,
  CreateRounded,
  VisibilityRounded,
} from "@mui/icons-material";

import { styled } from "@mui/material/styles";
import { tableCellClasses } from "@mui/material";

const StyledTableCell = styled(TableCell)(({ theme }) => ({
  [`&.${tableCellClasses.head}`]: {
    color: theme.palette.background.default,
    fontWeight: "900",
  },
  [`&.${tableCellClasses.body}`]: {
    fontSize: 14,
    fontWeight: "900",
  },
}));

const columns = [
  { key: "fecha", label: "Fecha" },
  { key: "tipo", label: "Tipo" },
  { key: "animal/lote", label: "Animal/Lote" },
  { key: "producto", label: "Producto" },
  { key: "veterinario", label: "Veterinario" },
  { key: "estado", label: "Estado" },
  { key: "acciones", label: "Acciones" },
];

const rows = [
  [
    {
      key: "fecha",
      content: new Date().toLocaleDateString(),
    },
    {
      key: "type",
      content: "Vacunación",
    },
    {
      key: "animal/lote",
      content: "Lote 1",
    },
    {
      key: "producto",
      content: "Vacuna 3131",
    },
    {
      key: "veterinario",
      content: "Pedro Gonzales",
    },
    {
      key: "estado",
      content: "completado",
    },
  ],
  [
    {
      key: "fecha",
      content: new Date().toLocaleDateString(),
    },
    {
      key: "type",
      content: "Desparasitación",
    },
    {
      key: "animal/lote",
      content: "Lote 2",
    },
    {
      key: "producto",
      content: "Desparasitante X",
    },
    {
      key: "veterinario",
      content: "Lucía Fernández",
    },
    {
      key: "estado",
      content: "pendiente",
    },
  ],
  [
    {
      key: "fecha",
      content: new Date().toLocaleDateString(),
    },
    {
      key: "type",
      content: "Chequeo general",
    },
    {
      key: "animal/lote",
      content: "Lote 3",
    },
    {
      key: "producto",
      content: "N/A",
    },
    {
      key: "veterinario",
      content: "Carlos Méndez",
    },
    {
      key: "estado",
      content: "en progreso",
    },
  ],
];

const TableVacunacion = () => {
  return (
    <section
      className="shadow-lg mt-3 py-6 px-4 rounded-sm"
      id="table-vacunación"
    >
      <h1 className="text-bold">Historial de intervenciones veterinarias</h1>
      <TableContainer>
        <Table>
          <TableHead>
            <TableRow>
              {columns.map((col) => (
                <StyledTableCell align="left" key={col.key}>
                  {col.label}
                </StyledTableCell>
              ))}
            </TableRow>
          </TableHead>
          <TableBody>
            {rows.map((row, rowIndex) => (<TableRow key={rowIndex}>
              {row.map((cell) => (<TableCell key={cell.key}>{cell.content}</TableCell>))}
                <Tooltip title="Editar">
                    <IconButton color="success">
                      <CreateRounded />
                    </IconButton>
                  </Tooltip>
                  <Tooltip title="Detalles">
                    <IconButton color="info">
                      <VisibilityRounded />
                    </IconButton>
                  </Tooltip>
                  <Tooltip title="Eliminar">
                    <IconButton color="error">
                      <DeleteRounded />
                    </IconButton>
                  </Tooltip>
            </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </section>
  );
};

export default TableVacunacion;
