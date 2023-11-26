import { Row } from "@tanstack/react-table";

import { Skeleton } from "./skeleton";
import { TableCell, TableRow } from "@/components/ui/table";

interface IProps {
    row: Row<any>;
}

const TableSkeletonRow = ({ row }: IProps) => {
    return (
        <TableRow key={row.id}>
            {row.getVisibleCells().map((cell) => (
                <TableCell key={cell.id}>
                    <Skeleton className="h-[20px] rounded-full" />
                </TableCell>
            ))}
        </TableRow>
    );
};

export default TableSkeletonRow;
