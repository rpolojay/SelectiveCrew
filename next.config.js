/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    domains: ['firebasestorage.googleapis.com', 'res.cloudinary.com'],
    unoptimized: process.env.NODE_ENV === 'production' ? false : true,
  },
  distDir: '.next',
  generateEtags: true,
  compress: true,
  async headers() {
    return [
      {
        source: '/_next/static/:path*',
        headers: [
          {
            key: 'Cache-Control',
            value: 'public, max-age=31536000, immutable',
          },
        ],
      },
    ];
  },
  async redirects() {
    return [
      {
        source: '/favicon.ico',
        destination: '/favicon.ico',
        permanent: true,
        has: [
          {
            type: 'header',
            key: 'accept',
            value: 'image/svg+xml',
          },
        ],
      },
    ];
  },
};

module.exports = nextConfig;
