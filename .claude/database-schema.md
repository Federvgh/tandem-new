# Database Schema - Tandem Studio Portal

Schema de Supabase para el Portal de Clientes MVP.

---

## Tablas

### companies

Empresas clientes de Tandem Studio.

```sql
CREATE TABLE public.companies (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  slug TEXT NOT NULL UNIQUE,
  contact_email TEXT,
  logo_url TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Índice para búsqueda por slug
CREATE INDEX idx_companies_slug ON public.companies(slug);

-- Ejemplos de datos
-- INSERT INTO companies (name, slug, contact_email) VALUES
--   ('TecMe', 'tecme', 'it@tecme.com'),
--   ('Aguas Cordobesas', 'aguas-cordobesas', 'sistemas@aguascordobesas.com');
```

### users

Usuarios del portal (sincronizado con Supabase Auth).

```sql
CREATE TABLE public.users (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  email TEXT NOT NULL UNIQUE,
  full_name TEXT,
  company_id UUID REFERENCES public.companies(id) ON DELETE SET NULL,
  role TEXT NOT NULL DEFAULT 'client' CHECK (role IN ('client', 'admin')),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Índice para búsqueda por company
CREATE INDEX idx_users_company ON public.users(company_id);

-- Trigger para crear user record cuando se registra en Auth
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.users (id, email)
  VALUES (NEW.id, NEW.email);
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();
```

### reports

Reportes mensuales de infraestructura.

```sql
CREATE TABLE public.reports (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  company_id UUID NOT NULL REFERENCES public.companies(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  period_month INTEGER NOT NULL CHECK (period_month BETWEEN 1 AND 12),
  period_year INTEGER NOT NULL CHECK (period_year >= 2020),
  status TEXT NOT NULL DEFAULT 'draft' CHECK (status IN ('draft', 'published')),
  pdf_path TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  published_at TIMESTAMPTZ,
  created_by UUID REFERENCES public.users(id),

  -- Evitar duplicados de período por empresa
  UNIQUE(company_id, period_month, period_year)
);

-- Índices
CREATE INDEX idx_reports_company ON public.reports(company_id);
CREATE INDEX idx_reports_period ON public.reports(period_year, period_month);
CREATE INDEX idx_reports_status ON public.reports(status);
```

---

## Row Level Security (RLS)

### companies

```sql
ALTER TABLE public.companies ENABLE ROW LEVEL SECURITY;

-- Admins pueden ver todas las empresas
CREATE POLICY "Admins can view all companies"
  ON public.companies FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM public.users
      WHERE users.id = auth.uid()
      AND users.role = 'admin'
    )
  );

-- Usuarios pueden ver su propia empresa
CREATE POLICY "Users can view own company"
  ON public.companies FOR SELECT
  USING (
    id IN (
      SELECT company_id FROM public.users
      WHERE users.id = auth.uid()
    )
  );

-- Solo admins pueden crear/editar empresas
CREATE POLICY "Admins can manage companies"
  ON public.companies FOR ALL
  USING (
    EXISTS (
      SELECT 1 FROM public.users
      WHERE users.id = auth.uid()
      AND users.role = 'admin'
    )
  );
```

### users

```sql
ALTER TABLE public.users ENABLE ROW LEVEL SECURITY;

-- Usuarios pueden ver su propio perfil
CREATE POLICY "Users can view own profile"
  ON public.users FOR SELECT
  USING (id = auth.uid());

-- Admins pueden ver todos los usuarios
CREATE POLICY "Admins can view all users"
  ON public.users FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM public.users u
      WHERE u.id = auth.uid()
      AND u.role = 'admin'
    )
  );

-- Solo admins pueden modificar usuarios
CREATE POLICY "Admins can manage users"
  ON public.users FOR ALL
  USING (
    EXISTS (
      SELECT 1 FROM public.users u
      WHERE u.id = auth.uid()
      AND u.role = 'admin'
    )
  );
```

### reports

```sql
ALTER TABLE public.reports ENABLE ROW LEVEL SECURITY;

-- Usuarios pueden ver reportes publicados de su empresa
CREATE POLICY "Users can view published company reports"
  ON public.reports FOR SELECT
  USING (
    status = 'published'
    AND company_id IN (
      SELECT company_id FROM public.users
      WHERE users.id = auth.uid()
    )
  );

-- Admins pueden ver todos los reportes
CREATE POLICY "Admins can view all reports"
  ON public.reports FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM public.users
      WHERE users.id = auth.uid()
      AND users.role = 'admin'
    )
  );

-- Solo admins pueden crear/editar reportes
CREATE POLICY "Admins can manage reports"
  ON public.reports FOR ALL
  USING (
    EXISTS (
      SELECT 1 FROM public.users
      WHERE users.id = auth.uid()
      AND users.role = 'admin'
    )
  );
```

---

## Storage Buckets

### reports (privado)

```sql
-- Crear bucket privado para PDFs
INSERT INTO storage.buckets (id, name, public)
VALUES ('reports', 'reports', false);

-- Policy: Usuarios pueden leer PDFs de su empresa
CREATE POLICY "Users can read own company PDFs"
  ON storage.objects FOR SELECT
  USING (
    bucket_id = 'reports'
    AND (storage.foldername(name))[1] IN (
      SELECT companies.id::text
      FROM public.companies
      INNER JOIN public.users ON users.company_id = companies.id
      WHERE users.id = auth.uid()
    )
  );

-- Policy: Admins pueden todo
CREATE POLICY "Admins can manage all PDFs"
  ON storage.objects FOR ALL
  USING (
    bucket_id = 'reports'
    AND EXISTS (
      SELECT 1 FROM public.users
      WHERE users.id = auth.uid()
      AND users.role = 'admin'
    )
  );
```

---

## Estructura de Storage

```
reports/
├── {company_id}/
│   ├── 2024/
│   │   ├── 01/
│   │   │   └── report.pdf
│   │   ├── 02/
│   │   │   └── report.pdf
│   │   └── ...
│   └── 2025/
│       └── ...
```

---

## Queries Comunes

### Dashboard - Reportes del usuario

```typescript
const { data: reports } = await supabase
  .from('reports')
  .select(`
    id,
    title,
    period_month,
    period_year,
    status,
    published_at,
    companies (
      name,
      slug
    )
  `)
  .order('period_year', { ascending: false })
  .order('period_month', { ascending: false })
```

### Admin - Listar empresas

```typescript
const { data: companies } = await supabase
  .from('companies')
  .select(`
    id,
    name,
    slug,
    contact_email,
    reports (count)
  `)
  .order('name')
```

### Descargar PDF

```typescript
const { data } = await supabase
  .storage
  .from('reports')
  .createSignedUrl(report.pdf_path, 60 * 15) // 15 min
```

---

## Roles

| Rol | Puede |
|-----|-------|
| **client** | Ver dashboard, ver reportes de su empresa, descargar PDFs |
| **admin** | Todo lo anterior + crear empresas + subir reportes + ver todas las empresas |

---

## Credenciales Necesarias

| Servicio | Variable de Entorno | Dónde Obtener |
|----------|---------------------|---------------|
| Supabase | `NEXT_PUBLIC_SUPABASE_URL` | Dashboard > Settings > API |
| Supabase | `NEXT_PUBLIC_SUPABASE_ANON_KEY` | Dashboard > Settings > API |
| Supabase | `SUPABASE_SERVICE_ROLE_KEY` | Dashboard > Settings > API (solo server) |
| Resend | `RESEND_API_KEY` | resend.com/api-keys |

---

## Setup Inicial

```bash
# 1. Crear proyecto en Supabase
# 2. Ir a SQL Editor y ejecutar las queries de arriba
# 3. Crear bucket 'reports' en Storage
# 4. Configurar Email Templates en Auth > Email Templates
# 5. Copiar credenciales a .env.local
```

---

**Versión:** 1.0 | **Última actualización:** Diciembre 2024
