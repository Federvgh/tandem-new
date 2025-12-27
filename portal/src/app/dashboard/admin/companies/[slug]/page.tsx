import { createClient } from '@/lib/supabase/server'
import { redirect, notFound } from 'next/navigation'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { ArrowLeft, User, Mail, Trash2 } from 'lucide-react'
import Link from 'next/link'
import { InviteUserForm } from './invite-user-form'
import { DeleteUserButton } from './delete-user-button'

interface CompanyPageProps {
  params: Promise<{ slug: string }>
}

export default async function CompanyPage({ params }: CompanyPageProps) {
  const { slug } = await params
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

  // Get company
  const { data: company, error } = await supabase
    .from('companies')
    .select('*')
    .eq('slug', slug)
    .single()

  if (error || !company) {
    notFound()
  }

  // Get users for this company
  const { data: users } = await supabase
    .from('users')
    .select('*')
    .eq('company_id', company.id)
    .order('full_name')

  return (
    <div>
      {/* Back button */}
      <Link
        href="/dashboard/admin"
        className="inline-flex items-center text-sm text-muted hover:text-foreground mb-6"
      >
        <ArrowLeft className="w-4 h-4 mr-2" />
        Volver a Empresas
      </Link>

      {/* Company Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-8">
        <div>
          <h1 className="text-2xl font-bold">{company.name}</h1>
          <p className="text-muted mt-1">
            {company.contact_email || 'Sin email de contacto'}
          </p>
        </div>
        <InviteUserForm companyId={company.id} companyName={company.name} />
      </div>

      {/* Users List */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Usuarios ({users?.length || 0})</CardTitle>
        </CardHeader>
        <CardContent>
          {users && users.length > 0 ? (
            <div className="divide-y">
              {users.map((user) => (
                <div key={user.id} className="flex items-center justify-between py-4 first:pt-0 last:pb-0">
                  <div className="flex items-center gap-3">
                    <div className="p-2 bg-gray-100 rounded-full">
                      <User className="w-4 h-4 text-muted" />
                    </div>
                    <div>
                      <p className="font-medium">
                        {user.full_name || 'Sin nombre'}
                      </p>
                      <p className="text-sm text-muted flex items-center gap-1">
                        <Mail className="w-3 h-3" />
                        {user.email}
                      </p>
                    </div>
                  </div>
                  <DeleteUserButton userId={user.id} userName={user.full_name || user.email} />
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-8">
              <div className="mx-auto w-12 h-12 bg-gray-100 rounded-full flex items-center justify-center mb-3">
                <User className="w-6 h-6 text-muted" />
              </div>
              <p className="text-muted">No hay usuarios en esta empresa</p>
              <p className="text-sm text-muted-foreground mt-1">
                Invitá al primer usuario usando el botón de arriba
              </p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
