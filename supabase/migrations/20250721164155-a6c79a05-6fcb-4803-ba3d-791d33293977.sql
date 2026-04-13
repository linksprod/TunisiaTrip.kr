-- Remove the incorrectly inserted user from auth.users (if it exists)
DELETE FROM public.profiles WHERE email = 'wassimayari47@gmail.com';

-- We'll use Supabase's proper signup process instead
-- This SQL just ensures we clean up any incorrect data