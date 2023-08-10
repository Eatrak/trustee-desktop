import { FC, ReactNode } from "react";

interface IProps {
    actions: ReactNode;
}

const TableActions: FC<IProps> = ({ actions }) => {
    return <div className="table__actions">{actions}</div>;
};

export default TableActions;
