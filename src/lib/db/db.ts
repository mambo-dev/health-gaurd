import { drizzle } from 'drizzle-orm/postgres-js';
import postgres from 'postgres';
import * as schema from './schema';
import { env } from '$env/dynamic/private';

if (!env.DATABASE_URL) {
	throw new Error('undefined database url');
}

const queryClient = postgres(env.DATABASE_URL);
export const db = drizzle(queryClient, { schema });
