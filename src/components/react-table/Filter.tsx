import { Column } from '@tanstack/react-table';

import { DebouncedInput } from '@/components/react-table/DebouncedInput';

type Props<T> = {
    column: Column<T, unknown>; // лучше чем использывать any
};

export default function Filter<T>({ column }: Props<T>) {
    const columnFilterValue = column.getFilterValue();

    //отдельно добавляем кнопку для сортировки - фильтрации
    const sortedUniqueValues = Array.from(
        column.getFacetedUniqueValues().keys()
    ).sort();

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
                placeholder={`Search... (${
                    [...column.getFacetedUniqueValues()].filter((arr) => arr[0])
                        .length
                })`}
                className="w-full border shadow bg-card"
                list={column.id + 'list'}
            />
        </>
    );
}
