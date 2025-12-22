'use client'

import { createClient } from '@/lib/supabase/client'
import { useRouter } from 'next/navigation'
import { LogOut, FileText, Building2 } from 'lucide-react'
import { Button } from '@/components/ui/button'
import type { User } from '@supabase/supabase-js'
import type { User as Profile } from '@/lib/types'

interface DashboardNavProps {
  user: User
  profile: Profile | null
}

export function DashboardNav({ user, profile }: DashboardNavProps) {
  const router = useRouter()
  const supabase = createClient()

  const handleLogout = async () => {
    await supabase.auth.signOut()
    router.push('/login')
    router.refresh()
  }

  return (
    <header className="sticky top-0 z-50 bg-surface border-b border-gray-100">
      <div className="container mx-auto px-4">
        <div className="flex h-16 items-center justify-between">
          {/* Logo */}
          <div className="flex items-center gap-8">
            <a href="/dashboard" className="text-xl font-bold">
              Tandem<span className="text-primary">Studio</span>
            </a>
            <nav className="hidden md:flex items-center gap-6">
              <a
                href="/dashboard"
                className="text-sm font-medium text-muted hover:text-foreground transition-colors flex items-center gap-2"
              >
                <FileText className="w-4 h-4" />
                Reportes
              </a>
              {profile?.role === 'admin' && (
                <a
                  href="/dashboard/admin"
                  className="text-sm font-medium text-muted hover:text-foreground transition-colors flex items-center gap-2"
                >
                  <Building2 className="w-4 h-4" />
                  Empresas
                </a>
              )}
            </nav>
          </div>

          {/* User menu */}
          <div className="flex items-center gap-4">
            <div className="hidden sm:block text-right">
              <p className="text-sm font-medium">{profile?.full_name || user.email}</p>
              {profile?.company && (
                <p className="text-xs text-muted">{profile.company.name}</p>
              )}
            </div>
            <Button variant="ghost" size="sm" onClick={handleLogout}>
              <LogOut className="w-4 h-4" />
              <span className="hidden sm:inline ml-2">Salir</span>
            </Button>
          </div>
        </div>
      </div>
    </header>
  )
}
