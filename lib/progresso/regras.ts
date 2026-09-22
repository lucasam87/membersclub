import type { SupabaseClient } from '@supabase/supabase-js'
import type { Database, Tables } from '@/types/database'

// A sequencia de bloqueio e' formada pelas aulas que compartilham o mesmo
// categoria_id (a subcategoria). Navegacao entre subcategorias diferentes e'
// sempre livre (cada uma tem sua propria sequencia independente).
export function isAulaLiberada(
  aula: Pick<Tables<'aulas'>, 'ordem'>,
  minOrdemNaSequencia: number,
  progresso?: Pick<Tables<'progresso_aluno'>, 'liberada'> | null
) {
  return progresso?.liberada === true || aula.ordem === minOrdemNaSequencia
}

// Marca a aula atual como concluida e libera a proxima da mesma sequencia
// (mesma categoria_id), se existir. Usa um client com service role: escrever
// progresso_aluno diretamente do client do usuario seria uma falha de
// seguranca (o aluno poderia setar liberada=true em qualquer aula via REST).
// So' deve ser chamada a partir de codigo de servidor que ja validou a regra
// de negocio (ex.: app/api/quiz/submit apos aprovacao, ou uma acao explicita
// de "marcar como concluida" para aulas sem quiz).
export async function liberarProximaAula(
  supabaseServiceRole: SupabaseClient<Database>,
  usuarioId: string,
  aulaAtualId: string
) {
  const { data: aulaAtual } = await supabaseServiceRole
    .from('aulas')
    .select('id, categoria_id, ordem')
    .eq('id', aulaAtualId)
    .single()

  if (!aulaAtual) return

  await supabaseServiceRole
    .from('progresso_aluno')
    .upsert(
      { usuario_id: usuarioId, aula_id: aulaAtual.id, concluida: true },
      { onConflict: 'usuario_id,aula_id' }
    )

  const { data: sequencia } = await supabaseServiceRole
    .from('aulas')
    .select('id, ordem')
    .eq('categoria_id', aulaAtual.categoria_id)
    .order('ordem')

  const lista = sequencia ?? []
  const indiceAtual = lista.findIndex((a) => a.id === aulaAtual.id)
  const proxima = indiceAtual >= 0 ? lista[indiceAtual + 1] : undefined

  if (proxima) {
    await supabaseServiceRole
      .from('progresso_aluno')
      .upsert(
        { usuario_id: usuarioId, aula_id: proxima.id, liberada: true },
        { onConflict: 'usuario_id,aula_id' }
      )
  }
}

// Calcula, para uma lista de aulas (potencialmente de varias categorias),
// quais estao liberadas para o usuario — usado pelos cards do catalogo
// (Home, categoria, busca). Agrupa por categoria_id pois cada categoria tem
// sua propria sequencia independente de bloqueio.
export async function mapaLiberacao(
  supabase: SupabaseClient<Database>,
  usuarioId: string | undefined,
  aulas: Pick<Tables<'aulas'>, 'id' | 'categoria_id' | 'ordem'>[]
): Promise<Map<string, boolean>> {
  const mapa = new Map<string, boolean>()
  if (aulas.length === 0) return mapa

  const minOrdemPorCategoria = new Map<string, number>()
  for (const aula of aulas) {
    const atual = minOrdemPorCategoria.get(aula.categoria_id)
    if (atual === undefined || aula.ordem < atual) {
      minOrdemPorCategoria.set(aula.categoria_id, aula.ordem)
    }
  }

  const progressoPorAula = new Map<string, boolean>()
  if (usuarioId) {
    const { data: progressos } = await supabase
      .from('progresso_aluno')
      .select('aula_id, liberada')
      .eq('usuario_id', usuarioId)
      .in('aula_id', aulas.map((a) => a.id))
    for (const p of progressos ?? []) {
      progressoPorAula.set(p.aula_id, p.liberada)
    }
  }

  for (const aula of aulas) {
    const minOrdem = minOrdemPorCategoria.get(aula.categoria_id) ?? 0
    mapa.set(
      aula.id,
      progressoPorAula.get(aula.id) === true || aula.ordem === minOrdem
    )
  }

  return mapa
}
