# ✅ Working Solution: Next.js + Astro Integration

## Confirmed Working Setup

The POC successfully demonstrates serving Astro documentation through Next.js rewrites.

### Test Results

| URL | Status | Served By |
|-----|--------|-----------|
| http://localhost:3000/ | ✅ Working | Next.js |
| http://localhost:3000/docs | ✅ Working | Astro (via proxy) |
| http://localhost:3000/docs/getting-started | ✅ Working | Astro (via proxy) |
| http://localhost:3000/docs/guides/installation | ✅ Working | Astro (via proxy) |

### Key Configuration

**next.config.ts:**
```typescript
async rewrites() {
  const astroDocsUrl = process.env.ASTRO_DOCS_URL || 'http://localhost:8081';
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

### Running Locally

1. **Terminal 1 - Astro Docs:**
   ```bash
   cd astro-docs
   npm run dev -- --port 8081
   ```

2. **Terminal 2 - Next.js:**
   ```bash
   cd nextjs-app
   npm run dev
   ```

### Production Deployment

1. **Deploy Astro to Netlify**
   - Build: `npm run build`
   - Publish: `dist`
   - Get URL: e.g., `https://nx-docs.netlify.app`

2. **Deploy Next.js to Vercel**
   - Set env var: `ASTRO_DOCS_URL=https://nx-docs.netlify.app`
   - Deploy normally

### For nx.dev Implementation

This setup allows:
- **canary.nx.dev** → Points to canary Astro docs on Netlify
- **nx.dev** → Points to production Astro docs on Netlify
- All paths remain the same (`/docs/*`)
- No DNS changes required
- Independent deployments

### Migration Steps for Nx Repository

1. **In nx-dev/nx-dev (Next.js):**
   - Add rewrite rules to `next.config.js`
   - Add `ASTRO_DOCS_URL` environment variable

2. **In astro-docs (Astro):**
   - Deploy to Netlify with CORS headers
   - Ensure all internal links use relative paths

3. **In Vercel:**
   - Set `ASTRO_DOCS_URL` for each environment
   - Production: `https://docs-prod.netlify.app`
   - Preview: `https://docs-canary.netlify.app`

The solution is production-ready and requires minimal changes to the existing setup.