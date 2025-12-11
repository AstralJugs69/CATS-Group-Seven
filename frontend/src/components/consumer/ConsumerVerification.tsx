import React, { useState } from 'react';
import ProductJourney from './ProductJourney';
import DashboardLayout from '../layout/DashboardLayout';

export default function ConsumerVerification() {
  const [scannedProduct, setScannedProduct] = useState<string | null>(null);
  const [manualId, setManualId] = useState('');

  const handleManualSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (manualId.trim()) {
      setScannedProduct(manualId);
    }
  };

  return (
    <DashboardLayout role="consumer" title="Product Verification" subtitle="Scan QR code to verify product origin and journey">
      <div className="max-w-4xl mx-auto">
        {!scannedProduct ? (
          <div className="bg-white rounded-xl shadow-lg p-8 text-center">
            <div className="w-32 h-32 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-6">
              <span className="text-5xl">📱</span>
            </div>
            <h2 className="text-2xl font-bold text-gray-800 mb-4">Scan Product QR Code</h2>
            <p className="text-gray-600 mb-8 max-w-md mx-auto">
              Point your camera at the QR code on the product packaging to verify its origin and journey from farm to market.
            </p>

            {/* Scanner Simulation */}
            <div className="bg-gray-900 rounded-lg p-8 mb-6 max-w-sm mx-auto">
              <div className="bg-black rounded-lg p-4">
                <div className="aspect-square bg-gradient-to-br from-purple-500 to-pink-600 rounded flex items-center justify-center">
                  <div className="text-center text-white">
                    <div className="text-4xl mb-2">📷</div>
                    <p className="text-sm opacity-75">QR Scanner View</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Manual Input */}
            <div className="max-w-md mx-auto mt-6">
              <form onSubmit={handleManualSubmit} className="flex space-x-2">
                <input
                  type="text"
                  value={manualId}
                  onChange={(e) => setManualId(e.target.value)}
                  placeholder="Enter Batch ID (e.g. BATCH-2023...)"
                  className="flex-1 p-3 border border-stone-200 rounded-lg outline-none focus:ring-2 focus:ring-purple-500"
                />
                <button
                  type="submit"
                  disabled={!manualId.trim()}
                  className="bg-purple-600 hover:bg-purple-700 text-white font-semibold py-3 px-6 rounded-lg transition duration-200 disabled:opacity-50"
                >
                  Verify
                </button>
              </form>
            </div>
          </div>
        ) : (
          <ProductJourney
            productId={scannedProduct}
            onScanAnother={() => setScannedProduct(null)}
          />
        )}
      </div>
    </DashboardLayout>
  );
}
