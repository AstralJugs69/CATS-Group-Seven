import React from 'react';
import { Routes, Route, Navigate, useNavigate, useSearchParams } from 'react-router-dom';
import BatchScanner from './BatchScanner';
import StatusUpdate from './StatusUpdate';
import DashboardLayout from '../layout/DashboardLayout';

export default function ProcessorPortal() {
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();
  const scannedBatchId = searchParams.get('batchId');

  return (
    <DashboardLayout role="processor" title="Processor Portal" subtitle="Scan batches and update processing status">
      {/* Route Content */}
      <div className="max-w-4xl mx-auto">
        <Routes>
          <Route path="/" element={<Navigate to="scan" replace />} />
          <Route
            path="scan"
            element={
              <BatchScanner
                onBatchScanned={(id) => {
                  navigate(`/processor/update?batchId=${id}`);
                }}
                onContinue={() => navigate('/processor/update')}
              />
            }
          />
          <Route
            path="update"
            element={
              <StatusUpdate
                batchId={scannedBatchId}
                onBatchChange={(id) => setSearchParams({ batchId: id })}
              />
            }
          />
        </Routes>
      </div>
    </DashboardLayout>
  );
}
