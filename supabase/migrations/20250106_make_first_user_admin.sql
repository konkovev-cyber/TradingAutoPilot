-- Add first admin user
-- Run this in Supabase SQL Editor to enable admin access

-- First, create the admin role for the current user
-- Replace USER_ID_HERE with your actual user UUID from auth.users

-- Option 1: If you know your user ID, uncomment and run:
-- INSERT INTO user_roles (user_id, role)
-- SELECT id, 'admin'
-- FROM auth.users
-- WHERE email = 'YOUR_EMAIL@DOMAIN.COM'
-- ON CONFLICT (user_id) DO UPDATE SET role = 'admin';

-- Option 2: Make the first registered user an admin (UNSAFE for production)
-- INSERT INTO user_roles (user_id, role)
-- SELECT id, 'admin'
-- FROM auth.users
-- ORDER BY created_at ASC
-- LIMIT 1
-- ON CONFLICT (user_id) DO NOTHING;

-- Option 3: Disable RLS temporarily to debug (REMOVE AFTER TESTING)
-- ALTER TABLE leads DISABLE ROW LEVEL SECURITY;
-- ALTER TABLE page_views DISABLE ROW LEVEL SECURITY;
-- ALTER TABLE site_content DISABLE ROW LEVEL SECURITY;
