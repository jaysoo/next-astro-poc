# 🚀 Deployment Guide: Next.js on Vercel + Astro on Netlify

This guide provides step-by-step instructions to deploy the POC to production.

## Prerequisites

- GitHub account
- Vercel account
- Netlify account
- This POC repository pushed to GitHub

## Step 1: Push to GitHub

```bash
cd ~/projects/next-astro-poc
git remote add origin https://github.com/YOUR_USERNAME/next-astro-poc.git
git push -u origin main
```

## Step 2: Deploy Astro Docs to Netlify

### Option A: Via Netlify CLI

```bash
# Install Netlify CLI if needed
npm install -g netlify-cli

# Deploy from astro-docs directory
cd astro-docs
netlify deploy --prod --dir=dist

# Or link to GitHub and deploy
netlify init
netlify deploy --prod
```

### Option B: Via Netlify Dashboard

1. Go to [app.netlify.com](https://app.netlify.com)
2. Click "Add new site" → "Import an existing project"
3. Connect to GitHub and select your repository
4. Configure build settings:
   - **Base directory**: `astro-docs`
   - **Build command**: `npm run build`
   - **Publish directory**: `astro-docs/dist`
   - **Node version**: 18 (set in Environment variables)
5. Click "Deploy site"
6. Note your site URL (e.g., `https://amazing-docs-123.netlify.app`)

### Configure Custom Domain (Optional)

In Netlify dashboard:
1. Go to "Domain settings"
2. Add custom domain: `docs.yourdomain.com`
3. Or use the Netlify subdomain

## Step 3: Deploy Next.js to Vercel

### Option A: Via Vercel CLI

```bash
# Install Vercel CLI if needed
npm install -g vercel

# Deploy from nextjs-app directory
cd nextjs-app
vercel

# Follow prompts and set environment variable when asked
```

### Option B: Via Vercel Dashboard

1. Go to [vercel.com/new](https://vercel.com/new)
2. Import your GitHub repository
3. Select the `nextjs-app` directory as the root
4. **IMPORTANT**: Add Environment Variable:
   - Name: `NEXT_PUBLIC_ASTRO_URL`
   - Value: Your Netlify URL (e.g., `https://amazing-docs-123.netlify.app`)
5. Click "Deploy"

### Setting Environment Variables in Vercel

After deployment or during setup:
1. Go to your project settings in Vercel
2. Navigate to "Environment Variables"
3. Add:
   ```
   NEXT_PUBLIC_ASTRO_URL = https://YOUR-ASTRO-SITE.netlify.app
   ```
4. Apply to: Production, Preview, Development (as needed)
5. Redeploy to apply changes

## Step 4: Test Your Deployment

Once both are deployed:

1. Visit your Vercel URL: `https://your-app.vercel.app`
2. Click "Go to Documentation" or navigate to `/docs`
3. Verify the Astro docs load correctly
4. Test nested routes: `/docs/getting-started`

## Environment Configuration

### For Multiple Environments

You can have different Astro deployments for different environments:

#### Production Setup
- Netlify (production): `nx-docs-prod.netlify.app`
- Vercel (production): Set `NEXT_PUBLIC_ASTRO_URL=https://nx-docs-prod.netlify.app`

#### Staging/Canary Setup
- Netlify (staging): `nx-docs-staging.netlify.app`
- Vercel (preview): Set `NEXT_PUBLIC_ASTRO_URL=https://nx-docs-staging.netlify.app`

### Vercel Environment Variables by Branch

In Vercel, you can set different values per environment:

1. Go to Settings → Environment Variables
2. Add `NEXT_PUBLIC_ASTRO_URL`
3. Set different values:
   - Production: `https://docs-prod.netlify.app`
   - Preview: `https://docs-staging.netlify.app`
   - Development: `http://localhost:8081`

## Troubleshooting

### Issue: 404 on /docs routes

**Solution**: Verify `NEXT_PUBLIC_ASTRO_URL` is set correctly in Vercel:
```bash
# Check in Vercel dashboard or use CLI
vercel env ls
```

### Issue: CORS errors

**Solution**: Ensure `netlify.toml` has proper headers:
```toml
[[headers]]
  for = "/*"
  [headers.values]
    Access-Control-Allow-Origin = "*"
```

### Issue: Rewrites not working

**Solution**: Redeploy after setting environment variables:
```bash
vercel --prod --force
```

### Issue: Assets not loading

**Solution**: Check Astro's base URL configuration if using a subdomain.

## Quick Deploy Scripts

Create these helper scripts in the root `package.json`:

```json
{
  "scripts": {
    "deploy:astro": "cd astro-docs && netlify deploy --prod",
    "deploy:nextjs": "cd nextjs-app && vercel --prod",
    "deploy:all": "npm run deploy:astro && npm run deploy:nextjs"
  }
}
```

## Monitoring

### Vercel Analytics
- Automatic with Vercel deployment
- Check "Analytics" tab in dashboard

### Netlify Analytics
- Enable in Netlify dashboard
- Go to "Analytics" section

## CI/CD Setup (Optional)

### GitHub Actions

Create `.github/workflows/deploy.yml`:

```yaml
name: Deploy

on:
  push:
    branches: [main]

jobs:
  deploy-astro:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - uses: actions/setup-node@v3
        with:
          node-version: 18
      - run: cd astro-docs && npm ci && npm run build
      - uses: netlify/actions/cli@master
        with:
          args: deploy --prod --dir=astro-docs/dist
        env:
          NETLIFY_AUTH_TOKEN: ${{ secrets.NETLIFY_AUTH_TOKEN }}
          NETLIFY_SITE_ID: ${{ secrets.NETLIFY_SITE_ID }}

  deploy-nextjs:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - uses: amondnet/vercel-action@v25
        with:
          vercel-token: ${{ secrets.VERCEL_TOKEN }}
          vercel-org-id: ${{ secrets.VERCEL_ORG_ID }}
          vercel-project-id: ${{ secrets.VERCEL_PROJECT_ID }}
          working-directory: ./nextjs-app
```

## Summary

1. **Deploy Astro first** → Get Netlify URL
2. **Set Vercel env var** → `NEXT_PUBLIC_ASTRO_URL=<netlify-url>`
3. **Deploy Next.js** → Rewrites will work automatically
4. **Test everything** → Verify `/docs` routes work

The key is ensuring `NEXT_PUBLIC_ASTRO_URL` points to your deployed Astro site!