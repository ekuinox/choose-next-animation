declare namespace NodeJS {
    export interface ProcessEnv {
        readonly ANNICT_CLIENT_ID: string;
        readonly ANNICT_CLIENT_SECRET: string;
        readonly HOST?: string;
        readonly VERCEL_URL?: string; // https://vercel.com/docs/concepts/projects/environment-variables#system-environment-variables
        readonly AES_KEY: string;
    }
}
