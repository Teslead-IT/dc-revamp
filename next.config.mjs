/** @type {import('next').NextConfig} */
const nextConfig = {
  typescript: {
    ignoreBuildErrors: true,
  },
  images: {
    unoptimized: true,
  },
  webpack: (config, { isServer }) => {
    if (isServer) {
      // Mark database modules as external to prevent bundling issues
      config.externals = config.externals || []
      config.externals.push(
        'pg',
        'pg-hstore', 
        'sequelize'
      )
    }
    return config
  },
}

export default nextConfig
