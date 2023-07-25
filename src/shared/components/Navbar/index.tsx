import "./style.css";

import { useState, useEffect } from "react";
import { MdOutlineCreditCard } from "react-icons/md";
import { Subscription } from "rxjs";

import NavbarButton from "./NavbarButton";
import NavbarUserBadge from "./NavbarUserBadge";
import AuthService from "@shared/services/auth";

const Navbar = () => {
    const [name, setName] = useState<string>("");
    const [surname, setSurname] = useState<string>("");
    const [email, setEmail] = useState<string>("");
    let personalInfoSubcription: Subscription;

    useEffect(() => {
        personalInfoSubcription = AuthService.getInstance().personalInfo$.subscribe(
            (personalInfo) => {
                const { name, surname, email } = personalInfo;
                setName(name);
                setSurname(surname);
                setEmail(email);
            },
        );
    }, []);

    useEffect(
        () => () => {
            personalInfoSubcription.unsubscribe();
        },
        [],
    );

    return (
        <div className="navbar">
            <div className="navbar__button-container">
                <NavbarButton path="/" Icon={MdOutlineCreditCard} text="Transactions" />
            </div>
            <NavbarUserBadge firstName={name} lastName={surname} email={email} />
        </div>
    );
};

export default Navbar;
