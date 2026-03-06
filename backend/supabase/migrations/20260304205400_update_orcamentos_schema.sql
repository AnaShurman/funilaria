-- Update orcamentos table to match the form structure
ALTER TABLE orcamentos
  ADD COLUMN IF NOT EXISTS cliente_email text,
  ADD COLUMN IF NOT EXISTS cliente_telefone text,
  ADD COLUMN IF NOT EXISTS veiculo_modelo text,
  ADD COLUMN IF NOT EXISTS veiculo_placa text,
  ADD COLUMN IF NOT EXISTS veiculo_ano text,
  ADD COLUMN IF NOT EXISTS mao_de_obra numeric DEFAULT 0,
  ADD COLUMN IF NOT EXISTS total_materiais numeric DEFAULT 0,
  ADD COLUMN IF NOT EXISTS total_servicos numeric DEFAULT 0,
  ADD COLUMN IF NOT EXISTS valor_total numeric DEFAULT 0,
  ADD COLUMN IF NOT EXISTS numero_orcamento text;

-- Drop old columns that are no longer used (if they exist)
ALTER TABLE orcamentos
  DROP COLUMN IF EXISTS telefone,
  DROP COLUMN IF EXISTS veiculo,
  DROP COLUMN IF EXISTS placa;

-- Add descricao column to orcamento_materiais if it doesn't exist
ALTER TABLE orcamento_materiais
  ADD COLUMN IF NOT EXISTS descricao text;

-- Create index for faster queries
CREATE INDEX IF NOT EXISTS idx_orcamentos_numero ON orcamentos(numero_orcamento);
CREATE INDEX IF NOT EXISTS idx_orcamentos_created_at ON orcamentos(created_at DESC);

-- Made with Bob
