"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Sprout, TrendingUp, Shield, Zap } from "lucide-react"
import { useNetwork } from "@/contexts/network-context"

export default function YieldPage() {
  const [stakeAmount, setStakeAmount] = useState("")
  const { selectedChain, isTestnet } = useNetwork()

  const strategies = [
    {
      name: "Conservative USDC",
      apy: "6.2%",
      risk: "Low",
      protocol: "Compound",
      description: "Stable lending with minimal risk",
      icon: Shield,
    },
    {
      name: "Balanced Portfolio",
      apy: "12.8%",
      risk: "Medium",
      protocol: "Yearn",
      description: "Diversified yield farming strategy",
      icon: TrendingUp,
    },
    {
      name: "High Yield DeFi",
      apy: "24.5%",
      risk: "High",
      protocol: "Convex",
      description: "Maximum returns with higher risk",
      icon: Zap,
    },
  ]

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-6xl mx-auto">
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-2">Yield Farming</h1>
          <p className="text-muted-foreground">
            Maximize your USDC returns on {selectedChain?.name} {isTestnet ? "(Testnet)" : ""}
          </p>
        </div>

        <Tabs defaultValue="strategies" className="space-y-6">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="strategies">Strategies</TabsTrigger>
            <TabsTrigger value="portfolio">My Portfolio</TabsTrigger>
            <TabsTrigger value="analytics">Analytics</TabsTrigger>
          </TabsList>

          <TabsContent value="strategies" className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {strategies.map((strategy, index) => (
                <Card key={index} className="relative overflow-hidden">
                  <CardHeader>
                    <div className="flex items-center justify-between">
                      <strategy.icon className="h-8 w-8 text-primary" />
                      <Badge
                        variant={
                          strategy.risk === "Low" ? "default" : strategy.risk === "Medium" ? "secondary" : "destructive"
                        }
                      >
                        {strategy.risk} Risk
                      </Badge>
                    </div>
                    <CardTitle className="text-xl">{strategy.name}</CardTitle>
                    <CardDescription>{strategy.description}</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-muted-foreground">APY</span>
                      <span className="text-2xl font-bold text-green-600">{strategy.apy}</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-muted-foreground">Protocol</span>
                      <span className="text-sm font-medium">{strategy.protocol}</span>
                    </div>
                    <Button className="w-full">Stake USDC</Button>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          <TabsContent value="portfolio" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Sprout className="h-5 w-5" />
                    Portfolio Overview
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div className="text-center p-4 bg-muted rounded-lg">
                      <div className="text-2xl font-bold">$12,450</div>
                      <div className="text-sm text-muted-foreground">Total Staked</div>
                    </div>
                    <div className="text-center p-4 bg-muted rounded-lg">
                      <div className="text-2xl font-bold text-green-600">$1,234</div>
                      <div className="text-sm text-muted-foreground">Total Earned</div>
                    </div>
                  </div>
                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <span>Conservative USDC</span>
                      <span>$5,000</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Balanced Portfolio</span>
                      <span>$4,500</span>
                    </div>
                    <div className="flex justify-between">
                      <span>High Yield DeFi</span>
                      <span>$2,950</span>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Quick Stake</CardTitle>
                  <CardDescription>Add more USDC to your portfolio</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="stake-amount">Amount (USDC)</Label>
                    <Input
                      id="stake-amount"
                      placeholder="0.0"
                      value={stakeAmount}
                      onChange={(e) => setStakeAmount(e.target.value)}
                    />
                  </div>
                  <Button className="w-full" disabled={!stakeAmount}>
                    Stake Now
                  </Button>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="analytics" className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              <Card>
                <CardContent className="p-6">
                  <div className="text-2xl font-bold">9.8%</div>
                  <div className="text-sm text-muted-foreground">Avg APY</div>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="p-6">
                  <div className="text-2xl font-bold">$45.2K</div>
                  <div className="text-sm text-muted-foreground">TVL</div>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="p-6">
                  <div className="text-2xl font-bold">156</div>
                  <div className="text-sm text-muted-foreground">Active Users</div>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="p-6">
                  <div className="text-2xl font-bold text-green-600">+12.4%</div>
                  <div className="text-sm text-muted-foreground">24h Change</div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}
