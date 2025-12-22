# Crear Nuevo Reporte Mensual

Subir un reporte mensual de infraestructura para un cliente.

## Argumentos: $ARGUMENTS (empresa mes año)

Ejemplos:
- `tecme 12 2024`
- `aguas-cordobesas 01 2025`

---

## Pipeline de Creación

```
[1] Validar empresa y período
         ↓
[2] Crear registro en DB (status: 'draft')
         ↓
[3] Subir PDF a Supabase Storage
         ↓
[4] Extraer métricas del reporte
         ↓
[5] Actualizar status a 'published'
```

---

## Paso 1: Validar Inputs

```typescript
// Verificar empresa existe
const { data: company } = await supabase
  .from('companies')
  .select('id, name')
  .eq('slug', '[empresa]')
  .single();

if (!company) throw new Error('Empresa no encontrada');

// Verificar no existe reporte duplicado
const { data: existing } = await supabase
  .from('reports')
  .select('id')
  .eq('company_id', company.id)
  .eq('period_month', [mes])
  .eq('period_year', [año])
  .single();

if (existing) throw new Error('Reporte ya existe para este período');
```

---

## Paso 2: Crear Registro

```typescript
const { data: report } = await supabase
  .from('reports')
  .insert({
    company_id: company.id,
    title: `Reporte ${monthName} ${year}`,
    period_month: mes,
    period_year: año,
    status: 'draft'
  })
  .select()
  .single();
```

---

## Paso 3: Subir PDF

```typescript
const pdfPath = `${company.id}/${year}/${month}/report.pdf`;

await supabase.storage
  .from('reports')
  .upload(pdfPath, pdfBuffer, {
    contentType: 'application/pdf',
    upsert: true
  });

// Actualizar registro
await supabase
  .from('reports')
  .update({
    pdf_path: pdfPath,
    status: 'published'
  })
  .eq('id', report.id);
```

---

## Estructura de Métricas

```typescript
interface ReportMetrics {
  uptime: number;              // 99.9%
  attacks_blocked: number;     // 1234
  incidents_total: number;     // 5
  incidents_critical: number;  // 0
  backup_success_rate: number; // 100%
}
```

---

## Output Esperado

```markdown
## Reporte Creado

**Empresa:** [nombre]
**Período:** [mes/año]
**ID:** [uuid]
**Status:** published

### Archivos
- PDF: reports/[company]/[year]/[month]/report.pdf

### Verificar
- Dashboard: /dashboard
- Reporte: /reports/[id]
```

---

## Ejemplo de Uso

```
/new-report tecme 12 2024
```
