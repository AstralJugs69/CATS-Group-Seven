import React, { useState } from 'react';
import { Wallet } from '../../types/cardano';

interface WalletConnectorProps {
  onConnect: (walletName: string) => Promise<void>;
  onDisconnect: () => void;
  wallet: Wallet | null;
  isConnecting: boolean;
}

const WALLETS = [
  { id: 'nami', name: 'Nami Wallet', icon: '🔷' },
  { id: 'eternl', name: 'Eternl Wallet', icon: '🟣' },
  { id: 'flint', name: 'Flint Wallet', icon: '🔥' },
  { id: 'yoroi', name: 'Yoroi Wallet', icon: '🎴' }
];

export default function WalletConnector({ onConnect, onDisconnect, wallet, isConnecting }: WalletConnectorProps) {
  const [showModal, setShowModal] = useState(false);

  const handleWalletSelect = async (walletId: string) => {
    try {
      await onConnect(walletId);
      setShowModal(false);
    } catch (error) {
      console.error('Failed to connect wallet:', error);
    }
  };

  if (wallet) {
    return (
      <div className="bg-green-50 border border-green-200 rounded-lg p-4">
        <div className="flex items-center justify-between">
          <div>
            <p className="font-semibold text-green-800">{wallet.name}</p>
            <p className="text-green-600 text-sm">
              {wallet.address.slice(0, 12)}...{wallet.address.slice(-8)}
            </p>
          </div>
          <button
            onClick={onDisconnect}
            className="bg-red-100 text-red-700 px-3 py-1 rounded text-sm hover:bg-red-200 transition"
          >
            Disconnect
          </button>
        </div>
      </div>
    );
  }

  return (
    <div>
      <button
        onClick={() => setShowModal(true)}
        disabled={isConnecting}
        className="w-full bg-ethio-green text-white py-3 px-4 rounded-lg font-semibold hover:bg-green-700 transition disabled:opacity-50 disabled:cursor-not-allowed"
      >
        {isConnecting ? 'Connecting...' : 'Connect Cardano Wallet'}
      </button>

      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-xl shadow-2xl max-w-md w-full p-6">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-xl font-bold text-gray-800">Connect Wallet</h2>
              <button
                onClick={() => setShowModal(false)}
                className="text-gray-400 hover:text-gray-600"
              >
                ✕
              </button>
            </div>

            <div className="space-y-3">
              {WALLETS.map((wallet) => (
                <button
                  key={wallet.id}
                  onClick={() => handleWalletSelect(wallet.id)}
                  disabled={isConnecting}
                  className="w-full flex items-center space-x-4 p-4 border border-gray-200 rounded-lg hover:border-ethio-green hover:bg-green-50 transition disabled:opacity-50"
                >
                  <span className="text-2xl">{wallet.icon}</span>
                  <span className="font-medium text-gray-800">{wallet.name}</span>
                </button>
              ))}
            </div>

            <p className="text-sm text-gray-500 mt-4 text-center">
              Select your Cardano wallet to connect
            </p>
          </div>
        </div>
      )}
    </div>
  );
}