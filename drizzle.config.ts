import type { Config } from 'drizzle-kit';

if (!process.env.DATABASE_URL) {
	throw new Error('define a database url');
}

export default {
	schema: './src/lib/db/schema.ts',
	out: './drizzle/migrations',
	driver: 'pg',
	dbCredentials: {
		connectionString: process.env.DATABASE_URL
	}
} satisfies Config;
