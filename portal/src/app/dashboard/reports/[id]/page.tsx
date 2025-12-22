import { createClient } from '@/lib/supabase/server'
import { notFound } from 'next/navigation'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { ArrowLeft, Download, Calendar, Building2 } from 'lucide-react'
import { formatPeriod } from '@/lib/types'
import Link from 'next/link'

interface ReportPageProps {
  params: Promise<{ id: string }>
}

export default async function ReportPage({ params }: ReportPageProps) {
  const { id } = await params
  const supabase = await createClient()

  const { data: report, error } = await supabase
    .from('reports')
    .select(`
      *,
      company:companies(name, slug)
    `)
    .eq('id', id)
    .single()

  if (error || !report) {
    notFound()
  }

  return (
    <div>
      {/* Back button */}
      <Link
        href="/dashboard"
        className="inline-flex items-center text-sm text-muted hover:text-foreground mb-6"
      >
        <ArrowLeft className="w-4 h-4 mr-2" />
        Volver al Dashboard
      </Link>

      {/* Report Header */}
      <Card className="mb-6">
        <CardHeader>
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div>
              <CardTitle className="text-2xl">{report.title}</CardTitle>
              <div className="flex items-center gap-4 mt-2 text-sm text-muted">
                <span className="flex items-center gap-1">
                  <Calendar className="w-4 h-4" />
                  {formatPeriod(report.period_month, report.period_year)}
                </span>
                {report.company && (
                  <span className="flex items-center gap-1">
                    <Building2 className="w-4 h-4" />
                    {report.company.name}
                  </span>
                )}
              </div>
            </div>
            {report.pdf_path && (
              <Link href={`/dashboard/reports/${report.id}/download`}>
                <Button>
                  <Download className="w-4 h-4 mr-2" />
                  Descargar PDF
                </Button>
              </Link>
            )}
          </div>
        </CardHeader>
      </Card>

      {/* Report Content Placeholder */}
      <Card>
        <CardContent className="py-12 text-center">
          <p className="text-muted">
            El contenido del reporte se mostrará aquí.
          </p>
          <p className="text-sm text-muted-foreground mt-2">
            Por ahora, podés descargar el PDF para ver el reporte completo.
          </p>
        </CardContent>
      </Card>
    </div>
  )
}
