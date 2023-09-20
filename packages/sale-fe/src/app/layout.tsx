/* eslint-disable @typescript-eslint/ban-ts-comment */
// app/layout.tsx
import "@uploadthing/react/styles.css";
import '../styles/globals.css'
import { ClerkProvider } from '@clerk/nextjs'
import { Inter as FontSans } from 'next/font/google'
import Header from './header'
import { TrpcProvider } from '~/utils/trpc-provider'

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
      <ClerkProvider>
        <TrpcProvider>
          <body className="min-h-screen bg-background text-gray-900 antialiased flex flex-col items-center pb-16">
            <div className="max-w-7xl w-full">
              <Header />
              {children}
            </div>
          </body>
        </TrpcProvider>
      </ClerkProvider>
    </html>
  )
}
