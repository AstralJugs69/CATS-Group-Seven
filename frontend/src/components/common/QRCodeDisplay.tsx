import React, { useState } from 'react';
import { QRCodeSVG } from 'qrcode.react';
import { Button } from '../ui/Button';

interface QRCodeDisplayProps {
  data: string;
  title?: string;
  size?: number;
  showCopy?: boolean;
  downloadable?: boolean;
}

export default function QRCodeDisplay({
  data,
  title = 'Scan QR Code',
  size = 200,
  showCopy = true,
  downloadable = true
}: QRCodeDisplayProps) {
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

  const downloadQRCode = () => {
    const svg = document.getElementById('qr-code-svg');
    if (!svg) return;

    const svgData = new XMLSerializer().serializeToString(svg);
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');
    const img = new Image();

    img.onload = () => {
      canvas.width = size + 40; // Add padding
      canvas.height = size + 40;
      if (ctx) {
        ctx.fillStyle = 'white';
        ctx.fillRect(0, 0, canvas.width, canvas.height);
        ctx.drawImage(img, 20, 20);

        const link = document.createElement('a');
        link.download = `qr-code-${data.substring(0, 10)}.png`;
        link.href = canvas.toDataURL('image/png');
        link.click();
      }
    };

    img.src = 'data:image/svg+xml;base64,' + btoa(unescape(encodeURIComponent(svgData)));
  };

  return (
    <div className="bg-white rounded-lg shadow-md p-6 max-w-sm mx-auto">
      <h3 className="text-lg font-semibold text-gray-800 mb-4 text-center">{title}</h3>

      <div className="flex justify-center mb-4 p-4 bg-white border rounded-lg">
        <QRCodeSVG
          id="qr-code-svg"
          value={data}
          size={size}
          level="M"
          includeMargin={true}
        />
      </div>

      <div className="space-y-2">
        {downloadable && (
          <Button
            onClick={downloadQRCode}
            variant="outline"
            className="w-full"
          >
            📥 Download QR Code
          </Button>
        )}

        {showCopy && (
          <Button
            onClick={copyToClipboard}
            variant="outline"
            className="w-full"
          >
            {isCopied ? '✓ Copied!' : '📋 Copy ID'}
          </Button>
        )}
      </div>

      <p className="text-xs text-gray-500 mt-3 text-center break-all">
        ID: {data.length > 30 ? data.substring(0, 30) + '...' : data}
      </p>
    </div>
  );
}