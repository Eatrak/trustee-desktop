import WalletsBalanceSummary from "../WalletsBalanceSummary";
import { Utils } from "@/shared/services/utils";
import { TranslationKey } from "@/shared/ts-types/generic/translations";

interface IProps {
    totalIncome: number;
    totalExpense: number;
    totalUntrackedBalance: number;
    currencyCode: string;
}

const WalletsBalanceSummaryContainer = ({
    totalIncome,
    totalExpense,
    totalUntrackedBalance,
    currencyCode,
}: IProps) => {
    const translate = (translationKeys: TranslationKey[]) => {
        return Utils.getInstance().translate([
            TranslationKey.MODULES,
            TranslationKey.WALLETS,
            TranslationKey.SUMMARY,
            ...translationKeys,
        ]);
    };

    return (
        <div className="flex flex-column flex-grow w-full space-x-2">
            <WalletsBalanceSummary
                className="flex-grow"
                title={translate([TranslationKey.TOTAL_NET])}
                amount={totalIncome - totalExpense + totalUntrackedBalance}
                currencyCode={currencyCode}
            />
            <WalletsBalanceSummary
                className="flex-grow"
                title={translate([TranslationKey.TOTAL_INCOME])}
                amount={totalIncome}
                currencyCode={currencyCode}
            />
            <WalletsBalanceSummary
                className="flex-grow"
                title={translate([TranslationKey.TOTAL_EXPENSE])}
                amount={totalExpense}
                currencyCode={currencyCode}
            />
            <WalletsBalanceSummary
                className="flex-grow"
                title={translate([TranslationKey.TOTAL_UNTRACKED_BALANCE])}
                amount={totalUntrackedBalance}
                currencyCode={currencyCode}
            />
        </div>
    );
};

export default WalletsBalanceSummaryContainer;
