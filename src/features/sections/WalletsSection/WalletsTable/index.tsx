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
import TableActions from "@shared/components/Table/TableActions";
import RoundedTextIconButton from "@shared/components/RoundedTextIconButton";
import { MdDeleteOutline, MdOutlineModeEditOutline } from "react-icons/md";

const getAmountToDisplay = (amount: number, currencyCode: string) => {
    return `${Utils.getInstance().getFormattedAmount(currencyCode, amount)}`;
};

interface IProps {}

const columnHelper = createColumnHelper<WalletTableRow>();

const getColumns = (
    onEditButtonClicked: (transaction: WalletTableRow) => any,
    onDeleteButtonClicked: (transaction: WalletTableRow) => any,
) => [
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
    columnHelper.accessor("untrackedBalance", {
        id: "untrackedBalance",
        cell: ({ row }) => (
            <TableCell
                text={getAmountToDisplay(
                    row.original.untrackedBalance,
                    row.original.currencyCode,
                )}
            />
        ),
        header: () => (
            <TableHeader text="Untracked balance" style={{ minWidth: "140px" }} />
        ),
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
    columnHelper.display({
        id: "actions",
        cell: (info) => (
            <TableActions
                actions={[
                    <RoundedTextIconButton
                        Icon={MdOutlineModeEditOutline}
                        clickEvent={(e) => {
                            // Avoid to open the transaction item
                            e.stopPropagation();

                            onEditButtonClicked(info.row.original);
                        }}
                    />,
                    <RoundedTextIconButton
                        Icon={MdDeleteOutline}
                        state="danger"
                        clickEvent={(e) => {
                            // Avoid to open the transaction item
                            e.stopPropagation();

                            onDeleteButtonClicked(info.row.original);
                        }}
                    />,
                ]}
            />
        ),
    }),
];

interface IProps {
    className?: string;
    data: WalletTableRow[];
    onEditButtonClicked: (transaction: WalletTableRow) => any;
    onDeleteButtonClicked: (transaction: WalletTableRow) => any;
}

const WalletsTable = ({
    className = "",
    data,
    onEditButtonClicked,
    onDeleteButtonClicked,
}: IProps) => {
    const table = useReactTable({
        data,
        columns: getColumns(onEditButtonClicked, onDeleteButtonClicked),
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
