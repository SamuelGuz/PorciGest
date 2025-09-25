import { ListItem } from "@mui/material";
import theme from "@/theme/theme";

const { main } = theme.palette.secondary;

const EventComponent = () => {
  return (
    <ListItem
      sx={{
        display: "flex",
        flexDirection: "column",
        alignItems: "start",
        borderLeft: `4px solid ${main}`,
      }}
    >
      <small>Fecha del evento</small>
      <div>
        <strong>Evento</strong>-<span>Detalles</span>
      </div>
    </ListItem>
  );
};

export default EventComponent;
