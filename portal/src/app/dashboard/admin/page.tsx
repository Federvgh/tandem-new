import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Building2, Users, Plus } from 'lucide-react'
import Link from 'next/link'
import { CreateCompanyForm } from './create-company-form'

export default async function AdminPage() {
  const supabase = await createClient()

  const { data: { user } } = await supabase.auth.getUser()

  if (!user) {
    redirect('/login')
  }

  // Verify admin role
  const { data: profile } = await supabase
    .from('users')
    .select('role')
    .eq('id', user.id)
    .single()

  if (profile?.role !== 'admin') {
    redirect('/dashboard')
  }

  // Get companies with user count
  const { data: companies } = await supabase
    .from('companies')
    .select(`
      *,
      users:users(count)
    `)
    .order('name')

  return (
    <div>
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-8">
        <div>
          <h1 className="text-2xl font-bold">Empresas</h1>
          <p className="text-muted mt-1">Gestionar empresas y usuarios del portal</p>
        </div>
        <CreateCompanyForm />
      </div>

      {/* Companies Grid */}
      {companies && companies.length > 0 ? (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {companies.map((company) => (
            <Link key={company.id} href={`/dashboard/admin/companies/${company.slug}`}>
              <Card className="hover:shadow-md transition-shadow cursor-pointer h-full">
                <CardHeader className="pb-3">
                  <div className="flex items-start justify-between">
                    <div className="p-2 bg-primary/10 rounded-lg">
                      <Building2 className="w-5 h-5 text-primary" />
                    </div>
                    <span className="flex items-center gap-1 text-sm text-muted">
                      <Users className="w-4 h-4" />
                      {(company.users as { count: number }[])?.[0]?.count || 0}
                    </span>
                  </div>
                  <CardTitle className="text-lg mt-3">{company.name}</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-muted truncate">
                    {company.contact_email || 'Sin email de contacto'}
                  </p>
                </CardContent>
              </Card>
            </Link>
          ))}
        </div>
      ) : (
        <Card className="text-center py-12">
          <CardContent>
            <div className="mx-auto w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mb-4">
              <Building2 className="w-8 h-8 text-muted" />
            </div>
            <h3 className="text-lg font-medium mb-2">No hay empresas</h3>
            <p className="text-muted text-sm">
              Creá la primera empresa para empezar
            </p>
          </CardContent>
        </Card>
      )}
    </div>
  )
}
