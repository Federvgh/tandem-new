'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { UserPlus, X } from 'lucide-react'
import { inviteUser } from '../../actions'

interface InviteUserFormProps {
  companyId: string
  companyName: string
}

export function InviteUserForm({ companyId, companyName }: InviteUserFormProps) {
  const [isOpen, setIsOpen] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState(false)

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setLoading(true)
    setError('')
    setSuccess(false)

    const formData = new FormData(e.currentTarget)
    formData.append('companyId', companyId)

    const result = await inviteUser(formData)

    if (result.error) {
      setError(result.error)
      setLoading(false)
      return
    }

    setSuccess(true)
    setLoading(false)

    // Close after showing success
    setTimeout(() => {
      setIsOpen(false)
      setSuccess(false)
    }, 2000)
  }

  if (!isOpen) {
    return (
      <Button onClick={() => setIsOpen(true)}>
        <UserPlus className="w-4 h-4 mr-2" />
        Invitar Usuario
      </Button>
    )
  }

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl shadow-xl w-full max-w-md">
        <div className="flex items-center justify-between p-4 border-b">
          <div>
            <h2 className="text-lg font-semibold">Invitar Usuario</h2>
            <p className="text-sm text-muted">{companyName}</p>
          </div>
          <button
            onClick={() => setIsOpen(false)}
            className="p-1 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {success ? (
          <div className="p-8 text-center">
            <div className="mx-auto w-16 h-16 bg-success/10 rounded-full flex items-center justify-center mb-4">
              <UserPlus className="w-8 h-8 text-success" />
            </div>
            <p className="font-medium">Usuario creado</p>
            <p className="text-sm text-muted mt-1">
              El usuario recibirá un email para activar su cuenta
            </p>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="p-4 space-y-4">
            <Input
              name="fullName"
              label="Nombre completo"
              placeholder="Juan Pérez"
              required
              autoFocus
            />

            <Input
              name="email"
              type="email"
              label="Email"
              placeholder="juan@empresa.com"
              required
            />

            {error && (
              <p className="text-sm text-error">{error}</p>
            )}

            <div className="flex gap-3 pt-2">
              <Button
                type="button"
                variant="secondary"
                className="flex-1"
                onClick={() => setIsOpen(false)}
              >
                Cancelar
              </Button>
              <Button type="submit" className="flex-1" loading={loading}>
                Invitar
              </Button>
            </div>
          </form>
        )}
      </div>
    </div>
  )
}
