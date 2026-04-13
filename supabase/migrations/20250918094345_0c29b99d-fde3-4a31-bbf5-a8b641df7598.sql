-- Remove the category column from blog_articles table
ALTER TABLE public.blog_articles DROP COLUMN IF EXISTS category;