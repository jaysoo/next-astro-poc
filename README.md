# Next.js + Astro POC: Unified Documentation URL Structure

This POC demonstrates how to serve an Astro documentation site through Next.js rewrites, allowing `nx.dev/docs` to serve content from a separate Astro application hosted on Netlify while the main Next.js site remains on Vercel.

## Architecture Overview

```
User Request → nx.dev (Vercel/Next.js)
                ├── / → Next.js pages
                └── /docs/* → Rewrite to Astro (Netlify)
```

## Project Structure

```
next-astro-poc/
├── nextjs-app/          # Main Next.js application (nx.dev)
│   ├── app/
│   ├── next.config.ts   # Contains rewrite rules
│   ├── vercel.json      # Vercel deployment config
│   └── .env.example     # Environment variables template
└── astro-docs/          # Astro documentation site
    ├── src/pages/       # Documentation pages
    └── netlify.toml     # Netlify deployment config
```

## Local Development

### 1. Start the Astro Documentation Server

```bash
cd astro-docs
npm run dev
# Runs on http://localhost:4321
```

### 2. Start the Next.js Application

```bash
cd nextjs-app
npm run dev
# Runs on http://localhost:3000
```

### 3. Test the Integration

- **Main site**: http://localhost:3000
- **Documentation** (proxied through Next.js): http://localhost:3000/docs
- **Nested docs page**: http://localhost:3000/docs/getting-started
- **Deep nested page**: http://localhost:3000/docs/guides/installation

## How It Works

### Next.js Rewrite Configuration

The key configuration is in `nextjs-app/next.config.ts`:

```typescript
async rewrites() {
  const astroDocsUrl = process.env.ASTRO_DOCS_URL || 'http://localhost:4321';
  
  return [
    {
      source: '/docs',
      destination: `${astroDocsUrl}/`,
    },
    {
      source: '/docs/:path*',
      destination: `${astroDocsUrl}/:path*`,
    },
  ];
}
```

This configuration:
- Intercepts all requests to `/docs` and `/docs/*`
- Proxies them to the Astro application
- Uses environment variables for different environments

## Deployment Setup

### 1. Deploy Astro to Netlify

1. Create a new Netlify site
2. Connect the `astro-docs` directory
3. Deploy with these settings:
   - Build command: `npm run build`
   - Publish directory: `dist`
4. Note your Netlify URL (e.g., `https://your-astro-docs.netlify.app`)

### 2. Deploy Next.js to Vercel

1. Create a new Vercel project
2. Connect the `nextjs-app` directory
3. Add environment variable:
   - `ASTRO_DOCS_URL`: Your Netlify URL from step 1
4. Deploy

### 3. Configure for Multiple Environments

For production (`nx.dev`):
```
ASTRO_DOCS_URL=https://nx-docs-prod.netlify.app
```

For canary (`canary.nx.dev`):
```
ASTRO_DOCS_URL=https://nx-docs-canary.netlify.app
```

## Environment Variables

### Next.js (Vercel)

Create environment variables in Vercel dashboard:

| Variable | Value | Environment |
|----------|-------|-------------|
| `ASTRO_DOCS_URL` | `https://nx-docs-prod.netlify.app` | Production |
| `ASTRO_DOCS_URL` | `https://nx-docs-canary.netlify.app` | Preview |

### Local Development

Copy `.env.example` to `.env.local`:
```bash
cp nextjs-app/.env.example nextjs-app/.env.local
```

## Testing the Setup

### Local Testing Script

```bash
# Terminal 1: Start Astro
cd astro-docs && npm run dev

# Terminal 2: Start Next.js
cd nextjs-app && npm run dev

# Terminal 3: Test endpoints
curl http://localhost:3000/              # Next.js home
curl http://localhost:3000/docs          # Astro docs home
curl http://localhost:3000/docs/getting-started  # Astro subpage
```

## Important Considerations

### 1. CORS Configuration

The Astro site on Netlify includes CORS headers in `netlify.toml`:
```toml
[[headers]]
  for = "/*"
  [headers.values]
    Access-Control-Allow-Origin = "*"
```

### 2. Asset Handling

- Astro assets are served from Netlify's CDN
- Ensure all Astro internal links use relative paths
- Static assets in Astro should use proper base paths

### 3. Performance

- Next.js rewrites add minimal latency
- Consider caching strategies for production
- Netlify's CDN helps with documentation performance

### 4. SEO Considerations

- Search engines will see unified URLs under nx.dev/docs
- Ensure proper meta tags in Astro pages
- Consider canonical URLs if needed

## Migration Path for nx.dev

1. **Phase 1: Setup**
   - Deploy Astro docs to Netlify
   - Configure Next.js rewrites
   - Test with a subset of documentation

2. **Phase 2: Content Migration**
   - Migrate documentation content to Astro
   - Maintain URL structure for SEO
   - Set up redirects for any changed paths

3. **Phase 3: Production Deployment**
   - Update Vercel environment variables
   - Deploy both applications
   - Monitor for any issues

## Troubleshooting

### Rewrite not working locally
- Check that Astro is running on port 4321
- Verify `.env.local` exists with correct URL
- Restart Next.js dev server after env changes

### 404 errors on /docs
- Ensure Astro build includes all pages
- Check Netlify deployment logs
- Verify ASTRO_DOCS_URL is set correctly

### CORS issues
- Check Netlify headers configuration
- Verify Access-Control headers are present
- Test with curl to see response headers

## Benefits of This Approach

1. **Unified Domain**: All content under nx.dev
2. **Independent Deployment**: Docs and main site deploy separately
3. **Technology Freedom**: Use best tool for each purpose
4. **No DNS Changes**: Works with existing setup
5. **Easy Rollback**: Can revert by changing environment variable

## Next Steps

1. Add authentication if needed
2. Implement preview deployments
3. Set up CI/CD pipelines
4. Add monitoring and analytics
5. Configure CDN caching rules