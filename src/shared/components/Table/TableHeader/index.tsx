import { FC } from "react";

interface IProps extends React.InputHTMLAttributes<HTMLParagraphElement> {
    text: string;
}

const TableHeader: FC<IProps> = ({ text, ...nativeAttributes }) => {
    return (
        <p className="paragraph--small table__header" {...nativeAttributes}>
            {text}
        </p>
    );
};

export default TableHeader;
