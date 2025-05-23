import { neon } from '@neondatabase/serverless';
import { drizzle } from 'drizzle-orm/neon-http';
import { config } from 'dotenv';

/* config({ path: '.env.local' }); */
if (process.env.NODE_ENV === 'development') {
    config({ path: '.env.local' });
}

const sql = neon(process.env.DATABASE_URL!);
const db = drizzle({ client: sql });

export { db };
