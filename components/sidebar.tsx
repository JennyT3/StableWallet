"use client"

import { useState } from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet"
import { Switch } from "@/components/ui/switch"
import { Label } from "@/components/ui/label"
import { Menu, Moon, Sun, TestTube, Globe, Wallet, TrendingUp, Copy, RefreshCw, LogOut } from "lucide-react"
import { ChainSelector } from "./chain-selector"
import { useTheme } from "./theme-provider"
import { useNetwork } from "@/contexts/network-context"
import { useWallet } from "@/contexts/wallet-context"
import { cn } from "@/lib/utils"

const navItems = [
  { href: "/", label: "Swap", icon: "🔄" },
  { href: "/aggregate", label: "Aggregate", icon: "📊" },
  { href: "/yield", label: "Yield", icon: "🌱" },
  { href: "/pay", label: "Pay", icon: "💳" },
]

export function Sidebar() {
  const [isOpen, setIsOpen] = useState(false)
  const pathname = usePathname()
  const { theme, setTheme } = useTheme()
  const { isTestnet, setIsTestnet } = useNetwork()
  const { isConnected, address, totalBalance, currentStakingApy, connectWallet, disconnectWallet, refreshBalances } =
    useWallet()

  const copyAddress = () => {
    if (address) {
      navigator.clipboard.writeText(address)
    }
  }

  const SidebarContent = () => (
    <div className="flex flex-col h-full">
      {/* Logo */}
      <div className="p-6 border-b">
        <Link href="/" className="flex items-center space-x-2">
          <div className="h-8 w-8 rounded-lg bg-gradient-to-r from-blue-500 to-purple-600 flex items-center justify-center">
            <span className="text-white font-bold text-sm">SB</span>
          </div>
          <span className="font-bold text-xl">StableBridge</span>
        </Link>
      </div>

      {/* Wallet Section */}
      <div className="p-6 border-b">
        {isConnected ? (
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <Wallet className="h-4 w-4" />
                <span className="text-sm font-medium">Wallet</span>
              </div>
              <Button variant="ghost" size="sm" onClick={disconnectWallet}>
                <LogOut className="h-4 w-4" />
              </Button>
            </div>

            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-xs text-muted-foreground">Address</span>
                <Button variant="ghost" size="sm" onClick={copyAddress}>
                  <Copy className="h-3 w-3" />
                </Button>
              </div>
              <div className="text-sm font-mono bg-muted p-2 rounded">
                {address?.slice(0, 6)}...{address?.slice(-4)}
              </div>
            </div>

            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-xs text-muted-foreground">Total USDC Balance</span>
                <Button variant="ghost" size="sm" onClick={refreshBalances}>
                  <RefreshCw className="h-3 w-3" />
                </Button>
              </div>
              <div className="text-2xl font-bold">${totalBalance.toLocaleString()}</div>
            </div>

            <div className="space-y-2">
              <span className="text-xs text-muted-foreground">Current Staking APY</span>
              <div className="flex items-center space-x-2">
                <TrendingUp className="h-4 w-4 text-green-600" />
                <span className="text-lg font-semibold text-green-600">{currentStakingApy}%</span>
              </div>
            </div>
          </div>
        ) : (
          <Button onClick={connectWallet} className="w-full">
            <Wallet className="mr-2 h-4 w-4" />
            Connect Wallet
          </Button>
        )}
      </div>

      {/* Navigation */}
      <div className="flex-1 p-6">
        <div className="space-y-2">
          {navItems.map((item) => (
            <Link key={item.href} href={item.href}>
              <Button
                variant={pathname === item.href ? "default" : "ghost"}
                className={cn("w-full justify-start", pathname === item.href && "bg-primary text-primary-foreground")}
                onClick={() => setIsOpen(false)}
              >
                <span className="mr-2">{item.icon}</span>
                {item.label}
              </Button>
            </Link>
          ))}
        </div>
      </div>

      {/* Controls */}
      <div className="p-6 border-t space-y-4">
        {/* Chain Selector */}
        <div className="space-y-2">
          <Label className="text-xs text-muted-foreground">Network</Label>
          <ChainSelector />
        </div>

        {/* Testnet/Mainnet Toggle */}
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <Globe className="h-4 w-4" />
            <Label htmlFor="testnet-mode" className="text-sm">
              {isTestnet ? "Testnet" : "Mainnet"}
            </Label>
          </div>
          <div className="flex items-center space-x-2">
            <Switch id="testnet-mode" checked={isTestnet} onCheckedChange={setIsTestnet} />
            <TestTube className="h-4 w-4" />
          </div>
        </div>

        {/* Theme Toggle */}
        <div className="flex items-center justify-between">
          <Label className="text-sm">Theme</Label>
          <Button variant="ghost" size="sm" onClick={() => setTheme(theme === "blue" ? "dark" : "blue")}>
            {theme === "blue" ? <Moon className="h-4 w-4" /> : <Sun className="h-4 w-4" />}
          </Button>
        </div>
      </div>
    </div>
  )

  return (
    <>
      {/* Mobile Sidebar */}
      <Sheet open={isOpen} onOpenChange={setIsOpen}>
        <SheetTrigger asChild>
          <Button variant="ghost" size="icon" className="md:hidden">
            <Menu className="h-5 w-5" />
          </Button>
        </SheetTrigger>
        <SheetContent side="left" className="w-80 p-0">
          <SidebarContent />
        </SheetContent>
      </Sheet>

      {/* Desktop Sidebar */}
      <div className="hidden md:flex md:w-80 md:flex-col md:fixed md:inset-y-0 bg-background border-r">
        <SidebarContent />
      </div>
    </>
  )
}
