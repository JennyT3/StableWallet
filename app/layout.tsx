import type React from "react"
import type { Metadata } from "next"
import { Inter } from "next/font/google"
import "./globals.css"
import { ThemeProvider } from "@/components/theme-provider"
import { NetworkProvider } from "@/contexts/network-context"
import { WalletProvider } from "@/contexts/wallet-context"
import { Sidebar } from "@/components/sidebar"

const inter = Inter({ subsets: ["latin"] })

export const metadata: Metadata = {
  title: "StableBridge - Multi-Chain DeFi Platform",
  description: "Swap, aggregate, yield, and pay USDC across multiple blockchains",
    generator: 'v0.dev'
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={inter.className}>
        <ThemeProvider defaultTheme="blue" storageKey="stablebridge-theme">
          <NetworkProvider>
            <WalletProvider>
              <div className="min-h-screen bg-background">
                {/* Mobile Header */}
                <div className="md:hidden flex items-center justify-between p-4 border-b">
                  <Sidebar />
                  <div className="flex items-center space-x-2">
                    <div className="h-8 w-8 rounded-lg bg-gradient-to-r from-blue-500 to-purple-600 flex items-center justify-center">
                      <span className="text-white font-bold text-sm">SB</span>
                    </div>
                    <span className="font-bold text-xl">StableBridge</span>
                  </div>
                  <div className="w-10" /> {/* Spacer for centering */}
                </div>

                {/* Desktop Layout */}
                <div className="hidden md:block">
                  <Sidebar />
                </div>

                {/* Main Content */}
                <main className="md:ml-85">{children}</main>
              </div>
            </WalletProvider>
          </NetworkProvider>
        </ThemeProvider>
      </body>
    </html>
  )
}
