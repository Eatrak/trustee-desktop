import {
    createColumnHelper,
    getCoreRowModel,
    useReactTable,
    flexRender,
} from "@tanstack/react-table";
import dayjs from "dayjs";
import { MdDeleteOutline } from "react-icons/md";

import "./style.css";
import { Utils } from "@shared/services/utils";
import RoundedTextIconButton from "@shared/components/RoundedTextIconButton";

export interface TransactionsTableItem {
    id: string;
    name: string;
    category: string;
    creationDate: dayjs.Dayjs;
    amount: number;
    currencyCode: string;
    isIncome: boolean;
    onDeleteButtonClicked: (transaction: TransactionsTableItem) => any;
}

const columnHelper = createColumnHelper<TransactionsTableItem>();

const columns = [
    // @ts-ignore TODO: remove ts-ignore after the library will be fixed
    columnHelper.accessor("name", {
        id: "name",
        cell: (info) => <p className="paragraph--small table__cell">{info.getValue()}</p>,
        header: () => (
            <p className="paragraph--small table__header" style={{ minWidth: "180px" }}>
                Name
            </p>
        ),
    }),
    columnHelper.accessor("category", {
        id: "category",
        cell: (info) => <p className="paragraph--small table__cell">{info.getValue()}</p>,
        header: () => (
            <p className="paragraph--small table__header" style={{ minWidth: "120px" }}>
                Category
            </p>
        ),
    }),
    columnHelper.accessor("creationDate", {
        id: "creationDate",
        cell: (info) => (
            <p className="paragraph--small table__cell" style={{ minWidth: "100px" }}>
                {info.getValue().format("MM/DD/YYYY")}
            </p>
        ),
        header: () => <p className="paragraph--small table__header">Creation date</p>,
    }),
    columnHelper.accessor("amount", {
        id: "amount",
        cell: (info) => (
            <p
                className={`${
                    info.row.original.isIncome ? "table__cell__amount--income" : ""
                } ? table__cell__amount--income} paragraph--small`}
                style={{ minWidth: "190px" }}
            >{`${
                info.row.original.isIncome ? "+" : "-"
            } ${Utils.getInstance().getFormattedAmount(
                info.row.original.currencyCode,
                info.getValue(),
            )}`}</p>
        ),
        header: () => <p className="table__header paragraph--small">Amount</p>,
    }),
    columnHelper.display({
        id: "actions",
        cell: (info) => (
            <div className="table__actions">
                <RoundedTextIconButton
                    Icon={MdDeleteOutline}
                    state="danger"
                    clickEvent={(e) => {
                        // Avoid to open the transaction item
                        e.stopPropagation();

                        info.row.original.onDeleteButtonClicked(info.row.original);
                    }}
                />
            </div>
        ),
    }),
];

interface IProps {
    className: string;
    data: TransactionsTableItem[];
}

const TransactionsTable = ({ className = "", data }: IProps) => {
    const table = useReactTable({
        data,
        columns,
        getCoreRowModel: getCoreRowModel(),
    });

    return (
        <div className={`table card ${className}`}>
            <div className="table__wrapper">
                <table>
                    <thead>
                        {table.getHeaderGroups().map((headerGroup) => (
                            <tr key={headerGroup.id}>
                                {headerGroup.headers.map((header) => (
                                    <th key={header.id}>
                                        {header.isPlaceholder
                                            ? null
                                            : flexRender(
                                                  header.column.columnDef.header,
                                                  header.getContext(),
                                              )}
                                    </th>
                                ))}
                            </tr>
                        ))}
                    </thead>
                    <tbody>
                        {table.getRowModel().rows.map((row) => (
                            <tr key={row.id} className="table__row">
                                {row.getVisibleCells().map((cell) => (
                                    <td key={cell.id}>
                                        {flexRender(
                                            cell.column.columnDef.cell,
                                            cell.getContext(),
                                        )}
                                    </td>
                                ))}
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default TransactionsTable;
