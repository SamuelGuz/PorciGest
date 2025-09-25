import {
  TextField,
  Select,
  MenuItem,
  InputLabel,
  FormControl,
  Button,
} from "@mui/material";
import { DatePicker } from "@mui/x-date-pickers";

import { type RegistroCerda } from "../../../lib/definitions";
import { useState } from "react";
import dayjs, { Dayjs } from "dayjs";

interface FormProps {
  setShowForm: (value: boolean) => void;
  onAdd: (data: RegistroCerda) => void;
}

export default function ({ setShowForm, onAdd }: FormProps) {
  // Estados de cada input
  const [codigo, setCodigo] = useState("");
  const [fechaNacimiento, setFechaNacimiento] = useState<Dayjs | null>(dayjs());
  const [raza, setRaza] = useState("");
  const [estado, setEstado] = useState("");

  // Enviar datos a la page de cerdas
  const handleSubmit = (e: React.FormEvent)=>{
    e.preventDefault()
    if(!codigo || !fechaNacimiento || !raza || !estado) return
    const edad = dayjs().diff(fechaNacimiento, "years")
    onAdd({codigo, edad, raza, estado})
    setCodigo("");
    setFechaNacimiento(null)
    setRaza("")
    setEstado("")
  }

  return (
    <form
      action=""
      className={`py-6 px-4 rounded-sm shadow-lg gap-2 flex flex-col`}
      onSubmit={handleSubmit}
    >
      <h2 className="text-md font-bold">Registro nueva cerda</h2>
      <section className="flex flex-col sm:flex-row gap-3">
        <TextField
          label="Codigo"
          placeholder="Ej: CRD-2024-001"
          value={codigo}
          onChange={(e) => setCodigo(e.target.value)}
          sx={{flex: 1}}
        />
        <DatePicker
          label="Fecha de nacimiento"
          value={fechaNacimiento}
          onChange={(newValue) => {
            setFechaNacimiento(newValue);
            console.log(`Fecha seleccionada: ${newValue?.format("DD/MM/YYYY")}`)
          }}
          sx={{flex: 1}}
        />
        <FormControl sx={{flex: 1}}>
          <InputLabel id="raza">Raza</InputLabel>
          <Select label="Raza" labelId="raza" value={raza} onChange={e => setRaza(e.target.value)}>
            <MenuItem value={"yorkshire"}>Yorkshire</MenuItem>
          </Select>
        </FormControl>

        <FormControl sx={{flex: 1}}>
          <InputLabel id="estado">Estado</InputLabel>
          <Select label="Estado" labelId="estado" value={estado} onChange={e => setEstado(e.target.value)}>
            <MenuItem value={"vacia"}>Vacia</MenuItem>
          </Select>
        </FormControl>
      </section>
      <div id="actions" className="flex gap-3 mt-5">
        <Button variant="contained" sx={{ alignSelf: "start", '&:hover': {
                  backgroundColor: '#D3B8A1',
                },}} type="submit">
          Guardar
        </Button>

        <Button sx={{ color: "#171717",'&:hover': {
                  backgroundColor: '#D3B8A1',
                },}} onClick={() => setShowForm(false)}>
          Cancelar
        </Button>
      </div>
    </form>
  );
}
