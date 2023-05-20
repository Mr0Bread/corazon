/* eslint-disable @typescript-eslint/ban-ts-comment */
// app/layout.tsx
import '../styles/globals.css'
import { ClerkProvider } from '@clerk/nextjs'
import { Inter as FontSans } from 'next/font/google'
import Header from './header'

const fontSans = FontSans({
  subsets: ["latin"],
  variable: "--font-sans",
  display: "swap",
})

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" className={`${fontSans.className} dark`}>
      <body className="min-h-screen bg-background text-gray-900 antialiased flex flex-col items-center">
        <div className="max-w-7xl w-full">
          {children}
        </div>
      </body>
    </html>
  )
}
