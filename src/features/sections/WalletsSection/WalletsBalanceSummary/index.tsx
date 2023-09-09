import { FC } from "react";

import "./style.css";
import { Utils } from "@shared/services/utils";
import StatisticSkeleton from "@shared/components/Statistic/StatisticSkeleton";
import Statistic from "@shared/components/Statistic/Statistic";
import { TranslationKey } from "@shared/ts-types/generic/translations";

interface IProps {
    isLoading?: boolean;
    currencyCode: string;
    totalIncome: number;
    totalExpense: number;
    totalUntrackedBalance: number;
}

const WalletsBalanceSummary: FC<IProps> = ({
    isLoading = false,
    currencyCode,
    totalIncome,
    totalExpense,
    totalUntrackedBalance,
}) => {
    const getFormattedAmount = (amount: number) => {
        return Utils.getInstance().getFormattedAmount(currencyCode, amount);
    };

    const translate = (translationKeys: TranslationKey[]) => {
        return Utils.getInstance().translate([
            TranslationKey.MODULES,
            TranslationKey.WALLETS,
            TranslationKey.SUMMARY,
            ...translationKeys,
        ]);
    };

    return (
        <div className="card wallets-balance-summary">
            <div className="wallets-balance-summary__left">
                {isLoading ? (
                    <StatisticSkeleton
                        title={translate([TranslationKey.TOTAL_INCOME])}
                        width="180px"
                    />
                ) : (
                    <Statistic
                        className="wallets-balance-summary__left__total-income"
                        title={translate([TranslationKey.TOTAL_INCOME])}
                        value={getFormattedAmount(totalIncome)}
                    />
                )}
                {isLoading ? (
                    <StatisticSkeleton
                        title={translate([TranslationKey.TOTAL_EXPENSE])}
                        width="180px"
                    />
                ) : (
                    <Statistic
                        className="wallets-balance-summary__left__total-expense"
                        title={translate([TranslationKey.TOTAL_EXPENSE])}
                        value={getFormattedAmount(totalExpense)}
                    />
                )}
                {isLoading ? (
                    <StatisticSkeleton
                        title={translate([TranslationKey.TOTAL_UNTRACKED_BALANCE])}
                        width="180px"
                    />
                ) : (
                    <Statistic
                        className="wallets-balance-summary__left__total-untracked-balance"
                        title={translate([TranslationKey.TOTAL_UNTRACKED_BALANCE])}
                        value={getFormattedAmount(totalUntrackedBalance)}
                    />
                )}
            </div>
            <div className="wallets-balance-summary__right">
                {isLoading ? (
                    <StatisticSkeleton
                        title={translate([TranslationKey.TOTAL_NET])}
                        width="180px"
                        size="large"
                    />
                ) : (
                    <Statistic
                        className="wallets-balance-summary__right__total-balance"
                        title={translate([TranslationKey.TOTAL_NET])}
                        value={getFormattedAmount(
                            totalIncome - totalExpense + totalUntrackedBalance,
                        )}
                        size="large"
                    />
                )}
            </div>
        </div>
    );
};

export default WalletsBalanceSummary;
