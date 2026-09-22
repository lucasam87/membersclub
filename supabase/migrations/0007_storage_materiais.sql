-- Bucket privado para anexos de aula. Uploads e URLs assinadas de download
-- sao sempre gerados pelo servidor com o client de service role (ver
-- lib/supabase/service.ts), entao nenhuma policy de select/insert e'
-- concedida ao client do usuario aqui — apenas admin, para consistencia e
-- possivel uso futuro de upload direto do browser.
insert into storage.buckets (id, name, public)
values ('materiais', 'materiais', false)
on conflict (id) do nothing;

create policy "materiais_bucket_admin_all" on storage.objects
  for all to authenticated
  using (bucket_id = 'materiais' and public.is_admin())
  with check (bucket_id = 'materiais' and public.is_admin());
