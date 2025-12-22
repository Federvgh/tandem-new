import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { FileText, Download, Calendar } from 'lucide-react'
import { formatPeriod, type Report } from '@/lib/types'
import Link from 'next/link'

type ReportWithCompany = Report & { company: { name: string; slug: string } }

export default async function DashboardPage() {
  const supabase = await createClient()

  const { data: { user } } = await supabase.auth.getUser()

  if (!user) {
    redirect('/login')
  }

  // Get user profile to check role
  const { data: profile } = await supabase
    .from('users')
    .select('role, company_id')
    .eq('id', user?.id)
    .single()

  // Get reports based on user role
  let reportsQuery = supabase
    .from('reports')
    .select(`
      *,
      company:companies(name, slug)
    `)
    .eq('status', 'published')
    .order('period_year', { ascending: false })
    .order('period_month', { ascending: false })

  // If not admin, filter by company
  if (profile?.role !== 'admin' && profile?.company_id) {
    reportsQuery = reportsQuery.eq('company_id', profile.company_id)
  }

  const { data: reports } = await reportsQuery

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-2xl font-bold">Dashboard</h1>
        <p className="text-muted mt-1">
          {profile?.role === 'admin'
            ? 'Todos los reportes publicados'
            : 'Tus reportes de infraestructura'}
        </p>
      </div>

      {/* Reports Grid */}
      {reports && reports.length > 0 ? (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {reports.map((report: ReportWithCompany) => (
            <Card key={report.id} className="hover:shadow-md transition-shadow">
              <CardHeader className="pb-3">
                <div className="flex items-start justify-between">
                  <div className="p-2 bg-primary/10 rounded-lg">
                    <FileText className="w-5 h-5 text-primary" />
                  </div>
                  {profile?.role === 'admin' && (
                    <span className="text-xs text-muted bg-gray-100 px-2 py-1 rounded">
                      {report.company?.name}
                    </span>
                  )}
                </div>
                <CardTitle className="text-lg mt-3">{report.title}</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex items-center text-sm text-muted mb-4">
                  <Calendar className="w-4 h-4 mr-2" />
                  {formatPeriod(report.period_month, report.period_year)}
                </div>
                <div className="flex gap-2">
                  <Link
                    href={`/dashboard/reports/${report.id}`}
                    className="flex-1 inline-flex items-center justify-center h-9 px-4 text-sm font-medium rounded-lg bg-primary text-white hover:bg-primary-dark transition-colors"
                  >
                    Ver Reporte
                  </Link>
                  {report.pdf_path && (
                    <Link
                      href={`/dashboard/reports/${report.id}/download`}
                      className="inline-flex items-center justify-center h-9 w-9 rounded-lg border border-gray-200 hover:bg-gray-50 transition-colors"
                    >
                      <Download className="w-4 h-4" />
                    </Link>
                  )}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      ) : (
        <Card className="text-center py-12">
          <CardContent>
            <div className="mx-auto w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mb-4">
              <FileText className="w-8 h-8 text-muted" />
            </div>
            <h3 className="text-lg font-medium mb-2">No hay reportes disponibles</h3>
            <p className="text-muted text-sm">
              Los reportes aparecerán aquí cuando estén publicados
            </p>
          </CardContent>
        </Card>
      )}
    </div>
  )
}
