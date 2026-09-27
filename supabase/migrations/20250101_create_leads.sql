-- Leads table for contact form submissions
CREATE TABLE IF NOT EXISTS leads (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  contact text NOT NULL,
  bot text DEFAULT '\''any'\''::text,
  message text,
  status text DEFAULT '\''new'\'' NOT NULL CHECK (status IN ('\''new'\'', '\''read'\'', '\''replied'\'', '\''converted'\'')),
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

ALTER TABLE leads ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "admin_read_leads" ON leads;
CREATE POLICY "admin_read_leads" ON leads FOR SELECT TO authenticated USING (true);

DROP POLICY IF EXISTS "admin_update_leads" ON leads;
CREATE POLICY "admin_update_leads" ON leads FOR UPDATE TO authenticated USING (true) WITH CHECK (true);

DROP POLICY IF EXISTS "public_insert_leads" ON leads;
CREATE POLICY "public_insert_leads" ON leads FOR INSERT TO anon, authenticated WITH CHECK (true);

-- Function to update updated_at
CREATE OR REPLACE FUNCTION update_leads_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS leads_updated_at ON leads;
CREATE TRIGGER leads_updated_at
  BEFORE UPDATE ON leads
  FOR EACH ROW
  EXECUTE FUNCTION update_leads_updated_at();