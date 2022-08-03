import "./style.css";

import { MdDone } from "react-icons/md";

interface IProps {
    checked: boolean,
    setChecked: (...p: any) => any
}

const Checkbox = ({ checked, setChecked }: IProps) => {
    return (
        <div className="checkbox" onClick={e => setChecked(!checked)}>
            <input className="checkbox__input" type="checkbox"/>
            {checked && <div className="checkbox__checked-box">
                <MdDone className="checkbox__checked-box__icon"/>
            </div>}
        </div>
    );
};

export default Checkbox;