/// &lt;reference types="vite/client" /&gt;

interface ImportMetaEnv {
    readonly VITE_API_BASE_URL: string;
    readonly VITE_CARDANO_NETWORK: string;
    readonly VITE_APP_URL: string;
    readonly VITE_SUPABASE_URL: string;
    readonly VITE_SUPABASE_ANON_KEY: string;
    readonly VITE_MINT_API_URL: string;
    readonly VITE_BLOCKFROST_KEY: string;
    readonly VITE_SECRET_SEED: string;
    readonly VITE_CBOR_HEX: string;
}

interface ImportMeta {
    readonly env: ImportMetaEnv;
}
