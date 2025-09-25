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
import { RegistroCerda} from "../../../lib/definitions";

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
  { key: "id", label: "ID" },
  { key: "edad", label: "Edad" },
  { key: "estado", label: "Estado" },
  { key: "ultimo_parto", label: "Ultimo Parto " },
  { key: "n_partos", label: "N° Partos" },
  { key: "prox_evento", label: "Proximo Evento" },
  { key: "acciones", label: "Acciones" },
];

export default function TableCerdas({
  data,
}: {
  data: RegistroCerda[] | undefined;
}) {
  // crear un estado para los registros
  return (
    <section className="shadow-lg mt-3 py-6 px-4 rounded-sm">
      <h3 className="text-bold">Cerdas Reproductoras activas</h3>
      <TableContainer>
        <Table
          sx={{ minWidth: 650}}
          aria-label="simple table"
        >
          <TableHead>
            <TableRow>
              {columns.map((col) => (
                <StyledTableCell align="left" key={col.key}>{col.label}</StyledTableCell>
              ))}
            </TableRow>
          </TableHead>
          <TableBody>
            {data?.map((row) => (
              <TableRow
                key={row.codigo}
                sx={{ "&:last-child td, &:last-child th": { border: 0 } }}
              >
                <StyledTableCell component="th" scope="row">
                  {row.codigo}
                </StyledTableCell>
                <TableCell align="left">{row.edad}</TableCell>
                <TableCell align="left">{row.raza}</TableCell>
                <TableCell align="left">
                  <Chip label={row.estado} />
                </TableCell>
                <TableCell></TableCell>
                <TableCell></TableCell>
                <TableCell align="left">
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
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
      {data?.length === 0 && (
        <p className="text-center mt-4">No hay cerdas registradas</p>
      )}
    </section>
  );
}
