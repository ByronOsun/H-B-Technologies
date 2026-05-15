-- H&B Technologies Consultations Table Schema
-- Run this migration in Supabase SQL Editor

CREATE TABLE IF NOT EXISTS public.consultations (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  full_name VARCHAR(120) NOT NULL,
  email VARCHAR(254) NOT NULL,
  phone VARCHAR(40) NOT NULL DEFAULT '',
  company VARCHAR(120) NOT NULL DEFAULT '',
  service_interest VARCHAR(120) NOT NULL,
  message TEXT NOT NULL,
  source VARCHAR(50) NOT NULL DEFAULT 'contact',
  status VARCHAR(50) NOT NULL DEFAULT 'new',
  ip_address VARCHAR(45), -- Support IPv4 and IPv6
  email_sent BOOLEAN NOT NULL DEFAULT FALSE,
  email_sent_at TIMESTAMP WITH TIME ZONE,
  email_error TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  notes TEXT
);

-- Create indexes for faster queries
CREATE INDEX IF NOT EXISTS idx_consultations_created_at ON public.consultations(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_consultations_email ON public.consultations(email);
CREATE INDEX IF NOT EXISTS idx_consultations_status ON public.consultations(status);
CREATE INDEX IF NOT EXISTS idx_consultations_source ON public.consultations(source);

-- Enable Row Level Security (optional, for multi-tenant setups)
-- ALTER TABLE public.consultations ENABLE ROW LEVEL SECURITY;

-- Grant permissions (adjust as needed)
-- GRANT SELECT, INSERT, UPDATE ON public.consultations TO authenticated;
-- GRANT ALL ON public.consultations TO service_role;

-- Add comment for documentation
COMMENT ON TABLE public.consultations IS 'Stores consultation requests from website contact forms';
COMMENT ON COLUMN public.consultations.status IS 'Tracking status: new (unreviewed), contacted (client reached), closed (resolved)';
COMMENT ON COLUMN public.consultations.email_sent IS 'Whether confirmation email was sent successfully';
COMMENT ON COLUMN public.consultations.ip_address IS 'Client IP for audit trail and spam detection';
