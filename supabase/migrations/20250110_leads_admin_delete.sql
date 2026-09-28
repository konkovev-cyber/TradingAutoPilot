-- Allow admins to delete leads from the admin panel.
-- admin_read_leads / admin_update_leads already exist; DELETE was missing.

DROP POLICY IF EXISTS "admin_delete_leads" ON leads;
CREATE POLICY "admin_delete_leads" ON leads
FOR DELETE TO authenticated
USING (is_admin());