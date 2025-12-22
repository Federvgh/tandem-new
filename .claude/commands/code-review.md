# Code Review

Realizar un review exhaustivo del código especificado.

## Target: $ARGUMENTS

---

## Criterios de Review

### 1. Calidad de Código

- [ ] TypeScript strict mode respetado
- [ ] Sin tipos `any` (usar tipado apropiado)
- [ ] Manejo de errores correcto
- [ ] Sin `console.log` en código de producción
- [ ] Nombres de variables/funciones claros

### 2. Convenciones del Proyecto

| Elemento | Convención | Ejemplo |
|----------|------------|---------|
| Archivos | kebab-case | `report-generator.ts` |
| Componentes | PascalCase | `ReportCard.tsx` |
| Funciones | camelCase | `generatePdf()` |
| Tipos/Interfaces | PascalCase | `type ReportData` |
| Constantes | UPPER_SNAKE | `const MAX_RETRIES` |

### 3. React Best Practices

- [ ] Server Components por defecto
- [ ] `'use client'` solo cuando es necesario
- [ ] Hooks con deps arrays correctos
- [ ] Sin re-renders innecesarios
- [ ] Keys en items de listas

### 4. Seguridad (ver `/api-protect`)

- [ ] Input validation con Zod
- [ ] Sin exposición de datos sensibles
- [ ] Auth checks en rutas protegidas
- [ ] Sin riesgos de inyección

### 5. Performance

- [ ] Sin N+1 queries
- [ ] Memoización donde corresponde
- [ ] Dynamic imports para componentes pesados
- [ ] Imágenes con next/image

### 6. Testing & Mantenibilidad

- [ ] Código testeable
- [ ] Funciones focalizadas (single responsibility)
- [ ] Lógica compleja documentada
- [ ] Sin magic numbers/strings

---

## Checks Específicos por Área

### Lib Supabase (`lib/supabase/`)

- [ ] Usa cliente correcto (browser/server/admin)
- [ ] No expone service role key
- [ ] Queries aprovechan RLS
- [ ] Tipos generados actualizados

### Lib Reports (`lib/reports/`)

- [ ] Templates Handlebars válidos
- [ ] Manejo de datos faltantes
- [ ] Escape de HTML donde corresponde

### Lib Anthropic (`lib/anthropic/`)

- [ ] Prompts no hardcodeados (usa constantes)
- [ ] Manejo de errores de API
- [ ] Rate limiting considerado
- [ ] Respuestas parseadas correctamente

### Components (`components/`)

- [ ] Responsive design
- [ ] Dark mode support (si aplica)
- [ ] Loading states
- [ ] Error states
- [ ] Accesibilidad básica

### API Routes (`app/api/`)

- [ ] Auth verificado
- [ ] Input validado
- [ ] HTTP status codes correctos
- [ ] Errores no exponen internals

---

## Output del Review

```markdown
## Code Review: [archivo/feature]

### Resumen
[1-2 oraciones de overview]

### Issues

#### 🔴 Críticos (deben arreglarse)
- **Línea X:** [issue]
  ```typescript
  // Actual
  [código malo]

  // Sugerido
  [código bueno]
  ```

#### 🟡 Sugerencias (deberían arreglarse)
- **Línea X:** [sugerencia]

#### 💭 Nitpicks (opcionales)
- [mejoras menores]

### ✅ Lo que está bien
- [feedback positivo]

### Veredicto Final
- [ ] ✅ Aprobar
- [ ] ✅ Aprobar con sugerencias
- [ ] ❌ Requiere cambios
```

---

## Ejemplos de Issues Comunes

### TypeScript
```typescript
// ❌ Mal
const data: any = await fetch(...)

// ✅ Bien
interface ApiResponse {
  reports: Report[]
}
const data: ApiResponse = await fetch(...).then(r => r.json())
```

### React
```typescript
// ❌ Mal - re-render en cada render
<Button onClick={() => handleClick(id)} />

// ✅ Bien - callback estable
const handleButtonClick = useCallback(() => {
  handleClick(id)
}, [id])
<Button onClick={handleButtonClick} />
```

### Supabase
```typescript
// ❌ Mal - N+1 queries
for (const id of reportIds) {
  const { data } = await supabase.from('reports').select().eq('id', id)
}

// ✅ Bien - single query
const { data } = await supabase
  .from('reports')
  .select()
  .in('id', reportIds)
```

### Error Handling
```typescript
// ❌ Mal - silencia error
try {
  await riskyOperation()
} catch (e) {}

// ✅ Bien - maneja o propaga
try {
  await riskyOperation()
} catch (error) {
  console.error('Operation failed:', error)
  throw new AppError('Could not complete operation', { cause: error })
}
```

---

Ahora revisa el código especificado.
