/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_APP_ENV: 'development' | 'staging' | 'production'
  readonly VITE_APP_NAME: string
  readonly VITE_APP_VERSION: string
  readonly VITE_API_BASE_URL: string
  readonly VITE_ENABLE_LOGGING: string
  readonly VITE_LOG_LEVEL: 'debug' | 'info' | 'warn' | 'error'
  readonly VITE_ENABLE_PERFORMANCE_MONITORING: string
  readonly VITE_SENTRY_DSN: string
  readonly VITE_GOOGLE_ANALYTICS_ID: string
}

interface ImportMeta {
  readonly env: ImportMetaEnv
}
