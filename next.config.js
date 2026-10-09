/** @type {import('next').NextConfig} */
const nextConfig = {
  serverExternalPackages: ['firebase-admin'],
  async redirects() {
    return [
      { source: '/privacy-policy', destination: '/privacy', permanent: true },
      { source: '/terms-of-service', destination: '/terms', permanent: true },
      { source: '/home', destination: '/', permanent: true },
      { source: '/home/', destination: '/', permanent: true },
      { source: '/signup', destination: '/empezar', permanent: true },
      { source: '/training-partners', destination: '/training', permanent: true },
      { source: '/job/:slug', destination: '/jobs', permanent: true },
      { source: '/job/:slug/', destination: '/jobs', permanent: true },
      { source: '/blog/top-10-best-cruise-lines-to-work-for-in-2026', destination: '/blog', permanent: true },
      { source: '/jobs/cunard-sommelier-1', destination: '/jobs', permanent: true },
      { source: '/jobs/gcc-drw-1', destination: '/jobs', permanent: true },
      { source: '/jobs/po-bw-pc-1', destination: '/jobs', permanent: true },
      { source: '/jobs/gcc-ca-1', destination: '/jobs', permanent: true },
      { source: '/jobs/cunard-receptionist-1', destination: '/jobs', permanent: true },
      { source: '/blog/salaries-2026', destination: '/blog/cruise-ship-salary-guide', permanent: true },
      { source: '/blog/top-10-best-cruise-lines-to-work-for-in-2026', destination: '/blog', permanent: true },
      { source: '/for-employers', destination: '/employers', permanent: true },
      { source: '/pricing', destination: '/employers', permanent: false },
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
};

module.exports = nextConfig;



