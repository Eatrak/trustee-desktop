import BalanceSummary from "@/shared/customComponents/BalanceSummary";
import { Utils } from "@/shared/services/utils";
import { TranslationKey } from "@/shared/ts-types/generic/translations";

interface IProps {
    totalIncome: number;
    totalExpense: number;
    currencyCode: string;
}

const TransactionsBalanceSummaryContainer = ({
    totalIncome,
    totalExpense,
    currencyCode,
}: IProps) => {
    const translate = (translationKeys: TranslationKey[]) => {
        return Utils.getInstance().translate([
            TranslationKey.MODULES,
            TranslationKey.TRANSACTIONS,
            TranslationKey.SUMMARY,
            ...translationKeys,
        ]);
    };

    return (
        <div className="flex flex-column flex-grow w-full space-x-2">
            <BalanceSummary
                className="flex-grow"
                title={translate([TranslationKey.NET])}
                amount={totalIncome - totalExpense}
                currencyCode={currencyCode}
            />
            <BalanceSummary
                className="flex-grow"
                title={translate([TranslationKey.INCOME])}
                amount={totalIncome}
                currencyCode={currencyCode}
            />
            <BalanceSummary
                className="flex-grow"
                title={translate([TranslationKey.EXPENSE])}
                amount={totalExpense}
                currencyCode={currencyCode}
            />
        </div>
    );
};

export default TransactionsBalanceSummaryContainer;
