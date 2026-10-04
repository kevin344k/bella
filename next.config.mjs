/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  // App Router is enabled by default in newer Next.js versions; remove experimental.appDir to avoid warnings
  images: {
    formats: ["image/avif", "image/webp"]
  },
  webpack: (config, { isServer }) => {
    // Prevent pdfjs from trying to resolve optional 'canvas' native dependency during server build
    config.resolve = config.resolve || {}
    config.resolve.fallback = {
      ...(config.resolve.fallback || {}),
      canvas: false
    }
    return config
  }
};

export default nextConfig;
