import React, { useState } from 'react';

interface QRCodeDisplayProps {
  data: string;
  title?: string;
  size?: number;
}

export default function QRCodeDisplay({ data, title = 'Scan QR Code', size = 200 }: QRCodeDisplayProps) {
  const [isCopied, setIsCopied] = useState(false);

  const copyToClipboard = async () => {
    try {
      await navigator.clipboard.writeText(data);
      setIsCopied(true);
      setTimeout(() => setIsCopied(false), 2000);
    } catch (err) {
      console.error('Failed to copy text: ', err);
    }
  };

  // Simple QR code simulation - in real app, use a QR code library
  const renderQRCode = () => (
    <div className="bg-white p-4 border-2 border-dashed border-gray-300 rounded-lg">
      <div className="text-center font-mono text-xs break-all p-2 bg-gray-50 rounded">
        {data}
      </div>
      <div className="text-center mt-2 text-gray-500 text-sm">
        QR Code Placeholder
      </div>
    </div>
  );

  return (
    <div className="bg-white rounded-lg shadow-md p-6 max-w-sm">
      <h3 className="text-lg font-semibold text-gray-800 mb-4">{title}</h3>

      <div className="flex justify-center mb-4">
        {renderQRCode()}
      </div>

      <div className="text-center">
        <button
          onClick={copyToClipboard}
          className="bg-ethio-green text-white px-4 py-2 rounded-lg hover:bg-green-700 transition flex items-center justify-center space-x-2 w-full"
        >
          <span>{isCopied ? 'Copied!' : 'Copy Batch ID'}</span>
          {isCopied && <span>✓</span>}
        </button>

        <p className="text-xs text-gray-500 mt-2 break-all">
          Batch ID: {data}
        </p>
      </div>
    </div>
  );
}