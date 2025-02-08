"use client";

import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { RefreshCw, Wallet, ArrowRightLeft } from "lucide-react";

// Arbitrum Sepolia Chain ID and params
const ARBITRUM_SEPOLIA_CHAIN_ID = '0x66eee';
const ARBITRUM_SEPOLIA_PARAMS = {
  chainId: ARBITRUM_SEPOLIA_CHAIN_ID,
  chainName: 'Arbitrum Sepolia',
  nativeCurrency: {
    name: 'Ethereum',
    symbol: 'ETH',
    decimals: 18
  },
  rpcUrls: ['https://sepolia-rollup.arbitrum.io/rpc'],
  blockExplorerUrls: ['https://sepolia.arbiscan.io']
};

type PhantomProvider = {
  connect: () => Promise<{ publicKey: { toString: () => string } }>;
  isPhantom?: boolean;
  solana?: unknown;
};

interface EthereumProvider {
  isMetaMask?: boolean;
  isBraveWallet?: boolean;
  request: (args: { method: string; params?: unknown[] }) => Promise<unknown>;
  on(event: 'accountsChanged', handler: (accounts: string[]) => void): void;
  on(event: 'chainChanged', handler: (chainId: string) => void): void;
  removeListener(event: 'accountsChanged', handler: (accounts: string[]) => void): void;
  removeListener(event: 'chainChanged', handler: (chainId: string) => void): void;
}

export default function HydrayldApp() {
  const [loading, setLoading] = useState(false);
  const [solanaAddress, setSolanaAddress] = useState('');
  const [arbitrumAddress, setArbitrumAddress] = useState('');
  const [phantomProvider, setPhantomProvider] = useState<PhantomProvider | null>(null);
  const [metamaskProvider, setMetamaskProvider] = useState<EthereumProvider | null>(null);

  // Setup MetaMask provider and event listeners
  useEffect(() => {
    const setupMetaMask = () => {
      // Only set MetaMask provider if it's actually MetaMask
      if (window.ethereum?.isMetaMask) {
        console.log('MetaMask provider detected');
        setMetamaskProvider(window.ethereum as EthereumProvider);
      } else {
        console.log('MetaMask provider not found');
        setMetamaskProvider(null);
      }
    };

    setupMetaMask();

    // Listen for provider changes
    const handleProviderChanged = () => {
      console.log('Provider changed, updating MetaMask provider');
      setupMetaMask();
    };

    window.addEventListener('ethereum#initialized', handleProviderChanged);
    return () => {
      window.removeEventListener('ethereum#initialized', handleProviderChanged);
    };
  }, []);

  // Setup MetaMask event listeners
  useEffect(() => {
    if (metamaskProvider && arbitrumAddress) {
      console.log('Setting up MetaMask event listeners');
      
      const handleAccountsChanged = (accounts: string[]) => {
        console.log('MetaMask accounts changed:', accounts);
        if (accounts.length === 0) {
          setArbitrumAddress('');
        } else {
          setArbitrumAddress(accounts[0]);
        }
      };

      const handleChainChanged = (chainId: string) => {
        console.log('MetaMask chain changed:', chainId);
        if (chainId !== ARBITRUM_SEPOLIA_CHAIN_ID) {
          setArbitrumAddress('');
        }
      };

      metamaskProvider.on('accountsChanged', handleAccountsChanged);
      metamaskProvider.on('chainChanged', handleChainChanged);

      return () => {
        metamaskProvider.removeListener('accountsChanged', handleAccountsChanged);
        metamaskProvider.removeListener('chainChanged', handleChainChanged);
      };
    }
  }, [metamaskProvider, arbitrumAddress]);

  // Setup Phantom connection check
  useEffect(() => {
    const checkPhantom = async () => {
      try {
        const phantom = window?.phantom?.solana as PhantomProvider | undefined;
        
        if (phantom && 'isPhantom' in phantom) {
          console.log('Phantom provider detected');
          setPhantomProvider(phantom);
        }
      } catch (error) {
        console.error("Phantom provider not found:", error);
      }
    };

    checkPhantom();
  }, []);

  const handleConnectSolana = async () => {
    try {
      if (!phantomProvider) {
        window.open('https://phantom.app/', '_blank');
        return;
      }

      console.log('Connecting to Phantom...');
      const { publicKey } = await phantomProvider.connect();
      console.log('Connected to Phantom:', publicKey.toString());
      setSolanaAddress(publicKey.toString());
    } catch (error) {
      console.error("Error connecting to Solana:", error);
    }
  };

  const switchToArbitrumSepolia = async (provider: EthereumProvider) => {
    try {
      console.log('Switching to Arbitrum Sepolia...');
      await provider.request({
        method: 'wallet_switchEthereumChain',
        params: [{ chainId: ARBITRUM_SEPOLIA_CHAIN_ID }],
      });
      console.log('Successfully switched to Arbitrum Sepolia');
      return true;
    } catch (switchError: unknown) {
      if (typeof switchError === 'object' && switchError && 'code' in switchError && switchError.code === 4902) {
        try {
          console.log('Adding Arbitrum Sepolia network...');
          await provider.request({
            method: 'wallet_addEthereumChain',
            params: [ARBITRUM_SEPOLIA_PARAMS]
          });
          console.log('Successfully added Arbitrum Sepolia');
          return true;
        } catch (addError) {
          console.error("Error adding Arbitrum Sepolia:", addError);
          return false;
        }
      }
      console.error("Error switching to Arbitrum Sepolia:", switchError);
      return false;
    }
  };

  const handleConnectArbitrum = async () => {
    try {
      // Get all Ethereum providers and find MetaMask
      const providers = (window.ethereum?.providers || [window.ethereum]) as EthereumProvider[];
      const metaMaskProvider = providers.find((provider): provider is EthereumProvider => 
        Boolean(provider?.isMetaMask && !provider?.isBraveWallet)
      );
  
      if (!metaMaskProvider) {
        console.log('MetaMask not detected');
        window.open('https://metamask.io/', '_blank');
        return;
      }
  
      console.log('Requesting MetaMask accounts...');
      const accounts = (await metaMaskProvider.request({
        method: 'eth_requestAccounts'
      })) as string[];
  
      console.log('MetaMask accounts:', accounts);
      if (accounts.length > 0) {
        const switched = await switchToArbitrumSepolia(metaMaskProvider);
        if (switched) {
          setArbitrumAddress(accounts[0]);
          console.log('Successfully connected to MetaMask:', accounts[0]);
        }
      }
    } catch (error: unknown) {
      console.error('Failed to connect to MetaMask:', error);
      alert('Failed to connect to MetaMask. Please try again.');
    }
  };

  return (
    <div className="min-h-screen bg-[#FFFFFF] text-[#1C1E1B]">
      <div className="max-w-6xl mx-auto p-8">
        <div className="flex items-center justify-between mb-12">
          <div>
            <h1 className="text-4xl font-bold text-[#1C1E1B]">HYDRA YIELD</h1>
            <p className="text-[#5C7757] mt-2">Cross-chain Autonomous Yield Aggregator</p>
          </div>
          <Badge 
            variant="secondary" 
            className="px-4 py-2 bg-[#F8FAF8] text-[#355130]"
          >
            Ethereum Agentic Hackathon 2025
          </Badge>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
          {/* Solana Card */}
          <Card className="bg-white shadow-sm">
            <CardHeader>
              <CardTitle className="text-2xl text-[#1C1E1B]">Solana Deposit</CardTitle>
              <CardDescription className="text-[#5C7757]">
                Connect Phantom wallet to deposit $HYDRASOL
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div>
                  <p className="text-sm text-[#5C7757] mb-1">Address</p>
                  <p className="font-mono text-sm break-all text-[#1C1E1B]">
                    {solanaAddress || 'Not Connected'}
                  </p>
                </div>
                {!solanaAddress ? (
                  <Button 
                    onClick={handleConnectSolana}
                    className="w-full bg-[#355130] hover:bg-[#5C7757] text-white"
                  >
                    <Wallet className="mr-2 h-4 w-4" />
                    Connect Phantom
                  </Button>
                ) : (
                  <div>
                    <p className="text-sm text-[#5C7757] mb-1">$HYDRASOL Balance</p>
                    <p className="text-2xl font-bold text-[#1C1E1B]">0.00</p>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>

          {/* Arbitrum Card */}
          <Card className="bg-white shadow-sm">
            <CardHeader>
              <CardTitle className="text-2xl text-[#1C1E1B]">Arbitrum Yield</CardTitle>
              <CardDescription className="text-[#5C7757]">
                Connect MetaMask to Arbitrum Sepolia
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div>
                  <p className="text-sm text-[#5C7757] mb-1">Address</p>
                  <p className="font-mono text-sm break-all text-[#1C1E1B]">
                    {arbitrumAddress || 'Not Connected'}
                  </p>
                </div>
                {!arbitrumAddress ? (
                  <Button 
                    onClick={handleConnectArbitrum}
                    className="w-full bg-[#355130] hover:bg-[#5C7757] text-white"
                  >
                    <Wallet className="mr-2 h-4 w-4" />
                    Connect MetaMask
                  </Button>
                ) : (
                  <div>
                    <p className="text-sm text-[#5C7757] mb-1">HYDRAYLD Balance</p>
                    <p className="text-2xl font-bold text-[#1C1E1B]">0.00</p>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Action Section */}
        <Card className="bg-white shadow-sm mb-8">
          <CardHeader>
            <CardTitle className="text-[#1C1E1B]">Bridge Actions</CardTitle>
            <CardDescription className="text-[#5C7757]">
              Deposit and manage your cross-chain yield
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Button
              className="w-full bg-[#355130] hover:bg-[#5C7757] text-white transition-colors"
              size="lg"
              disabled={!solanaAddress || !arbitrumAddress || loading}
              onClick={() => setLoading(true)}
            >
              {loading ? (
                <>
                  <RefreshCw className="mr-2 h-4 w-4 animate-spin" />
                  Processing...
                </>
              ) : (
                <>
                  <ArrowRightLeft className="mr-2 h-4 w-4" />
                  Bridge to Arbitrum
                </>
              )}
            </Button>
          </CardContent>
        </Card>

        {/* Status Section */}
        <Card className="bg-white shadow-sm">
          <CardHeader>
            <CardTitle className="text-[#1C1E1B]">System Status</CardTitle>
            <CardDescription className="text-[#5C7757]">
              Real-time connection and bridge status
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className={`p-4 rounded-lg ${solanaAddress ? 'bg-[#F8FAF8]' : 'bg-gray-50'}`}>
              <div className="text-[#1C1E1B] font-medium mb-1">Phantom Wallet</div>
              <div className="text-[#5C7757]">
                {solanaAddress ? 'Connected to Solana' : 'Not connected'}
              </div>
            </div>
            <div className={`p-4 rounded-lg ${arbitrumAddress ? 'bg-[#F8FAF8]' : 'bg-gray-50'}`}>
              <div className="text-[#1C1E1B] font-medium mb-1">MetaMask</div>
              <div className="text-[#5C7757]">
                {arbitrumAddress ? 'Connected to Arbitrum Sepolia' : 'Not connected'}
              </div>
            </div>
            <div className="p-4 rounded-lg bg-gray-50">
              <div className="text-[#1C1E1B] font-medium mb-1">Bridge Status</div>
              <div className="text-[#5C7757]">
                {loading ? 'Processing transaction...' : 'Ready for deposits'}
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}