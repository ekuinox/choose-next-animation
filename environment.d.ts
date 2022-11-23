declare namespace NodeJS {
    export interface ProcessEnv {
        readonly ANNICT_CLIENT_ID: string;
        readonly ANNICT_CLIENT_SECRET: string;
        readonly ANNICT_REDIRECT_URL: string;
        readonly AES_KEY: string;
    }
}
