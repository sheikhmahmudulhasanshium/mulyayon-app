import type { NextConfig } from "next"

interface CustomWebpackConfig {
  watchOptions?: {
    ignored?: string[] | string
    poll?: number | boolean
    aggregateTimeout?: number
  }
  [key: string]: unknown
}

const nextConfig: NextConfig = {
  // Tell Next.js 16 to proceed with Turbopack for compilation builds
  // while keeping Webpack custom watch configurations intact for dev mode.
  turbopack: {},

  webpack: (
    config: CustomWebpackConfig, 
    { dev, isServer }: { dev: boolean; isServer: boolean }
  ) => {
    if (dev && !isServer) {
      // Reduce disk-polling overhead on slow drives
      config.watchOptions = {
        ignored: ['**/node_modules/**', '**/.next/**'],
        poll: 1000, 
        aggregateTimeout: 300, 
      }
    }
    return config
  },
}

export default nextConfig