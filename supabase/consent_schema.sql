-- Create consent_logs table
CREATE TABLE public.consent_logs (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id UUID REFERENCES public.profiles(id) NOT NULL,
    role user_role NOT NULL,
    consent_version TEXT NOT NULL,
    ip_address TEXT,
    user_agent TEXT,
    agreed_at TIMESTAMPTZ DEFAULT NOW(),
    
    -- Specific consent flags
    marketing_consent BOOLEAN DEFAULT false,
    data_processing_consent BOOLEAN DEFAULT false, -- For vendors
    location_tracking_consent BOOLEAN DEFAULT false -- For drivers
);

-- RLS for consent_logs
ALTER TABLE public.consent_logs ENABLE ROW LEVEL SECURITY;

-- Users can view their own consent logs
CREATE POLICY "Users can view own consent logs"
ON public.consent_logs FOR SELECT
USING ( auth.uid() = user_id );

-- Only server (service role) should ideally insert this to ensure integrity, 
-- but if using client-side inserts (not recommended for logs), use:
-- CREATE POLICY "Users can insert own consent" ...
-- We will settle for: authenticated users can insert their own log.
CREATE POLICY "Users can insert own consent log"
ON public.consent_logs FOR INSERT
WITH CHECK ( auth.uid() = user_id );
