import { headers as getHeaders } from 'next/headers'
import { getPayload } from 'payload'
import React from 'react'
import { Inter } from 'next/font/google'

import config from '@/payload.config'

import './styles.css' // Updated import path
import { Navbar } from '@/components/ui/navbar'
import { Footer } from '@/components/ui/footer'
import { Shell } from '@/components/ui/shell'
import { Toaster } from '@/components/ui/sonner'
import { ThemeProvider } from 'next-themes'

const inter = Inter({ subsets: ['latin'] })

export const metadata = {
  title: 'NYC Running Hub',
  description: 'Connect with running clubs, events, and resources in New York City.',
}

interface FrontendLayoutProps {
  children: React.ReactNode
}

export default async function FrontendLayout({ children }: FrontendLayoutProps) {
  const headers = await getHeaders()
  const payloadConfig = await config
  const payload = await getPayload({ config: payloadConfig })
  const { user } = await payload.auth({ headers })

  return (
    <html lang="en" suppressHydrationWarning>
      <head />
      <body className={inter.className}>
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          <div className="relative min-h-screen flex flex-col antialiased">
            <Navbar user={user} />
            <main className="flex-1">
              <Shell>{children}</Shell>
              <Toaster />
            </main>
            <Footer />
          </div>
        </ThemeProvider>
        <script
          dangerouslySetInnerHTML={{
            __html: `
              (function() {
                try {
                  const systemDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
                  const theme = localStorage.getItem('theme') || 'system';
                  if (theme === 'dark' || (theme === 'system' && systemDark)) {
                    document.documentElement.classList.add('dark');
                  }
                } catch (e) {}
              })();
            `,
          }}
        />
      </body>
    </html>
  )
}
