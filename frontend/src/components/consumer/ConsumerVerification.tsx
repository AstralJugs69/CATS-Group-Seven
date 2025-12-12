import React, { useState } from 'react';
import ProductJourney from './ProductJourney';
import DashboardLayout from '../layout/DashboardLayout';
import QRScanner from '../common/QRScanner';
import { Card, CardContent } from '../ui/Card';
import { Button } from '../ui/Button';

export default function ConsumerVerification() {
  const [scannedData, setScannedData] = useState<string | null>(null);
  const [manualId, setManualId] = useState('');
  const [inputMode, setInputMode] = useState<'scan' | 'manual'>('scan');

  const handleScanSuccess = (decodedText: string) => {
    // The QR code contains the token unit or batch ID
    setScannedData(decodedText);
  };

  const handleManualSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (manualId.trim()) {
      setScannedData(manualId.trim());
    }
  };

  const handleScanAnother = () => {
    setScannedData(null);
    setManualId('');
  };

  // Parse the scanned data - could be token unit or batch ID
  const getProductId = () => {
    if (!scannedData) return null;

    // If it looks like a batch UUID, use it directly
    if (scannedData.includes('-') && scannedData.length === 36) {
      return scannedData;
    }

    // Otherwise, it's likely a token unit - we'll look up by that
    // For now, we'll pass it as-is and ProductJourney will handle it
    return scannedData;
  };

  return (
    <DashboardLayout role="consumer" title="Product Verification" subtitle="Scan QR code to verify product origin and journey">
      <div className="max-w-4xl mx-auto">
        {!scannedData ? (
          <Card>
            <CardContent className="p-8">
              <div className="text-center mb-8">
                <div className="w-24 h-24 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <span className="text-4xl">📱</span>
                </div>
                <h2 className="text-2xl font-bold text-gray-800 mb-2">Verify Your Coffee</h2>
                <p className="text-gray-600 max-w-md mx-auto">
                  Scan the QR code on your coffee package to see its complete journey from farm to cup.
                </p>
              </div>

              {/* Mode Toggle */}
              <div className="flex justify-center mb-6">
                <div className="bg-gray-100 rounded-lg p-1 flex">
                  <button
                    onClick={() => setInputMode('scan')}
                    className={`px-4 py-2 rounded-md text-sm font-medium transition ${inputMode === 'scan'
                        ? 'bg-white shadow text-purple-700'
                        : 'text-gray-600 hover:text-gray-800'
                      }`}
                  >
                    📷 Scan QR
                  </button>
                  <button
                    onClick={() => setInputMode('manual')}
                    className={`px-4 py-2 rounded-md text-sm font-medium transition ${inputMode === 'manual'
                        ? 'bg-white shadow text-purple-700'
                        : 'text-gray-600 hover:text-gray-800'
                      }`}
                  >
                    ⌨️ Enter ID
                  </button>
                </div>
              </div>

              {/* Scanner or Manual Input */}
              {inputMode === 'scan' ? (
                <QRScanner onScanSuccess={handleScanSuccess} />
              ) : (
                <div className="max-w-md mx-auto">
                  <form onSubmit={handleManualSubmit} className="flex flex-col space-y-3">
                    <input
                      type="text"
                      value={manualId}
                      onChange={(e) => setManualId(e.target.value)}
                      placeholder="Enter Batch ID or Token Unit"
                      className="p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500 outline-none"
                    />
                    <Button
                      type="submit"
                      disabled={!manualId.trim()}
                      size="lg"
                    >
                      Verify Product
                    </Button>
                  </form>
                  <p className="text-xs text-gray-500 text-center mt-3">
                    Enter the batch ID (e.g., BATCH-2023...) or the token unit from the product label
                  </p>
                </div>
              )}
            </CardContent>
          </Card>
        ) : (
          <ProductJourney
            productId={getProductId()!}
            onScanAnother={handleScanAnother}
          />
        )}
      </div>
    </DashboardLayout>
  );
}
