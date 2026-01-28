/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  async headers() {
    return [
      {
        source: '/:path*',
        headers: [
          {
            key: 'Content-Security-Policy',
            value: "frame-src 'self' https://api.leadconnectorhq.com https://*.leadconnectorhq.com; script-src 'self' 'unsafe-inline' 'unsafe-eval' https://link.msgsndr.com https://*.google.com https://*.googletagmanager.com https://*.gstatic.com;",
          },
        ],
      },
    ]
  },
}

module.exports = nextConfig
