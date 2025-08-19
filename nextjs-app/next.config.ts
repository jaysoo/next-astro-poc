import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  async rewrites() {
    // Use NEXT_PUBLIC_ASTRO_URL environment variable
    const astroDocsUrl = process.env.NEXT_PUBLIC_ASTRO_URL || 'http://localhost:8081';
    
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
