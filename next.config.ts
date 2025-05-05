import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  env: {
    TMDB_API_KEY: process.env.TMDB_API_KEY,
  },
  images: {
    domains: ['image.tmdb.org'],
  },
};

export default nextConfig;
