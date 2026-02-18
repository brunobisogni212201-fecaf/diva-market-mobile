
-- Create products table
CREATE TABLE IF NOT EXISTS public.products (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id UUID REFERENCES auth.users(id) NOT NULL,
    name TEXT NOT NULL,
    description TEXT,
    price INTEGER NOT NULL, -- Price in cents
    category TEXT NOT NULL,
    image_url TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Enable RLS
ALTER TABLE public.products ENABLE ROW LEVEL SECURITY;

-- Policies
-- 1. Public Read: Everyone can view products (market functionality)
CREATE POLICY "Products are viewable by everyone" 
ON public.products FOR SELECT 
USING ( true );

-- 2. Insert: Only authenticated users can create products (and they are auto-assigned their user_id via logic or check)
-- Ideally we force user_id to be auth.uid() via default or check constraint, but for now RLS check:
CREATE POLICY "Users can insert their own products" 
ON public.products FOR INSERT 
WITH CHECK ( auth.uid() = user_id );

-- 3. Update: Only owner
CREATE POLICY "Users can update their own products" 
ON public.products FOR UPDATE 
USING ( auth.uid() = user_id );

-- 4. Delete: Only owner
CREATE POLICY "Users can delete their own products" 
ON public.products FOR DELETE 
USING ( auth.uid() = user_id );

-- Storage Bucket Setup for 'products'
INSERT INTO storage.buckets (id, name, public) 
VALUES ('products', 'products', true)
ON CONFLICT (id) DO NOTHING;

-- Storage Policies
-- Allow public read access to product images
CREATE POLICY "Product images are publicly accessible"
ON storage.objects FOR SELECT
USING ( bucket_id = 'products' );

-- Allow authenticated users to upload product images
CREATE POLICY "Authenticated users can upload product images"
ON storage.objects FOR INSERT
WITH CHECK ( bucket_id = 'products' AND auth.role() = 'authenticated' );

-- Allow users to update/delete their own images (if name includes uid or via path convention, simplifying to auth for now)
-- Refining Update/Delete to owner would require path structure like 'products/{user_id}/*' which MediaCapture should handle.
-- For now, allowing authenticated insert is the MVP step.
