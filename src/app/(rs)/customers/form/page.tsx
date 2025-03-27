import { getCustomer } from '@/lib/queries/getCustomers';
import { BackButton } from '@/components/BackButton';
import CustomerForm from '@/app/(rs)/customers/form/CustomerForm';

type SearchParams = Promise<{ [key: string]: string | undefined }>;

// export default async function generateMetadata(props: {
//     searchParams: SearchParams;
// }) {
//     const { customerId } = await props.searchParams;
//     if (!customerId) return { title: 'New Customer' };
//     return { title: `Edit Customer #${customerId}` };
// }

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
            return <CustomerForm customer={customer} />;
        } else {
            // creat new customer component
            return <CustomerForm />;
        }
    } catch (e) {
        if (e instanceof Error) {
            throw e;
        }
    }
}
