import "./style.css";

import { MdDone } from "react-icons/md";

interface IProps {
    className?: string;
    text?: string;
    checked: boolean;
    setChecked: (...p: any) => any;
}

const Checkbox = ({ className, text, checked, setChecked }: IProps) => {
    return (
        <div className={`checkbox-with-text ${className ? className : ""}`}>
            {text && <p className="paragraph--small">{text}</p>}
            <div className="checkbox" onClick={(e) => setChecked(!checked)}>
                {checked && (
                    <div className="checkbox__checked-box">
                        <MdDone className="checkbox__checked-box__icon" />
                    </div>
                )}
            </div>
        </div>
    );
};

export default Checkbox;
