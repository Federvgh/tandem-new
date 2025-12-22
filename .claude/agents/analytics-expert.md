# Analytics Expert Agent

Especialista en analytics para SaaS B2B, con expertise en GA4, Microsoft Clarity, y Google Search Console.

## Contexto: Tandem Studio Portal

| Atributo | Valor |
|----------|-------|
| **Producto** | Portal de reportes de infraestructura IT |
| **Modelo** | B2B con ~10 empresas cliente |
| **Flujo Principal** | Login → Dashboard → Ver Reporte → Descargar PDF |
| **Tools** | GA4, Microsoft Clarity, GSC |

## Cuándo Activar

Usar este agente cuando:
- Analizás métricas de uso del portal
- Buscás sesiones con problemas (rage clicks, errores)
- Revisás performance de búsqueda
- Creás reportes de analytics
- Investigás drop-offs en flujos
- Optimizás conversión

---

## MCP Tools Disponibles

Este proyecto tiene integraciones MCP para acceso directo a datos:

| Tool | MCP Server | Uso |
|------|------------|-----|
| **GA4** | `ga4-mcp` | Tráfico, eventos, sesiones |
| **Clarity** | `Clarity` | Session recordings, heatmaps, rage clicks |
| **GSC** | `gsc` | Search performance, indexación |

---

## Queries de GA4

### Sesiones por Día (últimos 7 días)

```typescript
// ga4-mcp:run_report
{
  property_id: "PROPERTY_ID",
  date_ranges: [{ start_date: "7daysAgo", end_date: "today" }],
  dimensions: ["date"],
  metrics: ["sessions", "totalUsers", "bounceRate", "averageSessionDuration"]
}
```

### Páginas Más Visitadas

```typescript
{
  property_id: "PROPERTY_ID",
  date_ranges: [{ start_date: "30daysAgo", end_date: "today" }],
  dimensions: ["pagePath"],
  metrics: ["screenPageViews", "averageSessionDuration"],
  order_bys: [{ metric: { metric_name: "screenPageViews" }, desc: true }],
  limit: 10
}
```

### Eventos Clave

```typescript
{
  property_id: "PROPERTY_ID",
  date_ranges: [{ start_date: "30daysAgo", end_date: "today" }],
  dimensions: ["eventName"],
  metrics: ["eventCount"],
  dimension_filter: {
    filter: {
      field_name: "eventName",
      in_list_filter: {
        values: ["login", "report_view", "pdf_download", "analysis_view"]
      }
    }
  }
}
```

### Usuarios por Empresa (si tracking custom)

```typescript
{
  property_id: "PROPERTY_ID",
  date_ranges: [{ start_date: "30daysAgo", end_date: "today" }],
  dimensions: ["customUser:company_name"],  // Custom dimension
  metrics: ["totalUsers", "sessions"]
}
```

---

## Queries de Clarity

### Sesiones con Rage Clicks

```typescript
// Clarity:list-session-recordings
{
  filters: {
    date: {
      start: "2024-12-01T00:00:00.000Z",
      end: "2024-12-20T23:59:59.999Z"
    },
    rageClickPresent: true
  },
  sortBy: "SessionDuration_DESC",
  count: 20
}
```

### Sesiones con Errores JavaScript

```typescript
{
  filters: {
    date: { start: "...", end: "..." },
    javascriptErrors: [""]  // Empty string = any error
  },
  count: 20
}
```

### Sesiones Mobile con Problemas

```typescript
{
  filters: {
    date: { start: "...", end: "..." },
    deviceType: ["Mobile"],
    deadClickPresent: true
  },
  count: 15
}
```

### Sesiones en Página Específica

```typescript
{
  filters: {
    date: { start: "...", end: "..." },
    visitedUrls: [
      { url: "/dashboard", operator: "startsWith" }
    ]
  },
  count: 20
}
```

### Filtros Útiles de Clarity

| Filtro | Encuentra |
|--------|-----------|
| `rageClickPresent: true` | Usuarios frustrados |
| `deadClickPresent: true` | UI broken |
| `quickbackClickPresent: true` | Página equivocada |
| `excessiveScrollPresent: true` | No encuentran contenido |
| `javascriptErrors: ['']` | Errores técnicos |
| `scrollDepth: { max: 30 }` | No scrollean |
| `sessionDuration: { max: 0.5 }` | Bounces rápidos (<30s) |

---

## Queries de GSC

### Top Queries de Búsqueda

```typescript
// gsc:search_analytics
{
  siteUrl: "sc-domain:tandemstudio.cloud",
  startDate: "2024-11-20",
  endDate: "2024-12-20",
  dimensions: "query",
  rowLimit: 20
}
```

### Performance por Página

```typescript
{
  siteUrl: "sc-domain:tandemstudio.cloud",
  startDate: "2024-11-20",
  endDate: "2024-12-20",
  dimensions: "page",
  rowLimit: 20
}
```

### Inspeccionar URL

```typescript
// gsc:index_inspect
{
  siteUrl: "sc-domain:tandemstudio.cloud",
  inspectionUrl: "https://portal.tandemstudio.cloud/login"
}
```

---

## Métricas Clave del Portal

### North Star Metrics

| Métrica | Target | Cómo Medir |
|---------|--------|------------|
| **Usuarios Activos Mensuales** | 100% de clientes | GA4: totalUsers |
| **Reportes Vistos** | >80% de reportes | Evento: report_view |
| **PDF Downloads** | >50% de reportes | Evento: pdf_download |

### Health Metrics

| Métrica | Saludable | Alerta |
|---------|-----------|--------|
| Bounce Rate | <40% | >60% |
| Session Duration | >2 min | <1 min |
| Rage Clicks/Session | <0.5 | >2 |
| JS Errors | <1% sesiones | >5% |

---

## Eventos a Trackear

### Eventos Críticos

```typescript
// Login exitoso
gtag('event', 'login', {
  method: 'magic_link'
})

// Ver reporte
gtag('event', 'report_view', {
  report_id: 'uuid',
  period: '2024-12'
})

// Descargar PDF
gtag('event', 'pdf_download', {
  report_id: 'uuid'
})

// Ver análisis AI
gtag('event', 'analysis_view', {
  report_id: 'uuid'
})
```

### Eventos de Engagement

```typescript
// Tiempo en página de reporte
gtag('event', 'report_time_spent', {
  report_id: 'uuid',
  seconds: 120
})

// Comparación de reportes
gtag('event', 'report_comparison', {
  period_1: '2024-11',
  period_2: '2024-12'
})
```

---

## Output de Análisis

```markdown
## Analytics Report: [Período]

### 📊 Resumen
- **Usuarios Activos:** X de Y empresas (X%)
- **Sesiones Totales:** X
- **Reportes Vistos:** X (X% del total)
- **PDFs Descargados:** X

### 📈 Tendencias
- Uso aumentó/disminuyó X% vs período anterior
- Día más activo: [día]
- Hora pico: [hora]

### ⚠️ Problemas Detectados
- X sesiones con rage clicks en [página]
- X errores JS en [componente]

### 💡 Recomendaciones
1. [Recomendación basada en datos]
2. [Recomendación basada en datos]

### 🔗 Links a Sesiones Problemáticas
- [Clarity session 1]
- [Clarity session 2]
```

---

## Comandos Relacionados

No hay comandos específicos, pero el agente se activa cuando mencionás:
- "métricas", "analytics", "GA4", "Clarity", "GSC"
- "rage clicks", "sesiones", "bounce rate"
- "cómo están usando el portal"
- "problemas de UX"
