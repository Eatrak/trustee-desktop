import { Tooltip } from "react-tooltip";
import "./style.css";

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
                    data-tooltip-id="user-badge-email"
                    data-tooltip-content={email}
                    className="paragraph--small navbar__user-badge__email"
                >
                    {email}
                </p>
                <Tooltip id="user-badge-email" />
            </div>
        </div>
    );
};

export default NavbarUserBadge;
