/*
<ai_context>
Configures Drizzle for the app.
</ai_context>
*/

import type { Config } from 'drizzle-kit';
import * as dotenv from 'dotenv';

// Load environment variables from .env.local
dotenv.config({ path: '.env.local' });

if (!process.env.NEXT_PUBLIC_SUPABASE_URL) {
  throw new Error("NEXT_PUBLIC_SUPABASE_URL is not defined");
}

// Extract database URL from Supabase URL
const dbUrl = new URL(process.env.NEXT_PUBLIC_SUPABASE_URL);
const hostname = dbUrl.hostname;
const database = hostname.split(".")[0];

export default {
  schema: './db/schema.ts',
  out: './drizzle',
  dialect: 'postgresql',
  driver: 'pglite',       // <-- Updated driver to one of the allowed values for PostgreSQL
  dbCredentials: {
    host: process.env.DB_HOST || 'localhost',
    user: process.env.DB_USER || 'postgres',
    password: process.env.DB_PASSWORD || 'password',
    database: process.env.DB_NAME || 'slack_clone',
    // port: 5432, // Uncomment if needed
  }
} satisfies Config;