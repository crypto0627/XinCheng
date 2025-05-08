export interface ENV {
  // D1 Database
  DB: D1Database
  TOKEN_BLACKLIST: KVNamespace
  // Environment Variables
  RESEND_API_KEY: string
  API_KEY: string
  JWT_SECRET: string
  GOOGLE_CLIENT_ID: string
  GOOGLE_CLIENT_SECRET: string
  BASE_URL: string
  TEST_BASE_URL: string
  API_URL: string
}
