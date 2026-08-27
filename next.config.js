/** @type {import('next').NextConfig} */
const nextConfig = {
  // Allow proxying requests to instagram.com
  async rewrites() {
    return [
      {
        source: '/proxy/:path*',
        destination: 'https://www.instagram.com/:path*',
      },
    ]
  },
}

module.exports = nextConfig
