import "./style.css";

import { useState, useEffect } from "react";
import { MdOutlineCreditCard } from "react-icons/md";

import NavbarButton from "./NavbarButton";
import NavbarUserBadge from "./NavbarUserBadge";
import AuthService from "@services/auth";

const Navbar = () => {
    const [ name, setName ] = useState<string>("");
    const [ surname, setSurname ] = useState<string>("");
    const [ email, setEmail ] = useState<string>("");

    useEffect(() => {
        AuthService.getInstance().personalInfo$.subscribe(personalInfo => {
            const { name, surname, email } = personalInfo;
            setName(name);
            setSurname(surname);
            setEmail(email);
        });
    }, []);

    return (
        <div className="navbar">
            <div className="navbar__button-container">
                <NavbarButton path="/" Icon={MdOutlineCreditCard} text="Transactions"/>
            </div>
            <NavbarUserBadge firstName={name} lastName={surname} email={email}/>
        </div>
    );
};

export default Navbar;