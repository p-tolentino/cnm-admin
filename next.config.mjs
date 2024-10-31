import { hostname } from 'os';

/** @type {import('next').NextConfig} */
const nextConfig = {
    images: {
        remotePatterns: [
            {
                protocol: 'https',
                hostname: 'gjumfsramdwwahgpofpb.supabase.co'
            },
            {
                protocol: 'https',
                hostname: 'images.unsplash.com'
            },
            {
                protocol: 'https',
                hostname: 'scontent.fmnl25-1.fna.fbcdn.net'
            }
        ]
    }
};

export default nextConfig;
