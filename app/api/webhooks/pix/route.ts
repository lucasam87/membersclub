// TODO: implementar o webhook do gateway Pix quando o gateway for escolhido
// (pendencia documentada em CLAUDE.md secao 12).
//
// Responsabilidades esperadas quando implementado:
// - Verificar a assinatura/secret do webhook do gateway escolhido
//   (comparar contra PIX_WEBHOOK_SECRET em .env.local, nunca confiar no
//   payload sem validar a origem)
// - Parsear o evento de pagamento (pago / falhou / atrasado) no formato
//   especifico do gateway
// - Fazer upsert na tabela `assinaturas` (status, data_vencimento, gateway)
//   para o usuario_id correspondente, usando o client com service role
//   (ver lib/supabase/service.ts) — o gateway nao tem sessao de usuario
// - Nao implementar aqui a logica de bloqueio automatico apos os 2 dias de
//   tolerancia (CLAUDE.md secao 5): isso pertence a um job agendado
//   separado que roda periodicamente, nao a reacao a um unico evento de
//   webhook.
export async function POST() {
  return new Response(null, { status: 501 })
}
