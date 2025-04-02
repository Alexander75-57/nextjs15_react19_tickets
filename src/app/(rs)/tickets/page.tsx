import TicketSearch from '@/app/(rs)/tickets/TicketSearch';
import { getOpenTickets } from '@/lib/queries/getOpenTicket';
import { getCustomerSearchResult } from '@/lib/queries/getCustomerSearchResult';

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
                <p>{JSON.stringify(results)}</p>
            </>
        );
    }
    // query search results
    const results = await getCustomerSearchResult(searchText);

    // return search result
    return (
        <>
            <TicketSearch />
            <p>{JSON.stringify(results)}</p>
        </>
    );
}
