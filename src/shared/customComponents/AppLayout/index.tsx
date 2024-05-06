import "./style.css";

import { withTranslation } from "react-i18next";
import { Navigate, Route, Routes } from "react-router-dom";

import { Navbar } from "../Navbar";
import WalletsModule from "@/features/modules/WalletsModule";
import WalletUpdateModule from "@/features/modules/WalletsModule/WalletUpdateModule";
import WalletCreationModule from "@/features/modules/WalletsModule/WalletCreationModule";
import TransactionsModule from "@/features/modules/TransactionsModule";
import TransactionCreationModule from "@/features/modules/TransactionsModule/TransactionCreationModule";

const AppLayout = () => {
    return (
        <div className="page app-layout">
            <Navbar />
            <div className="app-layout__content">
                <Routes>
                    <Route path="/wallets/:id" element={<WalletUpdateModule />} />
                    <Route path="/wallets/new" element={<WalletCreationModule />} />
                    <Route path="/wallets" element={<WalletsModule />} />
                    <Route path="/transactions" element={<TransactionsModule />} />
                    <Route
                        path="/transactions/new"
                        element={<TransactionCreationModule />}
                    />
                    <Route path="/*" element={<Navigate to="/wallets" />} />
                </Routes>
            </div>
        </div>
    );
};

export default withTranslation()(AppLayout);
