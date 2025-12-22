# Pre-Deploy Checklist

Ejecutar checklist completa antes de ir a producción.

---

## Verificación Automatizada

### 1. Build y Lint

```bash
# TypeScript sin errores
pnpm build

# Lint sin errores
pnpm lint

# Tests pasan
pnpm test
```

### 2. Variables de Entorno (Vercel)

Verificar que existen en Vercel Dashboard (Settings → Environment Variables):

**🔴 Críticas (sin estas no funciona):**
- [ ] `NEXT_PUBLIC_SUPABASE_URL`
- [ ] `NEXT_PUBLIC_SUPABASE_ANON_KEY`
- [ ] `SUPABASE_SERVICE_ROLE_KEY`
- [ ] `ANTHROPIC_API_KEY`

**🟡 Importantes:**
- [ ] `RESEND_API_KEY` (notificaciones email)
- [ ] `UPSTASH_REDIS_REST_URL` (rate limiting)
- [ ] `UPSTASH_REDIS_REST_TOKEN`
- [ ] `NEXT_PUBLIC_APP_URL` (dominio final)

**🟢 Azure Functions:**
- [ ] `AZURE_FUNCTIONS_URL`
- [ ] `AZURE_FUNCTIONS_KEY` (si usa auth)

### 3. Seguridad

```bash
# Buscar secrets en código (NO debe encontrar nada)
grep -r "sk-ant\|supabase.*service_role\|ANTHROPIC_API_KEY=" src/

# Verificar que .env.local está en .gitignore
cat .gitignore | grep ".env"
```

### 4. Supabase

```sql
-- Verificar RLS habilitado en tablas críticas
SELECT tablename, rowsecurity 
FROM pg_tables 
WHERE schemaname = 'public' 
AND tablename IN ('companies', 'users', 'reports');

-- Todas deben tener rowsecurity = true
```

```bash
# Verificar migraciones aplicadas
supabase db diff
# Debe estar vacío si todo está sincronizado
```

### 5. Azure Functions

```bash
# Verificar que las functions están deployadas
az functionapp list --query "[].{name:name, state:state}"

# Health check
curl $AZURE_FUNCTIONS_URL/api/health
```

### 6. Dominio y DNS

- [ ] Dominio configurado en Vercel
- [ ] SSL activo (HTTPS)
- [ ] `NEXT_PUBLIC_APP_URL` apunta al dominio correcto
- [ ] Subdominio `portal.tandemstudio.cloud` configurado

---

## Checklist Manual

### Auth Flow
- [ ] Login con Magic Link funciona
- [ ] Email de Magic Link llega
- [ ] Redirect post-login correcto
- [ ] Logout limpia sesión
- [ ] Usuario solo ve sus reportes (RLS)

### Core Features
- [ ] Dashboard carga correctamente
- [ ] Lista de reportes muestra datos
- [ ] PDF se puede descargar
- [ ] Análisis AI funciona

### Notificaciones
- [ ] Email de nuevo reporte se envía
- [ ] Template de email se ve bien
- [ ] Links en email funcionan

### Edge Cases
- [ ] Usuario sin reportes ve empty state
- [ ] Usuario de otra empresa NO ve reportes ajenos
- [ ] Sesión expirada redirige a login

---

## Output

```markdown
## Pre-Deploy Status

### ✅ Passed
- [x] Build exitoso
- [x] Lint sin errores
- [x] Tests pasan
- [x] Variables de entorno configuradas
- [x] RLS habilitado
- [x] Auth flow verificado

### ❌ Failed (BLOQUEA DEPLOY)
- [ ] Item que falló - **Acción:** [descripción]

### ⚠️ Warnings (no bloquean)
- [ ] Item con warning - **Nota:** [descripción]

---

## Ready to Deploy?

[ ] ✅ SÍ - Todo listo, proceder con `/deploy production`
[ ] ❌ NO - Resolver items marcados como Failed
```

---

## Comandos de Verificación Rápida

```bash
# Todo en uno
pnpm build && pnpm lint && pnpm test

# Verificar env vars (sin mostrar valores)
vercel env ls

# Ver último deploy
vercel ls --limit 1
```

---

Ahora ejecuta la verificación.
