-- Allow authenticated users to read their own role row.
-- admin_read_user_roles stays for admins; this adds a self-read path
-- so the client fallback in useAuth works for every logged-in user.

DROP POLICY IF EXISTS "self_read_user_roles" ON user_roles;
CREATE POLICY "self_read_user_roles" ON user_roles
FOR SELECT TO authenticated
USING (user_id = auth.uid());