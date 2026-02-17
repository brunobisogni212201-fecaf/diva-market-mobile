/** @type {import('next').NextConfig} */
const nextConfig = {
    reactStrictMode: true,
    eslint: {
        ignoreDuringBuilds: true,
    },
    typescript: {
        ignoreBuildErrors: true,
    },
    images: {
        remotePatterns: [
            {
                protocol: 'https',
                hostname: '**',
            },
        ],
    },
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
};

export default nextConfig;
