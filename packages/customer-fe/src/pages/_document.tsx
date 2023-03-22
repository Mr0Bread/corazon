import { Html, Head, Main, NextScript } from 'next/document'

export default function Document() {
  return (
    <Html>
      <Head />
      <body
        className="min-h-screen bg-gray-100 dark:bg-slate-900 text-gray-900 antialiased"
      >
        <Main />
        <NextScript />
      </body>
    </Html>
  )
}