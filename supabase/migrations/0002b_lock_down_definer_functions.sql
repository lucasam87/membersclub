-- handle_new_user so' deve rodar via trigger (contexto do sistema), nunca via RPC direta
revoke execute on function public.handle_new_user() from public, anon, authenticated;

-- is_admin() precisa ser executavel por 'authenticated' pois e' usada dentro das
-- RLS policies (avaliadas com o role da sessao); anon nao tem nenhuma policy que a use.
revoke execute on function public.is_admin() from public, anon;
grant execute on function public.is_admin() to authenticated;
