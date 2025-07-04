"use client"

import { createContext, useContext, useState, type ReactNode } from "react"
import { type Chain, MAINNET_CHAINS, TESTNET_CHAINS } from "@/lib/chains"

interface NetworkContextType {
  isTestnet: boolean
  setIsTestnet: (testnet: boolean) => void
  selectedChain: Chain | null
  setSelectedChain: (chain: Chain) => void
  availableChains: Chain[]
}

const NetworkContext = createContext<NetworkContextType | undefined>(undefined)

export function NetworkProvider({ children }: { children: ReactNode }) {
  const [isTestnet, setIsTestnet] = useState(false)
  const [selectedChain, setSelectedChain] = useState<Chain | null>(MAINNET_CHAINS[0])

  const availableChains = isTestnet ? TESTNET_CHAINS : MAINNET_CHAINS

  return (
    <NetworkContext.Provider
      value={{
        isTestnet,
        setIsTestnet,
        selectedChain,
        setSelectedChain,
        availableChains,
      }}
    >
      {children}
    </NetworkContext.Provider>
  )
}

export function useNetwork() {
  const context = useContext(NetworkContext)
  if (context === undefined) {
    throw new Error("useNetwork must be used within a NetworkProvider")
  }
  return context
}
