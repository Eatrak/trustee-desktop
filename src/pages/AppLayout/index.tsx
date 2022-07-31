import "./style.css";

import { Routes } from "react-router-dom";

import Navbar from "@components/Navbar";

const AppLayout = () => {
    return (
        <div className="page app-layout">
            <Navbar/>
            <div className="app-layout__content">
                <Routes>
                </Routes>
            </div>
            <div></div>
        </div>
    );
};

export default AppLayout;