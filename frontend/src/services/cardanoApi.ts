import { Batch } from '../types/supplychain';

// Cardano Minting API Configuration
const MINT_API_URL = import.meta.env.VITE_MINT_API_URL || 'https://thirsty-bat-79-y99yj1aw8c92.deno.dev/mint';
const BLOCKFROST_KEY = import.meta.env.VITE_BLOCKFROST_KEY || '';
const SECRET_SEED = import.meta.env.VITE_SECRET_SEED || '';
const CBOR_HEX = import.meta.env.VITE_CBOR_HEX || '';
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
 * Calls the external minting API with batch metadata
 */
export async function mintBatchToken(batch: Batch): Promise<MintResponse> {
    // Validate environment variables
    if (!BLOCKFROST_KEY || !SECRET_SEED || !CBOR_HEX) {
        throw new MintError(
            'Minting credentials not configured. Please set VITE_BLOCKFROST_KEY, VITE_SECRET_SEED, and VITE_CBOR_HEX environment variables.'
        );
    }

    // Generate unique token name
    const tokenName = `Coffee#${batch.batchNumber?.replace('BATCH-', '') || batch.id.substring(0, 8)}`;

    // Build metadata from batch info
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

    // Build request payload as per API documentation
    const requestBody = {
        blockfrostKey: BLOCKFROST_KEY,
        secretSeed: SECRET_SEED,
        tokenName,
        metadata,
        cborHex: CBOR_HEX
    };

    try {
        const response = await fetch(MINT_API_URL, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(requestBody),
        });

        if (!response.ok) {
            const errorText = await response.text();
            throw new MintError(`Minting API returned ${response.status}: ${errorText}`);
        }

        const data = await response.json();

        if (data.status !== 'success') {
            throw new MintError(`Minting failed: ${data.message || 'Unknown error'}`, data);
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
        throw new MintError(`Failed to connect to minting API: ${(error as Error).message}`);
    }
}
