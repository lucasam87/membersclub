-- Tabela de usuarios (espelha auth.users, adiciona papel e status de assinatura)
create table public.usuarios (
  id uuid primary key references auth.users(id) on delete cascade,
  nome text not null default '',
  email text not null unique,
  papel text not null default 'aluno' check (papel in ('aluno', 'admin')),
  status_assinatura text not null default 'pendente' check (status_assinatura in ('ativo', 'atrasado', 'bloqueado', 'pendente')),
  created_at timestamptz not null default now()
);

-- Popula automaticamente public.usuarios ao criar um usuario em auth.users
create function public.handle_new_user()
returns trigger as $$
begin
  insert into public.usuarios (id, nome, email)
  values (new.id, coalesce(new.raw_user_meta_data ->> 'nome', ''), new.email);
  return new;
end;
$$ language plpgsql security definer set search_path = public;

create trigger on_auth_user_created
  after insert on auth.users
  for each row execute procedure public.handle_new_user();

-- Helper usado por todas as policies de escrita restritas a admin
create function public.is_admin()
returns boolean as $$
  select exists (
    select 1 from public.usuarios where id = auth.uid() and papel = 'admin'
  );
$$ language sql stable security definer set search_path = public;

alter table public.usuarios enable row level security;

create policy "usuarios_select_own_or_admin" on public.usuarios
  for select to authenticated
  using (auth.uid() = id or public.is_admin());

create policy "usuarios_update_own" on public.usuarios
  for update to authenticated
  using (auth.uid() = id);
