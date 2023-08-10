import { FC, ReactNode } from "react";

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
