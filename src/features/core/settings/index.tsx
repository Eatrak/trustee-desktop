import { FC } from "react";

import "./style.css";
import SettingsHeader from "./SettingsHeader";

const SettingsPage: FC = () => {
    return (
        <div className="section section__main-content">
            <SettingsHeader></SettingsHeader>
        </div>
    );
};

export default SettingsPage;
