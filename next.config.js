/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  images: {
    domains: [],
    formats: ['image/avif', 'image/webp'],
  },
  // Ottimizzazione performance
  compress: true,
  poweredByHeader: false,
}

module.exports = nextConfig
