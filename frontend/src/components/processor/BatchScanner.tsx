import React, { useState } from 'react';
import { getBatchById } from '../../services/api';
import { Batch } from '../../types/supplychain';
import LoadingSpinner from '../common/LoadingSpinner';

interface BatchScannerProps {
  onBatchScanned: (batchId: string) => void;
  onContinue: () => void;
}

export default function BatchScanner({ onBatchScanned, onContinue }: BatchScannerProps) {
  const [isScanning, setIsScanning] = useState(false);
  const [scannedBatch, setScannedBatch] = useState<Batch | null>(null);
  const [manualBatchId, setManualBatchId] = useState('');
  const [error, setError] = useState<string | null>(null);

  const handleScan = async () => {
    setIsScanning(true);
    setError(null);
    try {
      // Simulate QR code scanning delay
      await new Promise(resolve => setTimeout(resolve, 2000));

      // Use manual ID
      const batchId = manualBatchId;
      if (!batchId) {
        // If simulating a scan without manual input, we can't really guess a valid ID from the DB
        // So we just return early or throw an error for this demo
        throw new Error('No batch ID provided');
      }

      const batch = await getBatchById(batchId);

      if (batch) {
        setScannedBatch(batch);
        onBatchScanned(batchId);
      } else {
        setError('Batch not found in the database.');
        setScannedBatch(null);
      }
    } catch (error: any) {
      console.error('Scan failed:', error);
      setError('Batch lookup failed. Please check the ID.');
    } finally {
      setIsScanning(false);
    }
  };

  const handleManualSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (manualBatchId.trim()) {
      handleScan();
    }
  };

  return (
    <div className="max-w-2xl mx-auto">
      <div className="bg-white rounded-xl shadow-lg p-6">
        <div className="text-center mb-8">
          <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <span className="text-2xl">📷</span>
          </div>
          <h2 className="text-2xl font-bold text-gray-800">Scan Batch QR Code</h2>
          <p className="text-gray-600">Scan the QR code on the harvest batch to begin processing</p>
        </div>

        {/* Scanner Simulation */}
        {error && (
          <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg mb-6 text-sm">
            {error}
          </div>
        )}

        <div className="bg-gray-900 rounded-lg p-8 mb-6">
          <div className="bg-black rounded-lg p-4 mx-auto max-w-xs">
            <div className="aspect-square bg-gradient-to-br from-blue-500 to-purple-600 rounded relative overflow-hidden">
              {/* Scanner Animation */}
              <div className="absolute inset-0 flex items-center justify-center">
                {isScanning ? (
                  <div className="text-center">
                    <LoadingSpinner size="md" text="Scanning..." />
                  </div>
                ) : scannedBatch ? (
                  <div className="text-center text-white p-4">
                    <div className="text-3xl mb-2">✅</div>
                    <div className="font-mono text-sm bg-black bg-opacity-50 p-2 rounded">
                      {scannedBatch.id}
                    </div>
                    <p className="text-green-400 text-sm mt-2">Batch Found!</p>
                  </div>
                ) : (
                  <div className="text-center text-white p-4">
                    <div className="text-3xl mb-2">📷</div>
                    <p className="text-sm opacity-75">QR Scanner Ready</p>
                  </div>
                )}
              </div>

              {/* Scanner line animation */}
              {isScanning && (
                <div className="absolute top-0 left-0 right-0 h-1 bg-green-400 animate-pulse"></div>
              )}
            </div>
          </div>
        </div>

        {/* Manual Input */}
        <div className="bg-gray-50 rounded-lg p-4 mb-6">
          <h3 className="font-semibold text-gray-800 mb-3">Or Enter Batch ID Manually</h3>
          <form onSubmit={handleManualSubmit} className="flex space-x-2">
            <input
              type="text"
              value={manualBatchId}
              onChange={(e) => setManualBatchId(e.target.value)}
              placeholder="Enter batch ID (e.g., ETH-COFFEE-001)"
              className="flex-1 p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            />
            <button
              type="submit"
              disabled={isScanning || !manualBatchId.trim()}
              className="bg-blue-600 text-white px-4 py-3 rounded-lg font-semibold hover:bg-blue-700 transition disabled:opacity-50"
            >
              {isScanning ? 'Scanning...' : 'Lookup'}
            </button>
          </form>
        </div>

        {/* Batch Info */}
        {scannedBatch && (
          <div className="bg-green-50 border border-green-200 rounded-lg p-4 mb-6">
            <h3 className="font-semibold text-green-800 mb-2">Batch Information</h3>
            <div className="grid grid-cols-2 gap-2 text-sm text-green-700">
              <div><span className="font-medium">ID:</span> {scannedBatch.id}</div>
              <div><span className="font-medium">Crop:</span> {scannedBatch.cropType}</div>
              <div><span className="font-medium">Weight:</span> {scannedBatch.initialWeight}kg</div>
              <div><span className="font-medium">Farmer:</span> {scannedBatch.farmer.name}</div>
              <div className="col-span-2">
                <span className="font-medium">Location:</span> {scannedBatch.location}
              </div>
            </div>
          </div>
        )}

        {/* Action Buttons */}
        <div className="flex space-x-4">
          {scannedBatch && (
            <button
              onClick={onContinue}
              className="w-full bg-green-600 hover:bg-green-700 text-white font-semibold py-3 px-4 rounded-lg transition"
            >
              Continue to Update
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
