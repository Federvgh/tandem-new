# Agregar Nueva Empresa Cliente

Onboardear una nueva empresa al Portal de Clientes.

## Argumento: $ARGUMENTS (nombre de la empresa)

---

## Proceso de Onboarding

### Paso 1: Crear Empresa en Supabase

```sql
INSERT INTO public.companies (name, slug, contact_email)
VALUES (
  '[NOMBRE_EMPRESA]',
  '[slug-empresa]',
  '[email@empresa.com]'
)
RETURNING id;
```

### Paso 2: Crear Usuario

```sql
-- El usuario se crea cuando hace login por primera vez con Magic Link
-- Solo necesitamos asociar el email al company_id
INSERT INTO public.users (email, company_id, role)
VALUES (
  '[email@empresa.com]',
  '[UUID-de-paso-1]',
  'client'
);
```

### Paso 3: Crear Bucket en Storage

```typescript
await supabase.storage
  .from('reports')
  .upload(`${companyId}/.keep`, new Blob(['']));
```

---

## Checklist de Onboarding

```markdown
## Onboarding: [EMPRESA]

### Datos Básicos
- [ ] Nombre completo:
- [ ] Slug (URL-friendly):
- [ ] Email de contacto:

### Configuración
- [ ] Company creada en Supabase
- [ ] Usuario registrado
- [ ] Bucket de storage creado
- [ ] Magic Link enviado

### Primer Reporte
- [ ] Subir primer PDF de prueba
```

---

## Output Esperado

```markdown
## Empresa Creada: [NOMBRE]

**ID:** [uuid]
**Slug:** [slug]
**Email:** [email]

### Próximos Pasos
1. El cliente recibirá Magic Link en su email
2. Subir primer reporte con `/new-report [slug] [mes] [año]`
3. Verificar acceso al dashboard

### Credenciales para entregar al cliente
- URL: https://portal.tandemstudio.cloud
- Email: [email]
- Método: Magic Link (sin contraseña)
```

---

## Ejemplo de Uso

```
/add-client Bio4 Argentina
```
