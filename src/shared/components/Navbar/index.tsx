import "./style.css";

import { useState, useEffect } from "react";
import { MdOutlineAccountBalanceWallet, MdOutlineCreditCard } from "react-icons/md";
import { Subscription } from "rxjs";

import NavbarButton from "./NavbarButton";
import NavbarUserBadge from "./NavbarUserBadge";
import AuthService from "@shared/services/auth";
import { Utils } from "@shared/services/utils";
import { TranslationKey } from "@shared/ts-types/generic/translations";

const Navbar = () => {
    const [name, setName] = useState<string>("");
    const [surname, setSurname] = useState<string>("");
    const [email, setEmail] = useState<string>("");
    let personalInfoSubcription: Subscription;

    const translateButton = (translationKey: TranslationKey) => {
        return Utils.getInstance().translate([
            TranslationKey.NAVBAR,
            TranslationKey.BUTTONS,
            translationKey,
        ]);
    };

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
                <NavbarButton
                    path="/wallets"
                    Icon={MdOutlineAccountBalanceWallet}
                    text={translateButton(TranslationKey.WALLETS)}
                />
                <NavbarButton
                    path="/transactions"
                    Icon={MdOutlineCreditCard}
                    text={translateButton(TranslationKey.TRANSACTIONS)}
                />
            </div>
            <NavbarUserBadge firstName={name} lastName={surname} email={email} />
        </div>
    );
};

export default Navbar;
