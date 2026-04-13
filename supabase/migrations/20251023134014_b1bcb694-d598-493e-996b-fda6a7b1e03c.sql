-- Add facebook_image column to blog_articles table for optimized 1200x630 JPG images
ALTER TABLE public.blog_articles 
ADD COLUMN facebook_image TEXT;

COMMENT ON COLUMN public.blog_articles.facebook_image IS 'Optimized image for Facebook sharing (recommended: 1200x630 JPG). Falls back to image field if not set.';