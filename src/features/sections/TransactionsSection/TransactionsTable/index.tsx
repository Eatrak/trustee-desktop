import {
    createColumnHelper,
    getCoreRowModel,
    useReactTable,
} from "@tanstack/react-table";
import dayjs from "dayjs";
import { MdDeleteOutline } from "react-icons/md";

import "./style.css";
import { Utils } from "@shared/services/utils";
import RoundedTextIconButton from "@shared/components/RoundedTextIconButton";
import TableCell from "@shared/components/Table/TableCell";
import TableHeader from "@shared/components/Table/TableHeader";
import TableTBody from "@shared/components/Table/TableTBody";
import TableTHead from "@shared/components/Table/TableTHead";
import TableActions from "@shared/components/Table/TableActions";
import Table from "@shared/components/Table";
import TableNoDataContainer from "@shared/components/Table/TableNoDataContainer";
import { TranslationKey } from "@shared/ts-types/generic/translations";

export interface TransactionsTableItem {
    id: string;
    name: string;
    creationDate: dayjs.Dayjs;
    amount: number;
    currencyCode: string;
    isIncome: boolean;
    onDeleteButtonClicked: (transaction: TransactionsTableItem) => any;
}

const getAmountToDisplay = (amount: number, isIncome: boolean, currencyCode: string) => {
    return `${isIncome ? "+" : "-"} ${Utils.getInstance().getFormattedAmount(
        currencyCode,
        amount,
    )}`;
};

const translate = (translationKeys: TranslationKey[]) => {
    return Utils.getInstance().translate([
        TranslationKey.MODULES,
        TranslationKey.TRANSACTIONS,
        TranslationKey.TABLE,
        ...translationKeys,
    ]);
};

const columnHelper = createColumnHelper<TransactionsTableItem>();

const columns = [
    // @ts-ignore TODO: remove ts-ignore after the library will be fixed
    columnHelper.accessor("name", {
        id: "name",
        cell: (info) => <TableCell text={info.getValue()} />,
        header: () => (
            <TableHeader
                text={translate([TranslationKey.NAME])}
                style={{ minWidth: "180px" }}
            />
        ),
    }),
    columnHelper.accessor("creationDate", {
        id: "creationDate",
        cell: (info) => <TableCell text={info.getValue().format("MM/DD/YYYY")} />,
        header: () => (
            <TableHeader
                text={translate([TranslationKey.CREATION_DATE])}
                style={{ minWidth: "100px" }}
            />
        ),
    }),
    columnHelper.accessor("amount", {
        id: "amount",
        cell: ({ row }) => (
            <TableCell
                className={`${
                    row.original.isIncome ? "table__cell__amount--income" : ""
                }`}
                text={getAmountToDisplay(
                    row.original.amount,
                    row.original.isIncome,
                    row.original.currencyCode,
                )}
            />
        ),
        header: () => (
            <TableHeader
                text={translate([TranslationKey.AMOUNT])}
                style={{ minWidth: "140px" }}
            />
        ),
    }),
    columnHelper.display({
        id: "actions",
        cell: (info) => (
            <TableActions
                actions={[
                    <RoundedTextIconButton
                        Icon={MdDeleteOutline}
                        state="danger"
                        clickEvent={(e) => {
                            // Avoid to open the transaction item
                            e.stopPropagation();

                            info.row.original.onDeleteButtonClicked(info.row.original);
                        }}
                    />,
                ]}
            />
        ),
    }),
];

interface IProps {
    className?: string;
    data: TransactionsTableItem[];
    hasBeenLoaded: boolean;
}

const TransactionsTable = ({ className = "", data, hasBeenLoaded }: IProps) => {
    const table = useReactTable({
        data,
        columns,
        getCoreRowModel: getCoreRowModel(),
    });

    return data.length == 0 && hasBeenLoaded ? (
        <TableNoDataContainer />
    ) : (
        <Table className={className}>
            <TableTHead table={table} />
            <TableTBody table={table} />
        </Table>
    );
};

export default TransactionsTable;
