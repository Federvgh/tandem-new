'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card'
import { Mail, CheckCircle, KeyRound } from 'lucide-react'

const supabase = createClient()

const isValidEmail = (email: string) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)

export default function LoginPage() {
  const router = useRouter()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const [sent, setSent] = useState(false)
  const [error, setError] = useState('')
  const [usePassword, setUsePassword] = useState(false)

  // Password login (for testing)
  const handlePasswordLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError('')

    if (!isValidEmail(email)) {
      setError('Email inválido')
      setLoading(false)
      return
    }

    const { error } = await supabase.auth.signInWithPassword({
      email,
      password,
    })

    if (error) {
      setError(error.message)
      setLoading(false)
      return
    }

    router.push('/dashboard')
    router.refresh()
  }

  // Magic Link login
  const handleMagicLinkLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError('')

    if (!isValidEmail(email)) {
      setError('Email inválido')
      setLoading(false)
      return
    }

    const { error } = await supabase.auth.signInWithOtp({
      email,
      options: {
        emailRedirectTo: `${window.location.origin}/auth/callback`,
      },
    })

    if (error) {
      setError(error.message)
      setLoading(false)
      return
    }

    setSent(true)
    setLoading(false)
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-dark via-dark to-primary/20 p-4">
      <div className="w-full max-w-md">
        {/* Logo */}
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-white">
            Tandem<span className="text-primary">Studio</span>
          </h1>
          <p className="text-gray-400 mt-2">Portal de Clientes</p>
        </div>

        <Card>
          <CardHeader className="text-center">
            <CardTitle>
              {sent ? 'Revisá tu email' : 'Iniciar Sesión'}
            </CardTitle>
            <CardDescription>
              {sent
                ? 'Te enviamos un link de acceso'
                : usePassword
                  ? 'Ingresá tus credenciales'
                  : 'Ingresá tu email para recibir un link de acceso'}
            </CardDescription>
          </CardHeader>
          <CardContent>
            {sent ? (
              <div className="text-center py-4">
                <div className="mx-auto w-16 h-16 bg-success/10 rounded-full flex items-center justify-center mb-4">
                  <CheckCircle className="w-8 h-8 text-success" />
                </div>
                <p className="text-sm text-muted">
                  Enviamos un link de acceso a <strong>{email}</strong>
                </p>
                <p className="text-xs text-muted-foreground mt-2">
                  El link expira en 1 hora
                </p>
                <Button
                  variant="ghost"
                  className="mt-4"
                  onClick={() => {
                    setSent(false)
                    setEmail('')
                  }}
                >
                  Usar otro email
                </Button>
              </div>
            ) : usePassword ? (
              // Password login form
              <form onSubmit={handlePasswordLogin} className="space-y-4">
                <Input
                  type="email"
                  label="Email"
                  placeholder="tu@empresa.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  autoFocus
                />
                <Input
                  type="password"
                  label="Contraseña"
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  error={error}
                  required
                />
                <Button
                  type="submit"
                  className="w-full"
                  size="lg"
                  loading={loading}
                >
                  <KeyRound className="w-4 h-4 mr-2" />
                  Iniciar Sesión
                </Button>
                <Button
                  type="button"
                  variant="ghost"
                  className="w-full"
                  onClick={() => {
                    setUsePassword(false)
                    setError('')
                  }}
                >
                  Usar Magic Link
                </Button>
              </form>
            ) : (
              // Magic Link form
              <form onSubmit={handleMagicLinkLogin} className="space-y-4">
                <Input
                  type="email"
                  label="Email"
                  placeholder="tu@empresa.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  error={error}
                  required
                  autoFocus
                />
                <Button
                  type="submit"
                  className="w-full"
                  size="lg"
                  loading={loading}
                >
                  <Mail className="w-4 h-4 mr-2" />
                  Enviar link de acceso
                </Button>
                {/* Testing only - password login toggle */}
                <Button
                  type="button"
                  variant="ghost"
                  className="w-full text-xs"
                  onClick={() => {
                    setUsePassword(true)
                    setError('')
                  }}
                >
                  Usar contraseña (testing)
                </Button>
              </form>
            )}
          </CardContent>
        </Card>

        <p className="text-center text-xs text-gray-500 mt-6">
          {usePassword
            ? 'Login con contraseña (solo para testing)'
            : 'Usamos Magic Links para un acceso seguro sin contraseñas'}
        </p>
      </div>
    </div>
  )
}
