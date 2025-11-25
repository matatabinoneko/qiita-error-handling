import type { Metadata } from 'next'
import './globals.css'

export const metadata: Metadata = {
  title: 'ユーザー検索',
  description: 'ユーザー検索アプリケーション',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="ja">
      <body>{children}</body>
    </html>
  )
}

