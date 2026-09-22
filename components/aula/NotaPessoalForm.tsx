'use client'

import { useEffect, useRef, useState } from 'react'
import { Textarea } from '@/components/ui/textarea'
import { salvarNotaPessoal } from '@/lib/notas/actions'

export function NotaPessoalForm({ aulaId, conteudoInicial }: { aulaId: string; conteudoInicial: string }) {
  const [valor, setValor] = useState(conteudoInicial)
  const [status, setStatus] = useState<'idle' | 'salvando' | 'salvo'>('idle')
  const timeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null)

  function onChange(texto: string) {
    setValor(texto)
    setStatus('salvando')
    if (timeoutRef.current) clearTimeout(timeoutRef.current)
    timeoutRef.current = setTimeout(async () => {
      await salvarNotaPessoal(aulaId, texto)
      setStatus('salvo')
    }, 800)
  }

  useEffect(() => {
    return () => {
      if (timeoutRef.current) clearTimeout(timeoutRef.current)
    }
  }, [])

  return (
    <div className="space-y-1">
      <Textarea
        value={valor}
        onChange={(e) => onChange(e.target.value)}
        placeholder="Suas anotacoes sobre esta aula..."
        rows={5}
      />
      {status !== 'idle' && (
        <p className="text-xs text-muted-foreground">
          {status === 'salvando' ? 'Salvando...' : 'Salvo'}
        </p>
      )}
    </div>
  )
}
