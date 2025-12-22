# QA Tester Agent

Especialista en testing del Portal de Clientes de Tandem Studio.

## Contexto: Tandem Studio Portal

| Atributo | Valor |
|----------|-------|
| **Stack** | Next.js 14, TypeScript, Vitest, Playwright |
| **Flujos Críticos** | Auth (Magic Links), Dashboard, Reportes, PDF Download |
| **Config** | vitest.config.ts, playwright.config.ts |

## Cuándo Activar

Usar este agente cuando:
- Escribís tests unitarios
- Creás tests de integración
- Testeás flujos de auth
- Validás funcionalidad de reportes
- Hacés testing manual pre-deploy
- Regression testing

---

## Estructura de Tests

```
src/
├── lib/
│   └── reports/
│       ├── generate.ts
│       └── __tests__/
│           └── generate.test.ts
│
├── app/
│   └── api/
│       └── reports/
│           └── __tests__/
│               └── route.test.ts
│
e2e/
├── auth.spec.ts
├── dashboard.spec.ts
└── reports.spec.ts

vitest.config.ts
playwright.config.ts
```

---

## Vitest Setup

### vitest.config.ts

```typescript
import { defineConfig } from 'vitest/config'
import react from '@vitejs/plugin-react'
import path from 'path'

export default defineConfig({
  plugins: [react()],
  test: {
    environment: 'jsdom',
    globals: true,
    setupFiles: ['./vitest.setup.ts'],
    include: ['src/**/*.test.{ts,tsx}'],
    coverage: {
      provider: 'v8',
      reporter: ['text', 'html'],
      exclude: ['node_modules/', 'e2e/']
    }
  },
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src')
    }
  }
})
```

### vitest.setup.ts

```typescript
import '@testing-library/jest-dom'
import { vi } from 'vitest'

// Mock Supabase
vi.mock('@/lib/supabase/client', () => ({
  createClient: () => ({
    from: vi.fn(() => ({
      select: vi.fn().mockReturnThis(),
      insert: vi.fn().mockReturnThis(),
      update: vi.fn().mockReturnThis(),
      eq: vi.fn().mockReturnThis(),
      single: vi.fn().mockResolvedValue({ data: null, error: null })
    })),
    auth: {
      getUser: vi.fn().mockResolvedValue({
        data: { user: { id: 'test-user-id', app_metadata: { company_id: 'test-company' } } },
        error: null
      })
    }
  })
}))
```

---

## Tests Unitarios

### Test de Generación de Reporte

```typescript
// src/lib/reports/__tests__/generate.test.ts
import { describe, it, expect, vi, beforeEach } from 'vitest'
import { generateReportData } from '../generate'

describe('generateReportData', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('generates correct report structure', () => {
    const data = generateReportData({
      companyId: 'test-company',
      month: 12,
      year: 2024,
      metrics: mockMetrics
    })

    expect(data).toHaveProperty('resumen')
    expect(data).toHaveProperty('seguridad')
    expect(data).toHaveProperty('infraestructura')
    expect(data).toHaveProperty('backup')
  })

  it('calculates uptime correctly', () => {
    const data = generateReportData({
      ...mockInput,
      metrics: { ...mockMetrics, downtime_minutes: 60 }
    })

    // 60 min downtime en 1 mes ≈ 99.86% uptime
    expect(data.resumen.uptime_promedio).toBeCloseTo(99.86, 1)
  })

  it('handles missing security data gracefully', () => {
    const data = generateReportData({
      ...mockInput,
      metrics: { ...mockMetrics, seguridad: null }
    })

    expect(data.seguridad.ataques_bloqueados).toBe(0)
    expect(data.seguridad.efectividad_bloqueo).toBe(100)
  })
})
```

### Test de API Route

```typescript
// src/app/api/reports/__tests__/route.test.ts
import { describe, it, expect, vi, beforeEach } from 'vitest'
import { GET, POST } from '../route'
import { NextRequest } from 'next/server'

describe('GET /api/reports', () => {
  it('returns 401 for unauthenticated requests', async () => {
    vi.mocked(supabase.auth.getUser).mockResolvedValueOnce({
      data: { user: null },
      error: null
    })

    const request = new NextRequest('http://localhost/api/reports')
    const response = await GET(request)

    expect(response.status).toBe(401)
  })

  it('returns reports for authenticated user', async () => {
    vi.mocked(supabase.from).mockReturnValueOnce({
      select: vi.fn().mockReturnThis(),
      eq: vi.fn().mockReturnThis(),
      order: vi.fn().mockResolvedValue({
        data: [{ id: '1', title: 'Report 1' }],
        error: null
      })
    })

    const request = new NextRequest('http://localhost/api/reports')
    const response = await GET(request)
    const data = await response.json()

    expect(response.status).toBe(200)
    expect(data.reports).toHaveLength(1)
  })
})
```

---

## Tests E2E (Playwright)

### playwright.config.ts

```typescript
import { defineConfig, devices } from '@playwright/test'

export default defineConfig({
  testDir: './e2e',
  fullyParallel: true,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 2 : 0,
  workers: process.env.CI ? 1 : undefined,
  reporter: 'html',
  use: {
    baseURL: 'http://localhost:3000',
    trace: 'on-first-retry',
  },
  projects: [
    { name: 'chromium', use: { ...devices['Desktop Chrome'] } },
    { name: 'Mobile Safari', use: { ...devices['iPhone 13'] } },
  ],
  webServer: {
    command: 'pnpm dev',
    url: 'http://localhost:3000',
    reuseExistingServer: !process.env.CI,
  },
})
```

### Test de Auth Flow

```typescript
// e2e/auth.spec.ts
import { test, expect } from '@playwright/test'

test.describe('Authentication', () => {
  test('shows login page for unauthenticated users', async ({ page }) => {
    await page.goto('/dashboard')
    await expect(page).toHaveURL(/.*login/)
  })

  test('login form validates email', async ({ page }) => {
    await page.goto('/login')
    
    await page.fill('input[name="email"]', 'invalid-email')
    await page.click('button[type="submit"]')
    
    await expect(page.locator('.error-message')).toBeVisible()
  })

  test('successful login redirects to dashboard', async ({ page }) => {
    // Este test requiere mock de Supabase Auth
    // O usar cuenta de test real
    await page.goto('/login')
    await page.fill('input[name="email"]', 'test@empresa.com')
    await page.click('button[type="submit"]')
    
    await expect(page.locator('text=Magic Link enviado')).toBeVisible()
  })
})
```

### Test de Dashboard

```typescript
// e2e/dashboard.spec.ts
import { test, expect } from '@playwright/test'

test.describe('Dashboard', () => {
  test.beforeEach(async ({ page }) => {
    // Simular sesión autenticada
    await page.goto('/login')
    // ... login flow o mock
  })

  test('displays company reports', async ({ page }) => {
    await page.goto('/dashboard')
    
    await expect(page.locator('h1')).toContainText('Dashboard')
    await expect(page.locator('[data-testid="reports-list"]')).toBeVisible()
  })

  test('can download PDF report', async ({ page }) => {
    await page.goto('/dashboard')
    
    const downloadPromise = page.waitForEvent('download')
    await page.click('[data-testid="download-pdf-btn"]')
    const download = await downloadPromise
    
    expect(download.suggestedFilename()).toContain('.pdf')
  })
})
```

---

## Checklists de Testing Manual

### Pre-Deploy

```markdown
## Checklist Pre-Deploy

### Auth
- [ ] Login con Magic Link funciona
- [ ] Email llega correctamente (Resend)
- [ ] Redirect post-login al dashboard
- [ ] Logout limpia sesión
- [ ] Sesión persiste en refresh
- [ ] Usuario sin empresa no puede acceder

### Dashboard
- [ ] Carga correctamente
- [ ] Muestra solo reportes del usuario/empresa
- [ ] Métricas principales visibles
- [ ] Empty state si no hay reportes

### Reportes
- [ ] Lista de reportes carga
- [ ] Click abre detalle
- [ ] PDF download funciona
- [ ] PDF se descarga con nombre correcto

### Admin (Santiago)
- [ ] Puede ver todas las empresas
- [ ] Puede subir reportes
- [ ] Puede agregar clientes

### Responsive
- [ ] Mobile: navegación funciona
- [ ] Tablet: layout correcto
- [ ] Desktop: todo visible
```

### Nueva Feature

```markdown
## Checklist Nueva Feature: [nombre]

### Funcionalidad
- [ ] Happy path funciona
- [ ] Edge cases manejados
- [ ] Errores muestran mensaje apropiado

### UI
- [ ] Responsive en 3 breakpoints
- [ ] Dark mode correcto
- [ ] Loading states
- [ ] Empty states

### Seguridad
- [ ] Auth requerida donde corresponde
- [ ] Datos de otros usuarios no visibles
- [ ] Inputs validados
```

---

## Comandos

```bash
# Unit tests
pnpm test           # Watch mode
pnpm test:run       # CI mode
pnpm test:coverage  # Con coverage

# E2E tests
pnpm test:e2e           # Headless
pnpm test:e2e:headed    # Con browser
pnpm test:e2e:debug     # Debug mode
```

---

## Mocks Útiles

### Mock de Supabase Response

```typescript
const mockReport = {
  id: 'test-report-id',
  company_id: 'test-company',
  title: 'Reporte Diciembre 2024',
  period_month: 12,
  period_year: 2024,
  status: 'published',
  pdf_path: 'company-id/2024/12/report.pdf'
}

vi.mocked(supabase.from).mockReturnValue({
  select: vi.fn().mockReturnThis(),
  eq: vi.fn().mockResolvedValue({ data: mockReport, error: null })
})
```

### Mock de Storage URL

```typescript
vi.mocked(supabase.storage.from).mockReturnValue({
  createSignedUrl: vi.fn().mockResolvedValue({
    data: { signedUrl: 'https://supabase.co/signed-url' },
    error: null
  })
})
```
