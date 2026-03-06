-- Create clientes table
CREATE TABLE IF NOT EXISTS clientes (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  nome text NOT NULL,
  email text,
  telefone text,
  cpf text,
  endereco text,
  cidade text,
  estado text,
  cep text,
  created_at timestamp DEFAULT now(),
  updated_at timestamp DEFAULT now()
);

-- Create veiculos table
CREATE TABLE IF NOT EXISTS veiculos (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  cliente_id uuid REFERENCES clientes(id) ON DELETE CASCADE,
  modelo text NOT NULL,
  placa text NOT NULL,
  ano text,
  cor text,
  marca text,
  created_at timestamp DEFAULT now(),
  updated_at timestamp DEFAULT now()
);

-- Update orcamentos table to reference clientes and veiculos
ALTER TABLE orcamentos
  ADD COLUMN IF NOT EXISTS cliente_id uuid REFERENCES clientes(id) ON DELETE SET NULL,
  ADD COLUMN IF NOT EXISTS veiculo_id uuid REFERENCES veiculos(id) ON DELETE SET NULL;

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_clientes_nome ON clientes(nome);
CREATE INDEX IF NOT EXISTS idx_clientes_telefone ON clientes(telefone);
CREATE INDEX IF NOT EXISTS idx_veiculos_placa ON veiculos(placa);
CREATE INDEX IF NOT EXISTS idx_veiculos_cliente_id ON veiculos(cliente_id);
CREATE INDEX IF NOT EXISTS idx_orcamentos_cliente_id ON orcamentos(cliente_id);
CREATE INDEX IF NOT EXISTS idx_orcamentos_veiculo_id ON orcamentos(veiculo_id);

-- Add unique constraint on placa
CREATE UNIQUE INDEX IF NOT EXISTS idx_veiculos_placa_unique ON veiculos(placa);

-- Create function to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ language 'plpgsql';

-- Create triggers for updated_at
DROP TRIGGER IF EXISTS update_clientes_updated_at ON clientes;
CREATE TRIGGER update_clientes_updated_at
  BEFORE UPDATE ON clientes
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

DROP TRIGGER IF EXISTS update_veiculos_updated_at ON veiculos;
CREATE TRIGGER update_veiculos_updated_at
  BEFORE UPDATE ON veiculos
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- Made with Bob