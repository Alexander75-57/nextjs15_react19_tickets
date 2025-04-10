'use client';

import type { TicketSearchResultsType } from '@/lib/queries/getTicketSearchResult';

import {
    createColumnHelper,
    flexRender,
    getCoreRowModel,
    useReactTable,
    getPaginationRowModel,
    ColumnFiltersState,
    getFilteredRowModel,
    getFacetedUniqueValues,
    SortingState, // для стрелок фильтрации
    getSortedRowModel,
} from '@tanstack/react-table';

import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from '@/components/ui/table';

import { useRouter, useSearchParams } from 'next/navigation';
import { useState, useMemo, useEffect } from 'react'; // useState - используем для филтра колонок

import {
    CircleCheckIcon,
    CircleXIcon,
    ArrowDown,
    ArrowUp,
    ArrowUpDown,
} from 'lucide-react';
import { Button } from '@/components/ui/button';

import Filter from '@/components/react-table/Filter';
import { usePolling } from '@/hooks/usePolling';

type Props = {
    data: TicketSearchResultsType;
};

type RowType = TicketSearchResultsType[0];

export default function TicketTable({ data }: Props) {
    const router = useRouter();

    const searchParams = useSearchParams();

    const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([]);
    // для стрелок фильтрации ниже
    const [sorting, setSorting] = useState<SortingState>([
        {
            id: 'ticketDate',
            desc: false, // false for ascending
        },
    ]);

    usePolling(300000, searchParams.get('searchText')); // 300000 - интервал обновления страницы каждые 5 минут
    const pageIndex = useMemo(() => {
        const page = searchParams.get('page');
        return page ? parseInt(page) - 1 : 0;
    }, [searchParams.get('page')]); // eslint-disable-line react-hooks/exhaustive-deps

    const columnHeadersArray: Array<keyof RowType> = [
        'ticketDate',
        'title',
        'tech',
        'firstName',
        'lastName',
        'email',
        'completed',
    ];

    const columnWidths = {
        ticketDate: 150,
        title: 250,
        tech: 225,
        email: 225,
        completed: 150,
    };

    const columnHelper = createColumnHelper<RowType>();

    /* const columns = [
        columnHelper.accessor('firstName', { header: 'First Name' }),
    ];*/
    const columns = columnHeadersArray.map((columnName) => {
        //return columnHelper.accessor(columnName, {  // заменяем columnName на функцию для преобразования данных
        return columnHelper.accessor(
            (row) => {
                const value = row[columnName];
                if (columnName === 'ticketDate' && value instanceof Date) {
                    return value.toLocaleDateString('en-US', {
                        year: 'numeric',
                        month: '2-digit',
                        day: '2-digit',
                    });
                }
                if (columnName === 'completed') {
                    return value ? 'COMPLETED' : 'OPEN';
                }
                return value;
            },
            {
                id: columnName,
                size:
                    columnWidths[columnName as keyof typeof columnWidths] ??
                    undefined,
                /* header: columnName[0].toUpperCase() + columnName.slice(1), */ /* // добавляем стрелок фильтрации */
                header: ({ column }) => {
                    return (
                        <Button
                            variant="ghost"
                            className="pl-1 w-full flex justify-between"
                            onClick={() =>
                                column.toggleSorting(
                                    column.getIsSorted() === 'asc'
                                )
                            }
                        >
                            {columnName[0].toUpperCase() + columnName.slice(1)}
                            {column.getIsSorted() === 'asc' && (
                                <ArrowUp className="w-4 h-4" />
                            )}
                            {column.getIsSorted() === 'desc' && (
                                <ArrowDown className="w-4 h-4" />
                            )}
                            {column.getIsSorted() !== 'desc' &&
                                column.getIsSorted() !== 'asc' && (
                                    <ArrowUpDown className="w-4 h-4" />
                                )}
                        </Button>
                    );
                },
                cell: ({ getValue }) => {
                    // presentation data
                    const value = getValue();
                    if (columnName === 'completed') {
                        return (
                            <div className="grid place-content-center">
                                {value === 'OPEN' ? (
                                    <CircleXIcon className="opacity-25" />
                                ) : (
                                    <CircleCheckIcon className="text-green-600" />
                                )}
                            </div>
                        );
                    }
                    return value;
                },
            }
        );
    });

    const table = useReactTable({
        data,
        columns,
        /*state: {
            columnFilters,
            sorting,
        },
        initialState: {
            pagination: {
                pageSize: 10,
            },
        }, */ // change as add pageIndex
        state: {
            columnFilters,
            sorting,
            pagination: {
                pageIndex: pageIndex,
                pageSize: 10,
            },
        },
        onColumnFiltersChange: setColumnFilters,
        onSortingChange: setSorting,
        getCoreRowModel: getCoreRowModel(),
        getPaginationRowModel: getPaginationRowModel(),
        getFilteredRowModel: getFilteredRowModel(),
        getFacetedUniqueValues: getFacetedUniqueValues(),
        getSortedRowModel: getSortedRowModel(),
    });

    // ниже эффект для перехода на страницу с выбранным в фильре параметром
    useEffect(() => {
        const currentPageIndex = table.getState().pagination.pageIndex;
        const pageCount = table.getPageCount();

        if (pageCount <= currentPageIndex && currentPageIndex > 0) {
            const params = new URLSearchParams(searchParams.toString());
            params.set('page', '1');
            router.push(`?${params.toString()}`, { scroll: false });
        }
    }, [table.getState().columnFilters]); // eslint-disable-line react-hooks/exhaustive-deps

    return (
        <div className="mt-6 flex flex-col gap-4">
            <div className="rounded-lg overflow-hidden boarder boarder-boarder">
                <Table className="border">
                    <TableHeader>
                        {table.getHeaderGroups().map((headerGroup) => (
                            <TableRow key={headerGroup.id}>
                                {headerGroup.headers.map((header) => {
                                    return (
                                        <TableHead
                                            key={header.id}
                                            className="bg-secondary p-1"
                                            style={{ width: header.getSize() }}
                                        >
                                            <div>
                                                {header.isPlaceholder
                                                    ? null
                                                    : flexRender(
                                                          header.column
                                                              .columnDef.header,
                                                          header.getContext()
                                                      )}
                                            </div>
                                            {/* // вставляем фильтр */}
                                            {header.column.getCanFilter() ? (
                                                <div className="grid place-content-center">
                                                    <Filter
                                                        column={header.column}
                                                        filteredRows={table
                                                            .getFilteredRowModel()
                                                            .rows.map((row) =>
                                                                row.getValue(
                                                                    header
                                                                        .column
                                                                        .id
                                                                )
                                                            )}
                                                    />
                                                </div>
                                            ) : null}
                                        </TableHead>
                                    );
                                })}
                            </TableRow>
                        ))}
                    </TableHeader>
                    <TableBody>
                        {table.getRowModel().rows.map((row) => (
                            <TableRow
                                key={row.id}
                                className="cursor-pointer hover:bg-border/25 dark:hover:bg-ring/40"
                                onClick={() =>
                                    router.push(
                                        `/tickets/form?ticketId=${row.original.id}`
                                    )
                                }
                            >
                                {row.getVisibleCells().map((cell) => (
                                    <TableCell key={cell.id} className="border">
                                        {flexRender(
                                            cell.column.columnDef.cell,
                                            cell.getContext()
                                        )}
                                    </TableCell>
                                ))}
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </div>
            <div className="flex justify-between items-center gap-1 flex-wrap">
                <div>
                    <p className="whitespace-nowrap font-bold">
                        {`Page ${
                            table.getState().pagination.pageIndex + 1
                        } of ${Math.max(table.getPageCount())} `}
                        &nbsp;&nbsp;
                        {`[${table.getFilteredRowModel().rows.length} ${
                            table.getFilteredRowModel().rows.length !== 1
                                ? 'Total result'
                                : 'Result'
                        }]`}
                    </p>
                </div>
                <div className="flex flex-row gap-1">
                    <div className="flex flex-row gap-1">
                        <Button
                            variant="outline"
                            onClick={() => router.refresh()}
                        >
                            Refresh Data
                        </Button>
                        <Button
                            variant="outline"
                            onClick={() => table.resetSorting()}
                        >
                            Reset Sorting
                        </Button>
                        <Button
                            variant="outline"
                            onClick={() => table.resetColumnFilters()}
                        >
                            Reset Filters
                        </Button>
                    </div>
                    <div className="flex flex-row gap-1">
                        <Button
                            variant="outline"
                            /* onClick={() => table.previousPage()} */
                            onClick={() => {
                                const newIndex =
                                    table.getState().pagination.pageIndex - 1;
                                table.setPageIndex(newIndex);
                                const params = new URLSearchParams(
                                    searchParams.toString()
                                );
                                params.set('page', (newIndex + 1).toString());
                                router.replace(`?${params.toString}`, {
                                    scroll: false,
                                });
                            }}
                            disabled={!table.getCanPreviousPage()}
                        >
                            Previous
                        </Button>
                        <Button
                            variant="outline"
                            /* onClick={() => table.nextPage()} */
                            onClick={() => {
                                const newIndex =
                                    table.getState().pagination.pageIndex + 1;
                                table.setPageIndex(newIndex);
                                const params = new URLSearchParams(
                                    searchParams.toString()
                                );
                                params.set('page', (newIndex + 1).toString());
                                router.replace(`?${params.toString()}`, {
                                    scroll: false,
                                });
                            }}
                            disabled={!table.getCanNextPage()}
                        >
                            Next
                        </Button>
                    </div>
                </div>
            </div>
        </div>
    );
}
