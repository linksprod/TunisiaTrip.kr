
-- Insert the admin user directly into auth.users and profiles
-- First, we'll insert into auth.users (this is normally done by Supabase Auth)
INSERT INTO auth.users (
  id,
  email,
  encrypted_password,
  email_confirmed_at,
  created_at,
  updated_at,
  raw_app_meta_data,
  raw_user_meta_data,
  is_super_admin,
  role
) VALUES (
  gen_random_uuid(),
  'wassimayari47@gmail.com',
  crypt('azerty', gen_salt('bf')),
  now(),
  now(),
  now(),
  '{"provider": "email", "providers": ["email"]}',
  '{}',
  false,
  'authenticated'
);

-- Then insert into profiles table with admin privileges
INSERT INTO public.profiles (
  id,
  email,
  is_admin,
  created_at,
  updated_at
) VALUES (
  (SELECT id FROM auth.users WHERE email = 'wassimayari47@gmail.com'),
  'wassimayari47@gmail.com',
  true,
  now(),
  now()
);
