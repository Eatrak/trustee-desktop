import "./style.css";

import { RiLoader5Fill } from "react-icons/ri";

interface IProps {
    className?: string
}

const LoadingIcon = ({ className }: IProps) => {
    return (
        <RiLoader5Fill className={`text-button__icon loading-icon ${className}`}/>
    );
};

export default LoadingIcon;