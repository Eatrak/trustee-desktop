import "./style.css";

import NavbarUserBadge from "./NavbarUserBadge";

const Navbar = () => {
    return (
        <div className="navbar">
            <div className="navbar__button-container">
            </div>
            <NavbarUserBadge firstName="John" lastName="Doe" email="johndoe@example.com"/>
        </div>
    );
};

export default Navbar;