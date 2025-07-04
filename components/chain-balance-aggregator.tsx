"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { Badge } from "@/components/ui/badge"
import { Checkbox } from "@/components/ui/checkbox"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { RefreshCw, Send } from "lucide-react"
import { useWallet } from "@/contexts/wallet-context"
import { useNetwork } from "@/contexts/network-context"

export function ChainBalanceAggregator() {
  const [selectedChains, setSelectedChains] = useState<string[]>([])
  const [targetChain, setTargetChain] = useState<string>("")
  const [isMoving, setIsMoving] = useState(false)
  const { chainBalances, refreshBalances, moveUSDC } = useWallet()
  const { availableChains } = useNetwork()

  const selectedBalance = chainBalances
    .filter((chain) => selectedChains.includes(chain.chainId))
    .reduce((sum, chain) => sum + chain.balance, 0)

  const handleChainSelect = (chainId: string, checked: boolean) => {
    if (checked) {
      setSelectedChains((prev) => [...prev, chainId])
    } else {
      setSelectedChains((prev) => prev.filter((id) => id !== chainId))
    }
  }

  const handleMoveUSDC = async () => {
    if (!targetChain || selectedChains.length === 0) return

    setIsMoving(true)
    try {
      for (const chainId of selectedChains) {
        const chainBalance = chainBalances.find((c) => c.chainId === chainId)
        if (chainBalance && chainBalance.balance > 0) {
          await moveUSDC(chainId, targetChain, chainBalance.balance)
        }
      }
      setSelectedChains([])
      setTargetChain("")
    } catch (error) {
      console.error("Failed to move USDC:", error)
    } finally {
      setIsMoving(false)
    }
  }

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="flex items-center gap-2">Chain Balance Aggregator</CardTitle>
            <CardDescription>View and manage your USDC across all supported chains</CardDescription>
          </div>
          <Button variant="outline" size="sm" onClick={refreshBalances}>
            <RefreshCw className="h-4 w-4" />
          </Button>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Chain Balances List */}
        <div className="space-y-3">
          {chainBalances.map((chain) => (
            <div key={chain.chainId} className="flex items-center justify-between p-3 border rounded-lg">
              <div className="flex items-center space-x-3">
                <Checkbox
                  id={chain.chainId}
                  checked={selectedChains.includes(chain.chainId)}
                  onCheckedChange={(checked) => handleChainSelect(chain.chainId, checked as boolean)}
                />
                <div>
                  <div className="font-medium">{chain.chainName}</div>
                  <div className="text-sm text-muted-foreground">{chain.balance.toFixed(2)} USDC</div>
                </div>
              </div>
              <div className="text-right">
                <div className="font-medium">${chain.usdValue.toLocaleString()}</div>
                <Badge variant="outline" className="text-xs">
                  {chain.balance > 0 ? "Active" : "Empty"}
                </Badge>
              </div>
            </div>
          ))}
        </div>

        {/* Selected Summary */}
        {selectedChains.length > 0 && (
          <div className="p-4 bg-muted rounded-lg">
            <div className="flex items-center justify-between mb-3">
              <span className="text-sm font-medium">Selected Chains: {selectedChains.length}</span>
              <span className="text-lg font-bold">${selectedBalance.toLocaleString()}</span>
            </div>

            <div className="space-y-3">
              <div className="space-y-2">
                <Label htmlFor="target-chain">Move to Chain</Label>
                <Select value={targetChain} onValueChange={setTargetChain}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select destination chain" />
                  </SelectTrigger>
                  <SelectContent>
                    {availableChains
                      .filter((chain) => !selectedChains.includes(chain.id))
                      .map((chain) => (
                        <SelectItem key={chain.id} value={chain.id}>
                          {chain.name}
                        </SelectItem>
                      ))}
                  </SelectContent>
                </Select>
              </div>

              <Dialog>
                <DialogTrigger asChild>
                  <Button className="w-full" disabled={!targetChain || selectedChains.length === 0}>
                    <Send className="mr-2 h-4 w-4" />
                    Move USDC ({selectedBalance.toFixed(2)})
                  </Button>
                </DialogTrigger>
                <DialogContent>
                  <DialogHeader>
                    <DialogTitle>Confirm USDC Transfer</DialogTitle>
                    <DialogDescription>
                      You are about to move {selectedBalance.toFixed(2)} USDC from {selectedChains.length} chain(s) to{" "}
                      {availableChains.find((c) => c.id === targetChain)?.name}.
                    </DialogDescription>
                  </DialogHeader>
                  <div className="space-y-4">
                    <div className="p-4 bg-muted rounded-lg">
                      <div className="text-sm space-y-2">
                        <div className="flex justify-between">
                          <span>Amount:</span>
                          <span className="font-medium">{selectedBalance.toFixed(2)} USDC</span>
                        </div>
                        <div className="flex justify-between">
                          <span>Estimated Fee:</span>
                          <span className="font-medium">~$5.00</span>
                        </div>
                        <div className="flex justify-between">
                          <span>Time:</span>
                          <span className="font-medium">~2-5 minutes</span>
                        </div>
                      </div>
                    </div>
                    <Button onClick={handleMoveUSDC} className="w-full" disabled={isMoving}>
                      {isMoving ? "Moving..." : "Confirm Transfer"}
                    </Button>
                  </div>
                </DialogContent>
              </Dialog>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  )
}
