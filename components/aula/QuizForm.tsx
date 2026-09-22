'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'

type Alternativa = { id: string; texto: string }
type Pergunta = { id: string; enunciado: string; alternativas: Alternativa[] }

export function QuizForm({
  quizId,
  perguntas,
  notaMinima,
  tentativasRestantesInicial,
}: {
  quizId: string
  perguntas: Pergunta[]
  notaMinima: number
  tentativasRestantesInicial: number
}) {
  const router = useRouter()
  const [respostas, setRespostas] = useState<Record<string, string>>({})
  const [enviando, setEnviando] = useState(false)
  const [resultado, setResultado] = useState<{
    nota: number
    aprovado: boolean
    tentativasRestantes: number
  } | null>(null)
  const [erro, setErro] = useState<string | null>(null)

  const tentativasRestantes = resultado?.tentativasRestantes ?? tentativasRestantesInicial
  const esgotado = tentativasRestantes <= 0 && !resultado?.aprovado

  async function enviar() {
    setEnviando(true)
    setErro(null)
    try {
      const res = await fetch('/api/quiz/submit', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ quizId, respostas }),
      })
      const data = await res.json()
      if (!res.ok) {
        setErro(data.error ?? 'Erro ao enviar respostas.')
        return
      }
      setResultado(data)
      if (data.aprovado) router.refresh()
    } catch {
      setErro('Erro de conexao. Tente novamente.')
    } finally {
      setEnviando(false)
    }
  }

  if (resultado?.aprovado) {
    return (
      <div className="space-y-2 rounded-md border border-border p-3 text-sm">
        <p className="font-medium text-foreground">Aprovado! Nota: {resultado.nota.toFixed(0)}</p>
        <p className="text-muted-foreground">A proxima aula da sequencia foi liberada.</p>
      </div>
    )
  }

  if (esgotado) {
    return (
      <div className="space-y-2 rounded-md border border-border p-3 text-sm">
        <p className="font-medium text-destructive">Tentativas esgotadas.</p>
        {resultado && <p className="text-muted-foreground">Ultima nota: {resultado.nota.toFixed(0)}</p>}
      </div>
    )
  }

  return (
    <div className="space-y-4">
      <p className="text-xs text-muted-foreground">
        Nota minima: {notaMinima} · Tentativas restantes: {tentativasRestantes}
      </p>

      {perguntas.map((pergunta, i) => (
        <fieldset key={pergunta.id} className="space-y-2">
          <legend className="text-sm font-medium">
            {i + 1}. {pergunta.enunciado}
          </legend>
          <div className="space-y-1">
            {pergunta.alternativas.map((alt) => (
              <label key={alt.id} className="flex items-center gap-2 text-sm">
                <input
                  type="radio"
                  name={pergunta.id}
                  value={alt.id}
                  checked={respostas[pergunta.id] === alt.id}
                  onChange={() => setRespostas((r) => ({ ...r, [pergunta.id]: alt.id }))}
                  className="size-3.5 accent-primary"
                />
                {alt.texto}
              </label>
            ))}
          </div>
        </fieldset>
      ))}

      {resultado && !resultado.aprovado && (
        <p className="text-sm text-destructive">
          Nao aprovado (nota {resultado.nota.toFixed(0)}). Tente novamente.
        </p>
      )}
      {erro && <p className="text-sm text-destructive">{erro}</p>}

      <Button
        onClick={enviar}
        disabled={enviando || Object.keys(respostas).length < perguntas.length}
      >
        {enviando ? 'Enviando...' : 'Enviar respostas'}
      </Button>
    </div>
  )
}
