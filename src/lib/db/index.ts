
import { drizzle } from 'drizzle-orm/postgres-js';
import postgres from 'postgres';
import * as schema from './schema';

const connectionString = process.env.DATABASE_URL!;

// Database connection singleton
// Use "prepare: false" for compatibility with Supabase transaction pooler (port 6543) if needed, 
// but user is using port 5432 (Session pooler or direct). 
// However, Supabase often requires "prepare: false" for their connection pooling in general.
const client = postgres(connectionString, { prepare: false });

export const db = drizzle(client, { schema });
