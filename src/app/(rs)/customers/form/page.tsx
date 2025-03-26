import { getCustomer } from '@/lib/queries/getCustomers';
import { BackButton } from '@/components/BackButton';

type SearchParams = Promise<{ [key: string]: string | undefined }>;

export default async function CustomerFormPage(props: {
    searchParams: SearchParams;
}) {
    try {
        // link /customers/form/[id]
        const { customerId } = await props.searchParams;
        // Edit customer form
        if (customerId) {
            const customer = await getCustomer(parseInt(customerId)); // parseInt() string to number;

            if (!customer) {
                return (
                    <>
                        <h2 className="text-2xl mb-2">
                            Customer ID #{customerId} not found
                        </h2>
                        <BackButton title="Go Back" variant="default" />
                    </>
                );
            }
            // update customer components
            console.log(customer);
        } else {
            // creat new customer component
        }
    } catch (e) {
        if (e instanceof Error) {
            throw e;
        }
    }
}
