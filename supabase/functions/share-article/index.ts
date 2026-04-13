import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.50.3';

// Bump this to force fresh deployments and for debugging
const FUNCTION_REV = 'share-article@2025-09-19-01';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
const supabaseKey = Deno.env.get('SUPABASE_ANON_KEY')!;
const supabase = createClient(supabaseUrl, supabaseKey);

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const url = new URL(req.url);
    const rawSlug = url.searchParams.get('slug');
    const slug = rawSlug ? decodeURIComponent(rawSlug) : null;
    const origin = url.searchParams.get('origin') || 'https://tunisiatrip.kr';
    const lang = url.searchParams.get('lang') || 'en';
    const noRedirect = url.searchParams.get('no_redirect') === '1';
    
    console.log(`[${FUNCTION_REV}] Processing share request`);
    console.log(`[Slug Processing] Raw slug: ${rawSlug}`);
    console.log(`[Slug Processing] Decoded slug: ${slug}`);
    console.log(`[Request] Language: ${lang}`);

    if (!slug) {
      return new Response('Missing slug parameter', { 
        status: 400, 
        headers: corsHeaders 
      });
    }

    // Fetch article from database with multiple fallback strategies
    let { data: article, error } = await supabase
      .from('blog_articles')
      .select('*')
      .eq('slug', slug)
      .eq('status', 'published')
      .maybeSingle();
    
    let searchStrategy = 'exact';

    // Fallback 1: Case-insensitive exact match
    if (!article && !error) {
      console.log(`[Fallback 1] Trying case-insensitive exact match for slug: ${slug}`);
      const result = await supabase
        .from('blog_articles')
        .select('*')
        .ilike('slug', slug)
        .eq('status', 'published')
        .maybeSingle();
      article = result.data;
      error = result.error;
      if (article) {
        searchStrategy = 'slug_ilike_exact';
        console.log(`[Fallback 1] ✅ Found article via ilike exact: ${article.title}`);
      }
    }

    // Fallback 2: Case-insensitive with wildcards
    if (!article && !error) {
      console.log(`[Fallback 2] Trying case-insensitive wildcard search: ${slug}`);
      const result = await supabase
        .from('blog_articles')
        .select('*')
        .ilike('slug', `%${slug}%`)
        .eq('status', 'published')
        .maybeSingle();
      article = result.data;
      error = result.error;
      if (article) {
        searchStrategy = 'slug_ilike_wildcard';
        console.log(`[Fallback 2] ✅ Found article via ilike wildcard: ${article.title}`);
      }
    }

    // Fallback 3: Extract UUID from slug (if present)
    if (!article && !error) {
      const uuidRegex = /([a-f0-9]{8}-[a-f0-9]{4}-[a-f0-9]{4}-[a-f0-9]{4}-[a-f0-9]{12})/i;
      const uuidMatch = slug.match(uuidRegex);
      if (uuidMatch) {
        const extractedId = uuidMatch[1];
        console.log(`[Fallback 3] Trying UUID extraction: ${extractedId}`);
        const result = await supabase
          .from('blog_articles')
          .select('*')
          .eq('id', extractedId)
          .eq('status', 'published')
          .maybeSingle();
        article = result.data;
        error = result.error;
        if (article) {
          searchStrategy = 'id_from_slug';
          console.log(`[Fallback 3] ✅ Found article via UUID extraction: ${article.title}`);
        }
      }
    }

    // Fallback 4: Direct UUID match (if slug is a valid UUID)
    if (!article && !error) {
      const uuidRegex = /^[a-f0-9]{8}-[a-f0-9]{4}-[a-f0-9]{4}-[a-f0-9]{4}-[a-f0-9]{12}$/i;
      if (uuidRegex.test(slug)) {
        console.log(`[Fallback 4] Trying direct UUID match: ${slug}`);
        const result = await supabase
          .from('blog_articles')
          .select('*')
          .eq('id', slug)
          .eq('status', 'published')
          .maybeSingle();
        article = result.data;
        error = result.error;
        if (article) {
          searchStrategy = 'id_direct';
          console.log(`[Fallback 4] ✅ Found article via direct UUID: ${article.title}`);
        }
      }
    }

    // Fallback 5: Search in title fields (exact match)
    if (!article && !error) {
      console.log(`[Fallback 5] Trying title exact match: ${slug}`);
      const result = await supabase
        .from('blog_articles')
        .select('*')
        .or(`title.eq.${slug},title_korean.eq.${slug}`)
        .eq('status', 'published')
        .maybeSingle();
      article = result.data;
      error = result.error;
      if (article) {
        searchStrategy = 'title_eq';
        console.log(`[Fallback 5] ✅ Found article via title exact: ${article.title}`);
      }
    }

    // Fallback 6: Search in title fields (wildcard)
    if (!article && !error) {
      console.log(`[Fallback 6] Trying title wildcard search: ${slug}`);
      const result = await supabase
        .from('blog_articles')
        .select('*')
        .or(`title.ilike.%${slug}%,title_korean.ilike.%${slug}%`)
        .eq('status', 'published')
        .maybeSingle();
      article = result.data;
      error = result.error;
      if (article) {
        searchStrategy = 'title_ilike';
        console.log(`[Fallback 6] ✅ Found article via title wildcard: ${article.title}`);
      }
    }

    console.log(`[Search Strategy] Used: ${searchStrategy}`);

    if (error) {
      console.error('Database error fetching article by slug', { slug, error });
      return new Response('Error fetching article', {
        status: 500,
        headers: corsHeaders
      });
    }

    if (!article) {
      console.warn('Article not found for slug', slug);
      return new Response('Article not found', {
        status: 404,
        headers: corsHeaders
      });
    }

    console.log(`Found article: ${article.title}`);
    console.log(`Article image: ${article.image}`);
    console.log(`Article facebook_image: ${(article as any).facebook_image || 'not set'}`);

    // Debug mode via ?debug=1
    const debug = url.searchParams.get('debug') === '1';

    // Normalize and resolve the best image URL (prioritize article image)
    const normalizeImageUrl = (raw: string | null): string => {
      if (!raw || !String(raw).trim()) return `${origin}/og-image.png`;
      let imageSrc = String(raw).trim();

      // If the value is a JSON string with language variants, try to resolve by lang
      try {
        const parsed = JSON.parse(imageSrc);
        if (parsed && typeof parsed === 'object') {
          imageSrc = parsed[lang] || parsed.en || parsed.fr || parsed.ar || (Object.values(parsed)[0] as string) || '';
        }
      } catch { /* not JSON, proceed */ }

      if (!imageSrc) return `${origin}/og-image.png`;

      // Absolute URL
      if (/^https?:\/\//i.test(imageSrc)) return imageSrc;

      // Supabase storage public object path without domain
      if (imageSrc.startsWith('storage/v1/object/public')) {
        return `${supabaseUrl.replace(/\/$/, '')}/${imageSrc.replace(/^\//, '')}`;
      }

      // Bucket path like "website_images/..." (public bucket)
      if (imageSrc.replace(/^\//, '').startsWith('website_images/')) {
        return `${supabaseUrl.replace(/\/$/, '')}/storage/v1/object/public/${imageSrc.replace(/^\//, '')}`;
      }

      // Otherwise treat as origin-relative path
      const path = imageSrc.startsWith('/') ? imageSrc : `/${imageSrc}`;
      return `${origin}${path}`;
    };

    // Helpers to build optimized candidates (1200x630 JPEG)
    // Use updated_at for cache busting to invalidate Facebook cache when article is modified
    const cacheBust = article.updated_at 
      ? `v${new Date(article.updated_at).getTime()}`
      : `v${Date.now()}`;
    const stripProtocol = (u: string) => u.replace(/^https?:\/\//i, '');
    const appendCacheBust = (u: string) => (u.includes('?') ? `${u}&v=${cacheBust}` : `${u}?v=${cacheBust}`);
    const buildImagesWeservUrl = (u: string) => `https://images.weserv.nl/?url=${encodeURIComponent(stripProtocol(u))}&w=1200&h=630&fit=cover&output=jpg&we&il&v=${cacheBust}`;
    const buildWsrvUrl = (u: string) => `https://wsrv.nl/?url=${encodeURIComponent(stripProtocol(u))}&w=1200&h=630&fit=cover&output=jpg&we&il&v=${cacheBust}`;

    const isLikelyImage = (ct: string | null, u: string) => {
      if (ct && /^image\//i.test(ct)) return true;
      return /\.(jpg|jpeg|png|gif|webp|avif)(\?|#|$)/i.test(u);
    };

    const checkImageAccessible = async (u: string): Promise<{ ok: boolean; contentType?: string }> => {
      try {
        const head = await fetch(u, { method: 'HEAD' });
        if (head.ok && isLikelyImage(head.headers.get('content-type'), u)) {
          return { ok: true, contentType: head.headers.get('content-type') || undefined };
        }
        // Some CDNs don't support HEAD properly; try lightweight GET
        const getRes = await fetch(u, { method: 'GET', headers: { 'Range': 'bytes=0-0' } });
        if (getRes.ok && isLikelyImage(getRes.headers.get('content-type'), u)) {
          return { ok: true, contentType: getRes.headers.get('content-type') || undefined };
        }
      } catch (e) {
        console.warn('Image check failed for', u, e);
      }
      return { ok: false };
    };

    // Generate article URL
    const articleUrl = `${origin}/blog/${article.slug || article.id}`;

    // Preferred source: facebook_image then image
    const preferredRaw = (article as any).facebook_image || article.image || null;
    const imageSource = (article as any).facebook_image ? 'facebook_image' : 'image';
    const absOriginal = normalizeImageUrl(preferredRaw);
    
    console.log(`[Image Selection] Image source field: ${imageSource}`);
    console.log(`[Image Selection] Preferred raw: ${preferredRaw}`);
    console.log(`[Image Selection] Absolute original: ${absOriginal}`);

    const candidates: string[] = [
      buildImagesWeservUrl(absOriginal),
      buildWsrvUrl(absOriginal),
      appendCacheBust(absOriginal)
    ];
    
    console.log(`[Image Selection] Testing ${candidates.length} image candidates`);

    let ogImage = `${origin}/og-image.png`;
    let imageType = 'image/jpeg';
    for (const c of candidates) {
      console.log(`[Image Selection] Testing candidate: ${c}`);
      const res = await checkImageAccessible(c);
      console.log(`[Image Selection] Result: ${res.ok ? 'OK' : 'FAILED'} (${res.contentType || 'no content-type'})`);
      if (res.ok) {
        ogImage = c;
        if (res.contentType) imageType = res.contentType;
        console.log(`[Image Selection] ✅ Selected: ${ogImage}`);
        break;
      }
    }
    
    if (ogImage === `${origin}/og-image.png`) {
      console.warn(`[Image Selection] ⚠️ All candidates failed, using fallback: ${ogImage}`);
    }
    // Get language-specific content
    const getContent = (field: string, lang: string): string => {
      try {
        const parsed = typeof article[field] === 'string' ? JSON.parse(article[field]) : article[field];
        if (parsed && typeof parsed === 'object') {
          return parsed[lang] || parsed.en || parsed.fr || parsed.ar || Object.values(parsed)[0] || '';
        }
        return article[field] || '';
      } catch {
        return article[field] || '';
      }
    };

    const title = getContent('title', lang) || 'TunisiaTrip Blog';
    const description = getContent('description', lang) || 'Découvrez la Tunisie avec nos guides de voyage';
    const locale = lang === 'fr' ? 'fr_FR' : (lang === 'ar' ? 'ar_TN' : 'en_US');

    // Generate HTML with proper Open Graph metadata
    const html = `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <meta name="robots" content="noindex">
  <title>${title}</title>
  <link rel="canonical" href="${articleUrl}" />
  
  <!-- Open Graph metadata -->
  <meta property="og:title" content="${title}" />
  <meta property="og:description" content="${description}" />
  <meta property="og:image" content="${ogImage}" />
  <meta property="og:image:secure_url" content="${ogImage}" />
  <meta property="og:image:type" content="${imageType}" />
  <meta property="og:image:alt" content="${title}" />
  <meta property="og:image:width" content="1200" />
  <meta property="og:image:height" content="630" />
  <meta property="og:url" content="${articleUrl}" />
  <meta property="og:type" content="article" />
  <meta property="og:site_name" content="TunisiaTrip" />
  <meta property="og:locale" content="${locale}" />
  
  <!-- Twitter Card metadata -->
  <meta name="twitter:card" content="summary_large_image" />
  <meta name="twitter:title" content="${title}" />
  <meta name="twitter:description" content="${description}" />
  <meta name="twitter:image" content="${ogImage}" />
  <meta name="twitter:url" content="${articleUrl}" />
  <meta name="twitter:image:alt" content="${title}" />
  
  <!-- Article metadata -->
  ${article.publish_date ? `<meta property="article:published_time" content="${article.publish_date}" />` : ''}
  <meta property="article:author" content="TunisiaTrip" />
  ${noRedirect ? '' : `
  <!-- Redirect to main site after a short delay for crawlers -->
  <meta http-equiv="refresh" content="0;url=${articleUrl}" />`}
</head>
<body>
  <h1>${title}</h1>
  <p>${description}</p>
  <img src="${ogImage}" alt="${title}" style="max-width: 100%; height: auto;" />
  <p><a href="${articleUrl}">Read full article on TunisiaTrip</a></p>
  ${noRedirect ? '' : `
  <script>
    // Immediate redirect for any browsers that do reach this page
    window.location.href = "${articleUrl}";
  </script>`}
</body>
</html>`;

    console.log(`Generated HTML for article: ${title}`);
    console.log(`Final OG Image: ${ogImage}`);
    console.log(`Final Image Type: ${imageType}`);
    
    return new Response(html, {
      headers: {
        'Content-Type': 'text/html; charset=utf-8',
        'Cache-Control': 'no-store',
        'X-OG-Image': ogImage,
        'X-OG-Image-Type': imageType,
        'X-Function-Rev': FUNCTION_REV,
        'X-Debug-Image-Source': imageSource,
        'X-Debug-Cache-Bust': cacheBust,
        'X-Debug-Original-Slug': rawSlug || '',
        'X-Debug-Article-ID': article.id,
        'X-Debug-Search-Strategy': searchStrategy,
        ...corsHeaders
      },
    });
    
  } catch (error) {
    console.error('Error in share-article function:', error);
    return new Response(JSON.stringify({ error: error.message }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});