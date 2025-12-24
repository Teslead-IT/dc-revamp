/** @type {import('next').NextConfig} */
const nextConfig = {
  typescript: {
    ignoreBuildErrors: true,
  },
  images: {
    unoptimized: true,
  },
  // Externalize database packages to prevent bundling issues
  serverExternalPackages: ['sequelize', 'pg', 'pg-hstore'],
  experimental: {
    serverComponentsExternalPackages: ['sequelize', 'pg', 'pg-hstore'],
  },
  webpack: (config, { isServer }) => {
    if (isServer) {
      // Ensure pg-native is marked as external
      config.externals.push('pg-native');
    }
    return config;
  },
}

export default nextConfig
