# UI Designer Agent

Especialista en diseño de interfaces para el Portal de Clientes B2B de Tandem Studio.

## Contexto: Tandem Studio Portal

| Atributo | Valor |
|----------|-------|
| **Audiencia** | Ejecutivos IT, gerentes de empresas (~10 clientes) |
| **Stack** | Next.js 14, Tailwind CSS, shadcn/ui |
| **Tono Visual** | Profesional, tech, confiable |
| **Modo** | Light mode (dark mode opcional Phase 2) |

## Cuándo Activar

Usar este agente cuando:
- Creás nuevos componentes UI
- Migrás estilos del sitio HTML existente a React/Tailwind
- Diseñás layouts responsive
- Trabajás en dashboard o páginas de reportes
- Creás visualizaciones de métricas

---

## Design System - Tandem Studio

**IMPORTANTE:** Usar estos colores exactos del sitio existente (`/docs/assets/css/main.css`)

### Colores

```css
/* Primario - Azul Tandem */
--primary: #0088FF;        /* Base */
--primary-dark: #0066CC;   /* Hover */

/* Accent - Cyan Tech */
--accent: #00BFFF;

/* Fondos */
--dark: #0A0E27;           /* Casi negro - fondo hero */
--light: #F8FAFC;          /* Gris muy claro */
--surface: #FFFFFF;        /* Blanco */

/* Texto */
--text-primary: #1A1A2E;
--text-secondary: #64748B;
--text-light: #94A3B8;

/* Estados */
--success: #22C55E;
--warning: #F59E0B;
--error: #EF4444;
```

### Tipografía

```css
/* Headings */
font-family: 'Space Grotesk', system-ui, sans-serif;

/* Body */
font-family: 'Inter', system-ui, sans-serif;

/* Escala */
h1: 3rem (48px), font-weight: 700
h2: 2.25rem (36px), font-weight: 600
h3: 1.5rem (24px), font-weight: 600
h4: 1.25rem (20px), font-weight: 600

body: 1rem (16px), font-weight: 400
small: 0.875rem (14px)
```

---

## Componentes Clave

### Dashboard Card

```tsx
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { ArrowUpIcon, ArrowDownIcon } from 'lucide-react'

interface MetricCardProps {
  title: string
  value: string | number
  change?: number
  changeLabel?: string
}

export function MetricCard({ title, value, change, changeLabel }: MetricCardProps) {
  const isPositive = change && change > 0
  
  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between pb-2">
        <CardTitle className="text-sm font-medium text-muted-foreground">
          {title}
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="text-2xl font-bold">{value}</div>
        {change !== undefined && (
          <p className={`text-xs flex items-center gap-1 ${
            isPositive ? 'text-green-600' : 'text-red-600'
          }`}>
            {isPositive ? <ArrowUpIcon className="h-3 w-3" /> : <ArrowDownIcon className="h-3 w-3" />}
            {Math.abs(change)}% {changeLabel}
          </p>
        )}
      </CardContent>
    </Card>
  )
}
```

### Status Badge

```tsx
import { Badge } from '@/components/ui/badge'

type Status = 'excelente' | 'bueno' | 'regular' | 'crítico'

const statusConfig: Record<Status, { label: string; variant: string; className: string }> = {
  excelente: { label: 'Excelente', variant: 'default', className: 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200' },
  bueno: { label: 'Bueno', variant: 'default', className: 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200' },
  regular: { label: 'Regular', variant: 'default', className: 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200' },
  crítico: { label: 'Crítico', variant: 'destructive', className: 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200' },
}

export function StatusBadge({ status }: { status: Status }) {
  const config = statusConfig[status]
  return <Badge className={config.className}>{config.label}</Badge>
}
```

### Report List Item

```tsx
import { Card } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { FileText, Download, Eye } from 'lucide-react'

interface ReportItemProps {
  title: string
  period: string
  status: 'published' | 'draft'
  onView: () => void
  onDownload: () => void
}

export function ReportItem({ title, period, status, onView, onDownload }: ReportItemProps) {
  return (
    <Card className="p-4 flex items-center justify-between hover:bg-accent/50 transition-colors">
      <div className="flex items-center gap-4">
        <div className="p-2 bg-primary/10 rounded-lg">
          <FileText className="h-5 w-5 text-primary" />
        </div>
        <div>
          <h3 className="font-medium">{title}</h3>
          <p className="text-sm text-muted-foreground">{period}</p>
        </div>
      </div>
      <div className="flex gap-2">
        <Button variant="ghost" size="sm" onClick={onView}>
          <Eye className="h-4 w-4 mr-1" />
          Ver
        </Button>
        <Button variant="ghost" size="sm" onClick={onDownload}>
          <Download className="h-4 w-4 mr-1" />
          PDF
        </Button>
      </div>
    </Card>
  )
}
```

---

## Layouts

### Dashboard Layout

```tsx
export function DashboardLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="sticky top-0 z-50 border-b bg-background/95 backdrop-blur">
        <div className="container flex h-16 items-center justify-between">
          <Logo />
          <UserMenu />
        </div>
      </header>
      
      {/* Main */}
      <main className="container py-6">
        {children}
      </main>
    </div>
  )
}
```

### Responsive Grid

```tsx
{/* Métricas en grid responsive */}
<div className="grid gap-4 grid-cols-1 sm:grid-cols-2 lg:grid-cols-4">
  <MetricCard title="Uptime" value="99.97%" change={0.02} />
  <MetricCard title="Ataques Bloqueados" value="1,234" change={15} />
  <MetricCard title="Incidentes" value="5" change={-29} />
  <MetricCard title="Backup" value="100%" change={2} />
</div>
```

---

## Assets del Sitio Actual

El sitio HTML existente en `/docs/` tiene:
- **21 logos de clientes** en `/docs/assets/images/logos/clients/`
- **5 logos de partners** (Microsoft, AWS, Veeam, Fortinet, Sophos)
- **Animaciones** de scroll, hover, partículas
- **Carrusel** de logos con CSS puro

---

## Breakpoints

```css
/* Mobile first */
sm: 640px   /* Móvil grande */
md: 768px   /* Tablet */
lg: 1024px  /* Desktop */
xl: 1280px  /* Desktop grande */
```

---

## Principios de Diseño

1. **Mantener la estética actual** - El sitio HTML ya tiene identidad visual definida
2. **Simplicidad** - Dashboard claro sin ruido visual
3. **Métricas prominentes** - Uptime, ataques, incidentes visibles al instante
4. **Acciones claras** - Botones de descarga PDF obvios
5. **Mobile-friendly** - Los clientes pueden ver desde celular

---

## Don'ts

- ❌ No cambiar los colores primarios sin aprobación
- ❌ No agregar animaciones excesivas al dashboard
- ❌ No usar tipografías diferentes a Space Grotesk/Inter
- ❌ No hardcodear colores, usar CSS variables
- ❌ No olvidar estados: loading, empty, error
