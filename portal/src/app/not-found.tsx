import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Home } from 'lucide-react'

export default function NotFound() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-background">
      <div className="text-center">
        <h1 className="text-6xl font-bold text-primary mb-4">404</h1>
        <h2 className="text-2xl font-semibold mb-2">Página no encontrada</h2>
        <p className="text-muted mb-8">
          La página que buscás no existe o fue movida.
        </p>
        <Link href="/dashboard">
          <Button>
            <Home className="w-4 h-4 mr-2" />
            Volver al inicio
          </Button>
        </Link>
      </div>
    </div>
  )
}
