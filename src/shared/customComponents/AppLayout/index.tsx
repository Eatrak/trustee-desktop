import "./style.css";

import { withTranslation } from "react-i18next";
import { Route, Routes } from "react-router-dom";

import { Navbar } from "../Navbar";
import WalletsModule from "@/features/modules/WalletsModule";
import WalletUpdateModule from "@/features/modules/WalletsModule/WalletUpdateModule";
import WalletCreationModule from "@/features/modules/WalletsModule/WalletCreationModule";

const AppLayout = () => {
    return (
        <div className="page app-layout">
            <Navbar />
            <div className="app-layout__content">
                <Routes>
                    <Route path="/wallets/:id" element={<WalletUpdateModule />} />
                    <Route path="/wallets/new" element={<WalletCreationModule />} />
                    <Route path="/wallets" element={<WalletsModule />} />
                </Routes>
            </div>
        </div>
    );
};

export default withTranslation()(AppLayout);
