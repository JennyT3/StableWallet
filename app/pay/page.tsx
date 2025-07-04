"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Send, QrCode, Clock, CheckCircle } from "lucide-react"
import { useNetwork } from "@/contexts/network-context"

export default function PayPage() {
  const [recipient, setRecipient] = useState("")
  const [amount, setAmount] = useState("")
  const [memo, setMemo] = useState("")
  const { selectedChain, isTestnet } = useNetwork()

  const recentTransactions = [
    {
      id: "1",
      recipient: "0x742d...4B73",
      amount: "100.00",
      status: "completed",
      timestamp: "2 hours ago",
    },
    {
      id: "2",
      recipient: "0x8ba1...9A2C",
      amount: "250.50",
      status: "pending",
      timestamp: "5 hours ago",
    },
    {
      id: "3",
      recipient: "0x1f9f...7E8D",
      amount: "75.25",
      status: "completed",
      timestamp: "1 day ago",
    },
  ]

  const handleSend = () => {
    console.log("Sending", amount, "USDC to", recipient, "on", selectedChain?.name)
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-4xl mx-auto">
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-2">Pay with USDC</h1>
          <p className="text-muted-foreground">
            Send USDC payments on {selectedChain?.name} {isTestnet ? "(Testnet)" : ""}
          </p>
        </div>

        <Tabs defaultValue="send" className="space-y-6">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="send">Send Payment</TabsTrigger>
            <TabsTrigger value="request">Request Payment</TabsTrigger>
            <TabsTrigger value="history">Transaction History</TabsTrigger>
          </TabsList>

          <TabsContent value="send" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Send className="h-5 w-5" />
                    Send USDC
                  </CardTitle>
                  <CardDescription>Send USDC to any wallet address</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="recipient">Recipient Address</Label>
                    <Input
                      id="recipient"
                      placeholder="0x... or ENS name"
                      value={recipient}
                      onChange={(e) => setRecipient(e.target.value)}
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="amount">Amount (USDC)</Label>
                    <Input id="amount" placeholder="0.0" value={amount} onChange={(e) => setAmount(e.target.value)} />
                    <div className="text-sm text-muted-foreground">Balance: 1,234.56 USDC</div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="memo">Memo (Optional)</Label>
                    <Textarea
                      id="memo"
                      placeholder="Add a note..."
                      value={memo}
                      onChange={(e) => setMemo(e.target.value)}
                      rows={3}
                    />
                  </div>

                  <div className="space-y-2 p-3 bg-muted rounded-lg">
                    <div className="flex justify-between text-sm">
                      <span>Network Fee</span>
                      <span>~$1.50</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span>Total</span>
                      <span className="font-medium">
                        {amount ? `$${(Number.parseFloat(amount) + 1.5).toFixed(2)}` : "$0.00"}
                      </span>
                    </div>
                  </div>

                  <Button onClick={handleSend} className="w-full" size="lg" disabled={!recipient || !amount}>
                    Send Payment
                  </Button>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <QrCode className="h-5 w-5" />
                    Quick Actions
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <Button variant="outline" className="w-full justify-start bg-transparent">
                    <QrCode className="mr-2 h-4 w-4" />
                    Scan QR Code
                  </Button>
                  <Button variant="outline" className="w-full justify-start bg-transparent">
                    <Send className="mr-2 h-4 w-4" />
                    Send to Contact
                  </Button>
                  <Button variant="outline" className="w-full justify-start bg-transparent">
                    <Clock className="mr-2 h-4 w-4" />
                    Schedule Payment
                  </Button>

                  <div className="pt-4 border-t">
                    <h4 className="font-medium mb-2">Recent Recipients</h4>
                    <div className="space-y-2">
                      <div className="flex items-center justify-between p-2 hover:bg-muted rounded cursor-pointer">
                        <span className="text-sm">0x742d...4B73</span>
                        <span className="text-xs text-muted-foreground">2h ago</span>
                      </div>
                      <div className="flex items-center justify-between p-2 hover:bg-muted rounded cursor-pointer">
                        <span className="text-sm">0x8ba1...9A2C</span>
                        <span className="text-xs text-muted-foreground">5h ago</span>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="request" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Request Payment</CardTitle>
                <CardDescription>Generate a payment request link or QR code</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="request-amount">Amount (USDC)</Label>
                    <Input id="request-amount" placeholder="0.0" />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="request-memo">Description</Label>
                    <Input id="request-memo" placeholder="Payment for..." />
                  </div>
                </div>
                <Button className="w-full">Generate Payment Request</Button>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="history" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Transaction History</CardTitle>
                <CardDescription>Your recent USDC transactions</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {recentTransactions.map((tx) => (
                    <div key={tx.id} className="flex items-center justify-between p-4 border rounded-lg">
                      <div className="flex items-center space-x-4">
                        <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full flex items-center justify-center">
                          <Send className="h-5 w-5 text-white" />
                        </div>
                        <div>
                          <div className="font-medium">Send to {tx.recipient}</div>
                          <div className="text-sm text-muted-foreground">{tx.timestamp}</div>
                        </div>
                      </div>
                      <div className="flex items-center space-x-3">
                        <div className="text-right">
                          <div className="font-medium">-${tx.amount}</div>
                          <div className="text-sm text-muted-foreground">USDC</div>
                        </div>
                        <Badge variant={tx.status === "completed" ? "default" : "secondary"}>
                          {tx.status === "completed" ? (
                            <CheckCircle className="w-3 h-3 mr-1" />
                          ) : (
                            <Clock className="w-3 h-3 mr-1" />
                          )}
                          {tx.status}
                        </Badge>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}
