import React, { useState } from 'react';
import { Farmer } from '../../types/supplychain';
import { useWallet } from '../../hooks/useWallet';
import WalletConnector from '../common/WalletConnector';
import LoadingSpinner from '../common/LoadingSpinner';

interface TipFarmerProps {
  farmer: Farmer;
}

export default function TipFarmer({ farmer }: TipFarmerProps) {
  const { wallet, connectWallet, disconnectWallet, isConnecting, sendTip } = useWallet();
  const [tipAmount, setTipAmount] = useState(5);
  const [isSending, setIsSending] = useState(false);
  const [tipSent, setTipSent] = useState(false);

  const handleSendTip = async () => {
    if (!wallet) return;

    setIsSending(true);
    try {
      await sendTip(tipAmount, farmer.walletAddress);
      setTipSent(true);
    } catch (error) {
      console.error('Failed to send tip:', error);
    } finally {
      setIsSending(false);
    }
  };

  const presetAmounts = [2, 5, 10, 20, 50];

  const handleConnect = async (walletName: string): Promise<void> => {
    await connectWallet(walletName);
  };

  return (
    <div>
      <h3 className="text-xl font-semibold text-gray-800 mb-6">Support Your Farmer</h3>

      <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-6 mb-6">
        <div className="flex items-start space-x-3">
          <span className="text-2xl">💝</span>
          <div>
            <h4 className="font-semibold text-yellow-800 mb-2">Direct Farmer Support</h4>
            <p className="text-yellow-700">
              Send a direct tip to {farmer.name} using Cardano blockchain. 100% of your tip goes
              directly to the farmer's wallet, supporting their family and sustainable farming practices.
            </p>
          </div>
        </div>
      </div>

      {/* Wallet Connection */}
      <div className="mb-6">
        <h4 className="font-semibold text-gray-800 mb-3">1. Connect Your Wallet</h4>
        <WalletConnector
          onConnect={handleConnect}
          onDisconnect={disconnectWallet}
          wallet={wallet}
          isConnecting={isConnecting}
        />
      </div>

      {wallet && !tipSent && (
        <div className="space-y-6">
          {/* Tip Amount Selection */}
          <div>
            <h4 className="font-semibold text-gray-800 mb-3">2. Choose Tip Amount</h4>
            <div className="grid grid-cols-5 gap-2 mb-4">
              {presetAmounts.map((amount) => (
                <button
                  key={amount}
                  onClick={() => setTipAmount(amount)}
                  className={`p-3 border-2 rounded-lg text-center transition ${tipAmount === amount
                    ? 'border-yellow-500 bg-yellow-50 text-yellow-700'
                    : 'border-gray-200 hover:border-gray-300'
                    }`}
                >
                  <div className="font-semibold">{amount} ADA</div>
                </button>
              ))}
            </div>

            <div className="flex items-center space-x-2">
              <span className="text-gray-600">Or custom amount:</span>
              <input
                type="number"
                min="1"
                value={tipAmount}
                onChange={(e) => setTipAmount(parseInt(e.target.value) || 1)}
                className="w-20 p-2 border border-gray-300 rounded focus:ring-2 focus:ring-yellow-500 focus:border-yellow-500"
              />
              <span className="text-gray-600">ADA</span>
            </div>
          </div>

          {/* Farmer Receipt */}
          <div className="bg-green-50 border border-green-200 rounded-lg p-4">
            <h5 className="font-semibold text-green-800 mb-2">Transaction Details</h5>
            <div className="space-y-1 text-sm">
              <div className="flex justify-between">
                <span className="text-green-700">To:</span>
                <span className="font-medium">{farmer.name}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-green-700">Amount:</span>
                <span className="font-medium">{tipAmount} ADA</span>
              </div>
              <div className="flex justify-between">
                <span className="text-green-700">Network:</span>
                <span className="font-medium">Cardano</span>
              </div>
            </div>
          </div>

          {/* Send Button */}
          <button
            onClick={handleSendTip}
            disabled={isSending}
            className="w-full bg-yellow-500 hover:bg-yellow-600 text-white font-semibold py-3 px-4 rounded-lg transition disabled:opacity-50 flex items-center justify-center"
          >
            {isSending ? (
              <>
                <LoadingSpinner size="sm" />
                <span className="ml-2">Sending Tip...</span>
              </>
            ) : (
              `Send ${tipAmount} ADA to ${farmer.name}`
            )}
          </button>
        </div>
      )}

      {tipSent && (
        <div className="bg-green-50 border border-green-200 rounded-lg p-6 text-center">
          <div className="text-4xl mb-4">🎉</div>
          <h4 className="text-xl font-semibold text-green-800 mb-2">Tip Sent Successfully!</h4>
          <p className="text-green-700 mb-4">
            Your tip of {tipAmount} ADA has been sent directly to {farmer.name}.
            Thank you for supporting sustainable farming!
          </p>
          <div className="bg-white rounded-lg p-3 inline-block">
            <p className="text-sm text-gray-600 font-mono">
              Transaction: tx_{Math.random().toString(36).substr(2, 16)}
            </p>
          </div>
        </div>
      )}

      {/* Educational Info */}
      <div className="mt-6 bg-gray-50 rounded-lg p-4">
        <h5 className="font-semibold text-gray-800 mb-2">Why Tip Directly?</h5>
        <ul className="text-sm text-gray-600 space-y-1">
          <li>• 100% goes to the farmer (no middlemen)</li>
          <li>• Supports sustainable farming practices</li>
          <li>• Encourages quality over quantity</li>
          <li>• Builds direct farmer-consumer relationships</li>
        </ul>
      </div>
    </div>
  );
}