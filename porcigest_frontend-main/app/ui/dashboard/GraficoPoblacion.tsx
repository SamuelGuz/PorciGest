import {Button} from '@mui/material'

export default function GraficoPoblacion() {
  return (
  <article className="max-w-5xl mx-auto h-40 shadow-lg mt-3 py-3 px-4 rounded-sm">
    <div id="header" className='flex justify-between items-center'>
        <h5 className="font-bold">Evolución de la población porcina</h5>
        <Button sx={{textTransform: "none", '&:hover': { backgroundColor: "#ceb6a3" },}} variant='contained'>Exportar</Button>
    </div>

    <div id="graphic">

    </div>
  </article>);
}
