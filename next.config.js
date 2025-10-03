/** @type {import('next').NextConfig} */
const nextConfig = {
  // App Router is enabled by default in Next.js 14
  images: {
    domains: [], // Adicione domínios externos se necessário
    formats: ["image/webp", "image/avif"],
  },
};

module.exports = nextConfig;
