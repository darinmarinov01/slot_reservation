/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  async redirects() {
    return [
      // Basic redirect
      {
        source: '/',
        destination: '/sign-in',
        permanent: true,
      },
    ]
  },
  images: {
    domains: [    
    "images.pexels.com"
    ],
  },
}

export default nextConfig
