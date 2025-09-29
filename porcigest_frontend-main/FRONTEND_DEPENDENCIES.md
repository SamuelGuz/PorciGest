# ============================================================================
# PORCIGEST FRONTEND - DOCUMENTACIÓN DE DEPENDENCIAS
# ============================================================================
# Actualizado: 29 de septiembre de 2025
# Next.js 15.5.2 + React 19 + Material-UI + TypeScript

## 📋 DEPENDENCIAS DE PRODUCCIÓN

### 🚀 **Framework Principal**
- **next**: 15.5.2
  - Framework React con SSR, routing automático y optimizaciones
  - Configurado con Turbopack para builds ultra-rápidos
  
- **react**: 19.1.0
  - Librería principal para la UI
  - Versión más reciente con nuevas características

- **react-dom**: 19.1.0
  - Renderizado de React en el DOM
  - Compatible con React 19

### 🎨 **Interfaz de Usuario (Material-UI)**
- **@mui/material**: ^7.3.2
  - Componentes de Material Design (botones, tablas, formularios, etc.)
  - Sistema de temas y estilos

- **@mui/icons-material**: ^7.3.2
  - Iconos de Material Design
  - Más de 2000 iconos SVG disponibles

- **@mui/x-date-pickers**: ^8.12.0
  - Selectores de fecha avanzados
  - Calendarios y date pickers para formularios

- **@emotion/react**: ^11.14.0
  - Motor de CSS-in-JS usado por Material-UI
  - Estilos dinámicos y temas

- **@emotion/styled**: ^11.14.1
  - Componentes estilizados con Emotion
  - API styled-components para MUI

### 🌐 **Comunicación HTTP**
- **axios**: ^1.12.2
  - Cliente HTTP para APIs REST
  - Interceptores, timeout, manejo de errores
  - Configurado para comunicarse con FastAPI backend

### 📅 **Manejo de Fechas**
- **dayjs**: ^1.11.18
  - Librería ligera para manipulación de fechas
  - Alternativa moderna a Moment.js
  - Usado con MUI Date Pickers

### 📄 **Exportación PDF**
- **jspdf**: ^3.0.3
  - Generación de PDFs del lado del cliente
  - Usado para exportar reportes de movimientos

- **html2canvas**: ^1.4.1
  - Captura de elementos HTML como imágenes
  - Complemento para exportaciones avanzadas

### 🎠 **Componentes Adicionales**
- **react-responsive-carousel**: ^3.2.23
  - Carrusel responsive para imágenes
  - Usado en páginas de presentación

## 🛠️ DEPENDENCIAS DE DESARROLLO

### 📝 **TypeScript**
- **typescript**: ^5
  - Tipado estático para JavaScript
  - Mejora la experiencia de desarrollo

- **@types/node**: ^20
  - Tipos de TypeScript para Node.js

- **@types/react**: ^19
  - Tipos de TypeScript para React 19

- **@types/react-dom**: ^19
  - Tipos de TypeScript para React DOM

- **@types/jspdf**: ^1.3.3
  - Tipos de TypeScript para jsPDF

### 🎨 **Estilos**
- **tailwindcss**: ^4
  - Framework CSS utility-first
  - Clases utilitarias para diseño rápido

- **@tailwindcss/postcss**: ^4
  - Plugin PostCSS para Tailwind
  - Procesamiento automático de CSS

## 🚀 SCRIPTS DISPONIBLES

```bash
# Desarrollo con hot reload y Turbopack
npm run dev

# Build de producción optimizado
npm run build

# Servidor de producción
npm run start
```

## 📦 INSTALACIÓN

### **Instalación completa:**
```bash
cd porcigest_frontend-main
npm install
```

### **Solo dependencias de producción:**
```bash
npm install --production
```

### **Agregar nueva dependencia:**
```bash
npm install nombre-paquete
```

## 🏗️ ARQUITECTURA FRONTEND

### **Estructura de carpetas:**
```
app/
├── dashboard/          # Páginas principales del sistema
│   ├── movimientos/   # Módulo de auditoría
│   ├── reproductoras/ # Gestión de cerdas
│   ├── sementales/    # Gestión de machos
│   ├── lechones/      # Gestión de crías
│   └── engorde/       # Gestión de engorde
├── login/             # Autenticación
├── registro/          # Registro de usuarios
└── ui/               # Componentes reutilizables

src/
├── components/        # Componentes React
├── hooks/            # Custom hooks para APIs
├── services/         # Configuración de APIs
└── types/           # Tipos TypeScript
```

### **Características implementadas:**
- ✅ **Autenticación JWT** con localStorage
- ✅ **CRUD completo** para todos los módulos
- ✅ **Hooks personalizados** para manejo de estado
- ✅ **Exportación PDF** de reportes
- ✅ **Filtros y búsquedas** avanzadas
- ✅ **Interfaz responsive** con Material-UI
- ✅ **Manejo de errores** y loading states
- ✅ **TypeScript** para type safety
- ✅ **Interceptores HTTP** para tokens automáticos

## 🌐 COMUNICACIÓN CON BACKEND

### **API Base URL:**
```javascript
// src/services/api.js
baseURL: 'http://localhost:8000'
```

### **Autenticación:**
- Headers automáticos con JWT token
- Refresh automático en caso de expiración
- Redirección automática al login si no autenticado

### **Endpoints principales:**
- `/auth/login` - Autenticación
- `/reproductoras/` - CRUD reproductoras
- `/sementales/` - CRUD sementales  
- `/lechones/` - CRUD lechones
- `/engorde/` - CRUD engorde
- `/veterinaria/` - CRUD tratamientos
- `/movimientos/` - Sistema de auditoría

## 📱 COMPATIBILIDAD

- **React**: 19.1.0+
- **Node.js**: 18+ recomendado
- **Navegadores**: Chrome 90+, Firefox 88+, Safari 14+
- **TypeScript**: 5.0+

## 🔧 CONFIGURACIÓN DE DESARROLLO

### **Variables de entorno (.env.local):**
```env
NEXT_PUBLIC_API_URL=http://localhost:8000
```

### **Configuración de Material-UI:**
- Tema personalizado en `app/theme/`
- Colores corporativos configurados
- Responsive breakpoints optimizados

## 📊 BUNDLE SIZE (aproximado)

- **Next.js**: ~200KB
- **React 19**: ~45KB  
- **Material-UI**: ~300KB
- **Axios**: ~15KB
- **jsPDF**: ~150KB
- **Total estimado**: ~710KB (gzipped)

## 🔄 ACTUALIZACIONES RECIENTES

### v0.1.0 (29/sep/2025)
- ✅ Exportación PDF implementada
- ✅ Sistema de movimientos completo
- ✅ Hooks optimizados para mejor performance
- ✅ TypeScript configurado correctamente
- ✅ Material-UI actualizado a v7

============================================================================