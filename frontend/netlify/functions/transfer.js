// Netlify Function to handle Cardano token transfers securely
// Version: 2.0 - Supports first transfer (minting wallet) and subsequent self-transfers (processor wallet)

export async function handler(event, context) {
    if (event.httpMethod !== 'POST') {
        return {
            statusCode: 405,
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ error: 'Method not allowed' }),
        };
    }

    // Get all credentials from environment variables
    const TRANSFER_API_URL = process.env.TRANSFER_API_URL;
    const BLOCKFROST_KEY = process.env.BLOCKFROST_KEY;
    const SECRET_SEED = process.env.SECRET_SEED; // Minting wallet (for first transfer)
    const PROCESSOR_SECRET_SEED = process.env.PROCESSOR_SECRET_SEED; // Processor wallet (for subsequent updates)
    const PROCESSOR_WALLET_ADDRESS = process.env.PROCESSOR_WALLET_ADDRESS;

    // Validate all required environment variables
    const requiredVars = { TRANSFER_API_URL, BLOCKFROST_KEY, SECRET_SEED, PROCESSOR_SECRET_SEED, PROCESSOR_WALLET_ADDRESS };
    const missing = Object.entries(requiredVars).filter(([_, v]) => !v).map(([k]) => k);

    if (missing.length > 0) {
        console.error('Missing environment variables:', missing);
        return {
            statusCode: 500,
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ error: `Missing environment variables: ${missing.join(', ')}` }),
        };
    }

    try {
        const { assetUnit, status, description, note, isFirstTransfer } = JSON.parse(event.body);

        if (!assetUnit || !status) {
            return {
                statusCode: 400,
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ error: 'assetUnit and status are required' }),
            };
        }

        // Determine which seed to use:
        // - First transfer: use minting wallet (SECRET_SEED) to send to processor
        // - Subsequent transfers: use processor wallet (PROCESSOR_SECRET_SEED) to self-transfer
        const seedToUse = isFirstTransfer ? SECRET_SEED : PROCESSOR_SECRET_SEED;
        const transferType = isFirstTransfer ? 'first transfer (minting → processor)' : 'self-transfer (processor → processor)';

        console.log('Transfer request:', {
            assetUnit,
            status,
            transferType,
            recipientAddress: PROCESSOR_WALLET_ADDRESS
        });

        const requestBody = {
            blockfrostKey: BLOCKFROST_KEY,
            secretSeed: seedToUse,
            metadata: {
                status,
                description: description || '',
                note: note || ''
            },
            assetUnit,
            recipientAddress: PROCESSOR_WALLET_ADDRESS
        };

        const response = await fetch(TRANSFER_API_URL, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(requestBody),
        });

        const responseText = await response.text();
        console.log('Transfer API response:', response.status, responseText);

        if (!response.ok) {
            let errorMessage = responseText;
            try {
                const errorJson = JSON.parse(responseText);
                errorMessage = errorJson.error || errorJson.message || responseText;
            } catch {
                // Use raw text
            }
            return {
                statusCode: response.status,
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ error: `Transfer API error: ${errorMessage}` }),
            };
        }

        let data;
        try {
            data = JSON.parse(responseText);
        } catch {
            return {
                statusCode: 500,
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ error: `Invalid JSON response: ${responseText.substring(0, 200)}` }),
            };
        }

        return {
            statusCode: 200,
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                status: data.status,
                txHash: data.txHash,
                message: data.message || 'Transfer successful'
            }),
        };
    } catch (error) {
        console.error('Transfer error:', error);
        return {
            statusCode: 500,
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ error: `Server error: ${error.message}` }),
        };
    }
}
