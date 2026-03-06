-- Simply add descricao column to orcamento_materiais if it doesn't exist
ALTER TABLE orcamento_materiais 
  ADD COLUMN IF NOT EXISTS descricao text;

-- Make nome nullable if it exists, or add it if it doesn't
DO $$ 
BEGIN
  -- Check if nome column exists
  IF EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_name = 'orcamento_materiais' AND column_name = 'nome'
  ) THEN
    -- Make it nullable
    ALTER TABLE orcamento_materiais ALTER COLUMN nome DROP NOT NULL;
  ELSE
    -- Add it as nullable
    ALTER TABLE orcamento_materiais ADD COLUMN nome text;
  END IF;
END $$;

-- Made with Bob
