import React from 'react';
import { Farmer } from '../../types/supplychain';

interface FarmerStoryProps {
  farmer: Farmer;
}

export default function FarmerStory({ farmer }: FarmerStoryProps) {
  return (
    <div>
      <h3 className="text-xl font-semibold text-gray-800 mb-6">Meet Your Farmer</h3>

      <div className="bg-green-50 rounded-lg p-6 mb-6">
        <div className="flex items-start space-x-4">
          <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center flex-shrink-0">
            <span className="text-2xl">👨‍🌾</span>
          </div>
          <div>
            <h4 className="text-lg font-semibold text-gray-800">{farmer.name}</h4>
            <p className="text-green-600 mb-2">📍 {farmer.region}</p>
            <p className="text-gray-700">
              Third-generation coffee farmer continuing family traditions of sustainable agriculture
              in the highlands of Ethiopia. Committed to quality and ethical farming practices.
            </p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Farm Details */}
        <div className="bg-white border border-gray-200 rounded-lg p-4">
          <h5 className="font-semibold text-gray-800 mb-3">Farm Information</h5>
          <div className="space-y-2 text-sm">
            <div className="flex justify-between">
              <span className="text-gray-600">Region:</span>
              <span className="font-medium">{farmer.region}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">Elevation:</span>
              <span className="font-medium">{farmer.elevation}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">GPS Location:</span>
              <span className="font-medium">{farmer.gps}</span>
            </div>
          </div>
        </div>

        {/* Sustainability */}
        <div className="bg-white border border-gray-200 rounded-lg p-4">
          <h5 className="font-semibold text-gray-800 mb-3">Sustainable Practices</h5>
          <div className="space-y-2">
            {[
              'Organic farming methods',
              'Shade-grown coffee',
              'Water conservation',
              'Soil preservation'
            ].map((practice, index) => (
              <div key={index} className="flex items-center text-sm">
                <span className="text-green-500 mr-2">✓</span>
                <span className="text-gray-700">{practice}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Impact Story */}
      <div className="mt-6 bg-blue-50 border border-blue-200 rounded-lg p-4">
        <h5 className="font-semibold text-blue-800 mb-2">Direct Impact</h5>
        <p className="text-blue-700 text-sm">
          By purchasing this product, you're directly supporting {farmer.name}'s family and
          contributing to sustainable agricultural practices in Ethiopia. Your choice helps
          preserve traditional farming methods while ensuring fair compensation.
        </p>
      </div>
    </div>
  );
}