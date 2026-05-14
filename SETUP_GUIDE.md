# H&B Technologies - Setup & Fixes

## Recent Changes

### Blog Improvements
- **Expanded blog content**: 7 blog posts now available (previously 3)
- **Detailed content**: Each blog post now has 4+ detailed paragraphs in the body
- **Better metadata**: Each post includes title, excerpt, date, reading time, and tags
- **Dynamic rendering**: `/blog/[slug]` pages render dynamically with ISR caching

**Blog posts available:**
1. Secure-by-design Next.js
2. Supabase RLS patterns
3. Lighthouse 90+ checklist
4. API security best practices *(new)*
5. Database migrations strategy *(new)*
6. Monitoring & observability guide *(new)*
7. Next.js performance optimization *(new)*

### Services Routing Fixed
- **Dynamic routes**: `/services/[slug]` now renders on-demand (not pre-rendered)
- **API-backed**: Services fetch from the API with static fallback
- **Proper 404 handling**: Uses `notFound()` when service doesn't exist
- **Related services**: Each service page shows 3 related services as internal links

### Blog Detail Pages Enhanced
- **Full content display**: Blog detail pages now show complete paragraphs from the body array
- **Featured images**: Support for featured images (currently uses fallback)
- **Metadata**: Dynamic OG tags, Twitter cards, and JSON-LD BlogPosting schema
- **Author info**: Displays blog author and publish date

## How It Works

### When API_URL is not configured (local development)
1. **Blog pages**: Fall back to static content (7 blog posts)
2. **Service pages**: Fall back to static services (12 services)
3. **Dynamic details**: Each detail page is rendered on-demand, not pre-built

### When API_URL is configured (production)
1. Fetch blog/service data from the Express API
2. Fall back to static content if API is unavailable
3. Cache responses with ISR (60-second revalidate)

## Environment Setup

### Frontend (.env.local in hb-technologies/)
```
NEXT_PUBLIC_API_URL=http://localhost:4000
```

### Backend (.env in hb-technologies-api/)
```
PORT=4000
NODE_ENV=development
CORS_ORIGINS=http://localhost:3000
JWT_SECRET=dev-secret-key-32-chars-min-abcdefghij
SUPABASE_URL=https://your-supabase-url
SUPABASE_SERVICE_ROLE_KEY=your-service-role-key
```

## Running Locally

### Terminal 1 - Frontend
```bash
cd hb-technologies
npm run dev
# Runs on http://localhost:3000
```

### Terminal 2 - Backend (optional, uses static fallback if not running)
```bash
cd hb-technologies-api
npm run dev
# Runs on http://localhost:4000
```

## Testing

- Visit `/blog` to see 7 blog posts
- Click any blog to see full detailed content
- Visit `/services` to see 12 services
- Click any service to see full details + related services
- Navigation is automatic - no manual page configuration needed

## Build Output

After `npm run build` in the frontend:
```
○  (Static)    prerendered as static
ƒ  (Dynamic)   server-rendered on demand  ← /blog/[slug] and /services/[slug]
```

The dynamic routes render on-demand with caching, so they stay fast while always falling back to static content if the API is unavailable.
