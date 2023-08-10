import { useEffect, useState } from "react";
import "./style.css";

import { IconType } from "react-icons";
import { Link, useLocation } from "react-router-dom";

interface IProps {
    Icon: IconType;
    text: string;
    path: string;
}

const NavbarButton = ({ Icon, text, path }: IProps) => {
    const [isSelected, setIsSelected] = useState(false);
    let location = useLocation();

    const getSelectedStyle = () => {
        return isSelected ? " navbar-button--selected" : "";
    };

    useEffect(() => {
        setIsSelected(path === location.pathname);
    }, [location]);

    return (
        <Link to={path} style={{ textDecoration: "none" }} draggable={false}>
            <div className={"navbar-button" + getSelectedStyle()}>
                <div className="navbar__button__container">
                    <Icon className="navbar__button__container__icon" />
                    <p className="paragraph--small paragraph--bold navbar__button__container__text">
                        {text}
                    </p>
                </div>
            </div>
        </Link>
    );
};

export default NavbarButton;
