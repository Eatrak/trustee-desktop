import { Subscription } from "rxjs";
import { useEffect, useState } from "react";
import { ArchiveIcon, ClipboardIcon, GearIcon } from "@radix-ui/react-icons";

import "./style.css";
import { TranslationKey } from "@/shared/ts-types/generic/translations";
import { Utils } from "@/shared/services/utils";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import AuthService from "@/shared/services/auth";
import NavbarButton from "./NavbarButton";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";

export const Navbar = () => {
    const [name, setName] = useState<string>("");
    const [surname, setSurname] = useState<string>("");
    const [email, setEmail] = useState<string>("");

    let personalInfoSubscription: Subscription;

    const translate = (translationKeys: TranslationKey[]) => {
        return Utils.getInstance().translate([
            TranslationKey.NAVBAR,
            TranslationKey.BUTTONS,
            ...translationKeys,
        ]);
    };

    useEffect(() => {
        personalInfoSubscription = AuthService.getInstance().personalInfo$.subscribe(
            ({ email, name, surname }) => {
                setEmail(email);
                setName(name);
                setSurname(surname);
            },
        );
    }, []);

    useEffect(
        () => () => {
            personalInfoSubscription.unsubscribe();
        },
        [],
    );

    return (
        <div className="navbar">
            <div className="navbar-content-container space-y-4 px-3 py-5">
                <div className="space-y-1 mt-14">
                    <NavbarButton
                        text={translate([TranslationKey.WALLETS])}
                        Icon={ArchiveIcon}
                        path="/wallets"
                    />
                    <NavbarButton
                        text={translate([TranslationKey.TRANSACTIONS])}
                        Icon={ClipboardIcon}
                        path="/transactions"
                    />
                </div>
                <div className="user-badge space-x-3">
                    <Avatar>
                        <AvatarFallback>
                            {name.charAt(0)}
                            {surname.charAt(0)}
                        </AvatarFallback>
                    </Avatar>

                    <div className="ml-4 space-y-1">
                        <p className="text-sm font-medium leading-none">
                            {name} {surname}
                        </p>
                        <p className="text-sm text-muted-foreground">Free plan</p>
                    </div>

                    <Link to="/settings/info" draggable={false}>
                        <Button variant="ghost" size="icon">
                            <GearIcon className="h-4 w-4" />
                        </Button>
                    </Link>
                </div>
            </div>
        </div>
    );
};
