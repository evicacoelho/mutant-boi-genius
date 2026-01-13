export {}; // This makes it a module

declare global {
  namespace NodeJS {
    interface ProcessEnv {
      REACT_APP_ADMIN_PASSWORD: string;
      REACT_APP_ADMIN_TOKEN: string;
    }
  }
}