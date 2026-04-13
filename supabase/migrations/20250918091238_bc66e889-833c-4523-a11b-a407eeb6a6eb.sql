-- Phase 1: Create storage bucket for website images
INSERT INTO storage.buckets (id, name, public) VALUES ('website_images', 'website_images', true);

-- Create storage policies for website images
CREATE POLICY "Anyone can view website images" 
ON storage.objects 
FOR SELECT 
USING (bucket_id = 'website_images');

CREATE POLICY "Admins can upload website images" 
ON storage.objects 
FOR INSERT 
WITH CHECK (bucket_id = 'website_images' AND is_admin());

CREATE POLICY "Admins can update website images" 
ON storage.objects 
FOR UPDATE 
USING (bucket_id = 'website_images' AND is_admin());

CREATE POLICY "Admins can delete website images" 
ON storage.objects 
FOR DELETE 
USING (bucket_id = 'website_images' AND is_admin());

-- Phase 2: Add SEO fields to blog_articles table
ALTER TABLE public.blog_articles 
ADD COLUMN meta_title TEXT,
ADD COLUMN meta_description TEXT,
ADD COLUMN meta_keywords TEXT,
ADD COLUMN focus_keyword TEXT,
ADD COLUMN canonical_url TEXT;

-- Phase 3: Create categories table for better category management
CREATE TABLE public.categories (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  slug TEXT NOT NULL UNIQUE,
  color TEXT NOT NULL,
  icon_type TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS on categories table
ALTER TABLE public.categories ENABLE ROW LEVEL SECURITY;

-- Create policies for categories
CREATE POLICY "Anyone can view categories" 
ON public.categories 
FOR SELECT 
USING (true);

CREATE POLICY "Admins can manage categories" 
ON public.categories 
FOR ALL 
USING (is_admin());

-- Insert default categories from existing data
INSERT INTO public.categories (name, slug, color, icon_type) VALUES
('Travel Diary', 'travel-diary', 'bg-blue-50', 'BookOpen'),
('Places', 'places', 'bg-purple-50', 'LandPlot'),
('Hotels', 'hotels', 'bg-yellow-50', 'Hotel'),
('Food', 'food', 'bg-red-50', 'Utensils'),
('Events', 'events', 'bg-indigo-50', 'Calendar'),
('Culture', 'culture', 'bg-emerald-50', 'Globe2'),
('History', 'history', 'bg-amber-50', 'History'),
('Tips', 'tips', 'bg-teal-50', 'HelpCircle');

-- Add trigger for categories updated_at
CREATE TRIGGER update_categories_updated_at
BEFORE UPDATE ON public.categories
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();