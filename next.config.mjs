/** @type {import('next').NextConfig} */
const nextConfig = {
  env: {
    BASE_URL: process.env.BASE_URL || "http://localhost:3000",
  },
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "images.unsplash.com",
      },
      {
        protocol: "https",
        hostname: "img.youtube.com",
      },
      {
        protocol: "https",
        hostname: "admin.crimevision24.com",
      },
      {
        protocol: "https",
        hostname: "admin.banglastarnews.com",
      },
      {
        protocol: "http",
        hostname: "admin.banglastarnews.com",
      },
      {
        protocol: "https",
        hostname: "res.cloudinary.com",
      },
      {
        protocol: "https",
        hostname: "i.imgur.com",
      },
    ],
  },
  reactStrictMode: true,
  serverExternalPackages: ["mongoose", "bcryptjs"],
};

export default nextConfig;
