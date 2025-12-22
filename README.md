# Tandem Studio - Portal de Clientes

> Portal web para clientes de Tandem Studio donde pueden ver y descargar sus reportes mensuales de infraestructura IT.

## Descripción

Transformación del sitio web estático de Tandem Studio en un portal interactivo donde los clientes empresariales pueden:
- Iniciar sesión con Magic Links (sin contraseñas)
- Ver su dashboard con métricas clave
- Acceder a reportes mensuales de infraestructura
- Descargar reportes en PDF

## Tech Stack

| Capa | Tecnología |
|------|------------|
| **Frontend** | Next.js 14, React, Tailwind CSS |
| **Backend** | Supabase (PostgreSQL + Auth + Storage) |
| **Deploy** | Vercel |
| **Emails** | Resend (Magic Links) |

## Estado Actual

El proyecto parte de un sitio HTML/CSS/JS estático en `/docs/` que contiene:
- Landing page de marketing
- Páginas de servicios
- Carousel de logos de clientes (~21 empresas)
- Partners: Microsoft Azure, AWS, Veeam, Fortinet, Sophos

### Design System Actual

```css
/* Colores */
--primary: #0088FF      /* Azul principal */
--accent: #00BFFF       /* Cyan tech */
--dark: #0A0E27         /* Fondo oscuro */
--light: #F8FAFC        /* Fondo claro */

/* Tipografías */
--font-heading: 'Space Grotesk'
--font-body: 'Inter'
```

## MVP - Funcionalidades

### Para Clientes
- [ ] Login con Magic Link (email)
- [ ] Dashboard con métricas hero (uptime, ataques bloqueados, incidentes, backup)
- [ ] Lista de reportes por mes
- [ ] Vista de reporte individual
- [ ] Descarga de PDF

### Para Admin (Santiago)
- [ ] Panel de administración
- [ ] Crear/editar empresas cliente
- [ ] Subir reportes mensuales
- [ ] Gestionar usuarios

## Fase 2 (Futuro)
- Gráficos interactivos con tendencias
- Comparación entre meses
- Notificaciones por email cuando hay nuevo reporte
- Automatización de extracción de datos (Fortinet, Veeam, etc.)

## Estructura del Proyecto

```
/
├── docs/                    # Sitio actual (HTML estático)
│   ├── index.html          # Landing page
│   ├── assets/
│   │   ├── css/main.css    # Estilos actuales
│   │   ├── js/main.js      # JS actual
│   │   └── images/         # Logos e imágenes
│   └── es/                  # Páginas en español
│
├── .claude/
│   ├── commands/            # Slash commands
│   └── agents/              # Agent definitions
│
└── [PRÓXIMO: app Next.js]
```

## Quick Start

```bash
# Clonar
git clone [repo]
cd tandem-new

# Ver sitio actual (estático)
open docs/index.html

# [PRÓXIMO] Instalar dependencias Next.js
pnpm install

# [PRÓXIMO] Configurar variables de entorno
cp .env.example .env.local

# [PRÓXIMO] Iniciar desarrollo
pnpm dev
```

## Variables de Entorno (Requeridas)

```env
# Supabase
NEXT_PUBLIC_SUPABASE_URL=
NEXT_PUBLIC_SUPABASE_ANON_KEY=
SUPABASE_SERVICE_ROLE_KEY=

# Resend (emails)
RESEND_API_KEY=

# App
NEXT_PUBLIC_APP_URL=http://localhost:3000
```

## Clientes Actuales

El portal servirá a ~21 empresas cliente de Tandem Studio, incluyendo:
- Bio4, Boiero, Bolsa de Cereales Córdoba
- Grupo Budeguer, Hamilton, Lorenzati
- Tecme, Aguas Cordobesas, Grupo Edisur
- Y más...

## Equipo

- **Santiago** - Admin/Owner de Tandem Studio
- **Fede** - Desarrollo backend y mantenimiento

---

© 2025 Tandem Studio | transparency | team first | think big
