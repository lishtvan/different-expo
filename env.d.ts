declare global {
  namespace NodeJS {
    interface ProcessEnv {
      EXPO_PUBLIC_ENVIRONMENT: 'local' | 'production';
    }
  }
}

export {};
