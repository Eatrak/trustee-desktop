import { useState } from "react";

import H2 from "@/components/ui/h2";
import { WalletsTable } from "./WalletsTable";
import { WalletTableRow } from "@/shared/ts-types/DTOs/wallets";

const WalletsModule = () => {
    let [wallets, setWallets] = useState<WalletTableRow[]>([]);

    return (
        <div className="section">
            <div className="section__main-content">
                <H2 text="Wallets" />
                <WalletsTable wallets={wallets} />
            </div>
        </div>
    );
};

export default WalletsModule;
