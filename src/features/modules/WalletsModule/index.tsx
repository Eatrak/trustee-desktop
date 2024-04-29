import { useEffect, useState } from "react";

import { WalletsTable } from "./WalletsTable";
import { Utils } from "@/shared/services/utils";
import WalletsService from "@/shared/services/wallets";
import { WalletTableRow } from "@/shared/ts-types/DTOs/wallets";
import { TranslationKey } from "@/shared/ts-types/generic/translations";
import H2 from "@/components/ui/h2";
import WalletsBalanceSummaryContainer from "./WalletsBalanceSummaryContainer";
import AuthService from "@/shared/services/auth";
import { Currency } from "@/shared/schema";
import { Button } from "@/components/ui/button";
import { Icons } from "@/components/ui/icons";
import WalletsHeader from "./WalletsHeader";

const WalletsModule = () => {
    let [wallets, setWallets] = useState<WalletTableRow[]>([]);
    let [isFetchingWallets, setIsFetchingWallets] = useState<boolean>(false);
    let [currency, setCurrency] = useState<Currency>(
        AuthService.getInstance().personalInfo$.getValue().settings.currency,
    );

    const fetchWallets = async () => {
        setIsFetchingWallets(true);

        try {
            const getWalletsResponse =
                await WalletsService.getInstance().getWalletTableRows(currency.id);

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

    useEffect(() => {
        AuthService.getInstance().personalInfo$.subscribe((personalInfo) => {
            setCurrency(personalInfo.settings.currency);
        });
        fetchWallets();
    }, []);

    return (
        <div className="section">
            <div className="section__main-content space-y-4">
                <WalletsHeader walletsCount={wallets.length} />
                <WalletsBalanceSummaryContainer
                    currencyCode={currency.code}
                    totalIncome={getTotalIncome()}
                    totalExpense={getTotalExpense()}
                    totalUntrackedBalance={getTotalUntrackedBalance()}
                />
                <WalletsTable
                    wallets={wallets}
                    isLoading={isFetchingWallets}
                    columnClassNames={["", "", "", "", "", "w-48"]}
                />
            </div>
        </div>
    );
};

export default WalletsModule;
