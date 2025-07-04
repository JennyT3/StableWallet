# 🔷 StableWallet

**The First USDC-Native Wallet for Seamless Cross-Chain Finance**

---

## 🎯 **What is StableWallet?**

StableWallet is a USDC-only stablecoin wallet that makes cross-chain finance as easy as sending a text message. Built with Worldcoin's design principles and targeting both crypto newcomers and experienced DeFi users.

**Core Value Proposition:** Eliminate the complexity of multi-token wallets and focus purely on making USDC work seamlessly across all chains.

---

## ✨ **Key Features**

### 🔐 **Zero-Friction Onboarding**
- Social login via Privy (Google, Twitter, Email)
- No seed phrases needed
- Embedded wallet creation in <30 seconds

### 🌉 **Universal Cross-Chain**
- Move USDC between chains with one tap
- Powered by Circle's CCTP v2
- Support for 10+ chains including Ethereum, Polygon, Arbitrum, Base

### ₿ **BTC Integration** 
- Direct BTC → USDC conversion via 1inch Fusion+
- Atomic swaps in single transaction
- No intermediate steps or multiple apps

### 💰 **Built-in Yield** *(Coming Soon)*
- Earn on idle USDC through Aave v3
- Auto-compound strategies
- No need to leave the app

### 📱 **Mobile-First Design**
- Worldcoin-inspired UI/UX
- QR code payments
- Instant transaction confirmations

---

## 🏗️ **Technical Architecture**

### **Frontend Stack**
```
Next.js 14 + TypeScript
Privy SDK (Auth + Embedded Wallets)
Tailwind CSS + shadcn/ui
TanStack Query (State Management)
Vercel (Deployment)
```

### **Backend Integration**
```
Circle CCTP v2 API (Cross-chain transfers)
1inch Fusion+ SDK (BTC conversion)
Aave v3 Contracts (Yield generation)
Privy Auth API (User management)
```

### **Supported Chains**
- Ethereum Mainnet
- Polygon
- Arbitrum
- Base
- Optimism
- Avalanche
- *More chains coming via CCTP v2*

---

## 🚀 **Getting Started**

### Prerequisites
- Node.js 18+
- npm or yarn
- Privy App ID
- Circle API Key

### Installation

```bash
# Clone the repository
git clone https://github.com/your-team/stablewallet
cd stablewallet

# Install dependencies
npm install

# Set up environment variables
cp .env.example .env.local

# Start development server
npm run dev
```

### Environment Variables

```env
# Privy Configuration
NEXT_PUBLIC_PRIVY_APP_ID=your_privy_app_id
PRIVY_APP_SECRET=your_privy_secret

# Circle CCTP Configuration
CIRCLE_API_KEY=your_circle_api_key
NEXT_PUBLIC_CIRCLE_ENVIRONMENT=sandbox

# 1inch Configuration (Coming Soon)
ONEINCH_API_KEY=your_1inch_api_key

# Aave Configuration (Coming Soon)
AAVE_API_KEY=your_aave_api_key
```

---

## 🎮 **Demo **


### Test Accounts
```
Demo Wallet 1: 
Demo Wallet 2:
```

---

## 👥 **Team**

### **Jenny T.** - *Product & Design Lead*
- UX/UI designer with DeFi experience
- Multiple hackathon winner
- Worldcoin design system expert

### **ppezz** - *Full-stack Lead*
- Full-stack developer
- React/Next.js specialist
- Privy integration expert

---

## 📊 **Key Metrics**

### **Performance Targets**
- ⚡ **Onboarding:** <30 seconds from landing to first transaction
- 🌉 **Cross-chain:** <2 minutes end-to-end transfer
- 🔄 **BTC Conversion:** Single transaction, no intermediate steps
- 🎨 **UI/UX:** >95% Worldcoin design compliance

### **Technical Metrics**
- 🔒 **Security:** All funds secured by Circle's infrastructure
- ⛽ **Gas Optimization:** Batched transactions where possible
- 📱 **Mobile:** <3 second load times
- 🌐 **Cross-chain:** Support for 10+ chains

---

## 🔮 **Roadmap**

### **Phase 1: Hackathon MVP** *(Current)*
- [x] Social login with Privy
- [x] Embedded wallet creation
- [x] USDC balance display
- [x] Cross-chain transfers (CCTP v2)
- [x] QR code payments
- [x] Mobile-responsive UI

### **Phase 2: Post-Hackathon** *(Next 30 days)*
- [ ] BTC → USDC conversion (1inch Fusion+)
- [ ] Aave yield integration
- [ ] Transaction history & analytics
- [ ] Merchant payment flows
- [ ] World ID integration

### **Phase 3: Scale** *(Next 90 days)*
- [ ] Non-EVM chain support (Sui, Solana)
- [ ] Advanced yield strategies
- [ ] Business accounts
- [ ] API for developers
- [ ] Mobile app (iOS/Android)

---

## 🛡️ **Security**

### **Wallet Security**
- Embedded wallets via Privy's secure infrastructure
- No seed phrases stored locally
- Multi-sig support for high-value accounts

### **Transaction Security**
- All transfers via Circle's CCTP v2
- Atomic swaps for BTC conversion
- Real-time transaction monitoring

### **Data Protection**
- Zero-knowledge architecture
- GDPR compliant
- No PII stored on-chain

---

### **Development Setup**
```bash
# Install dependencies
npm install

# Run tests
npm test

# Run linter
npm run lint

# Build for production
npm run build
```

---

## 🎉 **Acknowledgments**

Built with ❤️ by the StableWallet Team for ETHGlobal Cannes 2025

Special thanks to:
- [Privy](https://privy.io) for seamless wallet infrastructure
- [Circle](https://circle.com) for CCTP v2 cross-chain protocol
- [1inch](https://1inch.io) for atomic swap technology
- [Aave](https://aave.com) for yield generation
