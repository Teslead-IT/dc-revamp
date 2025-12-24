/** @type {import('next').NextConfig} */
const nextConfig = {
  typescript: {
    ignoreBuildErrors: true,
  },
  images: {
    unoptimized: true,
  },
  // Externalize database packages to prevent bundling issues
  serverExternalPackages: ['sequelize', 'pg', 'pg-hstore', 'pg-native'],
}

export default nextConfig


