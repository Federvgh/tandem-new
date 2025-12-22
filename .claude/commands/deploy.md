# Deploy a Producción

Push a GitHub → Vercel deploya automáticamente.

## Target: $ARGUMENTS (preview | production)

---

## Pre-requisitos

Antes de deployar, ejecutar `/pre-deploy` para verificar que todo está listo.

---

## Proceso de Deploy

### Paso 1: Verificar Estado Git

```bash
git status
```

Si hay cambios sin commitear, proceder al Paso 2.

### Paso 2: Commit de Cambios

```bash
git add .
git commit -m "tipo: descripción breve del cambio"
```

**Tipos de commit:**
- `feat:` nueva feature
- `fix:` corrección de bug
- `refactor:` refactoring
- `docs:` documentación
- `chore:` mantenimiento
- `security:` fix de seguridad

### Paso 3: Push a GitHub

```bash
# Push a main (si no hay branch protection)
git push origin main

# O crear PR (recomendado)
git checkout -b feature/nombre-descriptivo
git push -u origin feature/nombre-descriptivo
gh pr create --title "tipo: descripción" --body "Resumen"
```

### Paso 4: Vercel Deploya Automáticamente

Una vez pusheado/mergeado a `main`:
1. GitHub notifica a Vercel via webhook
2. Vercel hace build automático
3. Si pasa, se promueve a producción

```bash
# Ver estado del deploy en Vercel Dashboard
# O usar CLI:
vercel ls --limit 3
```

### Paso 4b: Deploy Manual (si webhook falla)

```bash
# Preview deploy
vercel

# Production deploy
vercel --prod

# Verificar estado
vercel inspect [DEPLOYMENT_URL]
```

---

## Verificación Post-Deploy

### Tests Críticos

1. **Homepage carga**
   - [ ] Abrir https://portal.tandemstudio.cloud
   - [ ] Sin errores en consola

2. **Auth funciona**
   - [ ] Login con Magic Link
   - [ ] Redirect a dashboard

3. **Dashboard funciona**
   - [ ] Lista de reportes carga
   - [ ] Datos correctos para el usuario

4. **Reportes funcionan**
   - [ ] Click en reporte abre detalle
   - [ ] PDF se puede descargar

### Monitoreo Post-Deploy

Verificar en las próximas horas:
- **Vercel:** Functions logs, errores 5xx
- **Supabase:** Queries lentas, errores RLS
- **Emails:** Alertas de monitoreo (si configurado)

---

## Rollback (si algo falla)

```bash
# Ver deploys anteriores
vercel ls

# Rollback a deploy anterior
vercel rollback [DEPLOYMENT_URL]

# O desde Vercel Dashboard:
# Deployments → ... → Promote to Production
```

---

## Checklist Post-Deploy

```markdown
### Deploy: [fecha] [hora]

- [ ] Homepage accesible
- [ ] Login funciona
- [ ] Dashboard carga
- [ ] Reportes visibles
- [ ] PDF download funciona
- [ ] No hay errores 5xx en logs
- [ ] Performance aceptable (< 3s load)

### Issues encontrados:
- [ninguno / descripción]

### Rollback necesario: [sí/no]
```

---

## URLs de Referencia

| Recurso | URL |
|---------|-----|
| Portal (Producción) | https://portal.tandemstudio.cloud |
| Vercel Dashboard | https://vercel.com/dashboard |
| Supabase Dashboard | https://app.supabase.com |
| GitHub Repo | https://github.com/[org]/[repo] |

---

## Ejemplo de Flujo Completo

```bash
# 1. Verificar pre-deploy
# /pre-deploy

# 2. Commit y push
git add .
git commit -m "feat: agregar comparación de reportes"
git push origin main

# 3. Esperar build en Vercel (~2-3 min)
vercel ls --limit 1

# 4. Verificar deploy
curl https://portal.tandemstudio.cloud/api/health

# 5. Test manual rápido
# - Login
# - Ver dashboard
# - Descargar un PDF

# 6. Marcar como exitoso
echo "Deploy exitoso: $(date)"
```
