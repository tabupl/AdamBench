/// <reference types="vitest" />

declare global {
  namespace NodeJS {
    interface ProcessEnv {
      readonly VITE_APP_TITLE: string
      readonly MODE: string
      readonly DEV: boolean
      readonly SSR: boolean
    }
  }
}