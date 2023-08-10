import { FC, useEffect, useState } from "react";

import "./style.css";
import WalletsHeader from "./WalletsHeader";
import WalletsTable from "./WalletsTable";
import { WalletTableRow } from "@shared/ts-types/DTOs/wallets";
import TransactionsService from "@shared/services/transactions";

const WalletsSection: FC = () => {
    let [wallets, setWallets] = useState<WalletTableRow[]>([]);

    const fetchWallets = async () => {
        try {
            const getWalletsResponse =
                await TransactionsService.getInstance().getWalletTableRows();

            if (getWalletsResponse.err) {
                // TODO: handle error
                return;
            }

            setWallets(getWalletsResponse.val);
        } catch (err) {
            // TODO: handle error
        }
    };

    useEffect(() => {
        fetchWallets();
    }, []);

    return (
        <div className="section wallets-section">
            <div className="wallets-section--main">
                <WalletsHeader />
                <WalletsTable
                    className="wallets-section--main__container__wallets-table"
                    data={wallets}
                />
            </div>
        </div>
    );
};

export default WalletsSection;
