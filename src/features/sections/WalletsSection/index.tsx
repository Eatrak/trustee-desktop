import { FC } from "react";

import "./style.css";
import WalletsHeader from "./WalletsHeader";

const WalletsSection: FC = () => {
    return (
        <div className="section wallets-section">
            <div className="wallets-section--main">
                <WalletsHeader />
            </div>
        </div>
    );
};

export default WalletsSection;
