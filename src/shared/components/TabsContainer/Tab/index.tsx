import { IconType } from "react-icons";

import "./style.css";
import "../../Navbar/NavbarButton/style.css";

export type TabOnClickEvent = (id: string) => void;

export interface IProps {
    id: string;
    isActive: boolean;
    name: string;
    Icon?: IconType;
    onClick: TabOnClickEvent;
}

const Tab = ({ id, isActive, name, Icon, onClick }: IProps) => {
    return (
        <div
            className={`${isActive ? "tab-container--selected" : ""}`}
            onClick={() => onClick(id)}
        >
            <div
                className={`tab navbar-button ${
                    isActive ? "navbar-button--selected" : ""
                }`}
            >
                <div className="navbar__button__container">
                    {Icon && <Icon className="navbar__button__container__icon" />}
                    <p className="navbar__button__container__text paragraph--small paragraph--sub-title">
                        {name}
                    </p>
                </div>
            </div>

            <div className="tab-container__underline"></div>
        </div>
    );
};

export default Tab;
