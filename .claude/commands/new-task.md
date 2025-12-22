# Task Analysis & Planning

Analizar una tarea y crear un plan de implementación estructurado.

## Tarea: $ARGUMENTS

---

## Framework de Análisis

### 1. Clasificación de Tarea

| Tipo | Descripción |
|------|-------------|
| Bug Fix | Corrección de error existente |
| New Feature | Nueva funcionalidad |
| Refactor | Mejora de código sin cambiar funcionalidad |
| Security | Fix de seguridad |
| Performance | Optimización de rendimiento |
| UI/UX | Mejora de interfaz |
| Integration | Integración con servicio externo |
| Documentation | Documentación |

### 2. Evaluación de Complejidad

| Tamaño | Tiempo | Criterios |
|--------|--------|-----------|
| **S** | 1-2h | Archivo único, solución clara |
| **M** | Medio día | 2-5 archivos, scope definido |
| **L** | 1-3 días | Múltiples sistemas, tests necesarios |
| **XL** | 1+ semana | Cambios de arquitectura |

### 3. Áreas Afectadas

Marcar qué áreas impacta la tarea:

- [ ] **Auth** (`lib/supabase/`) - Autenticación, sesiones
- [ ] **Database** (Supabase MCP) - Schema, RLS
- [ ] **API Routes** (`app/api/`) - Endpoints
- [ ] **UI Components** (`components/`) - Interfaz
- [ ] **Reports** - PDF storage y visualización
- [ ] **Storage** - Supabase Storage

### 4. Dependencias

- ¿APIs externas afectadas?
- ¿Migraciones de DB necesarias?
- ¿Variables de entorno nuevas?
- ¿Feature flags necesarios?

---

## Output: Plan de Implementación

```markdown
## Tarea: [Nombre]

**Tipo:** [Clasificación]
**Tamaño:** [S/M/L/XL]
**Prioridad:** [Crítica/Alta/Media/Baja]

### Archivos a Modificar
- [ ] `path/to/file.ts` - [qué cambia]
- [ ] ...

### Pasos de Implementación
1. [ ] Paso 1
2. [ ] Paso 2
3. [ ] ...

### Plan de Testing
- [ ] Test manual: [qué probar]
- [ ] Tests unitarios: [sí/no]
- [ ] Tests E2E: [sí/no]

### Riesgos y Mitigaciones
- Riesgo: [descripción]
  - Mitigación: [plan]

### Definition of Done
- [ ] Código implementado
- [ ] Tests pasan
- [ ] Lint pasa
- [ ] Deployed a preview
- [ ] Documentación actualizada (si aplica)
```

---

## Ejemplos de Análisis

### Ejemplo: Feature Simple (S)
```
Tarea: "Agregar botón de descarga de PDF en dashboard"

Tipo: New Feature
Tamaño: S (1-2h)
Archivos: components/dashboard/ReportCard.tsx

Pasos:
1. Agregar botón con icono de descarga
2. Llamar a endpoint de signed URL
3. Abrir PDF en nueva pestaña

Riesgos: Ninguno significativo
```

### Ejemplo: Feature Media (M)
```
Tarea: "Notificar por email cuando hay incidente crítico"

Tipo: New Feature
Tamaño: M (medio día)
Archivos:
- lib/email/templates/critical-incident.ts
- app/api/webhooks/incident/route.ts
- lib/email/send.ts

Pasos:
1. Crear template de email
2. Crear endpoint webhook
3. Integrar con Resend
4. Testear flujo completo

Riesgos:
- Rate limiting de Resend
- Mitigación: Agregar cola de emails
```

### Ejemplo: Feature Compleja (L)
```
Tarea: "Agregar filtros de reportes por período"

Tipo: New Feature
Tamaño: L (2-3 días)
Archivos:
- components/dashboard/ReportFilters.tsx
- app/dashboard/page.tsx
- lib/types.ts

Pasos:
1. Crear componente de filtros (año, mes)
2. Implementar query params en URL
3. Filtrar reportes en servidor
4. Implementar UI de filtros responsive
5. Tests unitarios
6. Tests E2E

Riesgos:
- Performance con muchos reportes
- Mitigación: Paginación, índices en DB
```

---

Ahora analiza la tarea especificada y genera el plan de implementación.
