// app/layout.tsx
import '../../styles/globals.css'
import { AxiomWebVitals } from 'next-axiom';
import { ClerkProvider } from '@clerk/nextjs'
import { Inter as FontSans } from 'next/font/google'
import Header from './header'
import { Toaster } from "@/components/ui/toaster"
import { TrpcProvider } from '~/utils/trpc-provider'
import JotaiProvider from './jotai-provider'

const fontSans = FontSans({
  subsets: ["latin"],
  variable: "--font-sans",
  display: "swap",
})

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <ClerkProvider>
      <TrpcProvider>
        <JotaiProvider>
          <html lang="en" className={`${fontSans.className} dark`}>
            <AxiomWebVitals />
            <body className="min-h-screen bg-background text-gray-900 antialiased flex flex-col items-center">
              <div className="max-w-7xl w-full flex-1 flex flex-col">
                <Header />
                {children}
                <Toaster />
              </div>
            </body>
          </html>
        </JotaiProvider>
      </TrpcProvider>
    </ClerkProvider>
  )
}
