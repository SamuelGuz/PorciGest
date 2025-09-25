import { createTheme, alpha, getContrastRatio } from "@mui/material/styles";

const primary = "#EAE7DD"
const secondary = "#99775C"

const theme = createTheme({
  typography: {
    fontFamily: "Quicksand", 
    button:{
        fontWeight: 600
    }
  },
  palette: {
    primary: {
      main: primary,
      light: alpha(primary, 0.5),
      dark: alpha(primary, 0.9),
      contrastText: getContrastRatio(primary, '#fff') > 4.5 ? '#fff' : '#111',
    },
    secondary: {
      main: secondary,
      contrastText: getContrastRatio(secondary, '#fff') > 4.5 ? '#fff' : '#111'
    },
    error:{
      main: "#E4004B"
    },
    warning:{
      main: "#FFCC00"
    },
    info:{
      main: "#3396D3"
    },
    success:{
      main: "#386641"
    },
    background: {
      default: "#395b64",
    },
  },
});
  
export default theme;
