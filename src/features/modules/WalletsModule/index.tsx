import { useEffect, useState } from "react";

import { WalletsTable } from "./WalletsTable";
import H2 from "@/components/ui/h2";
import WalletsService from "@/shared/services/wallets";
import { WalletTableRow } from "@/shared/ts-types/DTOs/wallets";

const WalletsModule = () => {
    let [wallets, setWallets] = useState<WalletTableRow[]>([]);
    let [isFetchingWallets, setIsFetchingWallets] = useState<boolean>(false);

    const fetchWallets = async () => {
        setIsFetchingWallets(true);

        try {
            const getWalletsResponse =
                await WalletsService.getInstance().getWalletTableRows();

            if (getWalletsResponse.err) {
                // TODO: handle error
                return;
            }

            setWallets(getWalletsResponse.val);
        } catch (err) {
            // TODO: handle error
        }

        setIsFetchingWallets(false);
    };

    useEffect(() => {
        fetchWallets();
    }, []);

    return (
        <div className="section">
            <div className="section__main-content">
                <H2 text="Wallets" />
                <WalletsTable wallets={wallets} isLoading={isFetchingWallets} />
            </div>
        </div>
    );
};

export default WalletsModule;
