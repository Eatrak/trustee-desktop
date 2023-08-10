import {
    createColumnHelper,
    getCoreRowModel,
    useReactTable,
} from "@tanstack/react-table";
import dayjs from "dayjs";

import "./style.css";
import { Utils } from "@shared/services/utils";
import TableCell from "@shared/components/Table/TableCell";
import TableHeader from "@shared/components/Table/TableHeader";
import TableTBody from "@shared/components/Table/TableTBody";
import TableTHead from "@shared/components/Table/TableTHead";
import Table from "@shared/components/Table";
import { WalletTableRow } from "@shared/ts-types/DTOs/wallets";

const getAmountToDisplay = (amount: number, currencyCode: string) => {
    return `${Utils.getInstance().getFormattedAmount(currencyCode, amount)}`;
};

const columnHelper = createColumnHelper<WalletTableRow>();

const columns = [
    columnHelper.accessor("name", {
        id: "name",
        cell: (info) => <TableCell text={info.getValue()} />,
        header: () => <TableHeader text="Name" style={{ minWidth: "180px" }} />,
    }),
    columnHelper.accessor("net", {
        id: "net",
        cell: ({ row }) => (
            <TableCell
                text={getAmountToDisplay(row.original.net, row.original.currencyCode)}
            />
        ),
        header: () => <TableHeader text="Net" style={{ minWidth: "140px" }} />,
    }),
    columnHelper.accessor("income", {
        id: "income",
        cell: ({ row }) => (
            <TableCell
                text={getAmountToDisplay(row.original.income, row.original.currencyCode)}
            />
        ),
        header: () => <TableHeader text="Income" style={{ minWidth: "140px" }} />,
    }),
    columnHelper.accessor("expense", {
        id: "expense",
        cell: ({ row }) => (
            <TableCell
                text={getAmountToDisplay(row.original.expense, row.original.currencyCode)}
            />
        ),
        header: () => <TableHeader text="Expense" style={{ minWidth: "140px" }} />,
    }),
    // columnHelper.accessor("creationDate", {
    //     id: "creationDate",
    //     cell: (info) => <TableCell text={info.getValue().format("MM/DD/YYYY")} />,
    //     header: () => <TableHeader text="Creation date" style={{ minWidth: "100px" }} />,
    // }),
    columnHelper.accessor("transactionsCount", {
        id: "transactionsCount",
        cell: (info) => <TableCell text={info.getValue().toString()} />,
        header: () => (
            <TableHeader text="Transactions count" style={{ minWidth: "80px" }} />
        ),
    }),
];

interface IProps {
    className?: string;
    data: WalletTableRow[];
}

const WalletsTable = ({ className = "", data }: IProps) => {
    const table = useReactTable({
        data,
        columns,
        getCoreRowModel: getCoreRowModel(),
    });

    return (
        <Table className={className}>
            <TableTHead table={table} />
            <TableTBody table={table} />
        </Table>
    );
};

export default WalletsTable;
