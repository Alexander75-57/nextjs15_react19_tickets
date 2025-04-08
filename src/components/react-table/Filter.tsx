import { Column } from '@tanstack/react-table';

import { DebouncedInput } from '@/components/react-table/DebouncedInput';

type Props<T> = {
    column: Column<T, unknown>; // лучше чем использывать any
    filteredRows: string[];
};

export default function Filter<T>({ column, filteredRows }: Props<T>) {
    const columnFilterValue = column.getFilterValue();

    const uniqueFilteredValue = new Set(filteredRows);

    //отдельно добавляем кнопку для сортировки - фильтрации
    /* const sortedUniqueValues = Array.from(
        column.getFacetedUniqueValues().keys()
    ).sort(); */ // change as add uniqueFilteredValue

    const sortedUniqueValues = Array.from(uniqueFilteredValue).sort();

    return (
        <>
            {/* //кнопку для сортировки - фильтрации */}
            <datalist id={column.id + 'list'}>
                {sortedUniqueValues.map((value, i) => (
                    <option value={value} key={`${i}-${column.id}`} />
                ))}
            </datalist>

            <DebouncedInput
                type="text"
                value={(columnFilterValue ?? '') as string}
                onChange={(value) => column.setFilterValue(value)}
                /* placeholder={`Search... (${
                    column.getFacetedUniqueValues().size
                })`} */
                placeholder={`Search... (${uniqueFilteredValue.size})`}
                className="w-full border shadow bg-card"
                list={column.id + 'list'}
            />
        </>
    );
}
