import CustomerSearch from '@/app/(rs)/customers/CustomerSearch';
import { getCustomerSearchResult } from '@/lib/queries/getCustomerSearchResult';

export const metadata = {
    title: 'Customers Search',
};

type SearchParams = Promise<{ [key: string]: string | undefined }>;

export default async function Customers(props: { searchParams: SearchParams }) {
    const { searchText } = await props.searchParams;

    if (!searchText) return <CustomerSearch />;

    //query DataBase
    const results = await getCustomerSearchResult(searchText);

    // return Result
    return (
        <>
            <CustomerSearch />
            <p>{JSON.stringify(results)}</p>
        </>
    );
}
