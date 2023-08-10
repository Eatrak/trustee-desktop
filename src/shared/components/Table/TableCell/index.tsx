import { FC } from "react";

interface IProps extends React.InputHTMLAttributes<HTMLParagraphElement> {
    text: string;
}

const TableCell: FC<IProps> = ({ className = "", text, ...nativeAttributes }) => {
    return (
        <p className={`paragraph--small table__cell ${className}`} {...nativeAttributes}>
            {text}
        </p>
    );
};

export default TableCell;
