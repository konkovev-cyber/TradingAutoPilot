-- Fix admin access for konkev@bk.ru
-- Run this in Supabase SQL Editor

-- Step 1: Check if user exists
SELECT id, email, created_at FROM auth.users WHERE email = 'konkev@bk.ru';

-- Step 2: If step 1 returned a row, run this (replace UUID with actual ID):
-- INSERT INTO user_roles (user_id, role) VALUES ('ACTUAL_UUID_HERE', 'admin');

-- OR use this auto-lookup version:
INSERT INTO user_roles (user_id, role)
SELECT id, 'admin'
FROM auth.users
WHERE email = 'konkev@bk.ru'
ON CONFLICT (user_id) DO UPDATE SET role = 'admin';

-- Step 3: Verify
SELECT * FROM user_roles;
