"use client";

import React, { useState } from 'react';
import {
  Box,
  Container,
  Typography,
  Button,
  Paper,
  Tabs,
  Tab,
  Fade,
  Alert,
  Snackbar,
} from '@mui/material';
import {
  Add as AddIcon,
  Assessment as AssessmentIcon,
  TableView as TableIcon,
} from '@mui/icons-material';
import { useVeterinaria } from '../../../src/hooks/useVeterinaria';
import CardsVeterinaria from '../../ui/veterinaria/CardsVeterinaria';
import TableVeterinaria from '../../ui/veterinaria/TableVeterinaria';
import RegistroNuevoTratamiento from '../../ui/veterinaria/RegistroNuevoTratamiento';

interface TabPanelProps {
  children?: React.ReactNode;
  index: number;
  value: number;
}

function TabPanel(props: TabPanelProps) {
  const { children, value, index, ...other } = props;

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`simple-tabpanel-${index}`}
      aria-labelledby={`simple-tab-${index}`}
      {...other}
    >
      {value === index && (
        <Fade in={true} timeout={300}>
          <Box sx={{ py: 3 }}>
            {children}
          </Box>
        </Fade>
      )}
    </div>
  );
}

function a11yProps(index: number) {
  return {
    id: `simple-tab-${index}`,
    'aria-controls': `simple-tabpanel-${index}`,
  };
}

const VeterinariaPageContent: React.FC = () => {
  const { loading, error, obtenerTratamientos } = useVeterinaria();
  const [value, setValue] = useState(0);
  const [openRegistro, setOpenRegistro] = useState(false);
  const [refreshKey, setRefreshKey] = useState(0);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  const handleChange = (event: React.SyntheticEvent, newValue: number) => {
    setValue(newValue);
  };

  const handleOpenRegistro = () => {
    setOpenRegistro(true);
  };

  const handleCloseRegistro = () => {
    setOpenRegistro(false);
  };

  const handleTratamientoCreated = () => {
    setRefreshKey(prev => prev + 1);
    setSuccessMessage('Tratamiento registrado exitosamente');
    obtenerTratamientos(); // Refrescar datos
  };

  const handleCloseSuccessMessage = () => {
    setSuccessMessage(null);
  };

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      {/* Encabezado */}
      <Box sx={{ mb: 4 }}>
        <Box 
          sx={{ 
            display: 'flex', 
            justifyContent: 'space-between', 
            alignItems: 'center',
            flexWrap: 'wrap',
            gap: 2
          }}
        >
          <Box>
            <Typography variant="h4" component="h1" gutterBottom>
              🏥 Gestión Veterinaria
            </Typography>
            <Typography variant="subtitle1" color="text.secondary">
              Administra y monitorea los tratamientos veterinarios de los animales
            </Typography>
          </Box>
          
          <Button
            variant="contained"
            startIcon={<AddIcon />}
            onClick={handleOpenRegistro}
            sx={{
              backgroundColor: "#99775C",
              '&:hover': {
                backgroundColor: '#7a6049',
              },
              borderRadius: 2,
              px: 3,
              py: 1,
            }}
          >
            Nuevo Tratamiento
          </Button>
        </Box>
      </Box>

      {/* Contenido principal */}
      <Paper 
        elevation={2} 
        sx={{ 
          borderRadius: 3,
          overflow: 'hidden',
        }}
      >
        <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
          <Tabs 
            value={value} 
            onChange={handleChange} 
            aria-label="tabs de gestión veterinaria"
            sx={{
              '& .MuiTab-root': {
                textTransform: 'none',
                fontSize: '1rem',
                fontWeight: 500,
                '&.Mui-selected': {
                  color: '#99775C',
                }
              },
              '& .MuiTabs-indicator': {
                backgroundColor: '#99775C',
              }
            }}
          >
            <Tab 
              label="Estadísticas" 
              icon={<AssessmentIcon />} 
              iconPosition="start" 
              {...a11yProps(0)} 
            />
            <Tab 
              label="Tratamientos" 
              icon={<TableIcon />} 
              iconPosition="start" 
              {...a11yProps(1)} 
            />
          </Tabs>
        </Box>

        <TabPanel value={value} index={0}>
          <CardsVeterinaria key={refreshKey} />
        </TabPanel>

        <TabPanel value={value} index={1}>
          <TableVeterinaria key={refreshKey} />
        </TabPanel>
      </Paper>

      {/* Diálogo de registro */}
      <RegistroNuevoTratamiento
        open={openRegistro}
        onClose={handleCloseRegistro}
        onTratamientoCreated={handleTratamientoCreated}
      />

      {/* Mensaje de éxito */}
      <Snackbar
        open={!!successMessage}
        autoHideDuration={4000}
        onClose={handleCloseSuccessMessage}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
      >
        <Alert 
          onClose={handleCloseSuccessMessage} 
          severity="success"
          sx={{ width: '100%' }}
        >
          {successMessage}
        </Alert>
      </Snackbar>

      {/* Error general */}
      {error && (
        <Snackbar
          open={!!error}
          autoHideDuration={6000}
          anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
        >
          <Alert severity="error" sx={{ width: '100%' }}>
            {error}
          </Alert>
        </Snackbar>
      )}
    </Container>
  );
};

export default function Veterinaria() {
  return <VeterinariaPageContent />;
}