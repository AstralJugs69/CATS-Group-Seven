import { useState, useEffect } from 'react';
import { Batch } from '../types/supplychain';
import { getAllBatches, createBatch, updateBatchStatus, deleteBatch as apiDeleteBatch } from '../services/api';

export function useBatches() {
  const [batches, setBatches] = useState<Batch[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const loadBatches = async () => {
    try {
      setIsLoading(true);
      const data = await getAllBatches();
      setBatches(data);
    } catch (err) {
      setError('Failed to load batches');
    } finally {
      setIsLoading(false);
    }
  };

  const addBatch = async (harvestData: any) => {
    try {
      const newBatch = await createBatch(harvestData);
      setBatches(prev => [newBatch, ...prev]);
      return newBatch;
    } catch (err) {
      setError('Failed to create batch');
      throw err;
    }
  };

  const updateBatch = async (updateData: any) => {
    try {
      const updatedBatch = await updateBatchStatus(updateData);
      setBatches(prev => prev.map(b =>
        b.id === updatedBatch.id ? updatedBatch : b
      ));
      return updatedBatch;
    } catch (err) {
      setError('Failed to update batch');
      throw err;
    }
  };

  const removeBatch = async (id: string) => {
    try {
      await apiDeleteBatch(id);
      setBatches(prev => prev.filter(b => b.id !== id));
    } catch (err) {
      setError('Failed to delete batch');
      throw err;
    }
  };

  useEffect(() => {
    loadBatches();
  }, []);

  return {
    batches,
    isLoading,
    error,
    addBatch,
    updateBatch,
    removeBatch,
    refreshBatches: loadBatches
  };
}
