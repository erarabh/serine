// next.config.js
/** @type {import('next').NextConfig} */
const nextConfig = {
  output: 'standalone',
  allowedDevOrigins: ['https://da8145e1a5df.ngrok-free.app'] // ✅ move to root level
};

export default nextConfig;
