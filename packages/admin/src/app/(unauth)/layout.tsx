import { ClerkProvider } from '@clerk/nextjs'
import { Inter as FontSans } from 'next/font/google'

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
      <html lang="en" className={`${fontSans.className} dark`}>
        <body>
          {children}
        </body>
      </html>
    </ClerkProvider>
  )
}
