/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  webpack: (config, { isServer }) => {
    // Fixes npm packages that depend on `node:process` module
    if (!isServer) {
      config.resolve.alias['node:process'] = false;
      config.resolve.alias['node:path'] = false;
      config.resolve.alias['node:os'] = false;
      config.resolve.alias['@opentelemetry/api'] = false;
    }
    return config;
  },
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'images.unsplash.com',
        port: '',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: 'rvogyfwpvmduozkawvxg.supabase.co',
        port: '',
        pathname: '/storage/v1/object/public/**',
      },
    ],
  },
};

export default nextConfig;
