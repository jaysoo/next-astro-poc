import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  async rewrites() {
    const isProduction = process.env.NODE_ENV === 'production';
    const astroDocsUrl = process.env.ASTRO_DOCS_URL || 'http://localhost:4321';
    
    console.log(`Configuring rewrites to Astro docs at: ${astroDocsUrl}`);
    
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
  },
};

export default nextConfig;
