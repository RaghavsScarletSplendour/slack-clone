/*
<ai_context>
Initializes the database connection and schema for the app.
</ai_context>
*/

import { drizzle } from 'drizzle-orm/postgres-js';
import postgres from 'postgres';
import { supabase } from '@/lib/supabase';

// For server-side database operations
const connectionString = process.env.DATABASE_URL || 
  `postgres://postgres.${process.env.NEXT_PUBLIC_SUPABASE_URL?.split('//')[1]}:${process.env.SUPABASE_SERVICE_ROLE_KEY}@aws-0-us-west-1.pooler.supabase.com:6543/postgres`;

// Use a single connection for development
const client = postgres(connectionString, { max: 1 });
export const db = drizzle(client);

// For client-side operations, we'll use Supabase's built-in Postgres interface
export const getSupabaseClient = () => supabase;