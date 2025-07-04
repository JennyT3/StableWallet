"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Switch } from "@/components/ui/switch"
import { Label } from "@/components/ui/label"
import { Moon, Sun, TestTube, Globe } from "lucide-react"
import { ChainSelector } from "./chain-selector"
import { useTheme } from "./theme-provider"
import { useNetwork } from "@/contexts/network-context"
import { cn } from "@/lib/utils"

const navItems = [
  { href: "/", label: "Swap", icon: "🔄" },
  { href: "/aggregate", label: "Aggregate", icon: "📊" },
  { href: "/yield", label: "Yield", icon: "🌱" },
  { href: "/pay", label: "Pay", icon: "💳" },
]

export function Navigation() {
  const pathname = usePathname()
  const { theme, setTheme } = useTheme()
  const { isTestnet, setIsTestnet } = useNetwork()

  return (
    <nav className="border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container mx-auto px-4">
        <div className="flex h-16 items-center justify-between">
          {/* Logo */}
          <div className="flex items-center space-x-4">
            <Link href="/" className="flex items-center space-x-2">
              <div className="h-8 w-8 rounded-lg bg-gradient-to-r from-blue-500 to-purple-600 flex items-center justify-center">
                <span className="text-white font-bold text-sm">SB</span>
              </div>
              <span className="font-bold text-xl">StableBridge</span>
            </Link>
          </div>

          {/* Main Navigation */}
          <div className="flex items-center space-x-1">
            {navItems.map((item) => (
              <Link key={item.href} href={item.href}>
                <Button
                  variant={pathname === item.href ? "default" : "ghost"}
                  className={cn(
                    "flex items-center space-x-2",
                    pathname === item.href && "bg-primary text-primary-foreground",
                  )}
                >
                  <span>{item.icon}</span>
                  <span>{item.label}</span>
                </Button>
              </Link>
            ))}
          </div>

          {/* Right Side Controls */}
          <div className="flex items-center space-x-4">
            {/* Chain Selector */}
            <ChainSelector />

            {/* Testnet/Mainnet Toggle */}
            <div className="flex items-center space-x-2">
              <Globe className="h-4 w-4" />
              <Switch id="testnet-mode" checked={isTestnet} onCheckedChange={setIsTestnet} />
              <TestTube className="h-4 w-4" />
              <Label htmlFor="testnet-mode" className="text-sm">
                {isTestnet ? "Testnet" : "Mainnet"}
              </Label>
            </div>

            {/* Theme Toggle */}
            <Button variant="ghost" size="icon" onClick={() => setTheme(theme === "blue" ? "dark" : "blue")}>
              {theme === "blue" ? <Moon className="h-4 w-4" /> : <Sun className="h-4 w-4" />}
            </Button>
          </div>
        </div>
      </div>
    </nav>
  )
}
