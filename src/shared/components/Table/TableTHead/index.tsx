import { FC } from "react";
import { Table, flexRender } from "@tanstack/react-table";

export interface TableTHeadProps {
    table: Table<any>;
}

const TableTHead: FC<TableTHeadProps> = ({ table }) => {
    return (
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
    );
};

export default TableTHead;
