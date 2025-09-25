import { List } from "@mui/material"
import EventComponent from "./EventComponent"

// Lista de proximos eventos desde el backend

const ProximosEvents = ()=>{
    // Estado para los proximos eventos que vengan desde el backend
    return (
        <section className="shadow-lg mt-3 py-6 px-4 rounded-sm">
            <h3>Proximos eventos programados</h3>
            <List>
                <EventComponent/>
            </List>
        </section>
    )
}

export default ProximosEvents