/// &lt;reference types="vite/client" /&gt;

interface ImportMetaEnv {
    readonly VITE_API_BASE_URL: string;
    readonly VITE_CARDANO_NETWORK: string;
    readonly VITE_APP_URL: string;
    readonly VITE_SUPABASE_URL: string;
    readonly VITE_SUPABASE_ANON_KEY: string;
    // Note: Minting secrets (SECRET_SEED, BLOCKFROST_KEY, CBOR_HEX) are server-side only
}

interface ImportMeta {
    readonly env: ImportMetaEnv;
}
