create table public.banner (
  id uuid primary key default gen_random_uuid(),
  imagem_url text not null,
  titulo text not null,
  link_destino text,
  ativo boolean not null default true,
  ordem int not null default 0
);

alter table public.banner enable row level security;

create policy "banner_select_auth" on public.banner
  for select to authenticated using (true);
create policy "banner_admin_write" on public.banner
  for all to authenticated using (public.is_admin()) with check (public.is_admin());
