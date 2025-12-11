export interface Wallet {
  address: string;
  name: string;
  isConnected: boolean;
}

export interface Transaction {
  hash: string;
  metadata: any;
  status: 'pending' | 'success' | 'failed';
}