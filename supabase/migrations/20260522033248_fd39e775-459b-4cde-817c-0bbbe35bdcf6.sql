INSERT INTO storage.buckets (id, name, public) VALUES ('lead-magnets', 'lead-magnets', true) ON CONFLICT (id) DO NOTHING;

CREATE POLICY "Public can read lead magnets"
ON storage.objects FOR SELECT
USING (bucket_id = 'lead-magnets');