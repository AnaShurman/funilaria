-- Add logo_path column to oficina table
ALTER TABLE public.oficina 
ADD COLUMN logo_path text;

-- Add comment to the column
COMMENT ON COLUMN public.oficina.logo_path IS 'Path to the oficina logo image in Supabase Storage';

-- Made with Bob
