'use client';

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
import { useEngorde } from '../../../src/hooks/useEngorde';
import CardsEngorde from '../../ui/engorde/CardsEngorde';
import TableEngorde from '../../ui/engorde/TableEngorde';
import RegistroNuevoLote from '../../ui/engorde/RegistroNuevoLote';

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

const EngordePageContent: React.FC = () => {
  const { loading, error, obtenerLotes } = useEngorde();
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

  const handleLoteCreated = () => {
    setRefreshKey(prev => prev + 1);
    setSuccessMessage('Lote registrado exitosamente');
    obtenerLotes(); // Refrescar datos
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
              🐷 Gestión de Engorde
            </Typography>
            <Typography variant="subtitle1" color="text.secondary">
              Administra y monitorea los lotes de cerdos en proceso de engorde
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
            Nuevo Lote
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
            aria-label="tabs de gestión de engorde"
            sx={{
              '& .MuiTab-root': {
                textTransform: 'none',
                fontSize: '1rem',
                fontWeight: 500,
                '&.Mui-selected': {
                  color: '#99775C',
                },
              },
              '& .MuiTabs-indicator': {
                backgroundColor: '#99775C',
              },
            }}
          >
            <Tab 
              icon={<AssessmentIcon />} 
              label="Resumen" 
              {...a11yProps(0)}
              iconPosition="start"
            />
            <Tab 
              icon={<TableIcon />} 
              label="Lista de Lotes" 
              {...a11yProps(1)}
              iconPosition="start"
            />
          </Tabs>
        </Box>

        {/* Panel de Resumen */}
        <TabPanel value={value} index={0}>
          <CardsEngorde />
        </TabPanel>

        {/* Panel de Lista */}
        <TabPanel value={value} index={1}>
          <TableEngorde />
        </TabPanel>
      </Paper>

      {/* Diálogo de registro de nuevo lote */}
      <RegistroNuevoLote
        open={openRegistro}
        onClose={handleCloseRegistro}
        onLoteCreated={handleLoteCreated}
      />

      {/* Snackbar para mensajes de éxito */}
      <Snackbar
        open={!!successMessage}
        autoHideDuration={6000}
        onClose={handleCloseSuccessMessage}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
      >
        <Alert 
          onClose={handleCloseSuccessMessage} 
          severity="success" 
          sx={{ width: '100%' }}
        >
          {successMessage}
        </Alert>
      </Snackbar>
    </Container>
  );
};

export default EngordePageContent;
