import { FC } from "react";
import { Table, flexRender } from "@tanstack/react-table";

export interface TableTBodyProps {
    table: Table<any>;
}

const TableTBody: FC<TableTBodyProps> = ({ table }) => {
    return (
        <tbody>
            {table.getRowModel().rows.map((row) => (
                <tr key={row.id} className="table__row">
                    {row.getVisibleCells().map((cell) => (
                        <td key={cell.id}>
                            {flexRender(cell.column.columnDef.cell, cell.getContext())}
                        </td>
                    ))}
                </tr>
            ))}
        </tbody>
    );
};

export default TableTBody;
