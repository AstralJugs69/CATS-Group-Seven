import React from 'react';
import { Batch } from '../../types/supplychain';
import { formatDate } from '../../utils/formatters';
import { getCardanoScanTxUrl, getCardanoScanTokenUrl } from '../../services/cardanoApi';
import { Card, CardContent } from '../ui/Card';
import { Button } from '../ui/Button';
import { motion } from 'framer-motion';

interface MintedBatchListProps {
    batches: Batch[];
}

export default function MintedBatchList({ batches }: MintedBatchListProps) {
    if (batches.length === 0) {
        return (
            <Card className="p-12 text-center">
                <div className="w-24 h-24 bg-stone-100 rounded-full flex items-center justify-center mx-auto mb-6">
                    <span className="text-4xl">🔗</span>
                </div>
                <h3 className="text-xl font-semibold text-stone-600 mb-2">No minted batches yet</h3>
                <p className="text-stone-500">
                    Batches will appear here after they are minted on the Cardano blockchain
                </p>
            </Card>
        );
    }

    return (
        <div className="space-y-6">
            <div className="flex justify-between items-center">
                <h2 className="text-xl font-semibold text-stone-800">Minted Batches</h2>
                <div className="text-sm text-stone-500">
                    {batches.length} minted batch{batches.length !== 1 ? 'es' : ''}
                </div>
            </div>

            <div className="grid gap-4">
                {batches.map((batch, index) => (
                    <motion.div
                        key={batch.id}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: index * 0.05 }}
                    >
                        <Card className="border-2 border-emerald-200 bg-emerald-50/30">
                            <CardContent className="p-6">
                                <div className="flex justify-between items-start mb-4">
                                    <div>
                                        <div className="flex items-center">
                                            <span className="text-emerald-500 mr-2">✓</span>
                                            <h3 className="font-bold text-lg text-stone-800">
                                                <span className="text-stone-400 font-normal text-sm mr-1">#</span>
                                                {batch.batchNumber || batch.id.substring(0, 8)}
                                            </h3>
                                        </div>
                                        <p className="text-stone-600 capitalize">{batch.cropType} • {batch.variety}</p>
                                    </div>
                                    <span className="bg-emerald-100 text-emerald-800 px-3 py-1 rounded-full text-sm font-medium">
                                        Minted
                                    </span>
                                </div>

                                <div className="grid grid-cols-2 md:grid-cols-3 gap-4 text-sm text-stone-600 mb-4">
                                    <div>
                                        <span className="font-medium">Weight:</span> {batch.initialWeight}kg
                                    </div>
                                    <div>
                                        <span className="font-medium">Farmer:</span> {batch.farmer.name}
                                    </div>
                                    <div>
                                        <span className="font-medium">Harvest Date:</span> {formatDate(batch.harvestDate)}
                                    </div>
                                </div>

                                {/* Blockchain Info */}
                                <div className="bg-white rounded-lg p-4 border border-emerald-200 mb-4">
                                    <h4 className="text-sm font-semibold text-stone-700 mb-2">Blockchain Details</h4>
                                    <div className="space-y-2 text-sm">
                                        {batch.mintTxHash && (
                                            <div className="flex items-center justify-between">
                                                <span className="text-stone-500">Transaction:</span>
                                                <span className="font-mono text-xs text-stone-700 truncate max-w-[200px]">
                                                    {batch.mintTxHash.substring(0, 20)}...
                                                </span>
                                            </div>
                                        )}
                                        {batch.policyId && (
                                            <div className="flex items-center justify-between">
                                                <span className="text-stone-500">Policy ID:</span>
                                                <span className="font-mono text-xs text-stone-700 truncate max-w-[200px]">
                                                    {batch.policyId.substring(0, 20)}...
                                                </span>
                                            </div>
                                        )}
                                    </div>
                                </div>

                                {/* CardanoScan Links */}
                                <div className="flex flex-wrap gap-2">
                                    {batch.mintTxHash && (
                                        <a
                                            href={getCardanoScanTxUrl(batch.mintTxHash)}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                        >
                                            <Button variant="outline" size="sm" className="gap-2">
                                                <span>🔍</span>
                                                View Transaction
                                            </Button>
                                        </a>
                                    )}
                                    {batch.mintUnit && (
                                        <a
                                            href={getCardanoScanTokenUrl(batch.mintUnit)}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                        >
                                            <Button variant="outline" size="sm" className="gap-2">
                                                <span>🪙</span>
                                                View Token
                                            </Button>
                                        </a>
                                    )}
                                </div>
                            </CardContent>
                        </Card>
                    </motion.div>
                ))}
            </div>
        </div>
    );
}
