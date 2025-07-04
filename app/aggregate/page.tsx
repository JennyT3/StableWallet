"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { TrendingUp, DollarSign } from "lucide-react"
import { useNetwork } from "@/contexts/network-context"
import { ChainBalanceAggregator } from "@/components/chain-balance-aggregator"

export default function AggregatePage() {
  const [amount, setAmount] = useState("")
  const { selectedChain, isTestnet } = useNetwork()

  const pools = [
    { name: "Uniswap V3", apy: "12.5%", tvl: "$2.1M", risk: "Low" },
    { name: "Curve Finance", apy: "8.3%", tvl: "$5.2M", risk: "Low" },
    { name: "Balancer", apy: "15.2%", tvl: "$1.8M", risk: "Medium" },
    { name: "SushiSwap", apy: "9.7%", tvl: "$3.4M", risk: "Low" },
  ]

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-6xl mx-auto">
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-2">Liquidity Aggregation</h1>
          <p className="text-muted-foreground">
            Aggregate liquidity and manage balances across multiple chains {isTestnet ? "(Testnet)" : ""}
          </p>
        </div>

        <Tabs defaultValue="balances" className="space-y-6">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="balances">Chain Balances</TabsTrigger>
            <TabsTrigger value="liquidity">Add Liquidity</TabsTrigger>
          </TabsList>

          <TabsContent value="balances" className="space-y-6">
            <ChainBalanceAggregator />
          </TabsContent>

          <TabsContent value="liquidity" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              {/* Input Panel */}
              <div className="lg:col-span-1">
                <Card>
                  <CardHeader>
                    <CardTitle>Add Liquidity</CardTitle>
                    <CardDescription>Provide USDC to earn fees across multiple pools</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="liquidity-amount">Amount (USDC)</Label>
                      <Input
                        id="liquidity-amount"
                        placeholder="0.0"
                        value={amount}
                        onChange={(e) => setAmount(e.target.value)}
                      />
                      <div className="text-sm text-muted-foreground">Balance: 1,234.56 USDC</div>
                    </div>

                    <div className="space-y-2 p-3 bg-muted rounded-lg">
                      <div className="flex justify-between text-sm">
                        <span>Estimated APY</span>
                        <span className="text-green-600 font-medium">11.4%</span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span>Daily Earnings</span>
                        <span>~$0.31</span>
                      </div>
                    </div>

                    <Button className="w-full" size="lg" disabled={!amount}>
                      Add Liquidity
                    </Button>
                  </CardContent>
                </Card>
              </div>

              {/* Pools List */}
              <div className="lg:col-span-2">
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <TrendingUp className="h-5 w-5" />
                      Available Pools
                    </CardTitle>
                    <CardDescription>Your liquidity will be distributed across these pools</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      {pools.map((pool, index) => (
                        <div key={index} className="flex items-center justify-between p-4 border rounded-lg">
                          <div className="flex items-center space-x-4">
                            <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full flex items-center justify-center">
                              <DollarSign className="h-5 w-5 text-white" />
                            </div>
                            <div>
                              <div className="font-medium">{pool.name}</div>
                              <div className="text-sm text-muted-foreground">TVL: {pool.tvl}</div>
                            </div>
                          </div>
                          <div className="flex items-center space-x-3">
                            <Badge variant={pool.risk === "Low" ? "default" : "secondary"}>{pool.risk} Risk</Badge>
                            <div className="text-right">
                              <div className="font-medium text-green-600">{pool.apy}</div>
                              <div className="text-sm text-muted-foreground">APY</div>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </div>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}
