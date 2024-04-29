"use client";

import * as React from "react";
import {
    ColumnDef,
    ColumnFiltersState,
    SortingState,
    VisibilityState,
    flexRender,
    getCoreRowModel,
    getFilteredRowModel,
    getPaginationRowModel,
    getSortedRowModel,
    useReactTable,
} from "@tanstack/react-table";

import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table";
import { Utils } from "@/shared/services/utils";
import { TransactionTableRow } from "@/shared/ts-types/DTOs/transactions";
import { TranslationKey } from "@/shared/ts-types/generic/translations";
import TableSkeletonRow from "@/components/ui/table-skeleton-row";

const getAmountToDisplay = (amount: number, currencyCode: string) => {
    return `${Utils.getInstance().getFormattedAmount(currencyCode, amount)}`;
};

const translate = (translationKeys: TranslationKey[]) => {
    return Utils.getInstance().translate([
        TranslationKey.MODULES,
        TranslationKey.TRANSACTIONS,
        TranslationKey.TABLE,
        ...translationKeys,
    ]);
};

export const columns: ColumnDef<TransactionTableRow>[] = [
    {
        accessorKey: "name",
        header: () => <div>{translate([TranslationKey.NAME])}</div>,
        cell: ({ row }) => <div className="capitalize">{row.original.name}</div>,
    },
    {
        accessorKey: "expense",
        header: () => (
            <div className="text-right">{translate([TranslationKey.AMOUNT])}</div>
        ),
        cell: ({ row }) => {
            return (
                <div className="text-right font-medium">
                    {getAmountToDisplay(row.original.amount, row.original.currencyCode)}
                </div>
            );
        },
    },
    {
        accessorKey: "carriedOut",
        header: () => <div>{translate([TranslationKey.CREATION_DATE])}</div>,
        cell: ({ row }) => (
            <div className="capitalize">
                {Utils.getInstance().getFormattedDateFromUnixTime(
                    row.original.carriedOut,
                )}
            </div>
        ),
    },
];

interface IProps {
    transactions: TransactionTableRow[];
    isLoading?: boolean;
    columnClassNames?: string[];
}

const skeletonTransactions: TransactionTableRow[] = Array.from(Array(5).keys()).map(
    (id) => ({
        id: id.toString(),
        currencyId: "",
        currencyCode: "",
        currencySymbol: "",
        amount: 0,
        carriedOut: 0,
        createdAt: 0,
        isIncome: false,
        name: "",
        userId: "",
        walletId: "",
        walletName: "",
    }),
);

export function TransactionsTable({
    transactions,
    isLoading = false,
    columnClassNames = [],
}: IProps) {
    const [sorting, setSorting] = React.useState<SortingState>([]);
    const [columnFilters, setColumnFilters] = React.useState<ColumnFiltersState>([]);
    const [columnVisibility, setColumnVisibility] = React.useState<VisibilityState>({});
    const [rowSelection, setRowSelection] = React.useState({});

    const table = useReactTable({
        data: isLoading ? skeletonTransactions : transactions,
        columns,
        onSortingChange: setSorting,
        onColumnFiltersChange: setColumnFilters,
        getCoreRowModel: getCoreRowModel(),
        getPaginationRowModel: getPaginationRowModel(),
        getSortedRowModel: getSortedRowModel(),
        getFilteredRowModel: getFilteredRowModel(),
        onColumnVisibilityChange: setColumnVisibility,
        onRowSelectionChange: setRowSelection,
        state: {
            sorting,
            columnFilters,
            columnVisibility,
            rowSelection,
        },
    });

    return (
        <div>
            <div className="rounded-md border">
                <Table>
                    <TableHeader>
                        {table.getHeaderGroups().map((headerGroup) => (
                            <TableRow key={headerGroup.id}>
                                {headerGroup.headers.map((header, index) => {
                                    return (
                                        <TableHead
                                            key={header.id}
                                            className={
                                                columnClassNames[index] &&
                                                columnClassNames[index]
                                            }
                                        >
                                            {header.isPlaceholder
                                                ? null
                                                : flexRender(
                                                      header.column.columnDef.header,
                                                      header.getContext(),
                                                  )}
                                        </TableHead>
                                    );
                                })}
                            </TableRow>
                        ))}
                    </TableHeader>
                    <TableBody>
                        {isLoading ? (
                            table
                                .getRowModel()
                                .rows.map((row) => (
                                    <TableSkeletonRow key={Math.random()} row={row} />
                                ))
                        ) : table.getRowModel().rows?.length ? (
                            table.getRowModel().rows.map((row) => (
                                <TableRow
                                    key={row.id}
                                    data-state={row.getIsSelected() && "selected"}
                                >
                                    {row.getVisibleCells().map((cell) => (
                                        <TableCell key={cell.id}>
                                            {flexRender(
                                                cell.column.columnDef.cell,
                                                cell.getContext(),
                                            )}
                                        </TableCell>
                                    ))}
                                </TableRow>
                            ))
                        ) : (
                            <TableRow>
                                <TableCell
                                    colSpan={columns.length}
                                    className="h-24 text-center"
                                >
                                    No results.
                                </TableCell>
                            </TableRow>
                        )}
                    </TableBody>
                </Table>
            </div>
        </div>
    );
}
