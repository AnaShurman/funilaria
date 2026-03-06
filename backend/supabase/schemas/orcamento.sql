create table orcamentos (
  id uuid primary key default gen_random_uuid(),
  cliente_nome text not null,
  telefone text,
  veiculo text,
  placa text,
  status text default 'pendente',
  observacoes text,
  created_at timestamp default now()
);

create table orcamento_servicos (
  id uuid primary key default gen_random_uuid(),
  orcamento_id uuid references orcamentos(id) on delete cascade,
  descricao text not null,
  valor numeric not null
);

create table orcamento_materiais (
  id uuid primary key default gen_random_uuid(),
  orcamento_id uuid references orcamentos(id) on delete cascade,
  nome text not null,
  quantidade numeric,
  valor_unitario numeric,
  created_at timestamp default now()
);

create table oficina (
  id uuid primary key default gen_random_uuid(),
  nome text not null,
  cnpj text,
  telefone text,
  email text,
  endereco text,
  cidade text,
  estado text,
  cep text,
  created_at timestamp default now()
);