import TicketSearch from '@/app/(rs)/tickets/TicketSearch';
import { getOpenTickets } from '@/lib/queries/getOpenTicket';
import { getTicketSearchResult } from '@/lib/queries/getTicketSearchResult';

import TicketTable from '@/app/(rs)/tickets/TicketTable';

export const metadata = {
    title: 'Tickets Search',
};

type SearchParams = Promise<{ [key: string]: string | undefined }>;

export default async function Tickets(props: { searchParams: SearchParams }) {
    const { searchText } = await props.searchParams;

    if (!searchText) {
        // query default results
        const results = await getOpenTickets();
        return (
            <>
                <TicketSearch />
                {/* <p>{JSON.stringify(results)}</p> */}
                {results.length ? (
                    <TicketTable data={results} />
                ) : (
                    <p className="mt-4">No open tickets found</p>
                )}
            </>
        );
    }
    // query search results
    const results = await getTicketSearchResult(searchText);

    // return search result
    return (
        <>
            <TicketSearch />
            {/* <p>{JSON.stringify(results)}</p> */}
            {results.length ? (
                <TicketTable data={results} />
            ) : (
                <p className="mt-4">No Reults Found</p>
            )}
        </>
    );
}
