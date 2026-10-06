-- SUPABASE SQL SETUP FOR: JAIN CONNECT 360°
-- Subtitle: Connecting Every Jain

-- 1. Create table
CREATE TABLE IF NOT EXISTS public.jain_connect_members (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    full_name TEXT NOT NULL,
    contact_number TEXT NOT NULL,
    whatsapp_number TEXT NOT NULL,
    sampradaya TEXT NOT NULL,
    sammaj_name TEXT NOT NULL,
    state TEXT NOT NULL,
    city TEXT NOT NULL,
    business_name TEXT NOT NULL,
    volunteer TEXT DEFAULT 'Not Specified',
    language_used TEXT DEFAULT 'en',
    is_verified BOOLEAN DEFAULT TRUE
);

-- 2. Enable Row Level Security (RLS)
ALTER TABLE public.jain_connect_members ENABLE ROW LEVEL SECURITY;

-- 3. Policy: Public community members can submit their details
CREATE POLICY "Allow public member registration" 
ON public.jain_connect_members 
FOR INSERT 
TO anon 
WITH CHECK (true);

-- 4. Policy: Authenticated admins can view all entries
CREATE POLICY "Allow authenticated admins to view members" 
ON public.jain_connect_members 
FOR SELECT 
TO authenticated 
USING (true);
