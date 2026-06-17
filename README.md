# AI Fitness Planner

Aplicación de fitness con inteligencia artificial para generar rutinas de entrenamiento y planes de nutrición personalizados.

## Características

- Generación de rutinas con IA basadas en objetivos personales
- Reproductor interactivo de entrenamiento con timer
- Plan de nutrición personalizado
- Seguimiento de progreso con gráficas
- Biblioteca de ejercicios con instrucciones detalladas
- Diseño responsive y moderno

## Stack Tecnológico

- **Framework**: Next.js 16 (App Router)
- **UI**: React 19, TypeScript
- **Estilos**: Tailwind CSS v4
- **Componentes**: shadcn/ui
- **Estado Global**: Zustand
- **Gráficas**: Recharts
- **Iconos**: Lucide React

## Arquitectura

La aplicación sigue una **arquitectura en capas**:

\`\`\`
Pages (Rutas) → Components (UI) → Hooks (Lógica) → 
Stores (Estado) → Services (API) → Types (Contratos)
\`\`\`

### Estructura de Carpetas

\`\`\`
app/          # Páginas Next.js
components/   # Componentes reutilizables
hooks/        # Hooks personalizados
lib/
  ├── services/  # API y mock data
  ├── store/     # Zustand stores
  └── types/     # TypeScript types
docs/         # Documentación
\`\`\`

## Inicio Rápido

### Instalación

\`\`\`bash
npm install
\`\`\`

### Desarrollo (Sin Backend)

\`\`\`bash
npm run dev
\`\`\`

La aplicación funcionará con datos mock automáticamente.

### Desarrollo (Con Backend)

1. Crear archivo `.env.local`:

\`\`\`bash
VITE_API_URL=http://localhost:8000/api
\`\`\`

2. Iniciar desarrollo:

\`\`\`bash
npm run dev
\`\`\`

3. Abrir [http://localhost:3000](http://localhost:3000)

## Usuario de Prueba

En modo mock (sin backend):

\`\`\`
Email: demo@fitness.com
Password: (cualquier contraseña)
\`\`\`

## Documentación

- **Guía Rápida**: `docs/GUIA_RAPIDA.md`
- **Arquitectura Completa**: `docs/ARQUITECTURA_FRONTEND.md`

## Variables de Entorno

\`\`\`bash
# Backend API URL (opcional)
NEXT_PUBLIC_API_URL=

# Si está vacía, la app usa mock data automáticamente
\`\`\`

Ver `.env.example` para más detalles.

## Scripts

\`\`\`bash
npm run dev      # Desarrollo
npm run build    # Build de producción
npm start        # Servidor de producción
npm run lint     # Linting
\`\`\`

## Características Principales

### Autenticación
- Login y registro de usuarios
- Perfil personalizado con métricas
- Objetivos y preferencias

### Rutinas de Entrenamiento
- Generación con IA basada en preferencias
- Biblioteca de 20+ ejercicios
- Player interactivo con timer
- Control de sets y descansos
- Instrucciones paso a paso

### Nutrición
- Plan personalizado con IA
- Comidas balanceadas por macros
- Recetas con ingredientes e instrucciones
- Objetivos calóricos personalizados

### Progreso
- Seguimiento de peso y medidas
- Gráficas de evolución
- Historial completo
- Dashboard con estadísticas

## Próximos Pasos

1. Desarrollar backend según contratos en documentación
2. Integrar IA para generación de contenido
3. Agregar videos de ejercicios
4. Implementar sistema de logros
5. Agregar funcionalidades sociales

## Integración con Backend

El backend debe implementar los endpoints definidos en `docs/ARQUITECTURA_FRONTEND.md`.

Endpoints principales:
- `/auth/*` - Autenticación
- `/workouts/*` - Rutinas
- `/exercises/*` - Ejercicios
- `/nutrition/*` - Nutrición
- `/progress/*` - Progreso

Ver documentación completa para detalles de cada endpoint.

## Contribución

1. Fork el proyecto
2. Crear rama feature (`git checkout -b feature/AmazingFeature`)
3. Commit cambios (`git commit -m 'Add AmazingFeature'`)
4. Push a la rama (`git push origin feature/AmazingFeature`)
5. Abrir Pull Request

## Licencia

MIT

## Contacto

Para soporte o preguntas, revisar la documentación en `docs/`.

---

**Versión**: 1.0.0  
**Stack**: Next.js 16 | React 19 | TypeScript | Zustand | Tailwind CSS
