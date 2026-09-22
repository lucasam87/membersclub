create table public.materiais (
  id uuid primary key default gen_random_uuid(),
  aula_id uuid not null references public.aulas(id) on delete cascade,
  nome_arquivo text not null,
  url_arquivo text not null,
  tipo text
);

create index materiais_aula_id_idx on public.materiais (aula_id);

create table public.quizzes (
  id uuid primary key default gen_random_uuid(),
  aula_id uuid not null unique references public.aulas(id) on delete cascade,
  nota_minima numeric not null default 70 check (nota_minima >= 0 and nota_minima <= 100),
  max_tentativas int not null default 3 check (max_tentativas > 0)
);

create table public.quiz_perguntas (
  id uuid primary key default gen_random_uuid(),
  quiz_id uuid not null references public.quizzes(id) on delete cascade,
  enunciado text not null,
  ordem int not null default 0
);

create index quiz_perguntas_quiz_id_idx on public.quiz_perguntas (quiz_id);

create table public.quiz_alternativas (
  id uuid primary key default gen_random_uuid(),
  pergunta_id uuid not null references public.quiz_perguntas(id) on delete cascade,
  texto text not null,
  correta boolean not null default false
);

create index quiz_alternativas_pergunta_id_idx on public.quiz_alternativas (pergunta_id);

alter table public.materiais enable row level security;
alter table public.quizzes enable row level security;
alter table public.quiz_perguntas enable row level security;
alter table public.quiz_alternativas enable row level security;

create policy "materiais_select_auth" on public.materiais
  for select to authenticated using (true);
create policy "materiais_admin_write" on public.materiais
  for all to authenticated using (public.is_admin()) with check (public.is_admin());

create policy "quizzes_select_auth" on public.quizzes
  for select to authenticated using (true);
create policy "quizzes_admin_write" on public.quizzes
  for all to authenticated using (public.is_admin()) with check (public.is_admin());

create policy "quiz_perguntas_select_auth" on public.quiz_perguntas
  for select to authenticated using (true);
create policy "quiz_perguntas_admin_write" on public.quiz_perguntas
  for all to authenticated using (public.is_admin()) with check (public.is_admin());

-- RLS impede alteracao por nao-admin, mas nao esconde colunas: sem a funcao
-- quiz_alternativas_do_quiz (ver 0005b), qualquer authenticated poderia ler
-- `correta` direto da tabela via REST e colar respostas. Por isso o SELECT
-- bruto e' restrito a admin.
create policy "quiz_alternativas_admin_all" on public.quiz_alternativas
  for all to authenticated using (public.is_admin()) with check (public.is_admin());
