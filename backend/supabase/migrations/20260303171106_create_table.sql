
  create table "public"."orcamento_materiais" (
    "id" uuid not null default gen_random_uuid(),
    "orcamento_id" uuid,
    "nome" text not null,
    "quantidade" numeric,
    "valor_unitario" numeric,
    "created_at" timestamp without time zone default now()
      );



  create table "public"."orcamento_servicos" (
    "id" uuid not null default gen_random_uuid(),
    "orcamento_id" uuid,
    "descricao" text not null,
    "valor" numeric not null
      );



  create table "public"."orcamentos" (
    "id" uuid not null default gen_random_uuid(),
    "cliente_nome" text not null,
    "telefone" text,
    "veiculo" text,
    "placa" text,
    "status" text default 'pendente'::text,
    "observacoes" text,
    "created_at" timestamp without time zone default now()
      );


CREATE UNIQUE INDEX orcamento_materiais_pkey ON public.orcamento_materiais USING btree (id);

CREATE UNIQUE INDEX orcamento_servicos_pkey ON public.orcamento_servicos USING btree (id);

CREATE UNIQUE INDEX orcamentos_pkey ON public.orcamentos USING btree (id);

alter table "public"."orcamento_materiais" add constraint "orcamento_materiais_pkey" PRIMARY KEY using index "orcamento_materiais_pkey";

alter table "public"."orcamento_servicos" add constraint "orcamento_servicos_pkey" PRIMARY KEY using index "orcamento_servicos_pkey";

alter table "public"."orcamentos" add constraint "orcamentos_pkey" PRIMARY KEY using index "orcamentos_pkey";

alter table "public"."orcamento_materiais" add constraint "orcamento_materiais_orcamento_id_fkey" FOREIGN KEY (orcamento_id) REFERENCES public.orcamentos(id) ON DELETE CASCADE not valid;

alter table "public"."orcamento_materiais" validate constraint "orcamento_materiais_orcamento_id_fkey";

alter table "public"."orcamento_servicos" add constraint "orcamento_servicos_orcamento_id_fkey" FOREIGN KEY (orcamento_id) REFERENCES public.orcamentos(id) ON DELETE CASCADE not valid;

alter table "public"."orcamento_servicos" validate constraint "orcamento_servicos_orcamento_id_fkey";

grant delete on table "public"."orcamento_materiais" to "anon";

grant insert on table "public"."orcamento_materiais" to "anon";

grant references on table "public"."orcamento_materiais" to "anon";

grant select on table "public"."orcamento_materiais" to "anon";

grant trigger on table "public"."orcamento_materiais" to "anon";

grant truncate on table "public"."orcamento_materiais" to "anon";

grant update on table "public"."orcamento_materiais" to "anon";

grant delete on table "public"."orcamento_materiais" to "authenticated";

grant insert on table "public"."orcamento_materiais" to "authenticated";

grant references on table "public"."orcamento_materiais" to "authenticated";

grant select on table "public"."orcamento_materiais" to "authenticated";

grant trigger on table "public"."orcamento_materiais" to "authenticated";

grant truncate on table "public"."orcamento_materiais" to "authenticated";

grant update on table "public"."orcamento_materiais" to "authenticated";

grant delete on table "public"."orcamento_materiais" to "service_role";

grant insert on table "public"."orcamento_materiais" to "service_role";

grant references on table "public"."orcamento_materiais" to "service_role";

grant select on table "public"."orcamento_materiais" to "service_role";

grant trigger on table "public"."orcamento_materiais" to "service_role";

grant truncate on table "public"."orcamento_materiais" to "service_role";

grant update on table "public"."orcamento_materiais" to "service_role";

grant delete on table "public"."orcamento_servicos" to "anon";

grant insert on table "public"."orcamento_servicos" to "anon";

grant references on table "public"."orcamento_servicos" to "anon";

grant select on table "public"."orcamento_servicos" to "anon";

grant trigger on table "public"."orcamento_servicos" to "anon";

grant truncate on table "public"."orcamento_servicos" to "anon";

grant update on table "public"."orcamento_servicos" to "anon";

grant delete on table "public"."orcamento_servicos" to "authenticated";

grant insert on table "public"."orcamento_servicos" to "authenticated";

grant references on table "public"."orcamento_servicos" to "authenticated";

grant select on table "public"."orcamento_servicos" to "authenticated";

grant trigger on table "public"."orcamento_servicos" to "authenticated";

grant truncate on table "public"."orcamento_servicos" to "authenticated";

grant update on table "public"."orcamento_servicos" to "authenticated";

grant delete on table "public"."orcamento_servicos" to "service_role";

grant insert on table "public"."orcamento_servicos" to "service_role";

grant references on table "public"."orcamento_servicos" to "service_role";

grant select on table "public"."orcamento_servicos" to "service_role";

grant trigger on table "public"."orcamento_servicos" to "service_role";

grant truncate on table "public"."orcamento_servicos" to "service_role";

grant update on table "public"."orcamento_servicos" to "service_role";

grant delete on table "public"."orcamentos" to "anon";

grant insert on table "public"."orcamentos" to "anon";

grant references on table "public"."orcamentos" to "anon";

grant select on table "public"."orcamentos" to "anon";

grant trigger on table "public"."orcamentos" to "anon";

grant truncate on table "public"."orcamentos" to "anon";

grant update on table "public"."orcamentos" to "anon";

grant delete on table "public"."orcamentos" to "authenticated";

grant insert on table "public"."orcamentos" to "authenticated";

grant references on table "public"."orcamentos" to "authenticated";

grant select on table "public"."orcamentos" to "authenticated";

grant trigger on table "public"."orcamentos" to "authenticated";

grant truncate on table "public"."orcamentos" to "authenticated";

grant update on table "public"."orcamentos" to "authenticated";

grant delete on table "public"."orcamentos" to "service_role";

grant insert on table "public"."orcamentos" to "service_role";

grant references on table "public"."orcamentos" to "service_role";

grant select on table "public"."orcamentos" to "service_role";

grant trigger on table "public"."orcamentos" to "service_role";

grant truncate on table "public"."orcamentos" to "service_role";

grant update on table "public"."orcamentos" to "service_role";


