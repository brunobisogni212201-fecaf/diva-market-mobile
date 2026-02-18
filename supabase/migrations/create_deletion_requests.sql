-- Create the deletion_requests table
CREATE TABLE IF NOT EXISTS deletion_requests (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES auth.users(id),
    email TEXT NOT NULL,
    reason TEXT,
    status TEXT NOT NULL DEFAULT 'pending_review',
    ip_address TEXT,
    requested_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Add RLS policies
ALTER TABLE deletion_requests ENABLE ROW LEVEL SECURITY;

-- Allow users to insert their own requests (public for email entry, but ideally authenticated)
-- For now, allowing public insert to support the "I lost access" case, but we log IP.
CREATE POLICY "Allow public insert to deletion_requests" 
ON deletion_requests FOR INSERT 
WITH CHECK (true);

-- Only admins can view/update
-- (Assuming admin policies are handled elsewhere or via service_role)
