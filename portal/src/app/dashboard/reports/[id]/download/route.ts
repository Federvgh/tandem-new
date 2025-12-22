import { createClient } from '@/lib/supabase/server'
import { NextResponse } from 'next/server'

interface DownloadRouteProps {
  params: Promise<{ id: string }>
}

export async function GET(request: Request, { params }: DownloadRouteProps) {
  const { id } = await params
  const supabase = await createClient()

  // Get the report
  const { data: report, error: reportError } = await supabase
    .from('reports')
    .select('pdf_path, title, period_month, period_year')
    .eq('id', id)
    .single()

  if (reportError || !report?.pdf_path) {
    return NextResponse.json({ error: 'Report not found' }, { status: 404 })
  }

  // Create signed URL for download (valid for 15 minutes)
  const { data, error: storageError } = await supabase
    .storage
    .from('reports')
    .createSignedUrl(report.pdf_path, 60 * 15)

  if (storageError || !data?.signedUrl) {
    return NextResponse.json({ error: 'Could not generate download URL' }, { status: 500 })
  }

  // Redirect to the signed URL
  return NextResponse.redirect(data.signedUrl)
}
