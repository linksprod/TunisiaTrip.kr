
export interface BlogCategory {
  name: string;
  iconType: string;
  color: string;
  slug: string;
}

export interface BlogArticle {
  id: string;
  title: string;
  slug?: string;
  description: string;
  content?: string;
  image: string;
  facebook_image?: string;
  status: 'draft' | 'published';
  publish_date?: string;
  created_at?: string;
  updated_at?: string;
  meta_title?: string;
  meta_description?: string;
  meta_keywords?: string;
  focus_keyword?: string;
  canonical_url?: string;
}

export interface Category {
  id: string;
  name: string;
  slug: string;
  color: string;
  icon_type: string;
  created_at?: string;
  updated_at?: string;
}
