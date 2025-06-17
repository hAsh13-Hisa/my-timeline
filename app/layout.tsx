import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: '私年表 - あなたの生年月日から年表を生成',
  description: 'ユーザーの生年月日を元に、同じ誕生日の有名人や人生の年表をAIが自動生成するWebアプリ',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="ja">
      <head>
        <script
          dangerouslySetInnerHTML={{
            __html: `
              // MetaMask対策
              if (typeof window !== 'undefined' && window.ethereum) {
                delete window.ethereum;
              }
            `,
          }}
        />
      </head>
      <body className={inter.className}>{children}</body>
    </html>
  )
}