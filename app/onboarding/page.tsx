"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { usePrivy } from "@privy-io/react-auth";
import { Button } from "@nextui-org/react";
import { 
  Wallet, 
  Globe, 
  Users, 
  Zap, 
  ArrowRight, 
  ArrowLeft,
  CheckCircle,
  Loader2
} from "lucide-react";

type ExpertiseLevel = 'easy' | 'expert';
type Region = 'EU' | 'US' | 'GLOBAL';

interface UserPreferences {
  expertise: ExpertiseLevel;
  region: Region;
  addressHash: string;
  defaultToken: 'USDC' | 'EURC';
  defaultChain: string;
}

export default function OnboardingPage() {
  const { user, authenticated, ready } = usePrivy();
  const router = useRouter();
  
  const [step, setStep] = useState<'expertise' | 'region' | 'confirm'>('expertise');
  const [expertise, setExpertise] = useState<ExpertiseLevel | null>(null);
  const [region, setRegion] = useState<Region | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isComplete, setIsComplete] = useState(false);

  // Redirect if not authenticated
  useEffect(() => {
    if (ready && !authenticated) {
      router.push('/');
    }
  }, [ready, authenticated, router]);

  // Get derived preferences based on selections
  const getPreferences = (): UserPreferences => {
    const defaultToken = region === 'EU' ? 'EURC' : 'USDC';
    const defaultChain = expertise === 'easy' ? 'ethereum' : 'flow';
    
    return {
      expertise: expertise!,
      region: region!,
      addressHash: user?.wallet?.address || '',
      defaultToken,
      defaultChain
    };
  };

  const handleExpertiseSelect = (level: ExpertiseLevel) => {
    setExpertise(level);
    setStep('region');
  };

  const handleRegionSelect = (selectedRegion: Region) => {
    setRegion(selectedRegion);
    setStep('confirm');
  };

  const handleComplete = async () => {
    if (!expertise || !region || !user) return;
    
    setIsLoading(true);
    
    try {
      const preferences = getPreferences();
      
      // Save to localStorage for immediate use
      localStorage.setItem(`stablewallet_user_${user.id}`, JSON.stringify(preferences));
      
      // TODO: Save to Supabase for persistence
      // await saveUserPreferences(preferences);
      
      setIsComplete(true);
      
      // Redirect to dashboard after animation
      setTimeout(() => {
        router.push('/dashboard');
      }, 1500);
      
    } catch (error) {
      console.error('Error saving preferences:', error);
      setIsLoading(false);
    }
  };

  const handleBack = () => {
    if (step === 'region') {
      setStep('expertise');
      setExpertise(null);
    } else if (step === 'confirm') {
      setStep('region');
      setRegion(null);
    }
  };

  // Loading state
  if (!ready || !authenticated) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="w-8 h-8 animate-spin text-blue-600 mx-auto mb-4" />
          <p className="text-gray-600">Loading...</p>
        </div>
      </div>
    );
  }

  // Success state
  if (isComplete) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-green-50 to-emerald-100 flex items-center justify-center">
        <div className="text-center animate-fade-in">
          <div className="w-20 h-20 bg-green-600 rounded-full flex items-center justify-center mx-auto mb-6 animate-bounce-gentle">
            <CheckCircle className="w-10 h-10 text-white" />
          </div>
          <h1 className="text-3xl font-bold text-green-900 mb-4">Welcome to StableWallet!</h1>
          <p className="text-green-700 text-lg">Setting up your personalized experience...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      <div className="max-w-4xl mx-auto px-4 py-8">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="flex items-center justify-center mb-4">
            <div className="w-12 h-12 bg-blue-600 rounded-xl flex items-center justify-center mr-3">
              <Wallet className="w-6 h-6 text-white" />
            </div>
            <h1 className="text-2xl font-bold text-gray-900">StableWallet</h1>
          </div>
          
          {/* Progress indicator */}
          <div className="flex items-center justify-center space-x-4 mb-6">
            <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
              step === 'expertise' ? 'bg-blue-600 text-white' : 
              expertise ? 'bg-green-600 text-white' : 'bg-gray-200 text-gray-500'
            }`}>
              1
            </div>
            <div className={`w-16 h-1 ${expertise ? 'bg-green-600' : 'bg-gray-200'}`} />
            <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
              step === 'region' ? 'bg-blue-600 text-white' : 
              region ? 'bg-green-600 text-white' : 'bg-gray-200 text-gray-500'
            }`}>
              2
            </div>
            <div className={`w-16 h-1 ${region ? 'bg-green-600' : 'bg-gray-200'}`} />
            <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
              step === 'confirm' ? 'bg-blue-600 text-white' : 'bg-gray-200 text-gray-500'
            }`}>
              3
            </div>
          </div>
        </div>

        {/* Step 1: Expertise Selection */}
        {step === 'expertise' && (
          <div className="animate-slide-up">
            <div className="text-center mb-8">
              <h2 className="text-3xl font-bold text-gray-900 mb-4">Choose Your Experience</h2>
              <p className="text-lg text-gray-600">We'll customize StableWallet based on your comfort level</p>
            </div>

            <div className="grid md:grid-cols-2 gap-6 max-w-4xl mx-auto">
              {/* Easy Mode */}
              <button
                onClick={() => handleExpertiseSelect('easy')}
                className="card-hover easy-mode-gradient text-white p-8 text-left transform hover:scale-105 transition-all"
              >
                <div className="flex items-center mb-4">
                  <div className="w-12 h-12 bg-white bg-opacity-20 rounded-xl flex items-center justify-center mr-4">
                    <Users className="w-6 h-6 text-white" />
                  </div>
                  <h3 className="text-2xl font-bold">Easy Mode</h3>
                </div>
                <p className="text-green-100 mb-6 text-lg">
                  Perfect for newcomers to crypto. Simple interface with smart defaults.
                </p>
                <ul className="space-y-3 text-green-100">
                  <li className="flex items-center">
                    <div className="w-2 h-2 bg-white rounded-full mr-3" />
                    Regional defaults (EU → EURC, US → USDC)
                  </li>
                  <li className="flex items-center">
                    <div className="w-2 h-2 bg-white rounded-full mr-3" />
                    One-click transfers and staking
                  </li>
                  <li className="flex items-center">
                    <div className="w-2 h-2 bg-white rounded-full mr-3" />
                    QR code payments
                  </li>
                  <li className="flex items-center">
                    <div className="w-2 h-2 bg-white rounded-full mr-3" />
                    No complex settings
                  </li>
                </ul>
              </button>

              {/* Expert Mode */}
              <button
                onClick={() => handleExpertiseSelect('expert')}
                className="card-hover expert-mode-gradient text-white p-8 text-left transform hover:scale-105 transition-all"
              >
                <div className="flex items-center mb-4">
                  <div className="w-12 h-12 bg-white bg-opacity-20 rounded-xl flex items-center justify-center mr-4">
                    <Zap className="w-6 h-6 text-white" />
                  </div>
                  <h3 className="text-2xl font-bold">Expert Mode</h3>
                </div>
                <p className="text-purple-100 mb-6 text-lg">
                  Advanced features for DeFi users. Full control and multi-chain management.
                </p>
                <ul className="space-y-3 text-purple-100">
                  <li className="flex items-center">
                    <div className="w-2 h-2 bg-white rounded-full mr-3" />
                    Multi-chain portfolio view
                  </li>
                  <li className="flex items-center">
                    <div className="w-2 h-2 bg-white rounded-full mr-3" />
                    Cross-chain aggregation
                  </li>
                  <li className="flex items-center">
                    <div className="w-2 h-2 bg-white rounded-full mr-3" />
                    Advanced DeFi integrations
                  </li>
                  <li className="flex items-center">
                    <div className="w-2 h-2 bg-white rounded-full mr-3" />
                    Wallet switching & management
                  </li>
                </ul>
              </button>
            </div>
          </div>
        )}

        {/* Step 2: Region Selection */}
        {step === 'region' && (
          <div className="animate-slide-up">
            <div className="text-center mb-8">
              <h2 className="text-3xl font-bold text-gray-900 mb-4">Select Your Region</h2>
              <p className="text-lg text-gray-600">This determines your default stablecoin and settings</p>
            </div>

            <div className="grid md:grid-cols-3 gap-6 max-w-4xl mx-auto">
              {/* Europe */}
              <button
                onClick={() => handleRegionSelect('EU')}
                className="card-hover eurc-gradient text-white p-6 text-center transform hover:scale-105 transition-all"
              >
                <div className="text-6xl mb-4">🇪🇺</div>
                <h3 className="text-xl font-bold mb-2">Europe</h3>
                <p className="text-yellow-100 mb-4">Default: EURC on Ethereum</p>
                <div className="bg-white bg-opacity-20 rounded-lg p-3">
                  <p className="text-sm text-yellow-100">EUR-denominated</p>
                  <p className="text-sm text-yellow-100">Increment.fi staking</p>
                </div>
              </button>

              {/* United States */}
              <button
                onClick={() => handleRegionSelect('US')}
                className="card-hover usdc-gradient text-white p-6 text-center transform hover:scale-105 transition-all"
              >
                <div className="text-6xl mb-4">🇺🇸</div>
                <h3 className="text-xl font-bold mb-2">United States</h3>
                <p className="text-blue-100 mb-4">Default: USDC on Ethereum</p>
                <div className="bg-white bg-opacity-20 rounded-lg p-3">
                  <p className="text-sm text-blue-100">USD-denominated</p>
                  <p className="text-sm text-blue-100">Aave staking</p>
                </div>
              </button>

              {/* Global */}
              <button
                onClick={() => handleRegionSelect('GLOBAL')}
                className="card-hover bg-gradient-to-br from-gray-600 to-gray-700 text-white p-6 text-center transform hover:scale-105 transition-all"
              >
                <div className="text-6xl mb-4">🌍</div>
                <h3 className="text-xl font-bold mb-2">Global</h3>
                <p className="text-gray-100 mb-4">Both USDC & EURC support</p>
                <div className="bg-white bg-opacity-20 rounded-lg p-3">
                  <p className="text-sm text-gray-100">Multi-currency</p>
                  <p className="text-sm text-gray-100">All DeFi protocols</p>
                </div>
              </button>
            </div>

            <div className="flex justify-center mt-8">
              <Button
                variant="bordered"
                onClick={handleBack}
                startContent={<ArrowLeft className="w-4 h-4" />}
              >
                Back
              </Button>
            </div>
          </div>
        )}

        {/* Step 3: Confirmation */}
        {step === 'confirm' && expertise && region && (
          <div className="animate-slide-up">
            <div className="text-center mb-8">
              <h2 className="text-3xl font-bold text-gray-900 mb-4">Confirm Your Setup</h2>
              <p className="text-lg text-gray-600">We're ready to create your personalized wallet</p>
            </div>

            <div className="max-w-2xl mx-auto">
              <div className="card p-8">
                <div className="space-y-6">
                  {/* Expertise Summary */}
                  <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                    <div className="flex items-center">
                      <div className={`w-12 h-12 rounded-xl flex items-center justify-center mr-4 ${
                        expertise === 'easy' ? 'easy-mode-gradient' : 'expert-mode-gradient'
                      }`}>
                        {expertise === 'easy' ? 
                          <Users className="w-6 h-6 text-white" /> : 
                          <Zap className="w-6 h-6 text-white" />
                        }
                      </div>
                      <div>
                        <h4 className="font-semibold capitalize">{expertise} Mode</h4>
                        <p className="text-sm text-gray-600">
                          {expertise === 'easy' ? 'Simple interface with smart defaults' : 'Advanced features and full control'}
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* Region Summary */}
                  <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                    <div className="flex items-center">
                      <div className={`w-12 h-12 rounded-xl flex items-center justify-center mr-4 text-2xl ${
                        region === 'EU' ? 'eurc-gradient' : 
                        region === 'US' ? 'usdc-gradient' : 
                        'bg-gradient-to-br from-gray-600 to-gray-700'
                      }`}>
                        {region === 'EU' ? '🇪🇺' : region === 'US' ? '🇺🇸' : '🌍'}
                      </div>
                      <div>
                        <h4 className="font-semibold">
                          {region === 'EU' ? 'Europe' : region === 'US' ? 'United States' : 'Global'}
                        </h4>
                        <p className="text-sm text-gray-600">
                          Default: {getPreferences().defaultToken} • {getPreferences().defaultChain}
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* Wallet Summary */}
                  <div className="flex items-center justify-between p-4 bg-blue-50 rounded-lg">
                    <div className="flex items-center">
                      <div className="w-12 h-12 bg-blue-600 rounded-xl flex items-center justify-center mr-4">
                        <Wallet className="w-6 h-6 text-white" />
                      </div>
                      <div>
                        <h4 className="font-semibold">Connected Wallet</h4>
                        <p className="text-sm text-gray-600 font-mono">
                          {user?.wallet?.address?.slice(0, 6)}...{user?.wallet?.address?.slice(-4)}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Action Buttons */}
                <div className="flex flex-col sm:flex-row gap-4 mt-8">
                  <Button
                    variant="bordered"
                    onClick={handleBack}
                    startContent={<ArrowLeft className="w-4 h-4" />}
                    className="sm:w-auto"
                  >
                    Back
                  </Button>
                  
                  <Button
                    className="btn-primary flex-1"
                    onClick={handleComplete}
                    disabled={isLoading}
                    endContent={isLoading ? <Loader2 className="w-4 h-4 animate-spin" /> : <ArrowRight className="w-4 h-4" />}
                  >
                    {isLoading ? 'Setting up...' : 'Complete Setup'}
                  </Button>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
