import React, { useState, useEffect } from 'react';
import { Batch } from '../../types/supplychain';
import { getBatchById } from '../../services/api';
import { formatDate } from '../../utils/formatters';
import FarmerStory from './FarmerStory';
import TipFarmer from './TipFarmer';
import LoadingSpinner from '../common/LoadingSpinner';
import { Card, CardContent } from '../ui/Card';
import { Button } from '../ui/Button';
import { cn } from '../../utils/cn';
import ProductJourneyTimeline from './ProductJourneyTimeline';

interface ProductJourneyProps {
  productId: string;
  onScanAnother: () => void;
}

export default function ProductJourney({ productId, onScanAnother }: ProductJourneyProps) {
  const [batch, setBatch] = useState<Batch | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<'journey' | 'farmer' | 'tip'>('journey');

  useEffect(() => {
    loadBatchData();
  }, [productId]);

  const loadBatchData = async () => {
    setIsLoading(true);
    try {
      const batchData = await getBatchById(productId);
      setBatch(batchData ?? null);
    } catch (error) {
      console.error('Failed to load batch:', error);
    } finally {
      setIsLoading(false);
    }
  };

  if (isLoading) {
    return (
      <div className="bg-white rounded-xl shadow-lg p-8 flex items-center justify-center">
        <LoadingSpinner size="lg" text="Loading product journey..." />
      </div>
    );
  }

  if (!batch) {
    return (
      <Card className="p-8 text-center">
        <div className="text-red-500 text-4xl mb-4">❌</div>
        <h3 className="text-xl font-semibold text-stone-700 mb-2">Product Not Found</h3>
        <p className="text-stone-500 mb-6">
          We couldn't find information for this product. It may not be registered in our system.
        </p>
        <Button onClick={onScanAnother}>
          Scan Another Product
        </Button>
      </Card>
    );
  }

  // Extract metadata for display
  const metadata = batch.cip25Metadata?.["721"]?.[batch.policyId || ""]?.[batch.id];
  const origin = metadata?.origin;

  // Transform batch journey to timeline events
  const timelineEvents = batch.journey.map((step, index) => {
    const isLast = index === batch.journey.length - 1;

    // Map action types to icons and titles
    let icon = '📦';
    let title = step.action.replace(/_/g, ' ');

    if (step.action.includes('HARVEST')) icon = '🍒';
    else if (step.action.includes('PROCESS')) icon = '💧';
    else if (step.action.includes('DRY')) icon = '☀️';
    else if (step.action.includes('TRANSPORT')) icon = '🚚';
    else if (step.action.includes('ROAST')) icon = '🔥';
    else if (step.action.includes('RETAIL')) icon = '☕';

    return {
      id: `step-${index}`,
      title: title.charAt(0).toUpperCase() + title.slice(1).toLowerCase(),
      date: formatDate(step.timestamp),
      description: step.data?.notes || 'Processing step recorded on blockchain.',
      icon,
      location: step.location || 'Unknown Location',
      status: isLast ? 'current' : 'completed',
      details: [
        { label: 'Actor', value: step.actor.name },
        ...(step.data?.new_weight ? [{ label: 'Weight', value: `${step.data.new_weight}kg` }] : []),
        ...(step.data?.moisture_content ? [{ label: 'Moisture', value: step.data.moisture_content }] : []),
        ...(step.data?.cupping_score ? [{ label: 'Score', value: step.data.cupping_score }] : [])
      ]
    };
  });

  // Add the final "Ready for you" step if the journey is active
  if (timelineEvents.length > 0) {
    timelineEvents.push({
      id: 'ready',
      title: 'Ready for You',
      date: 'Now',
      description: 'This product is verified authentic and ready to enjoy.',
      icon: '✨',
      location: 'Your Location',
      status: 'current',
      details: []
    });
    // Set previous last to completed
    if (timelineEvents.length > 1) {
      // @ts-ignore
      timelineEvents[timelineEvents.length - 2].status = 'completed';
    }
  }

  return (
    <div className="space-y-6">
      {/* Product Header */}
      <Card>
        <CardContent className="p-6">
          <div className="flex flex-col md:flex-row md:items-center justify-between">
            <div className="flex-1">
              <h2 className="text-2xl font-bold text-stone-800">{metadata?.name || `Batch #${batch.id}`}</h2>
              <p className="text-stone-600">Batch ID: {batch.id}</p>
              <div className="flex flex-wrap gap-2 mt-2">
                <span className="bg-emerald-100 text-emerald-800 px-2 py-1 rounded-full text-xs font-medium flex items-center">
                  <span className="mr-1">✓</span> Verified Organic
                </span>
                <span className="bg-blue-100 text-blue-800 px-2 py-1 rounded-full text-xs font-medium">
                  {batch.variety}
                </span>
                <span className="bg-amber-100 text-amber-800 px-2 py-1 rounded-full text-xs font-medium">
                  {batch.grade}
                </span>
              </div>
            </div>
            <div className="mt-4 md:mt-0 text-right">
              <div className="text-lg font-semibold text-emerald-600">Ethio-Origin Certified</div>
              <p className="text-sm text-stone-500">Blockchain Verified</p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Navigation Tabs */}
      <Card>
        <div className="flex border-b border-stone-200">
          {[
            { id: 'journey' as const, name: 'Product Journey', icon: '🛣️' },
            { id: 'farmer' as const, name: 'Farmer Story', icon: '👨‍🌾' },
            { id: 'tip' as const, name: 'Support Farmer', icon: '💝' }
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={cn(
                "flex items-center space-x-2 px-6 py-4 border-b-2 font-medium transition-colors flex-1 md:flex-none justify-center",
                activeTab === tab.id
                  ? "border-emerald-500 text-emerald-700 bg-emerald-50/30"
                  : "border-transparent text-stone-500 hover:text-stone-700 hover:bg-stone-50"
              )}
            >
              <span>{tab.icon}</span>
              <span className="hidden md:inline">{tab.name}</span>
            </button>
          ))}
        </div>

        <div className="p-6 bg-stone-50/50">
          {activeTab === 'journey' && (
            // @ts-ignore
            <ProductJourneyTimeline events={timelineEvents} />
          )}
          {activeTab === 'farmer' && <FarmerStory farmer={batch.farmer} />}
          {activeTab === 'tip' && <TipFarmer farmer={batch.farmer} />}
        </div>
      </Card>

      {/* Action Buttons */}
      <div className="flex space-x-4">
        <Button
          onClick={onScanAnother}
          className="flex-1"
          size="lg"
        >
          Scan Another Product
        </Button>
      </div>
    </div>
  );
}