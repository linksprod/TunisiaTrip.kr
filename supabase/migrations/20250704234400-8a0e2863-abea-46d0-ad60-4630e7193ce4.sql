-- Create contacts table for form submissions
CREATE TABLE public.contacts (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  email TEXT NOT NULL,
  subject TEXT,
  message TEXT NOT NULL,
  status TEXT NOT NULL DEFAULT 'new',
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable Row Level Security
ALTER TABLE public.contacts ENABLE ROW LEVEL SECURITY;

-- Create policies for contacts
CREATE POLICY "Admins can view all contacts" 
ON public.contacts 
FOR SELECT 
USING (is_admin());

CREATE POLICY "Admins can update contact status" 
ON public.contacts 
FOR UPDATE 
USING (is_admin());

CREATE POLICY "Anyone can insert contacts" 
ON public.contacts 
FOR INSERT 
WITH CHECK (true);

-- Create analytics table for real website statistics
CREATE TABLE public.analytics (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  page_path TEXT NOT NULL,
  visitor_count INTEGER NOT NULL DEFAULT 0,
  page_views INTEGER NOT NULL DEFAULT 0,
  bounce_rate DECIMAL(5,2),
  avg_session_duration INTEGER,
  date DATE NOT NULL DEFAULT CURRENT_DATE,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable Row Level Security
ALTER TABLE public.analytics ENABLE ROW LEVEL SECURITY;

-- Create policies for analytics
CREATE POLICY "Admins can view all analytics" 
ON public.analytics 
FOR SELECT 
USING (is_admin());

CREATE POLICY "Admins can manage analytics" 
ON public.analytics 
FOR ALL 
USING (is_admin());

-- Create performance_metrics table for actual performance data
CREATE TABLE public.performance_metrics (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  metric_name TEXT NOT NULL,
  metric_value DECIMAL(10,2) NOT NULL,
  unit TEXT,
  page_path TEXT,
  recorded_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable Row Level Security
ALTER TABLE public.performance_metrics ENABLE ROW LEVEL SECURITY;

-- Create policies for performance_metrics
CREATE POLICY "Admins can view all performance metrics" 
ON public.performance_metrics 
FOR SELECT 
USING (is_admin());

CREATE POLICY "Admins can manage performance metrics" 
ON public.performance_metrics 
FOR ALL 
USING (is_admin());

-- Create trigger for automatic timestamp updates on contacts
CREATE TRIGGER update_contacts_updated_at
BEFORE UPDATE ON public.contacts
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();

-- Create trigger for automatic timestamp updates on analytics
CREATE TRIGGER update_analytics_updated_at
BEFORE UPDATE ON public.analytics
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();