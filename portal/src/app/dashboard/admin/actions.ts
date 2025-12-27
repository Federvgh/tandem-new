'use server'

import { createClient } from '@/lib/supabase/server'
import { supabaseAdmin } from '@/lib/supabase/admin'
import { revalidatePath } from 'next/cache'

// Helper to verify admin role
async function verifyAdmin() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) {
    throw new Error('No autenticado')
  }

  const { data: profile } = await supabase
    .from('users')
    .select('role')
    .eq('id', user.id)
    .single()

  if (profile?.role !== 'admin') {
    throw new Error('No autorizado')
  }

  return user
}

// Generate slug from company name
function generateSlug(name: string): string {
  return name
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '') // Remove accents
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-|-$/g, '')
}

// Create a new company
export async function createCompany(formData: FormData) {
  await verifyAdmin()

  const name = formData.get('name') as string
  const contactEmail = formData.get('contactEmail') as string | null

  if (!name || name.trim().length < 2) {
    return { error: 'Nombre de empresa requerido' }
  }

  const slug = generateSlug(name)

  const { data, error } = await supabaseAdmin
    .from('companies')
    .insert({
      name: name.trim(),
      slug,
      contact_email: contactEmail?.trim() || null,
    })
    .select()
    .single()

  if (error) {
    if (error.code === '23505') {
      return { error: 'Ya existe una empresa con ese nombre' }
    }
    return { error: error.message }
  }

  revalidatePath('/dashboard/admin')
  return { success: true, company: data }
}

// Invite a new user to a company
export async function inviteUser(formData: FormData) {
  await verifyAdmin()

  const email = formData.get('email') as string
  const fullName = formData.get('fullName') as string
  const companyId = formData.get('companyId') as string

  if (!email || !email.includes('@')) {
    return { error: 'Email inválido' }
  }

  if (!fullName || fullName.trim().length < 2) {
    return { error: 'Nombre requerido' }
  }

  if (!companyId) {
    return { error: 'Empresa requerida' }
  }

  // Check if user already exists
  const { data: existingUser } = await supabaseAdmin
    .from('users')
    .select('id')
    .eq('email', email.toLowerCase())
    .single()

  if (existingUser) {
    return { error: 'Este email ya está registrado' }
  }

  // Create user in Auth with magic link invite
  const { data: authUser, error: authError } = await supabaseAdmin.auth.admin.createUser({
    email: email.toLowerCase(),
    email_confirm: false, // User needs to click magic link
    user_metadata: {
      full_name: fullName.trim(),
    },
  })

  if (authError) {
    return { error: authError.message }
  }

  // Update the user record with company and name
  // (trigger already created base record)
  const { error: updateError } = await supabaseAdmin
    .from('users')
    .update({
      full_name: fullName.trim(),
      company_id: companyId,
    })
    .eq('id', authUser.user.id)

  if (updateError) {
    return { error: updateError.message }
  }

  // Send magic link for user to activate account
  const { error: inviteError } = await supabaseAdmin.auth.admin.generateLink({
    type: 'magiclink',
    email: email.toLowerCase(),
    options: {
      redirectTo: `${process.env.NEXT_PUBLIC_SITE_URL || 'https://portal.tandemstudio.cloud'}/auth/callback`,
    },
  })

  if (inviteError) {
    console.error('Error sending invite:', inviteError)
    // User is created, but invite failed - they can use normal login
  }

  revalidatePath('/dashboard/admin')
  return { success: true }
}

// Delete a user
export async function deleteUser(userId: string) {
  await verifyAdmin()

  if (!userId) {
    return { error: 'ID de usuario requerido' }
  }

  // Delete from Auth (will cascade to users table via trigger)
  const { error } = await supabaseAdmin.auth.admin.deleteUser(userId)

  if (error) {
    return { error: error.message }
  }

  revalidatePath('/dashboard/admin')
  return { success: true }
}

// Get all companies with user count
export async function getCompaniesWithUsers() {
  await verifyAdmin()

  const { data, error } = await supabaseAdmin
    .from('companies')
    .select(`
      *,
      users:users(count)
    `)
    .order('name')

  if (error) {
    throw new Error(error.message)
  }

  return data
}

// Get users for a specific company
export async function getCompanyUsers(companyId: string) {
  await verifyAdmin()

  const { data, error } = await supabaseAdmin
    .from('users')
    .select('*')
    .eq('company_id', companyId)
    .order('full_name')

  if (error) {
    throw new Error(error.message)
  }

  return data
}
