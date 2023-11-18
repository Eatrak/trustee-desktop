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
import { ArrowUpDown, ChevronDown, MoreHorizontal } from "lucide-react";

import { Button } from "@/components/ui/button";
import {
    DropdownMenu,
    DropdownMenuCheckboxItem,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table";
import { Utils } from "@/shared/services/utils";
import AuthService from "@/shared/services/auth";
import { WalletTableRow } from "@/shared/ts-types/DTOs/wallets";
import { TranslationKey } from "@/shared/ts-types/generic/translations";

const data: WalletTableRow[] = [
    {
        currencyCode: "EUR",
        currencyId: "1",
        expense: 1000,
        id: "abc123",
        income: 2000,
        name: "W 1",
        net: 1000,
        transactionsCount: 10,
        untrackedBalance: 0,
        userId: "user1",
    },
    {
        currencyCode: "USD",
        currencyId: "2",
        expense: 1000,
        id: "def456",
        income: 1500,
        name: "W 2",
        net: 500,
        transactionsCount: 5,
        untrackedBalance: 0,
        userId: "user2",
    },
];

const getAmountToDisplay = (amount: number, currencyCode: string) => {
    return `${Utils.getInstance().getFormattedAmount(currencyCode, amount)}`;
};

const translate = (translationKeys: TranslationKey[]) => {
    return Utils.getInstance().translate([
        TranslationKey.MODULES,
        TranslationKey.WALLETS,
        TranslationKey.TABLE,
        ...translationKeys,
    ]);
};

export const columns: ColumnDef<WalletTableRow>[] = [
    {
        accessorKey: "name",
        header: translate([TranslationKey.NAME]),
        cell: ({ row }) => <div className="capitalize">{row.getValue("status")}</div>,
    },
    {
        accessorKey: "net",
        header: ({ column }) => {
            return (
                <Button
                    variant="ghost"
                    onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
                >
                    {translate([TranslationKey.NET])}
                    <ArrowUpDown className="ml-2 h-4 w-4" />
                </Button>
            );
        },
        cell: ({ row }) => {
            return (
                <div className="text-right font-medium">
                    {getAmountToDisplay(row.original.net, row.original.currencyCode)}
                </div>
            );
        },
    },
    {
        accessorKey: "income",
        header: () => (
            <div className="text-right">{translate([TranslationKey.INCOME])}</div>
        ),
        cell: ({ row }) => {
            return (
                <div className="text-right font-medium">
                    {getAmountToDisplay(row.original.income, row.original.currencyCode)}
                </div>
            );
        },
    },
    {
        accessorKey: "expense",
        header: () => (
            <div className="text-right">{translate([TranslationKey.EXPENSE])}</div>
        ),
        cell: ({ row }) => {
            return (
                <div className="text-right font-medium">
                    {getAmountToDisplay(row.original.expense, row.original.currencyCode)}
                </div>
            );
        },
    },
    {
        accessorKey: "untrackedBalance",
        header: () => (
            <div className="text-right">
                {translate([TranslationKey.UNTRACKED_BALANCE])}
            </div>
        ),
        cell: ({ row }) => {
            return (
                <div className="text-right font-medium">
                    {getAmountToDisplay(
                        row.original.untrackedBalance,
                        row.original.currencyCode,
                    )}
                </div>
            );
        },
    },
    {
        accessorKey: "transactionsCount",
        header: translate([TranslationKey.TRANSACTIONS_COUNT]),
        cell: ({ row }) => <div className="lowercase">{row.getValue("email")}</div>,
    },
];

export function WalletsTable() {
    const [sorting, setSorting] = React.useState<SortingState>([]);
    const [columnFilters, setColumnFilters] = React.useState<ColumnFiltersState>([]);
    const [columnVisibility, setColumnVisibility] = React.useState<VisibilityState>({});
    const [rowSelection, setRowSelection] = React.useState({});

    const table = useReactTable({
        data,
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
                                {headerGroup.headers.map((header) => {
                                    return (
                                        <TableHead key={header.id}>
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
                        {table.getRowModel().rows?.length ? (
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
