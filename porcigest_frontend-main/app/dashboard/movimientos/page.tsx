"use client";

import * as React from "react";
import { useState, useEffect } from "react";
import {
  Table, TableBody, TableCell, TableContainer,
  TableHead, TableRow, Paper, Typography, Box,
  TextField, Select, MenuItem, FormControl,
  InputLabel, Chip, IconButton, Pagination,
  Card, CardContent, InputAdornment, Button,
  Alert, CircularProgress, Skeleton
} from "@mui/material";
import {
  SearchRounded,
  FilterListRounded,
  RefreshRounded,
  DownloadRounded,
  PersonRounded,
  CalendarTodayRounded,
  CategoryRounded,
  TrendingUpRounded
} from "@mui/icons-material";
import { useMovimientos, MovimientoFilters } from "../../../src/hooks/useMovimientos";
import jsPDF from 'jspdf';

export default function Movimientos() {
  const [searchTerm, setSearchTerm] = useState("");
  const [filterModulo, setFilterModulo] = useState("");
  const [filterTipo, setFilterTipo] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [estadisticas, setEstadisticas] = useState<any>(null);
  const itemsPerPage = 10;

  const {
    movimientos,
    loading,
    error,
    totalPages,
    totalMovimientos,
    fetchMovimientos,
    getEstadisticas,
    getModulosDisponibles,
    getTiposDisponibles
  } = useMovimientos();

  const [modulosDisponibles, setModulosDisponibles] = useState<string[]>([]);
  const [tiposDisponibles, setTiposDisponibles] = useState<string[]>([]);

  // Función para exportar a PDF
  const exportarPDF = async () => {
    try {
      // Crear una nueva instancia de jsPDF
      const pdf = new jsPDF({
        orientation: 'landscape',
        unit: 'mm',
        format: 'a4'
      });

      const pageWidth = pdf.internal.pageSize.width;
      const pageHeight = pdf.internal.pageSize.height;
      const margin = 15;
      const usableWidth = pageWidth - (margin * 2);

      // Configurar título y encabezado
      pdf.setFontSize(18);
      pdf.setFont('helvetica', 'bold');
      pdf.text('Reporte de Movimientos - PorciGest', margin, 20);
      
      // Información del reporte
      pdf.setFontSize(10);
      pdf.setFont('helvetica', 'normal');
      const fechaActual = new Date().toLocaleDateString('es-ES', {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
      });
      pdf.text(`Fecha de generación: ${fechaActual}`, margin, 30);
      pdf.text(`Total de registros: ${totalMovimientos}`, margin, 35);
      
      // Filtros aplicados
      let filtrosTexto = 'Filtros aplicados: ';
      if (searchTerm) filtrosTexto += `Búsqueda: "${searchTerm}", `;
      if (filterModulo) filtrosTexto += `Módulo: ${filterModulo}, `;
      if (filterTipo) filtrosTexto += `Tipo: ${filterTipo}, `;
      
      if (filtrosTexto !== 'Filtros aplicados: ') {
        pdf.text(filtrosTexto.slice(0, -2), margin, 40);
      } else {
        pdf.text('Sin filtros aplicados', margin, 40);
      }

      // Configurar tabla manual
      const columnWidths = [25, 40, 25, 20, 35, 100]; // Anchos de columnas
      const headers = ['Fecha', 'Usuario', 'Módulo', 'Tipo', 'Acción', 'Descripción'];
      let currentY = 55;
      const rowHeight = 7;
      const headerHeight = 10;

      // Función para dibujar una línea horizontal
      const drawHorizontalLine = (y: number) => {
        pdf.setLineWidth(0.1);
        pdf.line(margin, y, margin + usableWidth, y);
      };

      // Función para verificar si necesitamos una nueva página
      const checkNewPage = (y: number, requiredHeight: number = 10) => {
        if (y + requiredHeight > pageHeight - margin) {
          pdf.addPage();
          return 20; // Nueva posición Y en la nueva página
        }
        return y;
      };

      // Dibujar encabezados de tabla
      currentY = checkNewPage(currentY, headerHeight);
      pdf.setFontSize(9);
      pdf.setFont('helvetica', 'bold');
      pdf.setFillColor(63, 81, 181);
      pdf.setTextColor(255, 255, 255);
      
      // Fondo del encabezado con altura adecuada
      pdf.rect(margin, currentY - 4, usableWidth, headerHeight, 'F');
      
      // Borde del encabezado
      pdf.setDrawColor(63, 81, 181);
      pdf.setLineWidth(0.5);
      pdf.rect(margin, currentY - 4, usableWidth, headerHeight, 'S');
      
      let currentX = margin + 2;
      headers.forEach((header, index) => {
        pdf.text(header, currentX, currentY + 2);
        currentX += columnWidths[index];
      });

      // Mover currentY después del encabezado
      currentY += headerHeight; // Posición correcta para las filas
      pdf.setTextColor(0, 0, 0);
      pdf.setFont('helvetica', 'normal');

      // Dibujar filas de datos
      const maxRowsPerPage = Math.floor((pageHeight - 100) / rowHeight);
      
      movimientos.forEach((mov, index) => {
        currentY = checkNewPage(currentY, rowHeight + 2);
        
        // Alternar color de fondo para filas
        if (index % 2 === 0) {
          pdf.setFillColor(248, 249, 250);
          pdf.rect(margin, currentY - 1, usableWidth, rowHeight, 'F');
        }

        const rowData = [
          mov.fecha_movimiento ? new Date(mov.fecha_movimiento).toLocaleDateString('es-ES') : 'N/A',
          (mov.usuario_nombre || 'N/A').substring(0, 25),
          (mov.modulo || 'N/A').substring(0, 15),
          (mov.tipo_movimiento || 'N/A').substring(0, 12),
          (mov.accion || 'N/A').substring(0, 20),
          (mov.descripcion || 'N/A').substring(0, 60)
        ];

        currentX = margin + 2;
        pdf.setFontSize(8);
        pdf.setTextColor(0, 0, 0);
        
        rowData.forEach((data, colIndex) => {
          // Limitar el texto que se puede mostrar en cada celda
          const maxWidth = columnWidths[colIndex] - 4;
          const textLines = pdf.splitTextToSize(data, maxWidth);
          
          // Solo mostrar la primera línea para mantener consistencia
          pdf.text(textLines[0] || '', currentX, currentY + 3);
          currentX += columnWidths[colIndex];
        });

        currentY += rowHeight;
        
        // Línea separadora muy sutil
        if (index < movimientos.length - 1) {
          pdf.setDrawColor(240, 240, 240);
          pdf.setLineWidth(0.1);
          drawHorizontalLine(currentY - 1);
        }
      });

      // Pie de página
      const totalPages = pdf.internal.getNumberOfPages();
      for (let i = 1; i <= totalPages; i++) {
        pdf.setPage(i);
        pdf.setFontSize(8);
        pdf.setTextColor(128, 128, 128);
        pdf.text(
          `Página ${i} de ${totalPages} - Generado por PorciGest`,
          margin,
          pageHeight - 10
        );
        pdf.text(
          `${new Date().toLocaleDateString('es-ES')}`,
          pageWidth - margin - 30,
          pageHeight - 10
        );
      }

      // Guardar el PDF
      const nombreArchivo = `movimientos_${new Date().toISOString().split('T')[0]}.pdf`;
      pdf.save(nombreArchivo);

    } catch (error) {
      console.error('Error generando PDF:', error);
      alert('Error al generar el PDF. Por favor, inténtelo de nuevo.');
    }
  };

  // Cargar datos iniciales
  useEffect(() => {
    const cargarDatos = async () => {
      try {
        // Cargar movimientos y opciones en paralelo
        const [, modulos, tipos, stats] = await Promise.all([
          fetchMovimientos({ page: 1, size: itemsPerPage }),
          getModulosDisponibles(),
          getTiposDisponibles(),
          getEstadisticas(30)
        ]);
        
        setModulosDisponibles(modulos);
        setTiposDisponibles(tipos);
        setEstadisticas(stats);
      } catch (error) {
        console.error('Error cargando datos iniciales:', error);
      }
    };

    cargarDatos();
  }, []);

  // Efecto para filtrar cuando cambian los parámetros
  useEffect(() => {
    const filters: MovimientoFilters = {
      page: currentPage,
      size: itemsPerPage
    };

    if (searchTerm) filters.search = searchTerm;
    if (filterModulo) filters.modulo = filterModulo;
    if (filterTipo) filters.tipo_movimiento = filterTipo;

    const timeoutId = setTimeout(() => {
      fetchMovimientos(filters);
    }, 300); // Debounce para la búsqueda

    return () => clearTimeout(timeoutId);
  }, [searchTerm, filterModulo, filterTipo, currentPage]);

  const handleRefresh = async () => {
    try {
      const [stats] = await Promise.all([
        getEstadisticas(30),
        fetchMovimientos({ 
          page: currentPage, 
          size: itemsPerPage,
          search: searchTerm || undefined,
          modulo: filterModulo || undefined,
          tipo_movimiento: filterTipo || undefined
        })
      ]);
      setEstadisticas(stats);
    } catch (error) {
      console.error('Error al actualizar:', error);
    }
  };

  const getChipColor = (tipo: string) => {
    switch (tipo) {
      case 'crear': return 'success';
      case 'editar': return 'warning';
      case 'eliminar': return 'error';
      default: return 'default';
    }
  };

  const getModuloIcon = (modulo: string) => {
    switch (modulo) {
      case 'Reproductoras': return '🐷';
      case 'Sementales': return '🐗';
      case 'Lechones': return '🐽';
      case 'Engorde': return '🥩';
      case 'Veterinaria': return '💉';
      default: return '📋';
    }
  };

  const formatearFecha = (fechaStr: string) => {
    const fecha = new Date(fechaStr);
    return {
      fecha: fecha.toLocaleDateString('es-ES'),
      hora: fecha.toLocaleTimeString('es-ES', { 
        hour: '2-digit', 
        minute: '2-digit' 
      })
    };
  };

  const usuariosUnicos = movimientos ? new Set(movimientos.map(m => m.usuario_nombre)).size : 0;

  if (error) {
    return (
      <Box sx={{ p: 3 }}>
        <Alert severity="error" sx={{ mb: 3 }}>
          Error al cargar los movimientos: {error}
        </Alert>
        <Button variant="contained" onClick={handleRefresh}>
          Reintentar
        </Button>
      </Box>
    );
  }

  return (
    <Box sx={{ p: 3 }}>
      {/* Header */}
      <Box sx={{ mb: 3 }}>
        <Typography variant="h4" fontWeight="bold" sx={{ mb: 1 }}>
          Registro de Movimientos
        </Typography>
        <Typography variant="body1" color="text.secondary">
          Control completo de todas las actividades realizadas en el sistema
        </Typography>
      </Box>

      {/* Filtros y Búsqueda */}
      <Card sx={{ mb: 3 }}>
        <CardContent>
          <Box sx={{ display: 'flex', gap: 2, flexWrap: 'wrap', alignItems: 'center' }}>
            {/* Búsqueda */}
            <TextField
              placeholder="Buscar por usuario, acción o descripción..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              sx={{ minWidth: 300, flex: 1 }}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <SearchRounded />
                  </InputAdornment>
                ),
              }}
            />

            {/* Filtro por Módulo */}
            <FormControl sx={{ minWidth: 150 }}>
              <InputLabel>Módulo</InputLabel>
              <Select
                value={filterModulo}
                label="Módulo"
                onChange={(e) => setFilterModulo(e.target.value)}
              >
                <MenuItem value="">Todos</MenuItem>
                {modulosDisponibles.map((modulo) => (
                  <MenuItem key={modulo} value={modulo}>
                    {modulo}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>

            {/* Filtro por Tipo */}
            <FormControl sx={{ minWidth: 120 }}>
              <InputLabel>Tipo</InputLabel>
              <Select
                value={filterTipo}
                label="Tipo"
                onChange={(e) => setFilterTipo(e.target.value)}
              >
                <MenuItem value="">Todos</MenuItem>
                {tiposDisponibles.map((tipo) => (
                  <MenuItem key={tipo} value={tipo}>
                    {tipo.charAt(0).toUpperCase() + tipo.slice(1)}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>

            {/* Botones de acción */}
            <IconButton 
              color="primary" 
              title="Actualizar"
              onClick={handleRefresh}
              disabled={loading}
            >
              <RefreshRounded />
            </IconButton>
            <IconButton 
              color="secondary" 
              title="Exportar" 
              onClick={exportarPDF}
              disabled={loading || movimientos.length === 0}
            >
              <DownloadRounded />
            </IconButton>
          </Box>

          {/* Estadísticas rápidas */}
          <Box sx={{ mt: 2, display: 'flex', gap: 2, flexWrap: 'wrap' }}>
            <Chip 
              icon={<CategoryRounded />} 
              label={`Total: ${totalMovimientos || 0}`} 
              variant="outlined" 
            />
            <Chip 
              icon={<PersonRounded />} 
              label={`Usuarios activos: ${usuariosUnicos}`} 
              variant="outlined" 
            />
            <Chip 
              icon={<CalendarTodayRounded />} 
              label="Últimos 30 días" 
              variant="outlined" 
              color="primary"
            />
            {estadisticas && (
              <Chip 
                icon={<TrendingUpRounded />} 
                label={`${estadisticas.total_movimientos} actividades`} 
                variant="outlined" 
                color="info"
              />
            )}
          </Box>
        </CardContent>
      </Card>

      {/* Tabla de Movimientos */}
      <TableContainer component={Paper} sx={{ boxShadow: 3 }}>
        <Table>
          <TableHead sx={{ backgroundColor: '#f5f5f5' }}>
            <TableRow>
              <TableCell sx={{ fontWeight: 'bold' }}>ID</TableCell>
              <TableCell sx={{ fontWeight: 'bold' }}>Usuario</TableCell>
              <TableCell sx={{ fontWeight: 'bold' }}>Módulo</TableCell>
              <TableCell sx={{ fontWeight: 'bold' }}>Acción</TableCell>
              <TableCell sx={{ fontWeight: 'bold' }}>Descripción</TableCell>
              <TableCell sx={{ fontWeight: 'bold' }}>Tipo</TableCell>
              <TableCell sx={{ fontWeight: 'bold' }}>Fecha</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {loading ? (
              // Skeletons mientras carga
              Array.from({ length: 5 }).map((_, index) => (
                <TableRow key={index}>
                  {Array.from({ length: 7 }).map((_, cellIndex) => (
                    <TableCell key={cellIndex}>
                      <Skeleton variant="text" width="100%" />
                    </TableCell>
                  ))}
                </TableRow>
              ))
            ) : movimientos && movimientos.length > 0 ? (
              movimientos.map((mov) => {
                const { fecha, hora } = formatearFecha(mov.fecha_movimiento);
                return (
                  <TableRow 
                    key={mov.id} 
                    sx={{ 
                      '&:hover': { backgroundColor: '#f9f9f9' },
                      '&:nth-of-type(odd)': { backgroundColor: '#fafafa' }
                    }}
                  >
                    <TableCell sx={{ fontWeight: 'bold', color: 'primary.main' }}>
                      #{mov.id}
                    </TableCell>
                    <TableCell>
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                        <PersonRounded fontSize="small" color="action" />
                        {mov.usuario_nombre}
                      </Box>
                    </TableCell>
                    <TableCell>
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                        <span>{getModuloIcon(mov.modulo)}</span>
                        {mov.modulo}
                      </Box>
                    </TableCell>
                    <TableCell sx={{ fontWeight: 'medium' }}>
                      {mov.accion}
                    </TableCell>
                    <TableCell sx={{ maxWidth: 250 }}>
                      <Typography variant="body2" color="text.secondary">
                        {mov.descripcion || 'Sin descripción'}
                      </Typography>
                    </TableCell>
                    <TableCell>
                      <Chip 
                        label={mov.tipo_movimiento.toUpperCase()} 
                        color={getChipColor(mov.tipo_movimiento) as any}
                        size="small"
                        sx={{ fontWeight: 'bold' }}
                      />
                    </TableCell>
                    <TableCell>
                      <Typography variant="body2">
                        {fecha}
                      </Typography>
                      <Typography variant="caption" color="text.secondary">
                        {hora}
                      </Typography>
                    </TableCell>
                  </TableRow>
                );
              })
            ) : (
              <TableRow>
                <TableCell colSpan={7}>
                  <Box sx={{ p: 4, textAlign: 'center' }}>
                    <Typography variant="h6" color="text.secondary">
                      No se encontraron movimientos
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      {searchTerm || filterModulo || filterTipo 
                        ? "Intenta ajustar los filtros de búsqueda"
                        : "Aún no hay actividad registrada en el sistema"
                      }
                    </Typography>
                  </Box>
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </TableContainer>

      {/* Paginación */}
      {totalPages > 1 && (
        <Box sx={{ display: 'flex', justifyContent: 'center', mt: 3 }}>
          <Pagination
            count={totalPages}
            page={currentPage}
            onChange={(_, page) => setCurrentPage(page)}
            color="primary"
            size="large"
            showFirstButton
            showLastButton
            disabled={loading}
          />
        </Box>
      )}

      {/* Loading overlay */}
      {loading && (
        <Box 
          sx={{ 
            position: 'fixed', 
            top: 0, 
            left: 0, 
            right: 0, 
            bottom: 0, 
            backgroundColor: 'rgba(255, 255, 255, 0.7)', 
            display: 'flex', 
            alignItems: 'center', 
            justifyContent: 'center',
            zIndex: 1000
          }}
        >
          <CircularProgress size={60} />
        </Box>
      )}
    </Box>
  );
}
