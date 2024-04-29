import { useEffect, useState } from "react";
import { DateRange, SelectRangeEventHandler } from "react-day-picker";

import { TransactionsTable } from "./TransactionsTable";
import TransactionsBalanceSummaryContainer from "./TransactionsBalanceSummaryContainer";
import AuthService from "@/shared/services/auth";
import { Currency } from "@/shared/schema";
import TransactionsHeader from "./TransactionsHeader";
import TransactionsService from "@/shared/services/transactions";
import { TransactionTableRow } from "@/shared/ts-types/DTOs/transactions";
import dayjs from "dayjs";

const TransactionsModule = () => {
    let [dateRangeToFilter, setDateRangeToFilter] = useState<DateRange | undefined>({
        from: dayjs().startOf("month").toDate(),
        to: dayjs().endOf("month").toDate(),
    });
    let [transactions, setTransactions] = useState<TransactionTableRow[]>([]);
    let [totalIncome, setTotalIncome] = useState<number>(0);
    let [totalExpense, setTotalExpense] = useState<number>(0);
    let [isFetchingTransactions, setIsFetchingTransactions] = useState<boolean>(false);
    let [currency, setCurrency] = useState<Currency>(
        AuthService.getInstance().personalInfo$.getValue().settings.currency,
    );

    const changeDateRangeToFilter = (newDateRange: DateRange | undefined) => {
        dateRangeToFilter = newDateRange;
        setDateRangeToFilter(newDateRange);

        if (!newDateRange) {
            return;
        }

        // Make sure the new date range is instantly available
        dateRangeToFilter = {
            from:
                newDateRange.from &&
                dayjs(newDateRange.from)
                    .hour(0)
                    .minute(0)
                    .second(0)
                    .millisecond(0)
                    .toDate(),
            to:
                newDateRange.to &&
                dayjs(newDateRange.to)
                    .hour(23)
                    .minute(59)
                    .second(59)
                    .millisecond(999)
                    .toDate(),
        };

        fetchTransactions();
        fetchBalance();
    };

    const fetchTransactions = async () => {
        // Don't fetch new data if both from-date and to-date are defined
        if (!dateRangeToFilter || !dateRangeToFilter.from || !dateRangeToFilter.to)
            return;

        setIsFetchingTransactions(true);

        try {
            const getTransactionsResponse =
                await TransactionsService.getInstance().getTransactionsByCurrencyAndCreationRange(
                    currency.id,
                    dayjs(dateRangeToFilter.from),
                    dayjs(dateRangeToFilter.to),
                    [],
                );

            if (getTransactionsResponse.err) {
                // TODO: handle error
                return;
            }

            setTransactions(getTransactionsResponse.val);
        } catch (err) {
            // TODO: handle error
        }

        setIsFetchingTransactions(false);
    };

    const fetchBalance = async () => {
        // Don't fetch new data if both from-date and to-date are defined
        if (!dateRangeToFilter || !dateRangeToFilter.from || !dateRangeToFilter.to)
            return;

        try {
            const getBalanceResponse = await TransactionsService.getInstance().getBalance(
                currency.id,
                dayjs(dateRangeToFilter.from),
                dayjs(dateRangeToFilter.to),
                [],
            );

            if (getBalanceResponse.err) {
                // TODO: handle error
                return;
            }

            const { totalIncome, totalExpense } = getBalanceResponse.val;

            setTotalIncome(totalIncome);
            setTotalExpense(totalExpense);
        } catch (err) {
            // TODO: handle error
        }
    };

    useEffect(() => {
        AuthService.getInstance().personalInfo$.subscribe((personalInfo) => {
            setCurrency(personalInfo.settings.currency);
        });
        fetchTransactions();
        fetchBalance();
    }, []);

    return (
        <div className="section">
            <div className="section__main-content space-y-4">
                <TransactionsHeader
                    dateRangeToFilter={dateRangeToFilter}
                    setDateRangeToFilter={
                        changeDateRangeToFilter as SelectRangeEventHandler
                    }
                    transactionsCount={transactions.length}
                />
                <TransactionsBalanceSummaryContainer
                    currencyCode={currency.code}
                    totalIncome={totalIncome}
                    totalExpense={totalExpense}
                />
                <TransactionsTable
                    transactions={transactions}
                    isLoading={isFetchingTransactions}
                    columnClassNames={["", "", "w-48"]}
                />
            </div>
        </div>
    );
};

export default TransactionsModule;
