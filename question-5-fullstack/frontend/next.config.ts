/** @type {import('next').NextConfig} */
const nextConfig = {
    output: 'standalone', // เพิ่มสำหรับ Docker optimization
    async rewrites() {
        const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:7777/api';

        return [
            {
                source: '/api/:path*',
                destination: `${apiUrl}/:path*`,
            },
        ]
    },
    images: {
        remotePatterns: [
            {
                protocol: 'https',
                hostname: 'cdn.jsdelivr.net',
                pathname: '/gh/faker-js/**',
            },
            {
                protocol: 'https',
                hostname: 'api.dicebear.com',
                pathname: '/7.x/**',
            },
            {
                protocol: 'https',
                hostname: 'avatars.githubusercontent.com',
                pathname: '/**',
            },
            {
                protocol: 'https',
                hostname: 'ui-avatars.com',
                pathname: '/api/**',
            },
        ],
        dangerouslyAllowSVG: true,
        contentDispositionType: 'attachment',
        contentSecurityPolicy: "default-src 'self'; script-src 'none'; sandbox;",
    }
}

module.exports = nextConfig