
'use client';

import Image from "next/image";
import Link from "next/link";
import { 
  Box, 
  Typography, 
  Container, 
  Paper, 
  Card, 
  CardContent,
  Button,
  Chip
} from "@mui/material";
import {
  PetsRounded,
  AnalyticsRounded,
  HealthAndSafetyRounded,
  GroupsRounded,
  TrendingUpRounded,
  SecurityRounded
} from "@mui/icons-material";

export default function AboutUs() {
  const features = [
    {
      icon: <PetsRounded sx={{ fontSize: 40, color: '#99775C' }} />,
      title: "Gestión Completa",
      description: "Administra reproductoras, sementales, lechones y engorde desde una sola plataforma"
    },
    {
      icon: <HealthAndSafetyRounded sx={{ fontSize: 40, color: '#99775C' }} />,
      title: "Control Veterinario",
      description: "Registro de tratamientos, vacunas y seguimiento sanitario completo"
    },
    {
      icon: <AnalyticsRounded sx={{ fontSize: 40, color: '#99775C' }} />,
      title: "Reportes y Auditoría",
      description: "Trazabilidad total con reportes PDF y sistema de movimientos automático"
    },
    {
      icon: <TrendingUpRounded sx={{ fontSize: 40, color: '#99775C' }} />,
      title: "Optimización",
      description: "Mejora la productividad con estadísticas y análisis de rendimiento"
    },
    {
      icon: <SecurityRounded sx={{ fontSize: 40, color: '#99775C' }} />,
      title: "Seguridad",
      description: "Sistema seguro con autenticación JWT y control de usuarios"
    },
    {
      icon: <GroupsRounded sx={{ fontSize: 40, color: '#99775C' }} />,
      title: "Fácil de Usar",
      description: "Interfaz intuitiva diseñada especialmente para productores porcinos"
    }
  ];

  return (
    <Box sx={{ bgcolor: '#f5f5f5', minHeight: '100vh' }}>
      {/* Header */}
      <Container maxWidth="lg">
        <Box sx={{ py: 2, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
            <Image
              src="/logo.jpg"
              alt="Logo de PorciGest"
              width={60}
              height={60}
              className="rounded-full"
            />
            <Typography variant="h5" sx={{ fontWeight: 'bold', color: '#99775C' }}>
              PorciGest
            </Typography>
          </Box>
          
          <Box sx={{ display: 'flex', gap: 2, alignItems: 'center' }}>
            <Button 
              component={Link} 
              href="/login" 
              variant="outlined"
              sx={{ 
                borderColor: '#99775C', 
                color: '#99775C',
                '&:hover': { borderColor: '#7a6049', bgcolor: '#f9f9f9' }
              }}
            >
              Iniciar Sesión
            </Button>
            <Button 
              component={Link} 
              href="/registro" 
              variant="contained"
              sx={{ 
                bgcolor: '#99775C',
                '&:hover': { bgcolor: '#7a6049' }
              }}
            >
              Registrarse
            </Button>
          </Box>
        </Box>
      </Container>

      {/* Hero Section */}
      <Container maxWidth="lg" sx={{ py: 6 }}>
        <Paper 
          elevation={3} 
          sx={{ 
            p: 6, 
            textAlign: 'center',
            background: 'linear-gradient(135deg, #99775C 0%, #7a6049 100%)',
            color: 'white',
            borderRadius: 3
          }}
        >
          <Typography variant="h2" component="h1" gutterBottom sx={{ fontWeight: 'bold', mb: 3 }}>
            🐷 PorciGest
          </Typography>
          
          <Typography variant="h5" sx={{ mb: 3, opacity: 0.9 }}>
            Sistema Integral de Gestión Porcina
          </Typography>
          
          <Chip 
            label="Tecnología al servicio de la porcicultura" 
            sx={{ 
              bgcolor: 'rgba(255,255,255,0.2)', 
              color: 'white',
              fontSize: '1.1rem',
              px: 2,
              py: 1
            }} 
          />
        </Paper>
      </Container>

      {/* Qué es PorciGest */}
      <Container maxWidth="lg" sx={{ py: 4 }}>
        <Box sx={{ 
          display: 'flex', 
          alignItems: 'center', 
          gap: 4,
          flexDirection: { xs: 'column', md: 'row' }
        }}>
          <Box sx={{ flex: 1 }}>
            <Typography variant="h4" component="h2" gutterBottom sx={{ color: '#99775C', fontWeight: 'bold' }}>
              ¿Qué es PorciGest?
            </Typography>
            
            <Typography variant="body1" paragraph sx={{ fontSize: '1.1rem', lineHeight: 1.7 }}>
              <strong>PorciGest</strong> es una plataforma web moderna diseñada especialmente para 
              <strong> granjas porcinas</strong> que quieren llevar un control profesional y detallado 
              de todas sus operaciones.
            </Typography>
            
            <Typography variant="body1" paragraph sx={{ fontSize: '1.1rem', lineHeight: 1.7 }}>
              Imagina tener toda la información de tu granja organizada en un solo lugar: 
              desde el control de tus <strong>reproductoras y sementales</strong>, hasta el 
              seguimiento de <strong>lechones y engorde</strong>, pasando por el 
              <strong> control veterinario</strong> completo.
            </Typography>
            
            <Typography variant="body1" paragraph sx={{ fontSize: '1.1rem', lineHeight: 1.7 }}>
              Con PorciGest, olvídate de los cuadernos y planillas. Todo queda registrado 
              automáticamente con <strong>fechas, usuarios y trazabilidad completa</strong>.
            </Typography>
          </Box>
          
          <Box sx={{ flex: 1, maxWidth: '100%' }}>
            <Image
              src="/cerdo7.jpg"
              alt="Granja porcina moderna"
              width={500}
              height={350}
              className="rounded-lg shadow-lg"
              style={{ 
                width: '100%', 
                height: 'auto',
                borderRadius: '12px',
                boxShadow: '0 8px 24px rgba(0,0,0,0.12)'
              }}
            />
          </Box>
        </Box>
      </Container>

      {/* Características principales */}
      <Container maxWidth="lg" sx={{ py: 6 }}>
        <Typography 
          variant="h4" 
          component="h2" 
          textAlign="center" 
          gutterBottom 
          sx={{ color: '#99775C', fontWeight: 'bold', mb: 4 }}
        >
          ¿Para qué sirve PorciGest?
        </Typography>
        
        <Box sx={{ 
          display: 'flex', 
          flexWrap: 'wrap', 
          gap: 3,
          justifyContent: 'center'
        }}>
          {features.map((feature, index) => (
            <Box key={index} sx={{ flex: { xs: '1 1 100%', md: '1 1 45%', lg: '1 1 30%' }, maxWidth: '400px' }}>
              <Card 
                sx={{ 
                  height: '100%', 
                  transition: 'transform 0.2s',
                  '&:hover': { transform: 'translateY(-4px)', boxShadow: 3 }
                }}
              >
                <CardContent sx={{ textAlign: 'center', p: 3 }}>
                  <Box sx={{ mb: 2 }}>
                    {feature.icon}
                  </Box>
                  <Typography variant="h6" component="h3" gutterBottom sx={{ fontWeight: 'bold' }}>
                    {feature.title}
                  </Typography>
                  <Typography variant="body2" color="text.secondary" sx={{ lineHeight: 1.6 }}>
                    {feature.description}
                  </Typography>
                </CardContent>
              </Card>
            </Box>
          ))}
        </Box>
      </Container>

      {/* Beneficios */}
      <Container maxWidth="lg" sx={{ py: 6 }}>
        <Paper elevation={2} sx={{ p: 4, bgcolor: '#f9f9f9' }}>
          <Typography 
            variant="h4" 
            component="h2" 
            textAlign="center" 
            gutterBottom 
            sx={{ color: '#99775C', fontWeight: 'bold', mb: 4 }}
          >
            ¿Por qué elegir PorciGest?
          </Typography>
          
          <Box sx={{ 
            display: 'flex', 
            flexWrap: 'wrap', 
            gap: 3,
            justifyContent: 'center'
          }}>
            <Box sx={{ flex: { xs: '1 1 100%', md: '1 1 30%' }, textAlign: 'center' }}>
              <Typography variant="h6" gutterBottom sx={{ color: '#99775C', fontWeight: 'bold' }}>
                📱 Acceso desde cualquier lugar
              </Typography>
              <Typography variant="body2">
                Consulta y actualiza información desde tu computadora, tablet o móvil
              </Typography>
            </Box>
            
            <Box sx={{ flex: { xs: '1 1 100%', md: '1 1 30%' }, textAlign: 'center' }}>
              <Typography variant="h6" gutterBottom sx={{ color: '#99775C', fontWeight: 'bold' }}>
                ⏰ Ahorra tiempo
              </Typography>
              <Typography variant="body2">
                Elimina el papeleo y automatiza el registro de todas las actividades
              </Typography>
            </Box>
            
            <Box sx={{ flex: { xs: '1 1 100%', md: '1 1 30%' }, textAlign: 'center' }}>
              <Typography variant="h6" gutterBottom sx={{ color: '#99775C', fontWeight: 'bold' }}>
                📊 Toma mejores decisiones
              </Typography>
              <Typography variant="body2">
                Analiza estadísticas y reportes para optimizar tu producción
              </Typography>
            </Box>
          </Box>
        </Paper>
      </Container>

      {/* Call to Action */}
      <Container maxWidth="lg" sx={{ py: 6, textAlign: 'center' }}>
        <Typography variant="h4" gutterBottom sx={{ color: '#99775C', fontWeight: 'bold' }}>
          ¿Listo para modernizar tu granja?
        </Typography>
        
        <Typography variant="body1" paragraph sx={{ fontSize: '1.1rem', mb: 4 }}>
          Únete a los productores que ya confían en PorciGest para gestionar sus operaciones
        </Typography>
        
        <Box sx={{ display: 'flex', gap: 2, justifyContent: 'center', flexWrap: 'wrap' }}>
          <Button
            component={Link}
            href="/registro"
            variant="contained"
            size="large"
            sx={{
              bgcolor: '#99775C',
              '&:hover': { bgcolor: '#7a6049' },
              px: 4,
              py: 2,
              fontSize: '1.1rem'
            }}
          >
            Registrarse
          </Button>
          
          <Button
            component={Link}
            href="/login"
            variant="outlined"
            size="large"
            sx={{
              borderColor: '#99775C',
              color: '#99775C',
              '&:hover': { borderColor: '#7a6049', bgcolor: '#f9f9f9' },
              px: 4,
              py: 2,
              fontSize: '1.1rem'
            }}
          >
            Iniciar Sesión
          </Button>
        </Box>
      </Container>

      {/* Footer */}
      <Box sx={{ bgcolor: '#99775C', color: 'white', py: 3, mt: 4 }}>
        <Container maxWidth="lg">
          <Typography variant="body2" textAlign="center">
            © 2024 PorciGest - Sistema Integral de Gestión Porcina
          </Typography>
          <Typography variant="body2" textAlign="center" sx={{ mt: 1, opacity: 0.8 }}>
            Desarrollado con ❤️ para la porcicultura moderna
          </Typography>
        </Container>
      </Box>
    </Box>
  );
}
