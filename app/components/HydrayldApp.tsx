"use client"

import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";
import { RefreshCw, Wallet, ArrowRightLeft } from "lucide-react";

export default function HydrayldApp() {
  const [loading, setLoading] = useState(false);
  const [solanaAddress, setSolanaAddress] = useState('');
  const [ethAddress, setEthAddress] = useState('');

  const handleConnectSolana = () => {
    setSolanaAddress('SimulatedSolanaAddress123...');
  };

  const handleConnectEth = () => {
    setEthAddress('0xSimulatedEthAddress123...');
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
                Deposit your $HYDRASOL tokens
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
                    Connect Solana
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

          {/* Ethereum Card */}
          <Card className="bg-white shadow-sm">
            <CardHeader>
              <CardTitle className="text-2xl text-[#1C1E1B]">Ethereum Yield</CardTitle>
              <CardDescription className="text-[#5C7757]">
                Monitor your yield performance
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div>
                  <p className="text-sm text-[#5C7757] mb-1">Address</p>
                  <p className="font-mono text-sm break-all text-[#1C1E1B]">
                    {ethAddress || 'Not Connected'}
                  </p>
                </div>
                {!ethAddress ? (
                  <Button 
                    onClick={handleConnectEth}
                    className="w-full bg-[#355130] hover:bg-[#5C7757] text-white"
                  >
                    <Wallet className="mr-2 h-4 w-4" />
                    Connect Ethereum
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
              disabled={!solanaAddress || !ethAddress || loading}
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
                  Deposit $HYDRASOL
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
              <div className="text-[#1C1E1B] font-medium mb-1">Solana Connection</div>
              <div className="text-[#5C7757]">
                {solanaAddress ? 'Connected and ready' : 'Not connected'}
              </div>
            </div>
            <div className={`p-4 rounded-lg ${ethAddress ? 'bg-[#F8FAF8]' : 'bg-gray-50'}`}>
              <div className="text-[#1C1E1B] font-medium mb-1">Ethereum Connection</div>
              <div className="text-[#5C7757]">
                {ethAddress ? 'Connected and ready' : 'Not connected'}
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