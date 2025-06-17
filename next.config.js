/** @type {import('next').NextConfig} */
const nextConfig = {
  // パフォーマンス最適化
  poweredByHeader: false,
  compress: true,
  // 画像最適化
  images: {
    minimumCacheTTL: 60,
  },
}

module.exports = nextConfig