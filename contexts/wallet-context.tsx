"use client"

import { createContext, useContext, useState, type ReactNode } from "react"

interface ChainBalance {
  chainId: string
  chainName: string
  balance: number
  usdValue: number
}

interface WalletContextType {
  isConnected: boolean
  address: string | null
  totalBalance: number
  chainBalances: ChainBalance[]
  currentStakingApy: number
  connectWallet: () => void
  disconnectWallet: () => void
  refreshBalances: () => void
  moveUSDC: (fromChain: string, toChain: string, amount: number) => Promise<void>
}

const WalletContext = createContext<WalletContextType | undefined>(undefined)

export function WalletProvider({ children }: { children: ReactNode }) {
  const [isConnected, setIsConnected] = useState(false)
  const [address, setAddress] = useState<string | null>(null)
  const [chainBalances, setChainBalances] = useState<ChainBalance[]>([])
  const [currentStakingApy, setCurrentStakingApy] = useState(8.4)

  // Mock data for demonstration
  const mockChainBalances: ChainBalance[] = [
    { chainId: "ethereum", chainName: "Ethereum", balance: 1234.56, usdValue: 1234.56 },
    { chainId: "arbitrum", chainName: "Arbitrum One", balance: 567.89, usdValue: 567.89 },
    { chainId: "polygon", chainName: "Polygon PoS", balance: 890.12, usdValue: 890.12 },
    { chainId: "base", chainName: "Base", balance: 345.67, usdValue: 345.67 },
    { chainId: "optimism", chainName: "OP Mainnet", balance: 123.45, usdValue: 123.45 },
    { chainId: "avalanche", chainName: "Avalanche C-Chain", balance: 678.9, usdValue: 678.9 },
  ]

  const totalBalance = chainBalances.reduce((sum, chain) => sum + chain.usdValue, 0)

  const connectWallet = async () => {
    // Mock wallet connection
    setIsConnected(true)
    setAddress("0x742d35Cc6634C0532925a3b8D4B9B4B73")
    setChainBalances(mockChainBalances)
  }

  const disconnectWallet = () => {
    setIsConnected(false)
    setAddress(null)
    setChainBalances([])
  }

  const refreshBalances = async () => {
    // Mock refresh - in real app, this would fetch from blockchain
    if (isConnected) {
      setChainBalances(mockChainBalances)
    }
  }

  const moveUSDC = async (fromChain: string, toChain: string, amount: number) => {
    // Mock USDC movement between chains
    console.log(`Moving ${amount} USDC from ${fromChain} to ${toChain}`)

    setChainBalances((prev) =>
      prev.map((chain) => {
        if (chain.chainId === fromChain) {
          return { ...chain, balance: chain.balance - amount, usdValue: chain.usdValue - amount }
        }
        if (chain.chainId === toChain) {
          return { ...chain, balance: chain.balance + amount, usdValue: chain.usdValue + amount }
        }
        return chain
      }),
    )
  }

  return (
    <WalletContext.Provider
      value={{
        isConnected,
        address,
        totalBalance,
        chainBalances,
        currentStakingApy,
        connectWallet,
        disconnectWallet,
        refreshBalances,
        moveUSDC,
      }}
    >
      {children}
    </WalletContext.Provider>
  )
}

export function useWallet() {
  const context = useContext(WalletContext)
  if (context === undefined) {
    throw new Error("useWallet must be used within a WalletProvider")
  }
  return context
}
