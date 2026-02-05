/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,

  // Enable compression
  compress: true,

  // Optimize images
  images: {
    formats: ['image/avif', 'image/webp'],
    deviceSizes: [640, 750, 828, 1080, 1200],
    imageSizes: [16, 32, 48, 64, 96, 128, 256],
  },

  // Experimental features for better performance
  experimental: {
    optimizeCss: true,
  },

  // Turbopack config (empty to acknowledge we're using default settings)
  turbopack: {},

  // Security and performance headers
  async headers() {
    return [
      {
        source: '/:path*',
        headers: [
          {
            key: 'Content-Security-Policy',
            value: [
              "default-src 'self'",
              "script-src 'self' 'unsafe-inline' 'unsafe-eval' https://link.msgsndr.com https://*.google.com https://*.googletagmanager.com https://*.gstatic.com https://va.vercel-scripts.com https://connect.facebook.net https://*.facebook.com",
              "style-src 'self' 'unsafe-inline' https://fonts.googleapis.com",
              "font-src 'self' https://fonts.gstatic.com data:",
              "img-src 'self' data: blob: https:",
              "frame-src 'self' https://api.leadconnectorhq.com https://*.leadconnectorhq.com",
              "connect-src 'self' https://api.leadconnectorhq.com https://*.leadconnectorhq.com https://*.msgsndr.com https://va.vercel-scripts.com https://*.vercel-analytics.com https://*.facebook.com https://*.facebook.net https://*.run.app https://*.conversionsapigateway.com",
            ].join('; '),
          },
          {
            key: 'X-Content-Type-Options',
            value: 'nosniff',
          },
          {
            key: 'X-Frame-Options',
            value: 'SAMEORIGIN',
          },
          {
            key: 'X-XSS-Protection',
            value: '1; mode=block',
          },
          {
            key: 'Referrer-Policy',
            value: 'strict-origin-when-cross-origin',
          },
        ],
      },
      {
        // Cache static assets aggressively
        source: '/content.html',
        headers: [
          {
            key: 'Cache-Control',
            value: 'public, max-age=31536000, immutable',
          },
        ],
      },
      {
        // Cache extracted images and fonts
        source: '/(images|fonts)/:path*',
        headers: [
          {
            key: 'Cache-Control',
            value: 'public, max-age=31536000, immutable',
          },
        ],
      },
    ]
  },
}

module.exports = nextConfig
