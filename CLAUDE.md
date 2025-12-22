# CLAUDE.md - Tandem Studio Portal

Este archivo configura el contexto y comportamiento de Claude Code para este proyecto.

## Reglas de Trabajo

### Uso Obligatorio de Agentes

**SIEMPRE usar los agentes correspondientes para cada tarea:**

| Tarea | Agente | Archivo |
|-------|--------|---------|
| Crear/modificar componentes UI | `ui-designer` | `.claude/agents/ui-designer.md` |
| Escribir tests, QA, pre-deploy | `qa-tester` | `.claude/agents/qa-tester.md` |
| Documentación, README, guías | `technical-writer` | `.claude/agents/technical-writer.md` |
| Analytics, métricas, UX issues | `analytics-expert` | `.claude/agents/analytics-expert.md` |

### Uso de Comandos

| Comando | Cuándo Usar |
|---------|-------------|
| `/add-client` | Agregar nueva empresa cliente |
| `/new-report` | Crear nuevo reporte mensual |
| `/security-check` | **SIEMPRE antes de commit** - verificar secrets |
| `/code-review` | Revisar código antes de merge |
| `/pre-deploy` | Checklist antes de deploy |
| `/deploy` | Deploy a producción |
| `/new-task` | Planificar nueva feature |

---

## Proyecto

### Stack Técnico

- **Frontend:** Next.js 14, React 19, TypeScript, Tailwind CSS
- **Backend:** Supabase (PostgreSQL + Auth + Storage)
- **Email:** Resend (Magic Links)
- **Deploy:** Vercel
- **Analytics:** GA4, Microsoft Clarity, GSC

### Estructura

```
/
├── portal/                 # Next.js app (el portal de clientes)
│   ├── src/
│   │   ├── app/           # Pages (App Router)
│   │   ├── components/    # React components
│   │   └── lib/           # Utilities, Supabase client
│   └── .env.local         # Credenciales (no commitear)
│
├── docs/                   # Landing page HTML estática (existente)
│
└── .claude/
    ├── agents/            # Definiciones de agentes
    ├── commands/          # Slash commands
    └── database-schema.md # Schema de Supabase
```

### Design System

```css
--primary: #0088FF;
--primary-dark: #0066CC;
--accent: #00BFFF;
--dark: #0A0E27;
--success: #22C55E;
--warning: #F59E0B;
--error: #EF4444;

font-heading: 'Space Grotesk'
font-body: 'Inter'
```

### Supabase

- **Project ID:** wvlpiacptjjencmuovii
- **Region:** sa-east-1 (São Paulo)
- **Tablas:** companies, users, reports
- **Storage:** bucket `reports` (privado, solo PDFs)

---

## Audiencia

- **Clientes:** ~10 empresas, ejecutivos IT y gerentes
- **Admin:** Santiago (dueño de Tandem Studio)
- **Desarrollador:** Feder

---

## Idioma

- **Código:** Inglés
- **UI/Docs:** Español (Argentina, voseo)
- **Commits:** Inglés

---

## No Hacer

- ❌ No agregar features de AI analysis (removido del scope)
- ❌ No usar Azure Functions (fuera de scope MVP)
- ❌ No cambiar colores primarios sin aprobación
- ❌ No commitear .env.local ni credenciales
- ❌ No crear documentación sin usar el agente technical-writer
