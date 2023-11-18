import "./style.css";

import { withTranslation } from "react-i18next";
import { Routes } from "react-router-dom";

import { Navbar } from "../Navbar";

const AppLayout = () => {
    return (
        <div className="page app-layout">
            <Navbar />
            <div className="app-layout__content">
                <Routes></Routes>
            </div>
        </div>
    );
};

export default withTranslation()(AppLayout);
