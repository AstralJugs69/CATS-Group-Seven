import { Batch } from '../types/supplychain';

// Cardano Network Configuration (public - safe for client)
const CARDANO_NETWORK = import.meta.env.VITE_CARDANO_NETWORK || 'preprod';

// CardanoScan URLs
export const getCardanoScanTxUrl = (txHash: string): string => {
    const baseUrl = CARDANO_NETWORK === 'mainnet'
        ? 'https://cardanoscan.io'
        : 'https://preprod.cardanoscan.io';
    return `${baseUrl}/transaction/${txHash}`;
};

export const getCardanoScanTokenUrl = (unit: string): string => {
    const baseUrl = CARDANO_NETWORK === 'mainnet'
        ? 'https://cardanoscan.io'
        : 'https://preprod.cardanoscan.io';
    return `${baseUrl}/token/${unit}`;
};

// Minting API Response
export interface MintResponse {
    status: string;
    txHash: string;
    unit: string;
    policyId: string;
}

// Error class for minting errors
export class MintError extends Error {
    constructor(message: string, public details?: any) {
        super(message);
        this.name = 'MintError';
    }
}

/**
 * Mint a batch as a Cardano native token
 * Calls the Netlify Function which handles secrets securely server-side
 */
export async function mintBatchToken(batch: Batch): Promise<MintResponse> {
    // Generate unique token name
    const tokenName = `Coffee#${batch.batchNumber?.replace('BATCH-', '') || batch.id.substring(0, 8)}`;

    // Build metadata from batch info (public data only)
    const metadata = {
        name: `Coffee batch ${batch.batchNumber || batch.id.substring(0, 8)}`,
        weight: String(batch.initialWeight),
        unit: 'kg',
        variety: batch.variety,
        location: batch.farmer?.gps || 'GPS Coordinates',
        lat: batch.farmer?.gps?.split(',')[0]?.trim() || '',
        long: batch.farmer?.gps?.split(',')[1]?.trim() || '',
        farmer: batch.farmer?.name || 'Unknown',
        harvestDate: batch.harvestDate,
        cropType: batch.cropType
    };

    try {
        // Call the Netlify Function (secrets are handled server-side)
        const response = await fetch('/.netlify/functions/mint', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                tokenName,
                metadata,
            }),
        });

        const data = await response.json();

        if (!response.ok) {
            throw new MintError(data.error || `Minting failed with status ${response.status}`);
        }

        if (data.status !== 'success') {
            throw new MintError(`Minting failed: ${data.error || 'Unknown error'}`, data);
        }

        return {
            status: data.status,
            txHash: data.txHash,
            unit: data.unit,
            policyId: data.policyId,
        };
    } catch (error) {
        if (error instanceof MintError) {
            throw error;
        }
        throw new MintError(`Failed to mint: ${(error as Error).message}`);
    }
}
