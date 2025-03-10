/** @type {import('next').NextConfig} */
const nextConfig = {
  typescript: {
    ignoreBuildErrors: true
  },
  eslint: {
    ignoreDuringBuilds: true
  },
  images: {
    domains: ['localhost', 'thetrader.id'],
    unoptimized: true,
  },
}

module.exports = nextConfig 