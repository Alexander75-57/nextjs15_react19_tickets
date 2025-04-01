import { createSafeActionClient } from 'next-safe-action';
import { z } from 'zod';

export const actionClient = createSafeActionClient({
    defineMetadataSchema() {
        return z.object({
            actionName: z.string(),
        });
    },
    handleServerError(e, utils) {
        // console.log(e.constructor.name); // show error text - NeonDbError

        // const { clientInput, metadata } = utils; // it is for send error to email
        // console.log('serverError: ', { message: e.message }); // log server error to console
        // console.log('metadata: ', { actionName: metadata?.actionName });
        // console.log('clientInput: ', { clientInput });

        if (e.constructor.name === 'NeonDbError') {
            return 'Database Error: Your data did not save. Support will be notified.';
        }
        return e.message;
    },
});
