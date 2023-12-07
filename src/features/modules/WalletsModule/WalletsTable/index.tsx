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
import { ArrowUpDown } from "lucide-react";

import { Button } from "@/components/ui/button";
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table";
import { Utils } from "@/shared/services/utils";
import { WalletTableRow } from "@/shared/ts-types/DTOs/wallets";
import { TranslationKey } from "@/shared/ts-types/generic/translations";
import TableSkeletonRow from "@/components/ui/table-skeleton-row";
import { Icons } from "@/components/ui/icons";
import { useNavigate } from "react-router-dom";

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
        cell: ({ row }) => <div className="capitalize">{row.original.name}</div>,
    },
    {
        accessorKey: "net",
        header: ({ column }) => {
            return (
                <div className="text-right">
                    <Button
                        variant="ghost"
                        onClick={() =>
                            column.toggleSorting(column.getIsSorted() === "asc")
                        }
                    >
                        {translate([TranslationKey.NET])}
                        <ArrowUpDown className="ml-2 h-4 w-4" />
                    </Button>
                </div>
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
        cell: ({ row }) => (
            <div className="lowercase">{row.original.transactionsCount}</div>
        ),
    },
    {
        accessorKey: "actions",
        header: "",
        maxSize: 50,
        cell: ({ row }) => {
            const navigate = useNavigate();

            return (
                <div className="d-flex flex-column space-x-2 text-right">
                    <Button
                        variant="outline"
                        size="icon"
                        onClick={() => navigate(`/wallets/${row.original.id}`)}
                    >
                        <Icons.pencil />
                    </Button>
                </div>
            );
        },
    },
];

interface IProps {
    wallets: WalletTableRow[];
    isLoading?: boolean;
}

const skeletonWallets: WalletTableRow[] = Array.from(Array(5).keys()).map((id) => ({
    id: id.toString(),
    net: 0,
    income: 0,
    expense: 0,
    transactionsCount: 0,
    currencyCode: "",
    name: "",
    userId: "",
    currencyId: "",
    untrackedBalance: 0,
}));

export function WalletsTable({ wallets, isLoading = false }: IProps) {
    const [sorting, setSorting] = React.useState<SortingState>([]);
    const [columnFilters, setColumnFilters] = React.useState<ColumnFiltersState>([]);
    const [columnVisibility, setColumnVisibility] = React.useState<VisibilityState>({});
    const [rowSelection, setRowSelection] = React.useState({});

    const table = useReactTable({
        data: isLoading ? skeletonWallets : wallets,
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
                        {isLoading ? (
                            table
                                .getRowModel()
                                .rows.map((row) => <TableSkeletonRow row={row} />)
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
