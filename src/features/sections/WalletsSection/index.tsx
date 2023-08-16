import { FC, useEffect, useState, useRef } from "react";

import "./style.css";
import WalletsHeader from "./WalletsHeader";
import WalletsTable from "./WalletsTable";
import { WalletTableRow } from "@shared/ts-types/DTOs/wallets";
import TransactionsService from "@shared/services/transactions";
import ConfirmationDialog from "@shared/components/ConfirmationDialog";
import WalletsBalanceSummary from "./WalletsBalanceSummary";
import AuthService from "@shared/services/auth";
import WalletDialog from "./WalletDialog";
import { Currency } from "@shared/schema";

const WalletsSection: FC = () => {
    let [wallets, setWallets] = useState<WalletTableRow[]>([]);
    let [currency, setCurrency] = useState<Currency>(
        AuthService.getInstance().personalInfo$.getValue().settings.currency,
    );
    // Dialog states
    let [isWalletDeletionDialogOpened, setIsWalletDeletionDialogOpened] = useState(false);
    let [isWalletCreationDialogOpened, setIsWalletCreationDialogOpened] = useState(false);
    let [isWalletUpdateDialogOpened, setIsWalletUpdateDialogOpened] = useState(false);
    // Loading states
    let [isDeletingWallet, setIsDeletingWallet] = useState<boolean>(false);
    let [isLoadingWallets, setIsLoadingWallets] = useState<boolean>(false);
    // Selected wallet to delete
    let walletToDelete = useRef<WalletTableRow | null>(null);
    // Selected wallet to edit
    let walletToUpdate = useRef<WalletTableRow | undefined>();

    const getTotalIncome = (): number => {
        return wallets.reduce((totalIncome, wallet) => totalIncome + wallet.income, 0);
    };

    const getTotalExpense = (): number => {
        return wallets.reduce((totalExpense, wallet) => totalExpense + wallet.expense, 0);
    };

    const getTotalUntrackedBalance = (): number => {
        return wallets.reduce(
            (totalUntrackedBalance, wallet) =>
                totalUntrackedBalance + wallet.untrackedBalance,
            0,
        );
    };

    const fetchWallets = async () => {
        setIsLoadingWallets(true);

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

        setIsLoadingWallets(false);
    };

    const openWalletDeletionDialog = (wallet: WalletTableRow) => {
        setIsWalletDeletionDialogOpened(true);
        walletToDelete.current = wallet;
    };

    const openWalletUpdateDialog = (wallet: WalletTableRow) => {
        setIsWalletUpdateDialogOpened(true);
        walletToUpdate.current = wallet;
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
        AuthService.getInstance().personalInfo$.subscribe((personalInfo) => {
            setCurrency(personalInfo.settings.currency);
        });
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
                {isWalletCreationDialogOpened && (
                    <WalletDialog
                        isCreationMode
                        selectedCurrencyId={currency.id}
                        onSuccess={() => {
                            fetchWallets();
                            setIsWalletCreationDialogOpened(false);
                        }}
                        close={() => setIsWalletCreationDialogOpened(false)}
                    />
                )}
                {isWalletUpdateDialogOpened && (
                    <WalletDialog
                        isCreationMode={false}
                        selectedCurrencyId={currency.id}
                        onUpdate={() => {
                            fetchWallets();
                            setIsWalletUpdateDialogOpened(false);
                        }}
                        close={() => setIsWalletUpdateDialogOpened(false)}
                        openedWallet={walletToUpdate.current}
                    />
                )}
                <WalletsHeader
                    walletsCount={wallets.length}
                    reloadWallets={fetchWallets}
                    onCreationButtonClicked={() => setIsWalletCreationDialogOpened(true)}
                />
                <WalletsBalanceSummary
                    totalIncome={getTotalIncome()}
                    totalExpense={getTotalExpense()}
                    totalUntrackedBalance={getTotalUntrackedBalance()}
                    currencyCode={currency.code}
                    isLoading={isLoadingWallets}
                />
                <WalletsTable
                    className="wallets-section--main__container__wallets-table"
                    data={wallets}
                    onEditButtonClicked={openWalletUpdateDialog}
                    onDeleteButtonClicked={openWalletDeletionDialog}
                />
            </div>
        </div>
    );
};

export default WalletsSection;
