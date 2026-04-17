/** @type {import('next').NextConfig} */
const nextConfig = {
  transpilePackages: ["@untitledui/react"],
  eslint: {
    ignoreDuringBuilds: true,
  },
  typescript: {
    ignoreBuildErrors: true,
  },
  images: {
    unoptimized: true,
  },
  // Prevent webpack from evaluating Three.js during SSR — these packages
  // require WebGL APIs that do not exist in Node.js.
  // NOTE: Next.js 14 uses experimental.serverComponentsExternalPackages.
  // (Next.js 15+ renamed this to top-level serverExternalPackages.)
  experimental: {
    serverComponentsExternalPackages: ["three", "@react-three/fiber", "@react-three/drei"],
  },
}

export default nextConfig
