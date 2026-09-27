-- Fix RLS for user_roles table
-- Allow authenticated users to read their own role

DROP POLICY IF EXISTS "admin_read_user_roles" ON user_roles;
CREATE POLICY "authenticated_read_user_roles" ON user_roles
FOR SELECT TO authenticated
USING (auth.uid() = user_id);

-- Also allow admins to update their own role (for self-service)
DROP POLICY IF EXISTS "admin_write_user_roles" ON user_roles;
CREATE POLICY "admin_write_user_roles" ON user_roles
FOR ALL TO authenticated
USING (is_admin())
WITH CHECK (is_admin());
