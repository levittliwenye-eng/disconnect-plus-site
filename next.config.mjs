/** @type {import('next').NextConfig} */
const nextConfig = {
  agentRules: false,
  output: "export",
  poweredByHeader: false,
  reactStrictMode: true,
  trailingSlash: true,
  images: {
    unoptimized: true
  }
};

export default nextConfig;
