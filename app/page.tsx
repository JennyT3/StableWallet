"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { ArrowRight, Settings, TrendingUp } from "lucide-react"
import { useNetwork } from "@/contexts/network-context"
import { useWallet } from "@/contexts/wallet-context"

const tokens = [
  { symbol: "USDC", name: "USD Coin", balance: 1234.56 },
  { symbol: "ETH", name: "Ethereum", balance: 0.5 },
  { symbol: "WBTC", name: "Wrapped Bitcoin", balance: 0.025 },
  { symbol: "USDT", name: "Tether", balance: 500.0 },
  { symbol: "DAI", name: "Dai Stablecoin", balance: 750.25 },
]

export default function SwapPage() {
  const [fromToken, setFromToken] = useState("USDC")
  const [toToken, setToToken] = useState("ETH")
  const [fromAmount, setFromAmount] = useState("")
  const [toAmount, setToAmount] = useState("")
  const { selectedChain, isTestnet } = useNetwork()
  const { isConnected } = useWallet()

  const handleSwap = () => {
    console.log("Swapping", fromAmount, fromToken, "to", toToken, "on", selectedChain?.name)
  }

  const swapTokens = () => {
    setFromToken(toToken)
    setToToken(fromToken)
    setFromAmount(toAmount)
    setToAmount(fromAmount)
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-6xl mx-auto">
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-2">Swap Tokens</h1>
          <p className="text-muted-foreground">
            Exchange tokens on {selectedChain?.name} {isTestnet ? "(Testnet)" : ""}
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          {/* From Token - Left Side */}
          <div className="lg:col-span-5">
            <Card className="h-full">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle>From</CardTitle>
                  <Button variant="ghost" size="icon">
                    <Settings className="h-4 w-4" />
                  </Button>
                </div>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="from-token">Token</Label>
                    <Select value={fromToken} onValueChange={setFromToken}>
                      <SelectTrigger className="h-12">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        {tokens.map((token) => (
                          <SelectItem key={token.symbol} value={token.symbol}>
                            <div className="flex items-center space-x-2">
                              <div className="w-6 h-6 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full" />
                              <span>{token.symbol}</span>
                              <span className="text-muted-foreground">- {token.name}</span>
                            </div>
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="from-amount">Amount</Label>
                    <Input
                      id="from-amount"
                      placeholder="0.0"
                      value={fromAmount}
                      onChange={(e) => setFromAmount(e.target.value)}
                      className="h-12 text-lg"
                    />
                  </div>

                  <div className="flex justify-between text-sm text-muted-foreground">
                    <span>
                      Balance: {tokens.find((t) => t.symbol === fromToken)?.balance} {fromToken}
                    </span>
                    <Button variant="link" className="p-0 h-auto text-sm">
                      Max
                    </Button>
                  </div>
                </div>

                {/* Token Info */}
                <div className="space-y-3 p-4 bg-muted rounded-lg">
                  <div className="flex justify-between text-sm">
                    <span>Price</span>
                    <span>$1.00</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span>24h Change</span>
                    <span className="text-green-600 flex items-center">
                      <TrendingUp className="h-3 w-3 mr-1" />
                      +0.02%
                    </span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Swap Arrow - Center */}
          <div className="lg:col-span-2 flex items-center justify-center">
            <div className="flex flex-col items-center space-y-4">
              <Button
                variant="outline"
                size="icon"
                className="rounded-full h-12 w-12 bg-background border-2"
                onClick={swapTokens}
              >
                <ArrowRight className="h-5 w-5" />
              </Button>
              <div className="text-center">
                <div className="text-sm text-muted-foreground">Rate</div>
                <div className="text-sm font-medium">1 USDC = 0.0003 ETH</div>
              </div>
            </div>
          </div>

          {/* To Token - Right Side */}
          <div className="lg:col-span-5">
            <Card className="h-full">
              <CardHeader>
                <CardTitle>To</CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="to-token">Token</Label>
                    <Select value={toToken} onValueChange={setToToken}>
                      <SelectTrigger className="h-12">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        {tokens.map((token) => (
                          <SelectItem key={token.symbol} value={token.symbol}>
                            <div className="flex items-center space-x-2">
                              <div className="w-6 h-6 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full" />
                              <span>{token.symbol}</span>
                              <span className="text-muted-foreground">- {token.name}</span>
                            </div>
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="to-amount">Amount</Label>
                    <Input
                      id="to-amount"
                      placeholder="0.0"
                      value={toAmount}
                      onChange={(e) => setToAmount(e.target.value)}
                      className="h-12 text-lg"
                    />
                  </div>

                  <div className="flex justify-between text-sm text-muted-foreground">
                    <span>
                      Balance: {tokens.find((t) => t.symbol === toToken)?.balance} {toToken}
                    </span>
                  </div>
                </div>

                {/* Token Info */}
                <div className="space-y-3 p-4 bg-muted rounded-lg">
                  <div className="flex justify-between text-sm">
                    <span>Price</span>
                    <span>$3,245.67</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span>24h Change</span>
                    <span className="text-green-600 flex items-center">
                      <TrendingUp className="h-3 w-3 mr-1" />
                      +2.45%
                    </span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Swap Details and Button */}
        <div className="mt-8 max-w-2xl mx-auto">
          <Card>
            <CardContent className="p-6">
              <div className="space-y-4">
                {/* Swap Summary */}
                <div className="space-y-3 p-4 bg-muted rounded-lg">
                  <div className="flex justify-between text-sm">
                    <span>Exchange Rate</span>
                    <span>
                      1 {fromToken} = 0.0003 {toToken}
                    </span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span>Network Fee</span>
                    <span>~$2.50</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span>Price Impact</span>
                    <span className="text-green-600">{"<0.01%"}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span>Minimum Received</span>
                    <span>
                      {toAmount ? (Number.parseFloat(toAmount) * 0.995).toFixed(6) : "0.0"} {toToken}
                    </span>
                  </div>
                </div>

                {/* Swap Button */}
                <Button
                  onClick={handleSwap}
                  className="w-full"
                  size="lg"
                  disabled={!fromAmount || !isConnected || !selectedChain}
                >
                  {!isConnected
                    ? "Connect Wallet"
                    : !selectedChain
                      ? "Select Chain"
                      : `Swap ${fromToken} for ${toToken}`}
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
