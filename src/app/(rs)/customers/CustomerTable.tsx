'use client';

import type { selectCustomerSchemaType } from '@/zod-schemas/customer';

import {
    createColumnHelper,
    flexRender,
    getCoreRowModel,
    useReactTable,
    CellContext,
} from '@tanstack/react-table';

import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from '@/components/ui/table';

/* import { useRouter } from 'next/navigation'; */

// beelow for DropDownMenu
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { TableOfContents, MoreHorizontal } from 'lucide-react';
import { Button } from '@/components/ui/button';
import Link from 'next/link';

type Props = {
    data: selectCustomerSchemaType[];
};

export default function CustomerTable({ data }: Props) {
    /* const router = useRouter(); */

    const columnHeadersArray: Array<keyof selectCustomerSchemaType> = [
        'firstName',
        'lastName',
        'email',
        'phone',
        /* 'address1', */
        'city',
        'zip',
    ];

    const columnHelper = createColumnHelper<selectCustomerSchemaType>();

    const ActionsCell = ({
        row,
    }: CellContext<selectCustomerSchemaType, unknown>) => {
        return (
            <DropdownMenu>
                <DropdownMenuTrigger asChild>
                    <Button variant="ghost" className="h-8 w-8 p-0">
                        <span className="sr-only">Open menu</span>
                        <MoreHorizontal className="h-4 w-4" />
                    </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                    <DropdownMenuLabel>Actions</DropdownMenuLabel>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem>
                        <Link
                            href={`/tickets/form?customerId=${row.original.id}`}
                            className="w-full"
                            prefetch={false}
                        >
                            New Ticket
                        </Link>
                    </DropdownMenuItem>
                    <DropdownMenuItem>
                        <Link
                            href={`/customers/form?customerId=${row.original.id}`}
                            className="w-full"
                            prefetch={false}
                        >
                            Edit Customer
                        </Link>
                    </DropdownMenuItem>
                </DropdownMenuContent>
            </DropdownMenu>
        );
    };
    ActionsCell.displayName = 'ActionsCell';

    /* const columns = [
        columnHelper.accessor('firstName', { header: 'First Name' }),
    ];*/

    /* const columns = columnHeadersArray.map((columnName) => {
        return columnHelper.accessor(columnName, {
            id: columnName,
            header: columnName[0].toUpperCase() + columnName.slice(1),
        });
    }); */ // меняем так как добавили ActionsCell
    const columns = [
        columnHelper.display({
            id: 'actions',
            header: () => <TableOfContents />,
            cell: ActionsCell,
        }),
        ...columnHeadersArray.map((columnName) => {
            return columnHelper.accessor(columnName, {
                id: columnName,
                header: columnName[0].toUpperCase() + columnName.slice(1),
            });
        }),
    ];

    const table = useReactTable({
        data,
        columns,
        getCoreRowModel: getCoreRowModel(),
    });

    return (
        <div className="mt-6 rounded-lg overflow-hidden boarder boarder-boarder">
            <Table className="border">
                <TableHeader>
                    {table.getHeaderGroups().map((headerGroup) => (
                        <TableRow key={headerGroup.id}>
                            {headerGroup.headers.map((header) => {
                                return (
                                    <TableHead
                                        key={header.id}
                                        className={`bg-secondary ${
                                            header.id === 'actions'
                                                ? 'w-12'
                                                : ''
                                        }`}
                                    >
                                        <div
                                            className={`${
                                                header.id === 'actions'
                                                    ? 'flex justify-center items-center'
                                                    : ''
                                            }`}
                                        >
                                            {header.isPlaceholder
                                                ? null
                                                : flexRender(
                                                      header.column.columnDef
                                                          .header,
                                                      header.getContext()
                                                  )}
                                        </div>
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
                            className="cursor-pointer hover:bg-border/25 dark:hover:bg-ring/40" /* // отменяем открытие формы клиента по клику на его строке  */
                            /* onClick={() =>
                                router.push(
                                    `/customers/form?customerId=${row.original.id}`
                                )
                            }*/
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
    );
}
