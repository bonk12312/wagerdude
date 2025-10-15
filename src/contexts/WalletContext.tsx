import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';

type PhantomProvider = {
  isPhantom?: boolean;
  connect: () => Promise<{ publicKey: { toString: () => string } }>;
  disconnect: () => Promise<void>;
  publicKey?: { toString: () => string };
  on: (event: string, handler: (args: any) => void) => void;
  off: (event: string, handler: (args: any) => void) => void;
};

type WalletContextType = {
  walletAddress: string | null;
  connecting: boolean;
  connected: boolean;
  connect: () => Promise<void>;
  disconnect: () => Promise<void>;
};

const WalletContext = createContext<WalletContextType | undefined>(undefined);

export const useWallet = () => {
  const context = useContext(WalletContext);
  if (!context) {
    throw new Error('useWallet must be used within a WalletProvider');
  }
  return context;
};

type WalletProviderProps = {
  children: ReactNode;
};

export const WalletProvider: React.FC<WalletProviderProps> = ({ children }) => {
  const [walletAddress, setWalletAddress] = useState<string | null>(null);
  const [connecting, setConnecting] = useState(false);
  const [connected, setConnected] = useState(false);

  const getProvider = (): PhantomProvider | undefined => {
    if ('phantom' in window) {
      const provider = (window as any).phantom?.solana;
      if (provider?.isPhantom) {
        return provider;
      }
    }
  };

  const connect = async () => {
    const provider = getProvider();
    if (!provider) {
      window.open('https://phantom.app/', '_blank');
      return;
    }

    try {
      setConnecting(true);
      const response = await provider.connect();
      const address = response.publicKey.toString();
      setWalletAddress(address);
      setConnected(true);
    } catch (err) {
      console.error('Error connecting to Phantom:', err);
    } finally {
      setConnecting(false);
    }
  };

  const disconnect = async () => {
    const provider = getProvider();
    if (provider) {
      await provider.disconnect();
      setWalletAddress(null);
      setConnected(false);
    }
  };

  useEffect(() => {
    const provider = getProvider();
    if (provider) {
      provider.on('accountChanged', (publicKey: any) => {
        if (publicKey) {
          setWalletAddress(publicKey.toString());
          setConnected(true);
        } else {
          setWalletAddress(null);
          setConnected(false);
        }
      });

      if (provider.publicKey) {
        setWalletAddress(provider.publicKey.toString());
        setConnected(true);
      }
    }
  }, []);

  return (
    <WalletContext.Provider
      value={{
        walletAddress,
        connecting,
        connected,
        connect,
        disconnect,
      }}
    >
      {children}
    </WalletContext.Provider>
  );
};
