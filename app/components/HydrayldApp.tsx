"use client"

import { useState } from 'react';

export default function HydrayldApp() {
  const [loading, setLoading] = useState(false);
  const [solanaAddress, setSolanaAddress] = useState('');
  const [ethAddress, setEthAddress] = useState('');

  // Simulated connect functions - these would be replaced with actual wallet connection logic
  const handleConnectSolana = () => {
    setSolanaAddress('SimulatedSolanaAddress123...');
  };

  const handleConnectEth = () => {
    setEthAddress('0xSimulatedEthAddress123...');
  };

  return (
    <div className="min-h-screen bg-gray-900 text-white">
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-4xl font-bold mb-8">HYDRAYLD</h1>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* Solana Section */}
          <div className="p-6 rounded-lg bg-gray-800">
            <h2 className="text-2xl font-semibold mb-4">Solana Deposit</h2>
            <div className="mb-4">
              <p className="text-gray-400">Address:</p>
              <p className="font-mono break-all">
                {solanaAddress ? solanaAddress : 'Not Connected'}
              </p>
              {!solanaAddress && (
                <button 
                  onClick={handleConnectSolana}
                  className="mt-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 rounded-lg"
                >
                  Connect Solana
                </button>
              )}
            </div>
            {solanaAddress && (
              <div className="mb-4">
                <p className="text-gray-400">$HYDRASOL Balance:</p>
                <p className="text-xl font-bold">0.00</p>
              </div>
            )}
          </div>

          {/* Ethereum Section */}
          <div className="p-6 rounded-lg bg-gray-800">
            <h2 className="text-2xl font-semibold mb-4">Ethereum Yield</h2>
            <div className="mb-4">
              <p className="text-gray-400">Address:</p>
              <p className="font-mono break-all">
                {ethAddress ? ethAddress : 'Not Connected'}
              </p>
              {!ethAddress && (
                <button 
                  onClick={handleConnectEth}
                  className="mt-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 rounded-lg"
                >
                  Connect Ethereum
                </button>
              )}
            </div>
            {ethAddress && (
              <div className="mb-4">
                <p className="text-gray-400">HYDRAYLD Balance:</p>
                <p className="text-xl font-bold">0.00</p>
              </div>
            )}
          </div>
        </div>

        {/* Action Section */}
        <div className="mt-8">
          <button
            className="px-6 py-3 bg-blue-600 hover:bg-blue-700 rounded-lg font-semibold disabled:opacity-50"
            disabled={!solanaAddress || !ethAddress || loading}
            onClick={() => setLoading(true)}
          >
            {loading ? 'Processing...' : 'Deposit $HYDRASOL'}
          </button>
        </div>

        {/* Status Section */}
        <div className="mt-4">
          <h3 className="text-xl font-semibold mb-2">Status</h3>
          <div className="space-y-2">
            <p className="text-gray-400">
              • Solana Connection: {solanaAddress ? 'Connected' : 'Not Connected'}
            </p>
            <p className="text-gray-400">
              • Ethereum Connection: {ethAddress ? 'Connected' : 'Not Connected'}
            </p>
            <p className="text-gray-400">
              • Bridge Status: {loading ? 'Processing' : 'Ready'}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}