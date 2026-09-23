'use server'

import { redirect } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'

export async function cadastrar(formData: FormData) {
  const nome = String(formData.get('nome') ?? '')
  const email = String(formData.get('email') ?? '')
  const password = String(formData.get('password') ?? '')

  const supabase = await createClient()
  const { error } = await supabase.auth.signUp({
    email,
    password,
    options: { data: { nome } },
  })

  if (error) {
    redirect(`/cadastro?erro=${encodeURIComponent(error.message)}`)
  }

  redirect('/inicio')
}
