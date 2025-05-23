import { migrate } from 'drizzle-orm/neon-http/migrator';
import { db } from '@/db/index';

const main = async () => {
    try {
        console.log('Migrating...');
        await migrate(db, { migrationsFolder: 'src/db/migrations' });
        console.log('Migrated successfully');
    } catch (error) {
        console.error('Error during migration:', error);
        process.exit(1);
    }
};
main();
