import { eq } from 'drizzle-orm';

import { db } from '@/db';
import { customers } from '@/db/schema';

export async function getCustomer(id: number) {
    const customer = await db
        .select()
        .from(customers)
        .where(eq(customers.id, id));
    return customer[0];
}
