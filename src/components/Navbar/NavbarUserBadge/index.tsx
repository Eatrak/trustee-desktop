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
                <p className="navbar__user-badge__image__letters paragraph--small paragraph--bold">{getNameInitials()}</p>
            </div>
            <div className="navbar__user-badge__text-container">
                <p className="paragraph--regular paragraph--bold">{firstName} {lastName}</p>
                <p className="paragraph--small navbar__user-badge__email">{email}</p>
            </div>
        </div>
    );
};

export default NavbarUserBadge;