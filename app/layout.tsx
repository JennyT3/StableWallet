import type { Metadata } from "next";
import { Raleway } from "next/font/google";
import "./globals.css";
import Providers from "@/components/providers";

const raleway = Raleway({
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "StableWallet - Stablecoin Wallet for Seamless Cross-Chain Finance",
  description: "The first USDC & EURC-only wallet with social login, cross-chain transfers via Circle CCTP v2, and built-in yield. No crypto knowledge required.",
  keywords: [
    "stablecoin wallet",
    "USDC",
    "EURC", 
    "cross-chain",
    "Circle CCTP",
    "DeFi",
    "Privy",
    "embedded wallet",
    "social login",
    "Flow blockchain",
    "Ethereum",
    "Base",
    "Polygon"
  ],
  authors: [
    { name: "StableWallet Team" },
    { name: "Jenny T.", url: "https://github.com/jenny" },
    { name: "ppezz", url: "https://github.com/ppezzull" },
    { name: "Federico O.", url: "https://github.com/federico" }
  ],
  creator: "StableWallet Team",
  publisher: "StableWallet",
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
  openGraph: {
    type: "website",
    locale: "en_US",
    url: "https://stablewallet.vercel.app",
    title: "StableWallet - Stablecoin Wallet for Everyone",
    description: "The first USDC & EURC-only wallet with social login, cross-chain transfers, and built-in yield. Made for beginners and experts.",
    siteName: "StableWallet",
    images: [
      {
        url: "/images/og-image.png",
        width: 1200,
        height: 630,
        alt: "StableWallet - Stablecoin Wallet for Seamless Cross-Chain Finance",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "StableWallet - Stablecoin Wallet for Everyone",
    description: "The first USDC & EURC-only wallet with social login, cross-chain transfers, and built-in yield.",
    site: "@stablewallet",
    creator: "@stablewallet",
    images: ["/images/twitter-image.png"],
  },
  icons: {
    icon: "/favicon.ico",
    shortcut: "/favicon-16x16.png",
    apple: "/apple-touch-icon.png",
  },
  manifest: "/site.webmanifest",
  category: "cryptocurrency",
  classification: "DeFi Wallet",
  viewport: {
    width: "device-width",
    initialScale: 1,
    maximumScale: 1,
  },
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#2563eb" },
    { media: "(prefers-color-scheme: dark)", color: "#1e40af" }
  ],
  verification: {
    // Add verification codes when you have them
    // google: "google-verification-code",
    // yandex: "yandex-verification-code",
  },
  alternates: {
    canonical: "https://stablewallet.vercel.app",
  },
  other: {
    "msapplication-TileColor": "#2563eb",
    "msapplication-config": "/browserconfig.xml",
  }
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        {/* Preconnect to external domains for performance */}
        <link rel="preconnect" href="https://auth.privy.io" />
        <link rel="preconnect" href="https://api.circle.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        
        {/* Additional performance hints */}
        <link rel="dns-prefetch" href="//auth.privy.io" />
        <link rel="dns-prefetch" href="//api.circle.com" />
        
        {/* Security headers */}
        <meta httpEquiv="X-Content-Type-Options" content="nosniff" />
        <meta httpEquiv="Referrer-Policy" content="strict-origin-when-cross-origin" />
        
        {/* ETHGlobal Cannes specific meta */}
        <meta name="hackathon" content="ETHGlobal Cannes 2025" />
        <meta name="bounty-tracks" content="Privy, Circle CCTP, Flow" />
        <meta name="demo-ready" content="true" />
      </head>
      <body className={`${raleway.className} antialiased`} suppressHydrationWarning>
        <Providers>{children}</Providers>
        
        {/* Analytics scripts would go here */}
        {process.env.NODE_ENV === 'production' && (
          <>
            {/* Add Google Analytics or other analytics */}
            {/* <Script src="https://www.googletagmanager.com/gtag/js?id=GA_MEASUREMENT_ID" />
            <Script id="google-analytics">
              {`
                window.dataLayer = window.dataLayer || [];
                function gtag(){dataLayer.push(arguments);}
                gtag('js', new Date());
                gtag('config', 'GA_MEASUREMENT_ID');
              `}
            </Script> */}
          </>
        )}
      </body>
    </html>
  );
}
