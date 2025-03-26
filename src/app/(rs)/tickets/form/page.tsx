import { getTicket } from '@/lib/queries/getTicket';
import { getCustomer } from '@/lib/queries/getCustomers';
import { BackButton } from '@/components/BackButton';

type SearchParams = Promise<{ [key: string]: string | undefined }>;

export default async function TicketFornPage(props: {
    searchParams: SearchParams;
}) {
    try {
        const { customerId, ticketId } = await props.searchParams;

        if (!customerId && !ticketId) {
            return (
                <>
                    <h2 className="text-2xl mb-2">
                        Ticket ID or Customer ID required to load ticket form
                    </h2>
                    <BackButton title="Go Back" variant="default" />
                </>
            );
        }
        // New ticket form
        if (customerId) {
            const customer = await getCustomer(parseInt(customerId)); // parseInt() string to number;

            if (!customer) {
                return (
                    <>
                        <h2 className="text-2xl mb-2">
                            Customer by ID #{customerId} not found
                        </h2>
                        <BackButton title="Go Back" variant="default" />
                    </>
                );
            }
            if (!customer.active) {
                return (
                    <>
                        <h2 className="text-2xl mb-2">
                            Customer ID #{customerId} not active
                        </h2>
                        <BackButton title="Go Back" variant="default" />
                    </>
                );
            }
            // Retun Ticket Form
            console.log('customer only: ', customer);
        }

        // Edit ticket form
        if (ticketId) {
            const ticket = await getTicket(parseInt(ticketId));

            if (!ticket) {
                return (
                    <>
                        <h2 className="text-2xl mb-2">
                            Ticket by ID #{ticketId} not found
                        </h2>
                        <BackButton title="Go Back" variant="default" />
                    </>
                );
            }
            const customer = await getCustomer(ticket.customerId);

            // Retun Ticket Form
            console.log('ticket: ', ticket);
            console.log('customer: ', customer);
        }
    } catch (e) {
        if (e instanceof Error) {
            throw e;
        }
    }
}
