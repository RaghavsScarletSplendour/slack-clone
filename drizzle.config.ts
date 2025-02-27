/*
<ai_context>
Configures Drizzle for the app.
</ai_context>
*/

import type { Config } from 'drizzle-kit';
import * as dotenv from 'dotenv';

// Load environment variables from .env.local
dotenv.config({ path: '.env.local' });

if (!process.env.DATABASE_URL) {
  // Construct from Supabase URL if DATABASE_URL is not directly provided
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
  
  if (!supabaseUrl || !supabaseKey) {
    throw new Error('Missing required environment variables for database connection');
  }
  
  process.env.DATABASE_URL = `postgres://postgres.${supabaseUrl.split('//')[1]}:${supabaseKey}@aws-0-us-west-1.pooler.supabase.com:6543/postgres`;
}

export default {
  schema: './db/schema/*',
  out: './drizzle',
  driver: 'pg',
  dbCredentials: {
    connectionString: process.env.DATABASE_URL,
  },
} satisfies Config;