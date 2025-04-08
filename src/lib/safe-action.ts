import { createSafeActionClient } from 'next-safe-action';
import { z } from 'zod';

import type { NeonDbError } from '@neondatabase/serverless';

export const actionClient = createSafeActionClient({
    defineMetadataSchema() {
        return z.object({
            actionName: z.string(),
        });
    },
    handleServerError(e, utils) {
        // console.log(e.constructor.name); // show error text in NeonDbError

        // const { clientInput, metadata } = utils; // it is for send error to email
        // console.log('serverError: ', { message: e.message }); // log server error to console
        // console.log('metadata: ', { actionName: metadata?.actionName });
        // console.log('clientInput: ', { clientInput });

        if (e.constructor.name === 'NeonDbError') {
            const { code, detail } = e as NeonDbError;
            // in NeonDB code: 23505 - дублирующая уникальная запись
            if (code === '23505') {
                return `Unique entry required. ${detail}`;
            }
        }
        //------------
        if (e.constructor.name === 'NeonDbError') {
            return 'Database Error: Your data did not save. Support will be notified.';
        }
        return e.message;
    },
});
