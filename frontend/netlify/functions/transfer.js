// Netlify Function to handle Cardano token transfers securely
// Transfers token to processor wallet and updates metadata

export async function handler(event, context) {
    if (event.httpMethod !== 'POST') {
        return {
            statusCode: 405,
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ error: 'Method not allowed' }),
        };
    }

    // API endpoint
    const TRANSFER_API_URL = process.env.TRANSFER_API_URL || 'https://thirsty-bat-79-y99yj1aw8c92.deno.dev/transfer';
    const BLOCKFROST_KEY = process.env.BLOCKFROST_KEY;
    const SECRET_SEED = process.env.SECRET_SEED;

    // Hardcoded processor wallet address (preprod testnet)
    const PROCESSOR_WALLET_ADDRESS = 'addr_test1qq63rds7cr2e7vq2jz2qrf66flk9qaunqvs7htjtsgg84sqrtd0enkkwga8mx4wegagjqx9kp78eu77xw5y8fra2058qt2sz5e';

    if (!BLOCKFROST_KEY || !SECRET_SEED) {
        console.error('Missing credentials:', { hasBlockfrost: !!BLOCKFROST_KEY, hasSeed: !!SECRET_SEED });
        return {
            statusCode: 500,
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ error: 'Transfer credentials not configured on server' }),
        };
    }

    try {
        const { assetUnit, status, description, note } = JSON.parse(event.body);

        if (!assetUnit || !status) {
            return {
                statusCode: 400,
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ error: 'assetUnit and status are required' }),
            };
        }

        console.log('Transfer request:', { assetUnit, status, recipientAddress: PROCESSOR_WALLET_ADDRESS });

        const requestBody = {
            blockfrostKey: BLOCKFROST_KEY,
            secretSeed: SECRET_SEED,
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

        // Get response as text first
        const responseText = await response.text();
        console.log('Transfer API response:', response.status, responseText);

        if (!response.ok) {
            // Try to parse as JSON, otherwise use raw text
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
