import { getTicket } from '@/lib/queries/getTicket';
import { getCustomer } from '@/lib/queries/getCustomers';
import { BackButton } from '@/components/BackButton';

import { getKindeServerSession } from '@kinde-oss/kinde-auth-nextjs/server';
import { Users, init as kindeInit } from '@kinde/management-api-js';

import TicketForm from '@/app/(rs)/tickets/form/TicketForm';

type SearchParams = Promise<{ [key: string]: string | undefined }>;

export async function generateMetadata(props: { searchParams: SearchParams }) {
    const { customerId, ticketId } = await props.searchParams;
    if (!customerId && !ticketId)
        return {
            title: 'Missing Ticket ID or Customer ID',
        };
    if (customerId)
        return {
            title: `New Ticket for Customer #${customerId}`,
        };
    if (ticketId)
        return {
            title: `Edit Ticket #${ticketId}`,
        };
}

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

        const { getPermission, getUser } = getKindeServerSession();
        const [managerPermission, user] = await Promise.all([
            getPermission('manager'),
            getUser(),
        ]);
        const isManager = managerPermission?.isGranted;

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
            if (isManager) {
                kindeInit(); // Initilized the Kinde Management API
                const { users } = await Users.getUsers();
                const techs = users
                    ? users.map((user) => ({
                          id: user.email!,
                          description: user.email!,
                      }))
                    : [];
                return (
                    <TicketForm
                        customer={customer}
                        techs={techs}
                        isManager={isManager}
                    />
                );
            } else {
                return <TicketForm customer={customer} />;
            }
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
            if (isManager) {
                kindeInit(); // Initilized the Kinde Management API
                const { users } = await Users.getUsers();
                const techs = users
                    ? users
                          .filter(
                              (user): user is { email: string } =>
                                  typeof user.email === 'string'
                          )
                          .map((user) => ({
                              id: user.email?.toLowerCase(),
                              description: user.email?.toLowerCase(),
                          }))
                    : [];
                return (
                    <TicketForm
                        customer={customer}
                        ticket={ticket}
                        techs={techs}
                        isManager={isManager}
                    />
                );
            } else {
                const isEditable =
                    user.email?.toLowerCase() === ticket.tech.toLowerCase();
                return (
                    <TicketForm
                        customer={customer}
                        ticket={ticket}
                        isEditable={isEditable}
                    />
                );
            }
        }
    } catch (e) {
        if (e instanceof Error) {
            throw e;
        }
    }
}
