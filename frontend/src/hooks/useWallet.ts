import { useState } from 'react';
import { Wallet } from '../types/cardano';

export function useWallet() {
  const [wallet, setWallet] = useState<Wallet | null>(null);
  const [isConnecting, setIsConnecting] = useState(false);

  const connectWallet = async (walletName: string) => {
    setIsConnecting(true);
    try {
      const cardano = (window as any).cardano;
      if (!cardano) {
        throw new Error('Cardano wallet extension not found');
      }

      const walletProvider = cardano[walletName.toLowerCase()];
      if (!walletProvider) {
        throw new Error(`Wallet provider ${walletName} not found`);
      }

      const api = await walletProvider.enable();
      
      // Get raw address (hex)
      const addresses = await api.getUsedAddresses();
      const rawAddress = addresses[0] || await api.getChangeAddress();

      const realWallet: Wallet = {
        address: rawAddress, // Note: This is Hex encoded. Use CSL to convert to bech32 if needed.
        name: walletName,
        isConnected: true
      };
      
      setWallet(realWallet);
      return realWallet;
    } catch (error) {
      console.error('Failed to connect wallet:', error);
      throw error;
    } finally {
      setIsConnecting(false);
    }
  };

  const disconnectWallet = () => {
    setWallet(null);
  };

  const sendTip = async (amount: number, toAddress: string) => {
    // Simulate sending tip
    await new Promise(resolve => setTimeout(resolve, 3000));
    console.log(`Sent ${amount} ADA to ${toAddress}`);
    return { success: true, txHash: `tx_${Math.random().toString(36).substr(2, 16)}` };
  };

  return {
    wallet,
    isConnecting,
    connectWallet,
    disconnectWallet,
    sendTip
  };
}
