import type React from "react"
import type { Metadata } from "next"
import { Inter } from "next/font/google"
import { GeistMono } from "geist/font/mono"
import { Analytics } from "@vercel/analytics/next"
import "./globals.css"
import { TranslationProvider } from "@/lib/translation-system"
import { ThemeProvider } from "@/components/theme-provider"
import { NavigationProvider } from "@/lib/navigation-context"
import { WorkspaceLayout } from "@/components/workspace-shell"

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
})

export const metadata: Metadata = {
  title: "Core UX Template UUI",
  description: "Core UX Template — legacy UUI shell reference",
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html
      lang="en"
      data-theme="legacy"
      data-design-system="ngx-legacy-uui"
      suppressHydrationWarning
      className={`${inter.variable} ${GeistMono.variable}`}
    >
      <body className="min-h-dvh bg-background-primary font-sans text-foreground-primary antialiased">
        <ThemeProvider attribute="class" defaultTheme="light" enableSystem>
          <NavigationProvider>
            <TranslationProvider>
              <WorkspaceLayout>{children}</WorkspaceLayout>
            </TranslationProvider>
          </NavigationProvider>
        </ThemeProvider>
        <Analytics />
      </body>
    </html>
  )
}
