import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'

const inter = Inter({ 
  subsets: ['latin'],
  display: 'swap',
  preload: true,
  variable: '--font-inter'
})

export const metadata: Metadata = {
  title: '私年表 - あなたの生年月日から年表を生成',
  description: 'ユーザーの生年月日を元に、歴史的出来事の年表をAIが自動生成するWebアプリ',
  viewport: 'width=device-width, initial-scale=1',
  robots: 'index,follow',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="ja" className={inter.variable}>
      <body className={`${inter.className} antialiased`} suppressHydrationWarning>
        {children}
      </body>
    </html>
  )
}