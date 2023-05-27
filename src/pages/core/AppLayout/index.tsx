import "./style.css";

import { Route, Routes } from "react-router-dom";

import Navbar from "@components/Navbar";
import TransactionsSection from "@pages/sections/TransactionsSection";

const AppLayout = () => {
    return (
        <div className="page app-layout">
            <Navbar/>
            <div className="app-layout__content">
                <Routes>
                    <Route path="/" element={<TransactionsSection/>}/>
                </Routes>
            </div>
        </div>
    );
};

export default AppLayout;