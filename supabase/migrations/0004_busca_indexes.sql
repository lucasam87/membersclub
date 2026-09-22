-- Suporte a busca por texto parcial (ilike) no catalogo de aulas.
create extension if not exists pg_trgm;

create index aulas_titulo_trgm_idx on public.aulas using gin (titulo gin_trgm_ops);
create index aulas_descricao_trgm_idx on public.aulas using gin (descricao gin_trgm_ops);
