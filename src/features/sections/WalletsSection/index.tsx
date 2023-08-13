import { FC, useEffect, useState, useRef } from "react";

import "./style.css";
import WalletsHeader from "./WalletsHeader";
import WalletsTable from "./WalletsTable";
import { WalletTableRow } from "@shared/ts-types/DTOs/wallets";
import TransactionsService from "@shared/services/transactions";
import ConfirmationDialog from "@shared/components/ConfirmationDialog";

const WalletsSection: FC = () => {
    let [wallets, setWallets] = useState<WalletTableRow[]>([]);
    // Dialog state
    let [isWalletDeletionDialogOpened, setIsWalletDeletionDialogOpened] = useState(false);
    // Loading state
    let [isDeletingWallet, setIsDeletingWallet] = useState<boolean>(false);
    // Selected wallet to delete
    let walletToDelete = useRef<WalletTableRow | null>(null);

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

    const openWalletDeletionDialog = (wallet: WalletTableRow) => {
        setIsWalletDeletionDialogOpened(true);
        walletToDelete.current = wallet;
    };

    const deleteWallet = async () => {
        setIsDeletingWallet(true);

        try {
            if (!walletToDelete.current) {
                // TODO: Give feedback to the user
                return;
            }

            const hasWalletBeenDeleted =
                await TransactionsService.getInstance().deleteWallet(
                    walletToDelete.current.id,
                );

            if (hasWalletBeenDeleted) {
                await fetchWallets();

                // Close deletion dialog
                setIsWalletDeletionDialogOpened(false);
            }
        } catch (err) {}

        setIsDeletingWallet(false);
    };

    useEffect(() => {
        fetchWallets();
    }, []);

    return (
        <div className="section wallets-section">
            <div className="wallets-section--main">
                {
                    // Wallet deletion dialog
                    isWalletDeletionDialogOpened && (
                        <ConfirmationDialog
                            title="Wallet deletion"
                            description={<p>Are you sure to delete the wallet?</p>}
                            isConfirming={isDeletingWallet}
                            confirm={() => deleteWallet()}
                            close={() => setIsWalletDeletionDialogOpened(false)}
                        />
                    )
                }
                <WalletsHeader reloadWallets={fetchWallets} />
                <WalletsTable
                    className="wallets-section--main__container__wallets-table"
                    data={wallets}
                    onDeleteButtonClicked={openWalletDeletionDialog}
                />
            </div>
        </div>
    );
};

export default WalletsSection;
