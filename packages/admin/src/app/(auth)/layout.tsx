import { ClerkProvider } from '@clerk/nextjs'
import { Inter as FontSans } from 'next/font/google'
import { TrpcProvider } from '~/utils/trpc-provider'
import { AntdStyleProvider } from './antd-style-provider'
import AdminLayout from './admin-layout'
import 'antd/dist/reset.css'

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
        <AntdStyleProvider>
          <html lang="en" className={`${fontSans.className} dark`}>
            <body>
              <AdminLayout>{children}</AdminLayout>
            </body>
          </html>
        </AntdStyleProvider>
      </TrpcProvider>
    </ClerkProvider>
  )
}
