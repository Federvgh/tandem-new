// Database types for Tandem Studio Portal

export interface Company {
  id: string
  name: string
  slug: string
  contact_email: string | null
  logo_url: string | null
  created_at: string
  updated_at: string
}

export interface User {
  id: string
  email: string
  full_name: string | null
  company_id: string | null
  role: 'client' | 'admin'
  created_at: string
  updated_at: string
  company?: Company
}

export interface Report {
  id: string
  company_id: string
  title: string
  period_month: number
  period_year: number
  status: 'draft' | 'published'
  pdf_path: string | null
  created_at: string
  published_at: string | null
  created_by: string | null
  company?: Company
}

// Helper to get month name in Spanish
export const MONTH_NAMES = [
  'Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio',
  'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre'
]

export function getMonthName(month: number): string {
  return MONTH_NAMES[month - 1] || ''
}

export function formatPeriod(month: number, year: number): string {
  return `${getMonthName(month)} ${year}`
}
