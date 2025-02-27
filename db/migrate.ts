import { drizzle } from 'drizzle-orm/postgres-js';
import { migrate } from 'drizzle-orm/postgres-js/migrator';
import postgres from 'postgres';
import * as dotenv from 'dotenv';

// Load environment variables
dotenv.config({ path: '.env.local' });

const runMigration = async () => {
  if (!process.env.NEXT_PUBLIC_SUPABASE_URL) {
    throw new Error("NEXT_PUBLIC_SUPABASE_URL is not defined");
  }

  // Extract database URL from Supabase URL
  const dbUrl = new URL(process.env.NEXT_PUBLIC_SUPABASE_URL);
  const hostname = dbUrl.hostname;
  const database = hostname.split(".")[0];

  const connectionString = `postgres://postgres:${
    process.env.SUPABASE_SERVICE_ROLE_KEY
  }@${hostname}:5432/${database}?sslmode=require`;

  const sql = postgres(connectionString, { max: 1 });
  const db = drizzle(sql);
  
  console.log('Running migrations...');
  
  await migrate(db, { migrationsFolder: 'drizzle' });
  
  console.log('Migrations completed!');
  
  await sql.end();
  process.exit(0);
};

runMigration().catch((error) => {
  console.error('Migration failed:', error);
  process.exit(1);
}); 