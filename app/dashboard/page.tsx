"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { usePrivy } from "@privy-io/react-auth";
import { useSmartWallets } from "@privy-io/react-auth/smart-wallets";
import { Button } from "@nextui-org/react";
import { 
  Wallet, 
  Send, 
  ArrowUpDown, 
  QrCode, 
  History, 
  Settings, 
  Copy, 
  BarChart3, 
  RefreshCw, 
  Globe, 
  Zap, 
  TrendingUp, 
  ArrowDownUp,
  Users,
  CheckCircle,
  Loader2,
  LogOut
} from "lucide-react";
import { useChainId, useSwitchChain, useBalance, useReadContract } from "wagmi";
import { erc20Abi, formatUnits, parseUnits, encodeFunctionData } from "viem";
import { base, baseSepolia } from "viem/chains";
import { BASE_SEPOLIA_USDC_ADDRESS, BASE_USDC_ADDRESS } from "@/lib/constants";

interface UserPreferences {
  expertise: 'easy' | 'expert';
  region: 'EU' | 'US' | 'GLOBAL';
  addressHash: string;
  defaultToken: 'USDC' | 'EURC';
  defaultChain: string;
}

// Mock transaction data
const mockTransactions = [
  { id: 1, type: 'received', amount: 500, token: 'USDC', from: 'Ethereum', to: 'Flow', time: '2 min ago', status: 'completed' },
  { id: 2, type: 'sent', amount: 150, token: 'EURC', from: 'Flow', to: 'Base', time: '1 hour ago', status: 'completed' },
  { id: 3, type: 'staked', amount: 75, token: 'USDC', chain: 'Ethereum', apy: '4.2%', time: '3 hours ago', status: 'completed' }
];

const chains = [
  { id: 'ethereum', name: 'Ethereum', color: 'chain-ethereum' },
  { id: 'flow', name: 'Flow', color: 'chain-flow' },
  { id: 'polygon', name: 'Polygon', color: 'chain-polygon' },
  { id: 'base', name: 'Base', color: 'chain-base' }
];

export default function DashboardPage() {
  const { user, authenticated, ready, logout } = usePrivy();
  const { client } = useSmartWallets();
  const router = useRouter();
  const { switchChain } = useSwitchChain();
  const chainId = useChainId();

  // State management
  const [userPreferences, setUserPreferences] = useState<UserPreferences | null>(null);
  const [currentView, setCurrentView] = useState('dashboard');
  const [isLoading, setIsLoading] = useState(true);
  const [smartWalletAddress, setSmartWalletAddress] = useState<string | undefined>();
  
  // Transaction state (reusing your existing logic)
  const [usdcAmount, setUsdcAmount] = useState("");
  const [recipientAddress, setRecipientAddress] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const [isTransactionLoading, setIsTransactionLoading] = useState(false);
  const [copiedWallet, setCopiedWallet] = useState<string | null>(null);

  // Load user preferences on mount
  useEffect(() => {
    if (ready && authenticated && user) {
      const savedPreferences = localStorage.getItem(`stablewallet_user_${user.id}`);
      
      if (savedPreferences) {
        const preferences = JSON.parse(savedPreferences) as UserPreferences;
        setUserPreferences(preferences);
        setIsLoading(false);
      } else {
        // No preferences found, redirect to onboarding
        router.push('/onboarding');
      }
    } else if (ready && !authenticated) {
      // Not authenticated, redirect to landing
      router.push('/');
    }
  }, [ready, authenticated, user, router]);

  // Set smart wallet address
  useEffect(() => {
    if (client?.account.address) {
      setSmartWalletAddress(client.account.address);
    }
  }, [client]);

  // Get balances (reusing your logic)
  const { data: embeddedEthBalance } = useBalance({
    address: user?.wallet?.address as `0x${string}`,
  });

  const { data: smartEthBalance } = useBalance({
    address: smartWalletAddress as `0x${string}`,
  });

  const { data: embeddedUsdcBalance } = useReadContract({
    abi: erc20Abi,
    address: chainId === baseSepolia.id ? BASE_SEPOLIA_USDC_ADDRESS : BASE_USDC_ADDRESS,
    functionName: "balanceOf",
    args: [user?.wallet?.address as `0x${string}`],
  });

  const { data: smartUsdcBalance } = useReadContract({
    abi: erc20Abi,
    address: chainId === baseSepolia.id ? BASE_SEPOLIA_USDC_ADDRESS : BASE_USDC_ADDRESS,
    functionName: "balanceOf",
    args: [smartWalletAddress as `0x${string}`],
  });

  // Transaction logic (reusing your existing code)
  const execTransaction = async () => {
    setIsTransactionLoading(true);
    if (!client) {
      console.error("No smart account client found");
      setIsTransactionLoading(false);
      return;
    }

    setErrorMessage("");
    const amount = parseUnits(usdcAmount, 6);

    if (smartUsdcBalance && amount > smartUsdcBalance) {
      setErrorMessage("Insufficient USDC balance");
      setIsTransactionLoading(false);
      return;
    }

    try {
      const tx = await client.sendTransaction({
        to: chainId === baseSepolia.id ? BASE_SEPOLIA_USDC_ADDRESS : BASE_USDC_ADDRESS,
        value: BigInt(0),
        data: encodeFunctionData({
          abi: erc20Abi,
          functionName: "transfer",
          args: [recipientAddress as `0x${string}`, amount],
        }),
        account: client.account,
      });
      console.log("Transaction sent:", tx);
      setUsdcAmount("");
      setRecipientAddress("");
    } catch (error) {
      console.error("Transaction failed:", error);
      setErrorMessage("Transaction failed. Please try again.");
    }
    setIsTransactionLoading(false);
  };

  const copyToClipboard = async (text: string, walletType: string) => {
    await navigator.clipboard.writeText(text);
    setCopiedWallet(walletType);
    setTimeout(() => setCopiedWallet(null), 2000);
  };

  const toggleChain = async () => {
    if (!client) return;
    switchChain({
      chainId: chainId === baseSepolia.id ? base.id : baseSepolia.id,
    });
  };

  const handleLogout = () => {
    // Clear user preferences
    if (user) {
      localStorage.removeItem(`stablewallet_user_${user.id}`);
    }
    logout();
  };

  const handleModeSwitch = () => {
    if (!userPreferences) return;
    
    // Toggle between easy and expert mode
    const newPreferences = {
      ...userPreferences,
      expertise: userPreferences.expertise === 'easy' ? 'expert' as const : 'easy' as const
    };
    
    setUserPreferences(newPreferences);
    localStorage.setItem(`stablewallet_user_${user!.id}`, JSON.stringify(newPreferences));
  };

  // Loading state
  if (isLoading || !userPreferences) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="w-8 h-8 animate-spin text-blue-600 mx-auto mb-4" />
          <p className="text-gray-600">Loading your wallet...</p>
        </div>
      </div>
    );
  }

  // Header Component
  const Header = () => (
    <div className="bg-white shadow-sm border-b">
      <div className="px-4 py-3 flex items-center justify-between">
        <div className="flex items-center space-x-3">
          <div className="w-8 h-8 bg-blue-600 rounded-full flex items-center justify-center">
            <Wallet className="w-4 h-4 text-white" />
          </div>
          <span className="font-semibold text-gray-900">StableWallet</span>
          <div className={`px-2 py-1 rounded-full text-xs font-medium ${
            userPreferences.expertise === 'easy' 
              ? 'bg-green-100 text-green-800' 
              : 'bg-purple-100 text-purple-800'
          }`}>
            {userPreferences.expertise === 'easy' ? 'Easy' : 'Expert'} Mode
          </div>
        </div>
        
        <div className="flex items-center space-x-2">
          <div className={`px-2 py-1 rounded-full text-xs font-medium ${
            userPreferences.defaultToken === 'EURC' 
              ? 'bg-yellow-100 text-yellow-800' 
              : 'bg-blue-100 text-blue-800'
          }`}>
            {userPreferences.defaultToken}
          </div>
          
          <div className="px-2 py-1 rounded-full text-xs font-medium bg-gray-100 text-gray-800">
            {chainId === base.id ? 'Base' : 'Base Sepolia'}
          </div>
          
          <Button
            size="sm"
            variant="ghost"
            onClick={() => setCurrentView('settings')}
          >
            <Settings className="w-4 h-4" />
          </Button>
        </div>
      </div>
    </div>
  );

  // Easy Mode Dashboard
  const EasyModeDashboard = () => {
    const balance = smartUsdcBalance ? parseFloat(formatUnits(smartUsdcBalance, 6)) : 0;
    
    return (
      <div className="p-4 space-y-6 pb-20">
        {/* Balance Card */}
        <div className="balance-card-easy">
          <div className="text-center">
            <div className="flex items-center justify-center space-x-2 mb-2">
              <p className="text-green-100 text-sm">{userPreferences.defaultToken} Balance</p>
              <div className="px-2 py-1 bg-green-500 rounded text-white text-xs">
                {chainId === base.id ? 'Base' : 'Base Sepolia'}
              </div>
            </div>
            <p className="text-3xl font-bold">{balance.toFixed(2)} {userPreferences.defaultToken}</p>
            <p className="text-green-100 text-sm mt-1">
              ≈ {balance.toFixed(2)} {userPreferences.region === 'EU' ? 'EUR' : 'USD'}
            </p>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="grid grid-cols-2 gap-4">
          <Button 
            onClick={() => setCurrentView('send')}
            className="h-16 bg-white border-2 border-blue-600 text-blue-600 hover:bg-blue-50"
          >
            <Send className="w-5 h-5 mr-2" />
            Send {userPreferences.defaultToken}
          </Button>
          <Button 
            onClick={() => setCurrentView('receive')}
            className="h-16 bg-white border-2 border-green-600 text-green-600 hover:bg-green-50"
          >
            <QrCode className="w-5 h-5 mr-2" />
            Receive
          </Button>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <Button 
            onClick={() => setCurrentView('stake')}
            className="h-16 bg-white border-2 border-purple-600 text-purple-600 hover:bg-purple-50"
          >
            <TrendingUp className="w-5 h-5 mr-2" />
            Stake & Earn
          </Button>
          <Button 
            onClick={toggleChain}
            className="h-16 bg-white border-2 border-orange-600 text-orange-600 hover:bg-orange-50"
          >
            <RefreshCw className="w-5 h-5 mr-2" />
            Switch Chain
          </Button>
        </div>

        {/* Recent Activity */}
        <div className="card">
          <h3 className="text-lg font-semibold mb-4">Recent Activity</h3>
          <div className="space-y-3">
            {mockTransactions.slice(0, 3).map((tx) => (
              <div key={tx.id} className="transaction-item">
                <div className="flex items-center space-x-3">
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
                    tx.type === 'sent' ? 'bg-red-100' : 
                    tx.type === 'received' ? 'bg-green-100' : 'bg-purple-100'
                  }`}>
                    <ArrowUpDown className={`w-4 h-4 ${
                      tx.type === 'sent' ? 'text-red-600' : 
                      tx.type === 'received' ? 'text-green-600' : 'text-purple-600'
                    }`} />
                  </div>
                  <div>
                    <p className="font-medium text-sm capitalize">{tx.type} {tx.token}</p>
                    <p className="text-xs text-gray-500">
                      {tx.from && tx.to ? `${tx.from} → ${tx.to}` : tx.chain}
                    </p>
                  </div>
                </div>
                <div className="text-right">
                  <p className={`font-medium ${
                    tx.type === 'sent' ? 'text-red-600' : 'text-green-600'
                  }`}>
                    {tx.type === 'sent' ? '-' : '+'}${tx.amount}
                  </p>
                  <p className="text-xs text-gray-500">{tx.time}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  };

  // Expert Mode Dashboard
  const ExpertModeDashboard = () => {
    const usdcBalance = smartUsdcBalance ? parseFloat(formatUnits(smartUsdcBalance, 6)) : 0;
    
    return (
      <div className="p-4 space-y-6 pb-20">
        {/* Multi-Chain Portfolio */}
        <div className="card">
          <div className="flex items-center mb-4">
            <BarChart3 className="w-5 h-5 mr-2 text-blue-600" />
            <h3 className="text-lg font-semibold">Multi-Chain Portfolio</h3>
          </div>
          
          <div className="grid grid-cols-2 gap-4 mb-4">
            <div className="text-center p-3 bg-blue-50 rounded-lg">
              <p className="text-blue-600 font-bold text-xl">${usdcBalance.toFixed(2)}</p>
              <p className="text-blue-500 text-sm">Total USDC</p>
            </div>
            <div className="text-center p-3 bg-yellow-50 rounded-lg">
              <p className="text-yellow-600 font-bold text-xl">$0.00</p>
              <p className="text-yellow-500 text-sm">Total EURC</p>
            </div>
          </div>

          <Button className="w-full bg-indigo-600 hover:bg-indigo-700 text-white">
            <ArrowDownUp className="w-4 h-4 mr-2" />
            Aggregate All Chains
          </Button>
        </div>

        {/* Wallet Controls */}
        <div className="card">
          <div className="flex items-center mb-4">
            <Settings className="w-5 h-5 mr-2 text-blue-600" />
            <h3 className="text-lg font-semibold">Wallet Controls</h3>
          </div>
          
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-sm">Current Chain</span>
              <Button
                size="sm"
                variant="bordered"
                onClick={toggleChain}
                startContent={<RefreshCw className="w-4 h-4" />}
              >
                Switch to {chainId === base.id ? 'Base Sepolia' : 'Base'}
              </Button>
            </div>
            
            <div className="flex items-center justify-between">
              <span className="text-sm">Smart Wallet</span>
              <div className="flex items-center space-x-2">
                <span className="text-xs font-mono text-gray-600">
                  {smartWalletAddress?.slice(0, 6)}...{smartWalletAddress?.slice(-4)}
                </span>
                <Button
                  size="sm"
                  variant="ghost"
                  onClick={() => copyToClipboard(smartWalletAddress || '', 'smart')}
                >
                  {copiedWallet === 'smart' ? 
                    <CheckCircle className="w-4 h-4 text-green-500" /> : 
                    <Copy className="w-4 h-4" />
                  }
                </Button>
              </div>
            </div>
          </div>
        </div>

        {/* DeFi Panel */}
        <div className="card">
          <div className="flex items-center mb-4">
            <TrendingUp className="w-5 h-5 mr-2 text-green-600" />
            <h3 className="text-lg font-semibold">DeFi Opportunities</h3>
          </div>
          
          <div className="grid grid-cols-2 gap-3">
            <Button variant="bordered" className="h-16 flex flex-col">
              <span className="font-medium">Aave</span>
              <span className="text-xs text-green-600">4.2% APY</span>
            </Button>
            <Button variant="bordered" className="h-16 flex flex-col">
              <span className="font-medium">Increment.fi</span>
              <span className="text-xs text-green-600">5.1% APY</span>
            </Button>
          </div>
        </div>
      </div>
    );
  };

  // Send View (reusing your transaction logic)
  const SendView = () => (
    <div className="p-4 space-y-6 pb-20">
      <div className="card">
        <h3 className="text-lg font-semibold mb-4">Send {userPreferences.defaultToken}</h3>
        
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium mb-2">Amount</label>
            <input
              type="number"
              placeholder="0.00"
              value={usdcAmount}
              onChange={(e) => setUsdcAmount(e.target.value)}
              className="input-primary w-full"
              min="0"
              step="0.1"
            />
            <p className="text-xs text-gray-500 mt-1">
              Available: {smartUsdcBalance ? formatUnits(smartUsdcBalance, 6) : '0'} {userPreferences.defaultToken}
            </p>
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">Recipient Address</label>
            <input
              placeholder="0x..."
              value={recipientAddress}
              onChange={(e) => setRecipientAddress(e.target.value)}
              className="input-primary w-full"
            />
          </div>

          <Button
            className="w-full btn-primary"
            onClick={execTransaction}
            disabled={
              isTransactionLoading ||
              !usdcAmount ||
              !recipientAddress ||
              (smartUsdcBalance && parseUnits(usdcAmount, 6) > smartUsdcBalance)
            }
            startContent={isTransactionLoading ? 
              <Loader2 className="w-4 h-4 animate-spin" /> : 
              <Send className="w-4 h-4" />
            }
          >
            {isTransactionLoading ? 'Sending...' : `Send ${usdcAmount || '0.00'} ${userPreferences.defaultToken}`}
          </Button>

          {errorMessage && (
            <div className="text-red-500 text-sm text-center">{errorMessage}</div>
          )}
        </div>
      </div>
    </div>
  );

  // Settings View
  const SettingsView = () => (
    <div className="p-4 space-y-6 pb-20">
      <div className="card">
        <h3 className="text-lg font-semibold mb-4">Settings</h3>
        
        <div className="space-y-4">
          <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
            <div>
              <p className="font-medium">Wallet Mode</p>
              <p className="text-sm text-gray-600">
                Currently in {userPreferences.expertise} mode
              </p>
            </div>
            <Button
              size="sm"
              onClick={handleModeSwitch}
              className={userPreferences.expertise === 'easy' ? 'btn-expert-mode' : 'btn-easy-mode'}
              startContent={userPreferences.expertise === 'easy' ? 
                <Zap className="w-4 h-4" /> : 
                <Users className="w-4 h-4" />
              }
            >
              Switch to {userPreferences.expertise === 'easy' ? 'Expert' : 'Easy'}
            </Button>
          </div>

          <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
            <div>
              <p className="font-medium">Region</p>
              <p className="text-sm text-gray-600">
                {userPreferences.region} • Default: {userPreferences.defaultToken}
              </p>
            </div>
            <div className={`px-2 py-1 rounded text-xs font-medium ${
              userPreferences.region === 'EU' ? 'bg-yellow-100 text-yellow-800' :
              userPreferences.region === 'US' ? 'bg-blue-100 text-blue-800' :
              'bg-gray-100 text-gray-800'
            }`}>
              {userPreferences.region === 'EU' ? '🇪🇺 EU' :
               userPreferences.region === 'US' ? '🇺🇸 US' : '🌍 Global'}
            </div>
          </div>

          <div className="pt-4 border-t">
            <Button
              variant="bordered"
              color="danger"
              onClick={handleLogout}
              className="w-full"
              startContent={<LogOut className="w-4 h-4" />}
            >
              Logout
            </Button>
          </div>
        </div>
      </div>
    </div>
  );

  // Bottom Navigation
  const BottomNav = () => {
    const navItems = userPreferences.expertise === 'easy' 
      ? [
          { id: 'dashboard', label: 'Home', icon: Wallet },
          { id: 'send', label: 'Send', icon: Send },
          { id: 'receive', label: 'Receive', icon: QrCode },
          { id: 'settings', label: 'Settings', icon: Settings }
        ]
      : [
          { id: 'dashboard', label: 'Portfolio', icon: BarChart3 },
          { id: 'send', label: 'Send', icon: Send },
          { id: 'aggregate', label: 'Bridge', icon: ArrowDownUp },
          { id: 'settings', label: 'Settings', icon: Settings }
        ];

    return (
      <div className="fixed bottom-0 left-0 right-0 bg-white border-t">
        <div className="flex">
          {navItems.map(({ id, label, icon: Icon }) => (
            <button
              key={id}
              onClick={() => setCurrentView(id)}
              className={`nav-item ${currentView === id ? 'nav-item-active' : ''}`}
            >
              <Icon className="w-5 h-5" />
              <span className="text-xs">{label}</span>
            </button>
          ))}
        </div>
      </div>
    );
  };

  // Render appropriate view based on current state
  const renderCurrentView = () => {
    switch (currentView) {
      case 'dashboard':
        return userPreferences.expertise === 'easy' ? <EasyModeDashboard /> : <ExpertModeDashboard />;
      case 'send':
        return <SendView />;
      case 'settings':
        return <SettingsView />;
      default:
        return (
          <div className="p-4 pb-20">
            <div className="card">
              <div className="text-center text-gray-500 py-8">
                <p className="text-lg font-medium">{currentView.charAt(0).toUpperCase() + currentView.slice(1)} Page</p>
                <p className="text-sm">Feature coming soon...</p>
              </div>
            </div>
          </div>
        );
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      {renderCurrentView()}
      <BottomNav />
    </div>
  );
}
