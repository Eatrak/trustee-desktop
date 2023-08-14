import { FC } from "react";

import "./style.css";
import { Utils } from "@shared/services/utils";
import StatisticSkeleton from "@shared/components/Statistic/StatisticSkeleton";
import Statistic from "@shared/components/Statistic/Statistic";

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

    return (
        <div className="card wallets-balance-summary">
            <div className="wallets-balance-summary__left">
                {isLoading ? (
                    <StatisticSkeleton title="Total income" width="180px" />
                ) : (
                    <Statistic
                        className="wallets-balance-summary__left__total-income"
                        title="Total income"
                        value={getFormattedAmount(totalIncome)}
                    />
                )}
                {isLoading ? (
                    <StatisticSkeleton title="Total expense" width="180px" />
                ) : (
                    <Statistic
                        className="wallets-balance-summary__left__total-expense"
                        title="Total expense"
                        value={getFormattedAmount(totalExpense)}
                    />
                )}
                {isLoading ? (
                    <StatisticSkeleton title="Total untracked balance" width="180px" />
                ) : (
                    <Statistic
                        className="wallets-balance-summary__left__total-untracked-balance"
                        title="Total untracked balance"
                        value={getFormattedAmount(totalUntrackedBalance)}
                    />
                )}
            </div>
            <div className="wallets-balance-summary__right">
                {isLoading ? (
                    <StatisticSkeleton title="Total net" width="180px" size="large" />
                ) : (
                    <Statistic
                        className="wallets-balance-summary__right__total-balance"
                        title="Total net"
                        value={getFormattedAmount(totalIncome - totalExpense)}
                        size="large"
                    />
                )}
            </div>
        </div>
    );
};

export default WalletsBalanceSummary;
