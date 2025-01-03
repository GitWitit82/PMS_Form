/** @type {import('next').NextConfig} */
const nextConfig = {
  webpack: (config, { isServer }) => {
    if (!isServer) {
      config.resolve.fallback = {
        ...config.resolve.fallback,
        fs: false,
        net: false,
        tls: false,
        crypto: false
      }
    }

    // Handle HTML files
    config.module.rules.push({
      test: /\.html$/,
      type: 'asset/resource'
    })

    // Disable webpack caching temporarily
    config.cache = false

    return config
  }
}

module.exports = nextConfig