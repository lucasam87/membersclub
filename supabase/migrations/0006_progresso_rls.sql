create table public.quiz_tentativas (
  id uuid primary key default gen_random_uuid(),
  quiz_id uuid not null references public.quizzes(id) on delete cascade,
  usuario_id uuid not null references public.usuarios(id) on delete cascade,
  nota numeric not null,
  aprovado boolean not null,
  criado_em timestamptz not null default now()
);

create index quiz_tentativas_quiz_usuario_idx on public.quiz_tentativas (quiz_id, usuario_id);

create table public.progresso_aluno (
  id uuid primary key default gen_random_uuid(),
  usuario_id uuid not null references public.usuarios(id) on delete cascade,
  aula_id uuid not null references public.aulas(id) on delete cascade,
  concluida boolean not null default false,
  liberada boolean not null default false,
  unique (usuario_id, aula_id)
);

create table public.notas_pessoais (
  id uuid primary key default gen_random_uuid(),
  usuario_id uuid not null references public.usuarios(id) on delete cascade,
  aula_id uuid not null references public.aulas(id) on delete cascade,
  conteudo text,
  unique (usuario_id, aula_id)
);

create table public.assinaturas (
  id uuid primary key default gen_random_uuid(),
  usuario_id uuid not null references public.usuarios(id) on delete cascade,
  status text not null default 'pendente' check (status in ('ativo', 'atrasado', 'bloqueado', 'pendente')),
  data_vencimento date,
  gateway text
);

alter table public.quiz_tentativas enable row level security;
alter table public.progresso_aluno enable row level security;
alter table public.notas_pessoais enable row level security;
alter table public.assinaturas enable row level security;

-- quiz_tentativas e progresso_aluno guardam o resultado da correcao e o
-- estado de liberacao das aulas. Se o aluno pudesse escrever essas tabelas
-- diretamente (via REST/client), poderia apagar tentativas para burlar
-- max_tentativas ou setar liberada=true em qualquer aula, pulando o quiz.
-- Por isso so' leem o proprio registro; toda escrita passa pelo endpoint
-- app/api/quiz/submit, que usa o client com service role apos validar a
-- identidade do usuario e a regra de negocio no servidor.
create policy "quiz_tentativas_select_own" on public.quiz_tentativas
  for select to authenticated
  using (auth.uid() = usuario_id or public.is_admin());
create policy "quiz_tentativas_admin_write" on public.quiz_tentativas
  for insert to authenticated with check (public.is_admin());
create policy "quiz_tentativas_admin_update" on public.quiz_tentativas
  for update to authenticated using (public.is_admin()) with check (public.is_admin());
create policy "quiz_tentativas_admin_delete" on public.quiz_tentativas
  for delete to authenticated using (public.is_admin());

create policy "progresso_aluno_select_own" on public.progresso_aluno
  for select to authenticated
  using (auth.uid() = usuario_id or public.is_admin());
create policy "progresso_aluno_admin_write" on public.progresso_aluno
  for insert to authenticated with check (public.is_admin());
create policy "progresso_aluno_admin_update" on public.progresso_aluno
  for update to authenticated using (public.is_admin()) with check (public.is_admin());
create policy "progresso_aluno_admin_delete" on public.progresso_aluno
  for delete to authenticated using (public.is_admin());

-- notas_pessoais e' conteudo livre do aluno (nao afeta progresso/nota), sem
-- risco de "trapaça" em permitir escrita direta do dono.
create policy "notas_pessoais_owner" on public.notas_pessoais
  for all to authenticated
  using (auth.uid() = usuario_id or public.is_admin())
  with check (auth.uid() = usuario_id or public.is_admin());

-- assinaturas so' e' escrita pelo webhook Pix (service role, Fase 4) ou
-- pelo admin; o aluno so' pode ler o proprio status.
create policy "assinaturas_select_own" on public.assinaturas
  for select to authenticated
  using (auth.uid() = usuario_id or public.is_admin());
create policy "assinaturas_admin_write" on public.assinaturas
  for insert to authenticated with check (public.is_admin());
create policy "assinaturas_admin_update" on public.assinaturas
  for update to authenticated using (public.is_admin()) with check (public.is_admin());
create policy "assinaturas_admin_delete" on public.assinaturas
  for delete to authenticated using (public.is_admin());
