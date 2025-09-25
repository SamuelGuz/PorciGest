"use client";
import { useRouter } from 'next/navigation';
import EditIcon from '@mui/icons-material/Edit';
import { Button, TextField, Snackbar, Alert, LinearProgress } from '@mui/material';

import * as React from 'react';
import { styled } from '@mui/material/styles';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell, { tableCellClasses } from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Paper from '@mui/material/Paper';
import DeleteIcon from '@mui/icons-material/Delete';
import IconButton from '@mui/material/IconButton';
import HeaderGestion from '@/ui/utils/HeaderGestion';

const StyledTableCell = styled(TableCell)(({ theme }) => ({
  [`&.${tableCellClasses.head}`]: {
    backgroundColor: theme.palette.common.black,
    color: theme.palette.common.white,
  },
  [`&.${tableCellClasses.body}`]: {
    fontSize: 14,
  },
}));

const StyledTableRow = styled(TableRow)(({ theme }) => ({
  '&:nth-of-type(odd)': {
    backgroundColor: theme.palette.action.hover,
  },
  '&:last-child td, &:last-child th': {
    border: 0,
  },
}));

function createData(
  lote: string,
  cantidad: number,
  edad: number,
  peso: number,
  consumo: number,
  progreso: number,
) {
  return { lote, cantidad, edad, peso, consumo, progreso };
}

const initialRows = [
  createData('Lote A', 159, 60, 24, 4.0, 78),
  createData('Lote B', 120, 45, 20, 3.5, 65),
];

export default function EngordePage() {
  
  const [rows, setRows] = React.useState(initialRows);

  const [editIndex, setEditIndex] = React.useState<number | null>(null);
  const [showForm, setShowForm] = React.useState(false);
  function handleClick(){
    setShowForm(!showForm)
  }

  const [lote, setLote] = React.useState("");
  const [cantidad, setCantidad] = React.useState("");
  const [edad, setEdad] = React.useState("");
  const [peso, setPeso] = React.useState("");
  const [consumo, setConsumo] = React.useState("");

  const [openSnackbar, setOpenSnackbar] = React.useState(false);

  const handleDelete = (lote: string) => {
    setRows(rows.filter((row) => row.lote !== lote));
  };

  const handleEdit = (index: number) => {
    const row = rows[index];
    setLote(row.lote);
    setCantidad(String(row.cantidad));
    setEdad(String(row.edad));
    setPeso(String(row.peso));
    setConsumo(String(row.consumo));
    setEditIndex(index); 
    setShowForm(true);
  };

  const handleSave = () => {
    if (!lote || !cantidad) {
      setOpenSnackbar(true);
      return;
    }

    const newRow = createData(
      lote,
      Number(cantidad),
      Number(edad),
      Number(peso),
      Number(consumo),
      editIndex !== null ? rows[editIndex].progreso : 0 
    );

    if (editIndex !== null) {
      const updatedRows = [...rows];
      updatedRows[editIndex] = newRow;
      setRows(updatedRows);
    } else {
      setRows([...rows, newRow]);
    }

    setShowForm(false);
    setEditIndex(null);
    setLote("");
    setCantidad("");
    setEdad("");
    setPeso("");
    setConsumo("");
  };

  return (
    <>
      <main>
       <HeaderGestion title='Gestion de cerdos de engorde' textButton='Nuevo lote' setShowForm={handleClick}/>
          {showForm && (
            <div className="bg-white rounded-xl shadow-md p-6 mb-8 mt-5">
              <h2 className="text-xl font-semibold mb-4">
                {editIndex !== null ? "Editar lote" : "Registrar nuevo lote"}
              </h2>
              <div className="grid grid-cols-2 gap-4">
                <TextField label="Nombre del lote" value={lote} onChange={(e) => setLote(e.target.value)} fullWidth />
                <TextField label="Cantidad" type="number" value={cantidad} onChange={(e) => setCantidad(e.target.value)} fullWidth />
                <TextField label="Edad (días)" type="number" value={edad} onChange={(e) => setEdad(e.target.value)} fullWidth />
                <TextField label="Peso Prom." type="number" value={peso} onChange={(e) => setPeso(e.target.value)} fullWidth />
                <TextField label="Consumo/día" type="number" value={consumo} onChange={(e) => setConsumo(e.target.value)} fullWidth />
              </div>
              <div className="flex justify-end mt-4 gap-3">
                <Button color='secondary' onClick={() => { setShowForm(false); setEditIndex(null); }}
                  sx={{
                      color: "#171717",
                      '&:hover': {
                        backgroundColor: '#D3B8A1',
                      },
                    }}>
                  Cancelar
                </Button>
                <Button  variant="contained" onClick={handleSave} 
                  sx={{
                  '&:hover': {
                    backgroundColor: '#D3B8A1',
                  },
                  }}>
                  {editIndex !== null ? "Actualizar" : "Guardar"}
                </Button>
              </div>
            </div>
          )}

          <div className="bg-white rounded-xl shadow-xl/20 inset-shadow-sm p-6 mb-8">
            <h2 className="font-semibold mb-4">Evolucion del peso por el lote</h2>
              <div className="h-40 flex items-center justify-center text-gray-400">
                grafica
              </div>
          </div>

          <div className="bg-white rounded-xl shadow-xl/20 inset-shadow-sm p-6 mb-8">
            <h1>Lotes en engorde</h1>
            <TableContainer className="mt-3" component={Paper}>
              <Table sx={{ minWidth: 700 }} aria-label="customized table">
                <TableHead>
                  <TableRow>
                    <StyledTableCell>Lote</StyledTableCell>
                    <StyledTableCell align="right">Cantidad</StyledTableCell>
                    <StyledTableCell align="right">Edad(días)</StyledTableCell>
                    <StyledTableCell align="right">Peso Prom.</StyledTableCell>
                    <StyledTableCell align="right">Consumo/día</StyledTableCell>
                    <StyledTableCell align="right">Progreso</StyledTableCell>
                    <StyledTableCell align="right">Acciones</StyledTableCell>
                  </TableRow>
                </TableHead>

                <TableBody>
                  {rows.map((row, index) => (
                    <StyledTableRow key={row.lote}>
                      <StyledTableCell component="th" scope="row">{row.lote}</StyledTableCell>
                      <StyledTableCell align="right">{row.cantidad}</StyledTableCell>
                      <StyledTableCell align="right">{row.edad}</StyledTableCell>
                      <StyledTableCell align="right">{row.peso}</StyledTableCell>
                      <StyledTableCell align="right">{row.consumo}</StyledTableCell>
                      <StyledTableCell align="right">
                        <div>
                          <span className="text-xs text-gray-500 mb-1">{row.progreso}%</span>
                          <LinearProgress
                            variant="determinate"
                            value={row.progreso}
                            sx={{
                              width: 120,
                              height: 8,
                              borderRadius: 5,
                              backgroundColor: 'e0e0e0',
                              '& .MuiLinearProgress-bar': {
                                borderRadius: 5,
                                background: 'linear-gradient(90deg, #4facfe 0%, #6a82fb 100%)',
                              }
                            }}
                          />
                        </div>
                      </StyledTableCell>

                      <StyledTableCell align="right">
                        <IconButton onClick={() => handleEdit(index)} aria-label="editar" size="small">
                          <EditIcon fontSize="small" />
                        </IconButton>
                        <IconButton onClick={() => handleDelete(row.lote)} aria-label="delete" size="small">
                          <DeleteIcon fontSize="small" />
                        </IconButton>
                      </StyledTableCell>
                    </StyledTableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
          </div>
      </main>

      <Snackbar
        open={openSnackbar}
        autoHideDuration={2500}
        onClose={() => setOpenSnackbar(false)}
        anchorOrigin={{ vertical: "top", horizontal: "center" }}
      >
        <Alert onClose={() => setOpenSnackbar(false)} severity="error" sx={{ width: "100%" }}>
          Debes completar al todos los campos
        </Alert>
      </Snackbar>
    </>
  );
}