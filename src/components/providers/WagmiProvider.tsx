import { createConfig, http, WagmiProvider } from "wagmi";
import { celo } from "wagmi/chains";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { farcasterFrame } from "@farcaster/frame-wagmi-connector";
import { coinbaseWallet, metaMask, walletConnect, injected } from "wagmi/connectors";
import { useEffect, useState } from "react";
import { useConnect, useAccount } from "wagmi";
import React from "react";
import { APP_ICON_URL, APP_NAME, APP_URL } from "~/constants";

// Custom hook for Coinbase Wallet detection and auto-connection
function useCoinbaseWalletAutoConnect() {
  const [isCoinbaseWallet, setIsCoinbaseWallet] = useState(false);
  const { connect, connectors } = useConnect();
  const { isConnected } = useAccount();

  useEffect(() => {
    // Check if we're running in Coinbase Wallet
    const checkCoinbaseWallet = () => {
      const isInCoinbaseWallet =
        window.ethereum?.isCoinbaseWallet ||
        window.ethereum?.isCoinbaseWalletExtension ||
        window.ethereum?.isCoinbaseWalletBrowser;
      setIsCoinbaseWallet(!!isInCoinbaseWallet);
      console.log('Coinbase Wallet detected:', !!isInCoinbaseWallet);
    };

    checkCoinbaseWallet();
    
    // Listen for ethereum initialization
    const handleEthereumInit = () => {
      console.log('Ethereum initialized');
      checkCoinbaseWallet();
    };
    
    window.addEventListener("ethereum#initialized", handleEthereumInit);

    return () => {
      window.removeEventListener("ethereum#initialized", handleEthereumInit);
    };
  }, []);

  useEffect(() => {
    // Auto-connect if in Coinbase Wallet and not already connected
    if (isCoinbaseWallet && !isConnected && connectors.length > 0) {
      console.log('Auto-connecting to Coinbase Wallet...');
      const coinbaseConnector = connectors.find(c => c.id === 'coinbaseWalletSDK');
      if (coinbaseConnector) {
        connect({ connector: coinbaseConnector });
      }
    }
  }, [isCoinbaseWallet, isConnected, connect, connectors]);

  return isCoinbaseWallet;
}

// Create connectors with better configuration
const getConnectors = () => {
  const connectorList = [];
  
  // Farcaster Frame connector
  try {
    connectorList.push(farcasterFrame());
  } catch (error) {
    console.warn('Farcaster Frame connector failed:', error);
  }
  
  // Coinbase Wallet connector
  try {
    connectorList.push(coinbaseWallet({
      appName: APP_NAME,
      appLogoUrl: APP_ICON_URL,
      preference: "all",
    }));
  } catch (error) {
    console.warn('Coinbase Wallet connector failed:', error);
  }
  
  // MetaMask connector
  try {
    connectorList.push(metaMask({
      dappMetadata: {
        name: APP_NAME,
        url: APP_URL,
      },
    }));
  } catch (error) {
    console.warn('MetaMask connector failed:', error);
  }
  
  // WalletConnect connector
  try {
    connectorList.push(walletConnect({
      projectId: "12ed680dece83c5e9afbcb9ea589bda9",
      metadata: {
        name: APP_NAME || 'FarQuest',
        description: "Farquest Game",
        url: APP_URL || '',
        icons: [APP_ICON_URL],
      },
    }));
  } catch (error) {
    console.warn('WalletConnect connector failed:', error);
  }
  
  // Injected connector as fallback
  try {
    connectorList.push(injected());
  } catch (error) {
    console.warn('Injected connector failed:', error);
  }
  
  // console.log('Created connectors:', connectorList.map(c => c.id || c.name));
  return connectorList;
};

export const config = createConfig({
  chains: [celo],
  transports: {
    [celo.id]: http(),
  },
  connectors: getConnectors(),
});

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: 1,
      refetchOnWindowFocus: false,
    },
  },
});

// Wrapper component that provides Coinbase Wallet auto-connection
function CoinbaseWalletAutoConnect({
  children,
}: {
  children: React.ReactNode;
}) {
  useCoinbaseWalletAutoConnect();
  return <>{children}</>;
}

// Debug component to log wallet state
function WalletDebugger() {
  const {  connectors, isPending, error } = useConnect();
  const { isConnected, address } = useAccount();
  
  useEffect(() => {
    console.log('=== WALLET DEBUG INFO ===');
    console.log('Connectors:', connectors.map(c => ({
      id: c.id,
      name: c.name,
      ready: c.ready,
      type: c.type
    })));
    console.log('Is connected:', isConnected);
    console.log('Address:', address);
    console.log('Is pending:', isPending);
    console.log('Error:', error?.message);
    console.log('Window ethereum:', !!window.ethereum);
    console.log('========================');
  }, [connectors, isConnected, address, isPending, error]);
  
  return null;
}

export default function Provider({ children }: { children: React.ReactNode }) {
  return (
    <WagmiProvider config={config}>
      <QueryClientProvider client={queryClient}>
        <WalletDebugger />
        <CoinbaseWalletAutoConnect>{children}</CoinbaseWalletAutoConnect>
      </QueryClientProvider>
    </WagmiProvider>
  );
}