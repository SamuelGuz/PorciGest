import {
  TextField,
  Select,
  MenuItem,
  InputLabel,
  FormControl,
  Button,
} from "@mui/material";

import { DatePicker } from "@mui/x-date-pickers";

const NuevoTratamiento = ({
  setOpenForm,
}: {
  setOpenForm: (value: boolean) => void;
}) => {
  return (
    <section
      id="form-nuevo-tratamiento"
      className="py-6 px-4 rounded-sm shadow-lg gap-2 flex flex-col"
    >
      <h3 id="title">Registrar Tratamiento/Vacunación</h3>
      <form action="" className="grid grid-cols-1 md:grid-cols-3 gap-2">
        <FormControl sx={{ Width: "250px" }}>
          <InputLabel id="tipo_intervencion">Tipo de intervención</InputLabel>
          <Select label="tipo_intervencion" labelId="tipo_intervencion">
            <MenuItem value="vacunación">Vacunación</MenuItem>
          </Select>
        </FormControl>
        <TextField label="Animal/Lote" />
        <TextField label="Medicamento/Vacuna" />
        <TextField label="Dosis" />
        <FormControl sx={{ minWidth: "250px" }}>
          <InputLabel id="veterinario">Veterinario</InputLabel>
          <Select label="veterinario" labelId="veterinario">
            <MenuItem value="veterinario">Veterinario</MenuItem>
          </Select>
        </FormControl>
        <DatePicker label="Fecha" />
        <TextField
          multiline
          rows="3"
          fullWidth
          sx={{ gridColumn: {xs: "1/1", md: "1/4"}}}
          label="Observaciones"
        />
      </form>
      <div id="actions" className="flex gap-3">
        <Button variant="contained"
            sx={{ alignSelf: "start", '&:hover': {
              backgroundColor: '#D3B8A1',
            },}}>
          Guardar
        </Button>
        <Button onClick={()=> setOpenForm(false)}
              sx={{ color: "#171717",'&:hover': {
                backgroundColor: '#D3B8A1',
              },}}>
            Cancelar
          </Button>
      </div>
    </section>
  );
};

export default NuevoTratamiento;
