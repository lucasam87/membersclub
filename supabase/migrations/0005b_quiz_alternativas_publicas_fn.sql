-- Expoe id/pergunta_id/texto das alternativas de um quiz para qualquer
-- authenticated, sem a coluna `correta`. Usa security definer (mesma tecnica
-- de is_admin()) em vez de uma view, pois uma view "security definer" e'
-- sinalizada como erro pelo linter de seguranca do Supabase.
create function public.quiz_alternativas_do_quiz(p_quiz_id uuid)
returns table (id uuid, pergunta_id uuid, texto text)
language sql
stable
security definer
set search_path = public
as $$
  select qa.id, qa.pergunta_id, qa.texto
  from public.quiz_alternativas qa
  join public.quiz_perguntas qp on qp.id = qa.pergunta_id
  where qp.quiz_id = p_quiz_id;
$$;

revoke execute on function public.quiz_alternativas_do_quiz(uuid) from public, anon;
grant execute on function public.quiz_alternativas_do_quiz(uuid) to authenticated;
