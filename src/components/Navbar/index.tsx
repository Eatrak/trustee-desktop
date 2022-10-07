import "./style.css";

import { MdOutlineCreditCard } from "react-icons/md";

import NavbarButton from "./NavbarButton";
import NavbarUserBadge from "./NavbarUserBadge";

const Navbar = () => {
    return (
        <div className="navbar">
            <div className="navbar__button-container">
                <NavbarButton path="/" Icon={MdOutlineCreditCard} text="Transactions"/>
            </div>
            <NavbarUserBadge firstName="John" lastName="Doe" email="johndoe@example.com"/>
        </div>
    );
};

export default Navbar;