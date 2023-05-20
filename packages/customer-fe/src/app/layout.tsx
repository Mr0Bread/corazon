// app/layout.tsx
import './globals.css'
import { ClerkProvider } from '@clerk/nextjs'

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <ClerkProvider>
      <html lang="en">
        <body className="min-h-screen bg-gray-100 dark:bg-slate-900 text-gray-900 antialiased">{children}</body>
      </html>
    </ClerkProvider>
  )
}
