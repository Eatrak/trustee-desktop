import { FC, ReactNode } from "react";

import "./style.css";

interface IProps {
    className?: string;
    children: ReactNode;
}

const Table: FC<IProps> = ({ className = "", children }) => {
    return (
        <div className={`table card ${className}`}>
            <div className="table__wrapper">
                <table>{children}</table>
            </div>
        </div>
    );
};

export default Table;
