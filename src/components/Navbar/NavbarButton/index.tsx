import "./style.css";

import { IconType } from "react-icons";
import { Link } from "react-router-dom";

interface IProps {
    Icon: IconType,
    text: string,
    path: string
}

const NavbarButton = ({ Icon, text, path }: IProps) => {
    const getSelectedStyle = () => {
        return path === document.location.pathname ? " navbar-button--selected" : "";
    };

    return (
        <Link to={path} style={{textDecoration: "none"}}>
            <div className={"navbar-button" + getSelectedStyle()}>
                <div className="navbar__button__container">
                    <Icon className="navbar__button__container__icon"/>
                    <p className="paragraph--regular paragraph--bold navbar__button__container__text">{text}</p>
                </div>
            </div>
        </Link>
    );
};

export default NavbarButton;