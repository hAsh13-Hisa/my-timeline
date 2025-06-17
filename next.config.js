/** @type {import('next').NextConfig} */
const nextConfig = {
  experimental: {
    // SES (Secure ECMAScript) 警告を無効化
    esmExternals: 'loose'
  },
  // 本番環境でのコンソール警告を抑制
  logging: {
    fetches: {
      fullUrl: process.env.NODE_ENV === 'development'
    }
  }
}

module.exports = nextConfig