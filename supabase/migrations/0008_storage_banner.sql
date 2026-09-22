-- Bucket publico para imagens de banner (conteudo de marketing, sem
-- necessidade de URL assinada).
insert into storage.buckets (id, name, public)
values ('banner', 'banner', true)
on conflict (id) do nothing;

create policy "banner_bucket_admin_write" on storage.objects
  for insert to authenticated with check (bucket_id = 'banner' and public.is_admin());
create policy "banner_bucket_admin_update" on storage.objects
  for update to authenticated using (bucket_id = 'banner' and public.is_admin()) with check (bucket_id = 'banner' and public.is_admin());
create policy "banner_bucket_admin_delete" on storage.objects
  for delete to authenticated using (bucket_id = 'banner' and public.is_admin());
