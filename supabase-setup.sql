-- =====================================================
-- TANDEM STUDIO - PORTAL DE CLIENTES
-- Schema de Base de Datos para Supabase
-- =====================================================

-- 1. TABLA: companies
-- Empresas clientes de Tandem Studio
-- =====================================================

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

-- =====================================================
-- 2. TABLA: users
-- Usuarios del portal (sincronizado con Supabase Auth)
-- =====================================================

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

-- =====================================================
-- 3. TABLA: reports
-- Reportes mensuales de infraestructura
-- =====================================================

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

-- =====================================================
-- 4. TRIGGER: Crear user record automáticamente
-- Cuando alguien se registra en Auth, crear perfil
-- =====================================================

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

-- =====================================================
-- 5. ROW LEVEL SECURITY: companies
-- =====================================================

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

-- Solo admins pueden crear/editar/eliminar empresas
CREATE POLICY "Admins can insert companies"
  ON public.companies FOR INSERT
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM public.users
      WHERE users.id = auth.uid()
      AND users.role = 'admin'
    )
  );

CREATE POLICY "Admins can update companies"
  ON public.companies FOR UPDATE
  USING (
    EXISTS (
      SELECT 1 FROM public.users
      WHERE users.id = auth.uid()
      AND users.role = 'admin'
    )
  );

CREATE POLICY "Admins can delete companies"
  ON public.companies FOR DELETE
  USING (
    EXISTS (
      SELECT 1 FROM public.users
      WHERE users.id = auth.uid()
      AND users.role = 'admin'
    )
  );

-- =====================================================
-- 6. ROW LEVEL SECURITY: users
-- =====================================================

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

-- Usuarios pueden actualizar su propio perfil
CREATE POLICY "Users can update own profile"
  ON public.users FOR UPDATE
  USING (id = auth.uid());

-- Solo admins pueden modificar otros usuarios
CREATE POLICY "Admins can update all users"
  ON public.users FOR UPDATE
  USING (
    EXISTS (
      SELECT 1 FROM public.users u
      WHERE u.id = auth.uid()
      AND u.role = 'admin'
    )
  );

-- =====================================================
-- 7. ROW LEVEL SECURITY: reports
-- =====================================================

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

-- Solo admins pueden crear reportes
CREATE POLICY "Admins can insert reports"
  ON public.reports FOR INSERT
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM public.users
      WHERE users.id = auth.uid()
      AND users.role = 'admin'
    )
  );

-- Solo admins pueden actualizar reportes
CREATE POLICY "Admins can update reports"
  ON public.reports FOR UPDATE
  USING (
    EXISTS (
      SELECT 1 FROM public.users
      WHERE users.id = auth.uid()
      AND users.role = 'admin'
    )
  );

-- Solo admins pueden eliminar reportes
CREATE POLICY "Admins can delete reports"
  ON public.reports FOR DELETE
  USING (
    EXISTS (
      SELECT 1 FROM public.users
      WHERE users.id = auth.uid()
      AND users.role = 'admin'
    )
  );

-- =====================================================
-- 8. DATOS INICIALES: Admin Santiago
-- IMPORTANTE: Reemplazar el UUID con el real después
-- de que Santiago haga login por primera vez
-- =====================================================

-- Crear empresa Tandem Studio (para el admin)
INSERT INTO public.companies (name, slug, contact_email)
VALUES ('Tandem Studio', 'tandem-studio', 'info@tandemstudio.cloud');

-- =====================================================
-- FIN DEL SCRIPT
-- =====================================================

-- PRÓXIMOS PASOS MANUALES:
--
-- 1. Ir a Storage > Create bucket > "reports" (privado)
--
-- 2. Después de que Santiago haga login, ejecutar:
--    UPDATE public.users
--    SET role = 'admin',
--        company_id = (SELECT id FROM companies WHERE slug = 'tandem-studio')
--    WHERE email = 'santiago@tandemstudio.cloud';
--
-- 3. Agregar empresas clientes:
--    INSERT INTO companies (name, slug, contact_email) VALUES
--      ('TecMe', 'tecme', 'it@tecme.com'),
--      ('Aguas Cordobesas', 'aguas-cordobesas', 'sistemas@aguascordobesas.com');
