declare global {
    namespace NodeJS {
        interface ProcessEnv {
            SERVER_HOST: string;
            JWT_PRIVATE_KEY: string;
        }
    }
}

export {};
