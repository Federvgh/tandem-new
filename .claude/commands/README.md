# Comandos - Tandem Studio Portal

Comandos disponibles para el desarrollo del Portal de Clientes.

---

## Comandos MVP

### `/add-client [nombre-empresa]`
Agregar una nueva empresa cliente al portal.

**Ejemplo:**
```
/add-client Bio4 Argentina
```

**Acciones:**
1. Crear registro en tabla `companies`
2. Crear usuario inicial con Magic Link
3. Crear bucket en Supabase Storage

---

### `/new-report [empresa] [mes] [año]`
Subir un nuevo reporte mensual para un cliente.

**Ejemplo:**
```
/new-report aguas-cordobesas 12 2024
```

**Acciones:**
1. Crear registro en tabla `reports`
2. Subir PDF a Supabase Storage
3. Extraer métricas del reporte

---

## Comandos de Desarrollo

### `/new-task [descripción]`
Planificar una nueva tarea con análisis de archivos afectados.

**Ejemplo:**
```
/new-task "Agregar filtro por fecha en lista de reportes"
```

---

### `/code-review`
Review del código seleccionado o de los últimos cambios.

---

### `/security-check`
**Verificación de seguridad antes de commit/push:**
- Secrets hardcodeados en código
- Archivos .env staged para commit
- Console.log con datos sensibles
- Uso incorrecto de Supabase service_role
- RLS en tablas nuevas

**Usar SIEMPRE antes de commit con cambios sensibles.**

---

### `/pre-deploy`
Checklist de verificación antes de deployar:
- Build sin errores
- Tests pasando
- Variables de entorno configuradas
- Migraciones aplicadas

---

### `/deploy [preview|production]`
Deploy a Vercel con verificaciones.

---

## Estructura

```
.claude/commands/
├── README.md           # Esta guía
├── add-client.md       # Onboarding de clientes
├── new-report.md       # Crear reportes
├── new-task.md         # Planificación
├── code-review.md      # Review de código
├── security-check.md   # Verificación pre-commit
├── pre-deploy.md       # Checklist pre-deploy
└── deploy.md           # Deploy a Vercel
```

---

## Comandos Fase 2 (Futuro)

- `/compare-reports` - Comparar métricas entre meses
- `/notify-client` - Enviar notificación de nuevo reporte

---

**Proyecto:** Tandem Studio Portal
