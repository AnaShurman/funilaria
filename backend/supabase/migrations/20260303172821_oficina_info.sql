
  create table "public"."oficina" (
    "id" uuid not null default gen_random_uuid(),
    "nome" text not null,
    "cnpj" text,
    "telefone" text,
    "email" text,
    "endereco" text,
    "cidade" text,
    "estado" text,
    "cep" text,
    "created_at" timestamp without time zone default now()
      );


CREATE UNIQUE INDEX oficina_pkey ON public.oficina USING btree (id);

alter table "public"."oficina" add constraint "oficina_pkey" PRIMARY KEY using index "oficina_pkey";

grant delete on table "public"."oficina" to "anon";

grant insert on table "public"."oficina" to "anon";

grant references on table "public"."oficina" to "anon";

grant select on table "public"."oficina" to "anon";

grant trigger on table "public"."oficina" to "anon";

grant truncate on table "public"."oficina" to "anon";

grant update on table "public"."oficina" to "anon";

grant delete on table "public"."oficina" to "authenticated";

grant insert on table "public"."oficina" to "authenticated";

grant references on table "public"."oficina" to "authenticated";

grant select on table "public"."oficina" to "authenticated";

grant trigger on table "public"."oficina" to "authenticated";

grant truncate on table "public"."oficina" to "authenticated";

grant update on table "public"."oficina" to "authenticated";

grant delete on table "public"."oficina" to "service_role";

grant insert on table "public"."oficina" to "service_role";

grant references on table "public"."oficina" to "service_role";

grant select on table "public"."oficina" to "service_role";

grant trigger on table "public"."oficina" to "service_role";

grant truncate on table "public"."oficina" to "service_role";

grant update on table "public"."oficina" to "service_role";


