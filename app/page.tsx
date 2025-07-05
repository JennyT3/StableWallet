"use client";

import { BASE_SEPOLIA_USDC_ADDRESS, BASE_USDC_ADDRESS } from "@/lib/constants";
import { Button } from "@nextui-org/react";
import { useLogin, usePrivy } from "@privy-io/react-auth";
import { useSmartWallets } from "@privy-io/react-auth/smart-wallets";
import { Wallet, ArrowRight, Globe, Users, Zap, Shield } from "lucide-react";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useChainId, useBalance, useReadContract } from "wagmi";
import { erc20Abi, formatUnits } from "viem";

export default function LandingPage() {
  const { ready, authenticated, user } = usePrivy();
  const { login } = useLogin();
  const { client } = useSmartWallets();
  const router = useRouter();
  const chainId = useChainId();

  const [smartWalletAddress, setSmartWalletAddress] = useState<string | undefined>();

  // Check if user has completed onboarding
  useEffect(() => {
    if (ready && authenticated && user) {
      // Check if user has onboarding data (this would come from Supabase in real implementation)
      const hasCompletedOnboarding = localStorage.getItem(`stablewallet_user_${user.id}`);
      
      if (hasCompletedOnboarding) {
        // User exists, go to dashboard
        router.push('/dashboard');
      } else {
        // New user, go to onboarding
        router.push('/onboarding');
      }
    }
  }, [ready, authenticated, user, router]);

  useEffect(() => {
    if (client?.account.address) {
      setSmartWalletAddress(client.account.address);
    }
  }, [client]);

  const { data: smartUsdcBalance } = useReadContract({
    abi: erc20Abi,
    address: chainId === 84532 ? BASE_SEPOLIA_USDC_ADDRESS : BASE_USDC_ADDRESS, // 84532 is Base Sepolia
    functionName: "balanceOf",
    args: [smartWalletAddress as `0x${string}`],
  });

  const handleGetStarted = () => {
    if (ready && !authenticated) {
      login();
    }
  };

  // If user is authenticated, show loading while redirecting
  if (ready && authenticated) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 bg-blue-600 rounded-full flex items-center justify-center mx-auto mb-4 animate-pulse">
            <Wallet className="w-8 h-8 text-white" />
          </div>
          <p className="text-gray-600">Loading your wallet...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-indigo-50">
      {/* Hero Section */}
      <div className="relative overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-20 pb-16">
          <div className="text-center">
            {/* Logo */}
            <div className="flex items-center justify-center mb-8">
              <div className="w-16 h-16 bg-blue-600 rounded-2xl flex items-center justify-center mr-4">
                <Wallet className="w-8 h-8 text-white" />
              </div>
              <h1 className="text-4xl font-bold text-gray-900">StableWallet</h1>
            </div>

            {/* Tagline */}
            <h2 className="text-5xl md:text-6xl font-extrabold text-gray-900 mb-6">
              Stablecoins Made
              <span className="text-blue-600 block">Simple</span>
            </h2>
            
            <p className="text-xl text-gray-600 mb-8 max-w-3xl mx-auto">
              The first USDC & EURC wallet designed for everyone. 
              Social login, cross-chain transfers, and built-in yield — no crypto knowledge required.
            </p>

            {/* CTA Buttons */}
            <div className="flex flex-col sm:flex-row gap-4 justify-center mb-16">
              <Button
                size="lg"
                className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-4 text-lg font-medium"
                onClick={handleGetStarted}
                disabled={!ready}
                startContent={<Wallet className="w-5 h-5" />}
                endContent={<ArrowRight className="w-5 h-5" />}
              >
                {!ready ? "Loading..." : "Get Started Free"}
              </Button>
              
              <Button
                size="lg"
                variant="bordered"
                className="border-2 border-blue-600 text-blue-600 hover:bg-blue-50 px-8 py-4 text-lg font-medium"
              >
                Watch Demo
              </Button>
            </div>

            {/* Trust Indicators */}
            <div className="flex items-center justify-center space-x-8 text-sm text-gray-500">
              <div className="flex items-center">
                <Shield className="w-4 h-4 mr-2" />
                Powered by Privy
              </div>
              <div className="flex items-center">
                <Globe className="w-4 h-4 mr-2" />
                Circle CCTP v2
              </div>
              <div className="flex items-center">
                <Zap className="w-4 h-4 mr-2" />
                Flow Network
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Features Section */}
      <div className="bg-white py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h3 className="text-3xl font-bold text-gray-900 mb-4">
              Built for Both Beginners & Experts
            </h3>
            <p className="text-lg text-gray-600">
              One wallet, two experiences. Choose what works for you.
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-8">
            {/* Easy Mode */}
            <div className="bg-green-50 border-2 border-green-200 rounded-2xl p-8">
              <div className="flex items-center mb-4">
                <div className="w-12 h-12 bg-green-600 rounded-xl flex items-center justify-center mr-4">
                  <Users className="w-6 h-6 text-white" />
                </div>
                <h4 className="text-2xl font-bold text-green-900">Easy Mode</h4>
              </div>
              <p className="text-green-800 mb-6">
                Perfect for newcomers. Social login, automatic defaults, and simple interfaces.
              </p>
              <ul className="space-y-3 text-green-700">
                <li className="flex items-center">
                  <div className="w-2 h-2 bg-green-600 rounded-full mr-3"></div>
                  Regional defaults (EU → EURC, US → USDC)
                </li>
                <li className="flex items-center">
                  <div className="w-2 h-2 bg-green-600 rounded-full mr-3"></div>
                  One-click staking and transfers
                </li>
                <li className="flex items-center">
                  <div className="w-2 h-2 bg-green-600 rounded-full mr-3"></div>
                  QR code payments
                </li>
                <li className="flex items-center">
                  <div className="w-2 h-2 bg-green-600 rounded-full mr-3"></div>
                  No seed phrases needed
                </li>
              </ul>
            </div>

            {/* Expert Mode */}
            <div className="bg-blue-50 border-2 border-blue-200 rounded-2xl p-8">
              <div className="flex items-center mb-4">
                <div className="w-12 h-12 bg-blue-600 rounded-xl flex items-center justify-center mr-4">
                  <Zap className="w-6 h-6 text-white" />
                </div>
                <h4 className="text-2xl font-bold text-blue-900">Expert Mode</h4>
              </div>
              <p className="text-blue-800 mb-6">
                Advanced features for DeFi users. Multi-chain management and yield optimization.
              </p>
              <ul className="space-y-3 text-blue-700">
                <li className="flex items-center">
                  <div className="w-2 h-2 bg-blue-600 rounded-full mr-3"></div>
                  Multi-chain portfolio view
                </li>
                <li className="flex items-center">
                  <div className="w-2 h-2 bg-blue-600 rounded-full mr-3"></div>
                  Cross-chain aggregation
                </li>
                <li className="flex items-center">
                  <div className="w-2 h-2 bg-blue-600 rounded-full mr-3"></div>
                  Advanced DeFi integrations
                </li>
                <li className="flex items-center">
                  <div className="w-2 h-2 bg-blue-600 rounded-full mr-3"></div>
                  Wallet switching & management
                </li>
              </ul>
            </div>
          </div>
        </div>
      </div>

      {/* Supported Chains */}
      <div className="bg-gray-50 py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h3 className="text-3xl font-bold text-gray-900 mb-4">
              Supported Networks
            </h3>
            <p className="text-lg text-gray-600">
              Native USDC & EURC across multiple chains via Circle's CCTP v2
            </p>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-6">
            {[
              { name: "Ethereum", color: "bg-blue-500" },
              { name: "Base", color: "bg-indigo-500" },
              { name: "Polygon", color: "bg-purple-500" },
              { name: "Arbitrum", color: "bg-cyan-500" },
              { name: "Flow", color: "bg-green-500" },
              { name: "Avalanche", color: "bg-red-500" },
              { name: "Solana", color: "bg-yellow-500" },
              { name: "Stellar", color: "bg-gray-500" },
            ].map((chain) => (
              <div key={chain.name} className="text-center">
                <div className={`w-16 h-16 ${chain.color} rounded-2xl flex items-center justify-center mx-auto mb-3`}>
                  <div className="w-8 h-8 bg-white rounded-lg"></div>
                </div>
                <p className="text-sm font-medium text-gray-700">{chain.name}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Final CTA */}
      <div className="bg-blue-600 py-16">
        <div className="max-w-4xl mx-auto text-center px-4 sm:px-6 lg:px-8">
          <h3 className="text-4xl font-bold text-white mb-6">
            Ready to simplify your stablecoin experience?
          </h3>
          <p className="text-xl text-blue-100 mb-8">
            Join thousands of users managing USDC & EURC across chains with ease.
          </p>
          <Button
            size="lg"
            className="bg-white text-blue-600 hover:bg-gray-100 px-8 py-4 text-lg font-medium"
            onClick={handleGetStarted}
            disabled={!ready}
            startContent={<Wallet className="w-5 h-5" />}
            endContent={<ArrowRight className="w-5 h-5" />}
          >
            {!ready ? "Loading..." : "Start Your Wallet"}
          </Button>
        </div>
      </div>

      {/* Footer */}
      <div className="bg-gray-900 py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row items-center justify-between">
            <div className="flex items-center mb-4 md:mb-0">
              <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center mr-3">
                <Wallet className="w-4 h-4 text-white" />
              </div>
              <span className="text-white font-medium">StableWallet</span>
            </div>
            <div className="text-gray-400 text-sm">
              Built for ETHGlobal Cannes 2025 • Powered by Privy, Circle & Flow
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
