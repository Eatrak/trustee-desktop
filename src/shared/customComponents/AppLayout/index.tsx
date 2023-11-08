import "./style.css";

import { withTranslation } from "react-i18next";
import { Route, Routes } from "react-router-dom";

import Navbar from "@shared/components/Navbar";
import TransactionsSection from "@features/sections/TransactionsSection";
import WalletsSection from "@features/sections/WalletsSection";
import SettingsPage from "@features/core/settings";

const AppLayout = () => {
    return (
        <div className="page app-layout">
            <Navbar />
            <div className="app-layout__content">
                <Routes>
                    <Route path="/transactions" element={<TransactionsSection />} />
                    <Route path="/wallets" element={<WalletsSection />} />
                    <Route path="/settings/*" element={<SettingsPage />} />
                </Routes>
            </div>
        </div>
    );
};

export default withTranslation()(AppLayout);
