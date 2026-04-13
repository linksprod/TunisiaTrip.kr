import type { Context } from "https://edge.netlify.com";

export default async (request: Request, context: Context) => {
  const url = new URL(request.url);
  const userAgent = request.headers.get("user-agent") || "";
  
  // Debug endpoint to verify Edge Function is active
  if (url.pathname === "/___og-debug") {
    const isBot = /facebookexternalhit|Twitterbot|LinkedInBot|WhatsApp|Slackbot|TelegramBot|SkypeUriPreview|Applebot|GoogleBot|Facebot|facebookcatalog/i.test(userAgent);
    const testMode = url.searchParams.has("_og") && (url.searchParams.get("_og") === "1" || url.searchParams.get("_og") === "");
    const payload = {
      pathname: url.pathname,
      search: url.search,
      origin: url.origin,
      isBot,
      testMode,
      userAgent
    };
    const html = `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <meta name="robots" content="noindex" />
  <title>OG Debug</title>
</head>
<body>
  <h1>Netlify Edge Function is active</h1>
  <pre>${JSON.stringify(payload, null, 2)}</pre>
</body>
</html>`;
    return new Response(html, {
      headers: {
        'Content-Type': 'text/html; charset=utf-8',
        'Cache-Control': 'no-store, max-age=0',
        'X-OG-Debug': '1',
        'X-OG-Edge': '1',
        'X-Edge-Active': '1'
      }
    });
  }

  // Detect social media bots (extended list)
  const isBotUserAgent = /facebookexternalhit|Twitterbot|LinkedInBot|WhatsApp|Slackbot|TelegramBot|SkypeUriPreview|Applebot|GoogleBot|Facebot|facebookcatalog/i.test(userAgent);
  
  // Test mode: force OG rendering for humans with ?_og=1
  const testMode = url.searchParams.has("_og") && (url.searchParams.get("_og") === "1" || url.searchParams.get("_og") === "");
  
  // Match /blog/:slug or /:lang/blog/:slug (allow trailing slash or query)
  const pathMatch = url.pathname.match(/^\/(?:([a-z]{2})\/)??blog\/([^\/?#]+)(?:\/)?/i);
  const lang = (pathMatch && pathMatch[1]) ? pathMatch[1].toLowerCase() : 'en';
  const slug = pathMatch ? pathMatch[2] : null;
  const isBlogArticle = !!slug;
  
  if ((isBotUserAgent || testMode) && isBlogArticle) {
    console.log(`Bot detected: ${userAgent} accessing ${url.pathname} | lang=${lang} slug=${slug}`);
    
    if (slug) {
      try {
        // Call Supabase Edge Function to generate HTML with proper OG metadata
        const supabaseUrl = `https://zlphvpkdeoatmvzkntpr.supabase.co/functions/v1/share-article?slug=${encodeURIComponent(slug)}&lang=${encodeURIComponent(lang)}&origin=${encodeURIComponent(url.origin)}&no_redirect=1${testMode ? '&debug=1' : ''}`;
        
        console.log(`Calling Supabase function: ${supabaseUrl}`);
        
        const response = await fetch(supabaseUrl, {
          headers: {
            'User-Agent': userAgent,
            'Authorization': `Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InpscGh2cGtkZW9hdG12emtudHByIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTE2NjA2MzcsImV4cCI6MjA2NzIzNjYzN30.v2s_cZulb57g8u-XrdOZrY1T98l3Mlld5YbeU4d8Jfk`,
            'apikey': 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InpscGh2cGtkZW9hdG12emtudHByIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTE2NjA2MzcsImV4cCI6MjA2NzIzNjYzN30.v2s_cZulb57g8u-XrdOZrY1T98l3Mlld5YbeU4d8Jfk'
          }
        });
        
        if (response.ok) {
          const html = await response.text();
          console.log(`Successfully generated HTML for bot: ${userAgent}`);
          const debugHeaders: Record<string, string> = {
            'X-OG-Debug': '1',
            'X-OG-Edge': '1',
            'X-Edge-Active': '1',
            'X-OG-Test-Mode': String(testMode),
            'X-OG-Lang': lang,
            'X-OG-Slug': slug || '',
            'X-OG-UA': userAgent,
            'X-OG-Supabase-Status': String(response.status)
          };
          
          // Propagate all X-OG-* and X-Debug-* headers from Supabase response
          for (const [key, value] of response.headers.entries()) {
            if (key.toLowerCase().startsWith('x-og-') || key.toLowerCase().startsWith('x-debug-')) {
              debugHeaders[key] = value;
            }
          }

          const cacheControl = response.headers.get('Cache-Control') || 'public, max-age=3600';

          return new Response(html, {
            headers: {
              'Content-Type': 'text/html; charset=utf-8',
              'Cache-Control': cacheControl,
              'Vary': 'User-Agent, Accept-Language',
              'X-Robots-Tag': 'noindex',
              ...debugHeaders
            }
          });
        } else {
          // Handle non-OK response from Supabase - return fallback HTML instead of SPA
          console.error(`Supabase function returned status ${response.status} for slug: ${slug}`);
          const errorText = await response.text().catch(() => 'Unable to read error');
          console.error(`Error response: ${errorText}`);
          
          const debugHeaders: Record<string, string> = {
            'X-OG-Debug': '1',
            'X-OG-Edge': '1',
            'X-Edge-Active': '1',
            'X-OG-Test-Mode': String(testMode),
            'X-OG-Lang': lang,
            'X-OG-Slug': slug || '',
            'X-OG-UA': userAgent,
            'X-OG-Supabase-Status': String(response.status),
            'X-OG-Fallback': 'true'
          };
          
          // Propagate any X-Debug-* headers from error response
          for (const [key, value] of response.headers.entries()) {
            if (key.toLowerCase().startsWith('x-debug-')) {
              debugHeaders[key] = value;
            }
          }
          
          const fallbackHtml = `<!DOCTYPE html>
<html lang="${lang}">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <meta name="robots" content="noindex" />
  <title>TunisiaTrip Blog</title>
  <link rel="canonical" href="${url.origin}${url.pathname}" />
  <meta property="og:title" content="TunisiaTrip Blog" />
  <meta property="og:description" content="Découvrez la Tunisie avec nos guides de voyage" />
  <meta property="og:image" content="${url.origin}/og-image.png" />
  <meta property="og:image:width" content="1200" />
  <meta property="og:image:height" content="630" />
  <meta property="og:url" content="${url.origin}${url.pathname}" />
  <meta property="og:type" content="article" />
  <meta property="og:site_name" content="TunisiaTrip" />
  <meta name="twitter:card" content="summary_large_image" />
  <meta name="twitter:title" content="TunisiaTrip Blog" />
  <meta name="twitter:description" content="Découvrez la Tunisie avec nos guides de voyage" />
  <meta name="twitter:image" content="${url.origin}/og-image.png" />
</head>
<body>
  <h1>TunisiaTrip Blog</h1>
  <p>Découvrez la Tunisie avec nos guides de voyage</p>
  <p><a href="${url.origin}${url.pathname}">Visit TunisiaTrip</a></p>
</body>
</html>`;
          
          return new Response(fallbackHtml, {
            status: 200,
            headers: {
              'Content-Type': 'text/html; charset=utf-8',
              'Cache-Control': 'public, max-age=300',
              'Vary': 'User-Agent, Accept-Language',
              'X-Robots-Tag': 'noindex',
              ...debugHeaders
            }
          });
        }
      } catch (error) {
        console.error('Error calling Supabase function:', error);
        const fallback = `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <meta name="robots" content="noindex" />
  <title>TunisiaTrip Blog</title>
  <link rel="canonical" href="${url.origin}${url.pathname}" />
  <meta property="og:title" content="TunisiaTrip Blog" />
  <meta property="og:description" content="Découvrez la Tunisie avec nos guides de voyage" />
  <meta property="og:image" content="${url.origin}/og-image.png" />
  <meta property="og:image:width" content="1200" />
  <meta property="og:image:height" content="630" />
  <meta property="og:url" content="${url.origin}${url.pathname}" />
  <meta property="og:type" content="article" />
</head>
<body>
  <h1>TunisiaTrip Blog</h1>
  <p>Découvrez la Tunisie avec nos guides de voyage</p>
</body>
</html>`;
        return new Response(fallback, {
          status: 200,
          headers: {
            'Content-Type': 'text/html; charset=utf-8',
            'Cache-Control': 'public, max-age=300',
            'Vary': 'User-Agent, Accept-Language',
            'X-Robots-Tag': 'noindex',
            'X-OG-Edge': '1',
            'X-Edge-Active': '1',
            'X-OG-Fallback': 'exception'
          }
        });
      }
    }
  }

  // For non-bot requests or fallback, continue to the original request
  return context.next();
};

export const config = {
  path: "/*"
};