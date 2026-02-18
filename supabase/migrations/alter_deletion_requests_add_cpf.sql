-- Add CPF column to deletion_requests for identity verification
ALTER TABLE deletion_requests 
ADD COLUMN IF NOT EXISTS cpf TEXT;

-- update the comment/description if possible (optional)
COMMENT ON TABLE deletion_requests IS 'Tracks user requests for data deletion/anonymization (LGPD Art. 18).';
