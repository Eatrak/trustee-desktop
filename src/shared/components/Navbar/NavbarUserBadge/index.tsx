import { Tooltip } from "react-tooltip";
import "./style.css";
import RoundedTextIconButton from "@shared/components/RoundedTextIconButton";
import { MdOutlineSettings } from "react-icons/md";
import { Link } from "react-router-dom";

interface IProps {
    firstName: string;
    lastName: string;
    email: string;
}

const NavbarUserBadge = ({ firstName, lastName, email }: IProps) => {
    const getNameInitials = () => {
        return (firstName.charAt(0) + lastName.charAt(0)).toUpperCase();
    };

    return (
        <div className="navbar__user-badge">
            <div className="navbar__user-badge__image">
                <p className="navbar__user-badge__image__letters paragraph--small paragraph--bold">
                    {getNameInitials()}
                </p>
            </div>
            <div className="navbar__user-badge__text-container">
                <p
                    data-tooltip-id="user-badge-name-and-surname"
                    data-tooltip-content={`${firstName} ${lastName}`}
                    className="paragraph--small paragraph--bold navbar__user-badge__name-and-surname"
                >
                    {firstName} {lastName}
                </p>
                <Tooltip id="user-badge-name-and-surname" />

                <p
                    data-tooltip-id="user-badge-plan"
                    data-tooltip-content="Free plan"
                    className="paragraph--small navbar__user-badge__plan"
                >
                    Free plan
                </p>
                <Tooltip id="user-badge-plan" />
            </div>
            <Link to="settings/info" draggable={false}>
                <RoundedTextIconButton Icon={MdOutlineSettings} size="small" />
            </Link>
        </div>
    );
};

export default NavbarUserBadge;
