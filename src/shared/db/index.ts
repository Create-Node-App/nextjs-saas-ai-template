import { drizzle } from 'drizzle-orm/postgres-js';
import postgres from 'postgres';

import * as schema from './schema';

/**
 * Database connection singleton for server-side usage.
 *
 * Uses the `postgres` driver with Drizzle ORM.
 * Connection pooling is handled automatically.
 *
 * @example
 * import { db } from '@/shared/db';
 *
 * const users = await db.query.persons.findMany();
 */

// For singleton pattern in development
const globalForDb = globalThis as unknown as {
  conn: postgres.Sql | undefined;
};

const connectionString = process.env.DATABASE_URL;

if (!connectionString) {
  throw new Error('DATABASE_URL environment variable is not set');
}

// Create connection (reuse in development to avoid too many connections)
const conn = globalForDb.conn ?? postgres(connectionString);

if (process.env.NODE_ENV !== 'production') {
  globalForDb.conn = conn;
}

// Export the Drizzle instance with schema
export const db = drizzle(conn, { schema });

// Export types for use in other files
export type Database = typeof db;
