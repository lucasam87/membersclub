-- Hierarquia flexivel: Categoria > Subcategoria (opcional) > Aula
create table public.categorias (
  id uuid primary key default gen_random_uuid(),
  nome text not null,
  slug text not null unique,
  categoria_pai_id uuid references public.categorias(id) on delete cascade,
  ordem int not null default 0
);

create index categorias_categoria_pai_id_idx on public.categorias (categoria_pai_id);

create table public.aulas (
  id uuid primary key default gen_random_uuid(),
  categoria_id uuid not null references public.categorias(id) on delete cascade,
  titulo text not null,
  descricao text,
  youtube_url text not null,
  ordem int not null default 0
);

create index aulas_categoria_id_idx on public.aulas (categoria_id);

alter table public.categorias enable row level security;
alter table public.aulas enable row level security;

create policy "categorias_select_auth" on public.categorias
  for select to authenticated using (true);
create policy "categorias_admin_write" on public.categorias
  for all to authenticated using (public.is_admin()) with check (public.is_admin());

create policy "aulas_select_auth" on public.aulas
  for select to authenticated using (true);
create policy "aulas_admin_write" on public.aulas
  for all to authenticated using (public.is_admin()) with check (public.is_admin());
