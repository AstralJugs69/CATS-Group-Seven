import React from 'react';

export default function Footer() {
  return (
    <footer className="bg-gray-800 text-white">
      <div className="max-w-7xl mx-auto py-8 px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div className="col-span-1 md:col-span-2">
            <div className="flex items-center mb-4">
              <div className="w-6 h-6 bg-gradient-to-r from-ethio-green via-ethio-yellow to-ethio-red rounded-full mr-2"></div>
              <span className="text-xl font-bold">Ethio-Origin</span>
            </div>
            <p className="text-gray-300 mb-4">
              Farm-to-Market Traceability on Cardano Blockchain.
              Empowering Ethiopian farmers with transparent supply chains.
            </p>
            <div className="flex space-x-4">
              <span className="bg-ethio-green px-3 py-1 rounded-full text-sm">Cardano</span>
              <span className="bg-ethio-yellow text-gray-800 px-3 py-1 rounded-full text-sm">Blockchain</span>
              <span className="bg-ethio-red px-3 py-1 rounded-full text-sm">Traceability</span>
            </div>
          </div>

          <div>
            <h3 className="font-semibold mb-4">Roles</h3>
            <ul className="space-y-2 text-gray-300">
              <li>👨‍🌾 Farmers</li>
              <li>🏭 Processors</li>
              <li>🛒 Consumers</li>
              <li>🚚 Exporters</li>
            </ul>
          </div>

          <div>
            <h3 className="font-semibold mb-4">Products</h3>
            <ul className="space-y-2 text-gray-300">
              <li>☕ Coffee</li>
              <li>🍃 Tea</li>
              <li>🌺 Flowers</li>
            </ul>
          </div>
        </div>

        <div className="border-t border-gray-700 mt-8 pt-6 text-center text-gray-400">
          <p>&copy; 2025 Ethio-Origin. Built on Cardano for Ethiopian Agriculture.</p>
        </div>
      </div>
    </footer>
  );
}