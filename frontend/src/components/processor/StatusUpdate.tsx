import React, { useState, useEffect } from 'react';
import { Batch, StatusUpdateData } from '../../types/supplychain';
import { useBatches } from '../../hooks/useBatches';
import { getBatchById } from '../../services/api';
import LoadingSpinner from '../common/LoadingSpinner';

interface StatusUpdateProps {
  batchId: string | null;
  onBatchChange: (batchId: string) => void;
}

const PROCESSING_ACTIONS = [
  { value: 'PROCESSING_STARTED', label: 'Start Processing', description: 'Begin washing/drying process' },
  { value: 'PROCESSING_COMPLETE', label: 'Complete Processing', description: 'Finish processing stage' },
  { value: 'QUALITY_CHECKED', label: 'Quality Check', description: 'Perform quality assessment' },
  { value: 'IN_TRANSIT', label: 'Ready for Export', description: 'Prepare for shipment' }
];

export default function StatusUpdate({ batchId, onBatchChange }: StatusUpdateProps) {
  const { updateBatch } = useBatches();
  const [batch, setBatch] = useState<Batch | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState<StatusUpdateData>({
    batchId: batchId || '',
    action: 'PROCESSING_STARTED',
    newWeight: undefined,
    moistureContent: '',
    cuppingScore: undefined,
    notes: ''
  });

  const completedActions = batch?.journey.map(step => step.action) || [];

  // Define strict order of operations
  const actionOrder = PROCESSING_ACTIONS.map(a => a.value);

  // Find the next expected action
  const nextAction = PROCESSING_ACTIONS.find(a => !completedActions.includes(a.value));

  // Check if fully processed
  const isFullyProcessed = PROCESSING_ACTIONS.every(a => completedActions.includes(a.value));

  useEffect(() => {
    if (batchId) {
      loadBatch(batchId);
    }
  }, [batchId]);

  const loadBatch = async (id: string) => {
    setIsLoading(true);
    try {
      const batchData = await getBatchById(id);
      if (batchData) {
        setBatch(batchData);
        setFormData((prev: StatusUpdateData) => ({
          ...prev,
          batchId: batchData.id,
          newWeight: batchData.currentWeight || batchData.initialWeight
        }));
      }
    } catch (error) {
      console.error('Failed to load batch:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!batch) return;

    if (completedActions.includes(formData.action)) {
      alert('This action has already been performed.');
      return;
    }

    setIsSubmitting(true);
    try {
      await updateBatch(formData);
      // Reload batch to get updated data
      await loadBatch(batch.id);

      // Reset form for next update
      setFormData({
        batchId: batch.id,
        action: 'PROCESSING_STARTED',
        newWeight: batch.currentWeight || batch.initialWeight,
        moistureContent: '',
        cuppingScore: undefined,
        notes: ''
      });
    } catch (error) {
      console.error('Failed to update batch:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleChange = (field: keyof StatusUpdateData, value: string | number) => {
    setFormData((prev: StatusUpdateData) => ({ ...prev, [field]: value }));
  };

  if (isLoading) {
    return (
      <div className="bg-white rounded-xl shadow-lg p-8 flex items-center justify-center">
        <LoadingSpinner size="lg" text="Loading batch data..." />
      </div>
    );
  }

  if (!batch) {
    return (
      <div className="bg-white rounded-xl shadow-lg p-8 text-center">
        <div className="w-20 h-20 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
          <span className="text-2xl">📦</span>
        </div>
        <h3 className="text-xl font-semibold text-gray-700 mb-2">No Batch Selected</h3>
        <p className="text-gray-500">
          Please scan a batch first or enter a batch ID to update its status
        </p>
        <div className="mt-6">
          <input
            type="text"
            placeholder="Enter Batch ID (e.g., ETH-COFFEE-001)"
            value={formData.batchId}
            onChange={(e) => onBatchChange(e.target.value)}
            className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          />
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto">
      <div className="bg-white rounded-xl shadow-lg p-6">
        {/* Batch Header */}
        <div className="bg-gray-50 rounded-lg p-4 mb-6">
          <div className="flex justify-between items-start">
            <div>
              <h3 className="font-bold text-lg text-gray-800">{batch.id}</h3>
              <p className="text-gray-600 capitalize">{batch.cropType} • {batch.variety}</p>
            </div>
            <div className="text-right">
              <div className="bg-green-100 text-green-800 px-2 py-1 rounded text-sm font-medium">
                Current Weight: {batch.currentWeight || batch.initialWeight}kg
              </div>
            </div>
          </div>
          <div className="grid grid-cols-2 gap-2 text-sm text-gray-600 mt-2">
            <div><span className="font-medium">Farmer:</span> {batch.farmer.name}</div>
            <div><span className="font-medium">Location:</span> {batch.location}</div>
          </div>
        </div>

        {isFullyProcessed && (
          <div className="bg-yellow-50 border-l-4 border-yellow-400 p-4 mb-6">
            <div className="flex">
              <div className="ml-3">
                <p className="text-sm text-yellow-700 font-medium">
                  Cannot edit since this batch has been fully processed.
                </p>
              </div>
            </div>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Action Selection */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-3">
              Processing Action *
            </label>
            <div className="grid gap-2">
              {PROCESSING_ACTIONS.map((action) => {
                const isCompleted = completedActions.includes(action.value);
                const isNext = action.value === nextAction?.value;
                const isDisabled = !isNext; // Disable if it's not the exact next step (covers completed and future steps)

                return (
                  <button
                    key={action.value}
                    type="button"
                    disabled={isDisabled}
                    onClick={() => handleChange('action', action.value)}
                    className={`p-4 border-2 rounded-lg text-left transition ${formData.action === action.value && !isDisabled
                        ? 'border-blue-500 bg-blue-50'
                        : isDisabled
                          ? 'border-gray-100 bg-gray-50 opacity-60 cursor-not-allowed'
                          : 'border-gray-200 hover:border-gray-300'
                      }`}
                  >
                    <div className="flex justify-between items-center">
                      <div>
                        <div className="font-medium text-gray-800">{action.label}</div>
                        <div className="text-sm text-gray-600">{action.description}</div>
                      </div>
                      {isCompleted && <span className="text-green-600 font-bold text-xl">✓</span>}
                    </div>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Processing Data */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Current Weight (kg)
              </label>
              <input
                type="number"
                disabled={isFullyProcessed}
                value={formData.newWeight || ''}
                onChange={(e) => handleChange('newWeight', parseInt(e.target.value) || 0)}
                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 disabled:bg-gray-100 disabled:text-gray-500"
                placeholder="Enter current weight"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Moisture Content (%)
              </label>
              <input
                type="text"
                disabled={isFullyProcessed}
                value={formData.moistureContent}
                onChange={(e) => handleChange('moistureContent', e.target.value)}
                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 disabled:bg-gray-100 disabled:text-gray-500"
                placeholder="e.g., 11.5%"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Cupping Score
              </label>
              <input
                type="number"
                disabled={isFullyProcessed}
                min="0"
                max="100"
                step="0.1"
                value={formData.cuppingScore || ''}
                onChange={(e) => handleChange('cuppingScore', parseFloat(e.target.value) || 0)}
                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 disabled:bg-gray-100 disabled:text-gray-500"
                placeholder="e.g., 88.5"
              />
            </div>
          </div>

          {/* Notes */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Processing Notes
            </label>
            <textarea
              value={formData.notes}
              disabled={isFullyProcessed}
              onChange={(e) => handleChange('notes', e.target.value)}
              rows={3}
              className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 disabled:bg-gray-100 disabled:text-gray-500"
              placeholder="Add any notes about the processing..."
            />
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            disabled={isSubmitting || isFullyProcessed}
            className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 px-4 rounded-lg transition disabled:opacity-50 flex items-center justify-center"
          >
            {isSubmitting ? (
              <>
                <LoadingSpinner size="sm" />
                <span className="ml-2">Updating Batch...</span>
              </>
            ) : (
              'Update Batch Status'
            )}
          </button>
        </form>

        {/* Transaction Preview */}
        <div className="mt-6 p-4 bg-gray-800 rounded-lg">
          <h4 className="text-white font-medium mb-2">Blockchain Transaction Preview</h4>
          <pre className="text-green-400 text-sm overflow-x-auto">
            {JSON.stringify({
              "1001": {
                batch_id: batch.id,
                action: formData.action,
                timestamp: new Date().toISOString(),
                actor: {
                  id: "processor_001",
                  name: "Processing Station"
                },
                data: {
                  new_weight: formData.newWeight,
                  moisture_content: formData.moistureContent,
                  cupping_score: formData.cuppingScore,
                  notes: formData.notes
                }
              }
            }, null, 2)}
          </pre>
        </div>
      </div>
    </div>
  );
}
