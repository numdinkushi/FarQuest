/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/ban-ts-comment */
import { useState, useCallback, useEffect } from 'react';
import { useAccount, useDisconnect, useConnect, useSwitchChain, useChainId } from 'wagmi';
import { WalletState } from '~/types';
import { celo } from 'viem/chains';
import sdk from "@farcaster/frame-sdk";

export const useWallet = () => {
  console.log('Initializing useWallet hook...');
  const { address, isConnected, chain } = useAccount();
  const { disconnect } = useDisconnect();
  const { connect, connectors } = useConnect();
  const { switchChain, isPending: isSwitchChainPending } = useSwitchChain();
  const chainId = useChainId();

  // SDK state management
  const [isSDKLoaded, setIsSDKLoaded] = useState(false);
  const [context, setContext] = useState<unknown>(null);

  // Define target chain
  const CELO_CHAIN_ID = celo.id;
  const targetChain = celo;
  const isCorrectChain = chain?.id === CELO_CHAIN_ID;

  const [wallet, setWallet] = useState<WalletState>({
    isConnected: false,
    address: ''
  });

  // Initialize Farcaster SDK
  useEffect(() => {
    const initializeSDK = async () => {
      try {
        if (typeof window !== 'undefined' && sdk) {
          console.log('Initializing Farcaster SDK...');
          // Set up SDK
          sdk.actions.ready({});
          // Get context if available
          const sdkContext = await sdk.context;
          setContext(sdkContext);
          // Add frame if in Farcaster environment
          if (sdk.actions?.addFrame) {
            await sdk.actions.addFrame();
          }
          setIsSDKLoaded(true);
          console.log('Farcaster SDK initialized successfully');
        }
      } catch (error) {
        console.error('Failed to initialize Farcaster SDK:', error);
        // Set SDK as loaded anyway to allow web fallback
        setIsSDKLoaded(true);
      }
    };

    initializeSDK();
  }, []);

  // Sync wagmi state with local wallet state
  useEffect(() => {
    console.log('Syncing wallet state:', { isConnected, address });
    setWallet({
      isConnected: isConnected,
      address: address || ''
    });
  }, [isConnected, address]);

  // Enhanced wallet connection with Farcaster SDK support
  const connectWallet = useCallback(async (): Promise<void> => {
    try {
      console.log('connectWallet called');
      console.log('Available connectors:', connectors.map(c => ({ id: c.id, name: c.name, ready: c.ready })));

      // Bank of Celo style connector selection - prefer injected (MetaMask) or fallback
      const connector = connectors.find((c) => c.id === "injected") || connectors[0];

      if (!connector) {
        throw new Error('No wallet connectors available');
      }

      console.log('Using connector:', connector.name);
      // Connect with target chain ID like Bank of Celo
      await connect({
        connector,
        chainId: CELO_CHAIN_ID,
      });

    } catch (error) {
      console.error('Wallet connection failed:', error);
      throw new Error(`Failed to connect wallet: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }, [connect, connectors, CELO_CHAIN_ID]);

  // Enhanced disconnect that accepts optional callback for saving state
  const disconnectWallet = useCallback(async (onBeforeDisconnect?: () => Promise<void>): Promise<void> => {
    try {
      console.log('Disconnecting wallet...');
      // Execute any pre-disconnect logic (like saving game state)
      if (onBeforeDisconnect) {
        await onBeforeDisconnect();
      }
    } catch (error) {
      console.error('Error during pre-disconnect logic:', error);
      // Continue with disconnect even if save fails
    } finally {
      // Use wagmi's disconnect
      disconnect();
    }
  }, [disconnect]);

  // Chain switching functionality
  const switchToTargetChain = useCallback(async (): Promise<void> => {
    try {
      console.log('Switching to target chain:', targetChain.name);
      await switchChain({ chainId: targetChain.id });
    } catch (error) {
      console.error("Chain switch failed:", error);
      throw new Error(`Failed to switch to ${targetChain.name}. Please try again.`);
    }
  }, [switchChain, targetChain]);

  // Debug connection status
  useEffect(() => {
    console.log('Wallet state changed:', {
      isConnected,
      address,
      chainId: chain?.id,
      chainName: chain?.name,
      connectError: null
    });
  }, [isConnected, address, chain]);

  // Log connector status
  useEffect(() => {
    console.log('Connectors status:', connectors.map(c => ({
      id: c.id,
      name: c.name,
      ready: c.ready,
      type: c.type
    })));
  }, [connectors]);

  return {
    // Existing interface
    wallet,
    connectWallet,
    disconnectWallet,

    // Additional wagmi-powered features
    chain,
    chainId,
    isCorrectChain,
    targetChain,
    switchToTargetChain,
    isSwitchChainPending,
    isConnectPending: false,

    // Connection utilities
    availableConnectors: connectors,

    // Farcaster SDK features
    isSDKLoaded,
    context,
    showSwitchNetworkBanner: isConnected && !isCorrectChain,

    // Raw wagmi hooks for advanced usage
    rawWagmiData: {
      address,
      isConnected,
      chain,
      connectors
    }
  };
};
