-- =============================================
-- ALLERIA — Configuración de base de datos para las landings de socios
-- =============================================
-- Hace tres cosas:
--   1. Crea la tabla que cuenta escaneos de QR y clics por local.
--   2. Agrega una columna a las reseñas para saber de qué local vienen.
--   3. Deja listas las consultas para ver los resultados.
--
-- CÓMO APLICARLO: Supabase → SQL Editor → New query → pegar todo → Run.
-- Es seguro ejecutarlo más de una vez: no duplica ni borra nada.
-- =============================================


-- ---------------------------------------------
-- 1. EVENTOS: escaneos de QR y clics por local
-- ---------------------------------------------
create table if not exists public.socio_eventos (
  id         bigint generated always as identity primary key,
  slug       text        not null,
  evento     text        not null,
  created_at timestamptz not null default now()
);

create index if not exists socio_eventos_slug_idx       on public.socio_eventos (slug);
create index if not exists socio_eventos_created_at_idx on public.socio_eventos (created_at desc);

-- Seguridad: la web usa una clave pública, así que la limitamos a solo INSERTAR.
-- Nadie puede leer, modificar ni borrar estos datos desde el navegador.
alter table public.socio_eventos enable row level security;

drop policy if exists "web puede insertar eventos" on public.socio_eventos;

create policy "web puede insertar eventos"
  on public.socio_eventos
  for insert
  to anon
  with check (
    evento in (
      'scan',
      'click_instagram',
      'click_whatsapp',
      'click_instagram_socio',
      'resena_estrellas',
      'resena_enviada'
    )
    and length(slug) <= 60
  );


-- ---------------------------------------------
-- 2. RESEÑAS: saber de qué local viene cada una
-- ---------------------------------------------
-- Agrega una columna a la tabla de reseñas que ya existe.
-- Las reseñas viejas quedan con este campo vacío, sin problema.
alter table public.testimonials
  add column if not exists socio_slug text;

create index if not exists testimonials_socio_slug_idx on public.testimonials (socio_slug);


-- =============================================
-- 3. CONSULTAS PARA VER RESULTADOS
-- Pega cualquiera de estas en el SQL Editor cuando quieras revisar.
-- =============================================

-- ---- A. Embudo del QR: cuánta gente escaneó y cuánta siguió en Instagram ----
--
-- select
--   slug                                                        as local,
--   count(*) filter (where evento = 'scan')                     as escaneos,
--   count(*) filter (where evento = 'click_instagram')          as clics_instagram,
--   count(*) filter (where evento = 'click_whatsapp')           as clics_whatsapp,
--   count(*) filter (where evento = 'resena_enviada')           as resenas,
--   round(
--     100.0 * count(*) filter (where evento = 'click_instagram')
--     / nullif(count(*) filter (where evento = 'scan'), 0)
--   , 1)                                                        as pct_siguieron
-- from public.socio_eventos
-- group by slug
-- order by escaneos desc;


-- ---- B. Satisfacción por local (esto es lo que le muestras a cada cliente) ----
--
-- select
--   coalesce(business, 'Sin local')  as local,
--   count(*)                         as total_resenas,
--   round(avg(rating), 2)            as promedio_estrellas,
--   count(*) filter (where rating = 5) as cinco_estrellas,
--   count(*) filter (where rating <= 3) as tres_o_menos
-- from public.testimonials
-- where socio_slug is not null
-- group by business
-- order by total_resenas desc;


-- ---- C. Las reseñas de UN local en concreto, para enseñárselas al dueño ----
--
-- select
--   to_char(created_at, 'DD/MM/YYYY') as fecha,
--   name                              as cliente,
--   rating                            as estrellas,
--   comment                           as comentario
-- from public.testimonials
-- where socio_slug = 'hamburgueseria143'   -- <-- cambia el slug aquí
-- order by created_at desc;
