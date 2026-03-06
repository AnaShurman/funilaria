-- Create storage bucket for oficina images
INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES (
  'oficina-images',
  'oficina-images',
  true,
  5242880, -- 5MB in bytes
  ARRAY['image/jpeg', 'image/jpg', 'image/png', 'image/gif', 'image/webp']
)
ON CONFLICT (id) DO NOTHING;

-- Set up storage policies for the bucket
-- Allow public read access
CREATE POLICY "Public Access"
ON storage.objects FOR SELECT
USING (bucket_id = 'oficina-images');

-- Allow authenticated users to upload
CREATE POLICY "Authenticated users can upload"
ON storage.objects FOR INSERT
WITH CHECK (bucket_id = 'oficina-images' AND auth.role() = 'authenticated');

-- Allow authenticated users to update their uploads
CREATE POLICY "Authenticated users can update"
ON storage.objects FOR UPDATE
USING (bucket_id = 'oficina-images' AND auth.role() = 'authenticated');

-- Allow authenticated users to delete their uploads
CREATE POLICY "Authenticated users can delete"
ON storage.objects FOR DELETE
USING (bucket_id = 'oficina-images' AND auth.role() = 'authenticated');

-- Allow anonymous users to upload (if needed for your use case)
CREATE POLICY "Anonymous users can upload"
ON storage.objects FOR INSERT
WITH CHECK (bucket_id = 'oficina-images' AND auth.role() = 'anon');

-- Allow anonymous users to update
CREATE POLICY "Anonymous users can update"
ON storage.objects FOR UPDATE
USING (bucket_id = 'oficina-images' AND auth.role() = 'anon');

-- Allow anonymous users to delete
CREATE POLICY "Anonymous users can delete"
ON storage.objects FOR DELETE
USING (bucket_id = 'oficina-images' AND auth.role() = 'anon');

-- Made with Bob
