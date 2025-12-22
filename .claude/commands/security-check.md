# Security Check Pre-Commit

Verificación de seguridad antes de commit/push.

---

## Checks Automáticos

### 1. Secrets en Código

```bash
# Buscar API keys y tokens hardcodeados
grep -rn --include="*.ts" --include="*.tsx" --include="*.js" \
  -E "(sk-ant-|sk_live_|sk_test_|eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9|service_role|SUPABASE_SERVICE_ROLE|re_[A-Za-z0-9]{20,})" \
  portal/src/

# Resultado esperado: vacío (sin matches)
```

### 2. Archivos Sensibles en Git

```bash
# Verificar que .env* NO está staged
git diff --cached --name-only | grep -E "\.env|\.env\.local|\.env\.production"

# Resultado esperado: vacío
```

### 3. .gitignore Correcto

```bash
# Verificar que .gitignore incluye archivos sensibles
cat .gitignore | grep -E "\.env|node_modules|\.next"

# Debe mostrar:
# .env*
# .env.local
# node_modules
# .next
```

### 4. Console.log con Datos Sensibles

```bash
# Buscar console.log que puedan exponer datos
grep -rn --include="*.ts" --include="*.tsx" \
  -E "console\.(log|info|debug).*\b(password|token|key|secret|credential)" \
  portal/src/

# Resultado esperado: vacío
```

### 5. Supabase Client Correcto

```bash
# Verificar que NO se usa service_role en cliente
grep -rn "service_role\|SUPABASE_SERVICE_ROLE" portal/src/app/ portal/src/components/

# Resultado esperado: vacío (solo debe estar en lib/supabase/admin.ts si existe)
```

### 6. Verificar RLS en Nuevas Tablas

Si hay migraciones nuevas:

```bash
# Listar migraciones pendientes de verificar
git diff --cached --name-only | grep "migrations"
```

Para cada migración con CREATE TABLE, verificar que incluye:
- `ALTER TABLE ... ENABLE ROW LEVEL SECURITY;`
- Al menos una policy

---

## Patrones de Secrets a Detectar

| Patrón | Descripción |
|--------|-------------|
| `sk-ant-*` | Anthropic API Key |
| `sk_live_*`, `sk_test_*` | Stripe Keys |
| `re_*` (20+ chars) | Resend API Key |
| `eyJhbGciOi*` | JWT Token |
| `ghp_*`, `gho_*` | GitHub Token |
| `service_role` | Supabase Service Role |
| `SUPABASE_SERVICE_ROLE_KEY` | Variable hardcodeada |

---

## Output

```markdown
## Security Check: [fecha]

### ✅ Passed
- [x] Sin secrets hardcodeados en código
- [x] Archivos .env no staged
- [x] .gitignore configurado correctamente
- [x] Sin console.log con datos sensibles
- [x] Supabase client correcto (anon key only)

### ❌ Failed (BLOQUEA COMMIT)
- [ ] **[archivo:línea]** - [descripción del problema]
  ```
  [código problemático]
  ```
  **Fix:** [cómo arreglarlo]

### ⚠️ Warnings
- [ ] [advertencias que no bloquean]

---

## Resultado

[ ] ✅ SEGURO - OK para commit
[ ] ❌ INSEGURO - Resolver issues antes de commit
```

---

## Acciones Correctivas

### Si encontrás un secret hardcodeado:

1. **NO hagas commit**
2. Mover el secret a `.env.local`
3. Usar `process.env.VARIABLE_NAME`
4. Si ya commiteaste:
   ```bash
   # Rotar el secret inmediatamente
   # El secret anterior está comprometido
   ```

### Si .env está staged:

```bash
git reset HEAD .env.local
```

### Si hay console.log sensible:

```typescript
// ❌ Mal
console.log('User token:', token)

// ✅ Bien
console.log('User authenticated')
// O usar logging estructurado sin datos sensibles
```

---

## Integración con Git Hooks (Opcional)

Para correr automáticamente antes de cada commit:

```bash
# .husky/pre-commit
#!/bin/sh
. "$(dirname "$0")/_/husky.sh"

# Run security check
pnpm security-check
```

```json
// package.json
{
  "scripts": {
    "security-check": "node scripts/security-check.js"
  }
}
```

---

## Comandos Rápidos

```bash
# Check completo
/security-check

# Solo secrets
grep -rn "sk-ant-\|service_role" portal/src/

# Solo archivos staged
git diff --cached --name-only
```

---

Ahora ejecuta la verificación de seguridad.
