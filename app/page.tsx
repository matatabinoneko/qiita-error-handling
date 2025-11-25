import Link from 'next/link'

export default function Home() {
  return (
    <main>
      <h1>ホーム</h1>
      <Link href="/search">ユーザー検索へ</Link>
    </main>
  )
}

