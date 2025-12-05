import React from 'react';
import { Wallet } from '../../types/cardano';

interface NavbarProps {
  wallet: Wallet | null;
  onConnectWallet: () => void;
  onDisconnectWallet: () => void;
  currentView: string;
}

export default function Navbar({ wallet, onConnectWallet, onDisconnectWallet, currentView }: NavbarProps) {
  return (
    <nav className="bg-white shadow-lg border-b border-gray-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <div className="flex items-center">
            <div className="flex-shrink-0 flex items-center">
              <div className="w-8 h-8 bg-gradient-to-r from-ethio-green via-ethio-yellow to-ethio-red rounded-full mr-3"></div>
              <span className="text-xl font-bold text-gray-900">Ethio-Origin</span>
            </div>
          </div>

          {/* Current View */}
          <div className="hidden md:block">
            <span className="text-sm font-medium text-gray-500 capitalize">
              {currentView.replace('-', ' ')}
            </span>
          </div>

          {/* Wallet Connection */}
          <div className="flex items-center">
            {wallet ? (
              <div className="flex items-center space-x-3">
                <div className="text-sm text-gray-700">
                  <div className="font-medium">{wallet.name}</div>
                  <div className="text-gray-500 text-xs">
                    {wallet.address.slice(0, 8)}...{wallet.address.slice(-8)}
                  </div>
                </div>
                <button
                  onClick={onDisconnectWallet}
                  className="bg-red-100 text-red-700 px-3 py-1 rounded-full text-sm font-medium hover:bg-red-200 transition"
                >
                  Disconnect
                </button>
              </div>
            ) : (
              <button
                onClick={onConnectWallet}
                className="bg-ethio-green text-white px-4 py-2 rounded-lg font-medium hover:bg-green-800 transition"
              >
                Connect Wallet
              </button>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
}