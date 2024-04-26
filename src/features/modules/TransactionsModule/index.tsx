import { useEffect, useState } from "react";

import { TransactionsTable } from "./TransactionsTable";
import TransactionsBalanceSummaryContainer from "./TransactionsBalanceSummaryContainer";
import AuthService from "@/shared/services/auth";
import { Currency } from "@/shared/schema";
import TransactionsHeader from "./TransactionsHeader";
import TransactionsService from "@/shared/services/transactions";
import { TransactionTableRow } from "@/shared/ts-types/DTOs/transactions";
import dayjs from "dayjs";

const TransactionsModule = () => {
    let [transactions, setTransactions] = useState<TransactionTableRow[]>([]);
    let [totalIncome, setTotalIncome] = useState<number>(0);
    let [totalExpense, setTotalExpense] = useState<number>(0);
    let [isFetchingTransactions, setIsFetchingTransactions] = useState<boolean>(false);
    let [currency, setCurrency] = useState<Currency>(
        AuthService.getInstance().personalInfo$.getValue().settings.currency,
    );

    const fetchTransactions = async () => {
        setIsFetchingTransactions(true);

        try {
            const getTransactionsResponse =
                await TransactionsService.getInstance().getTransactionsByCurrencyAndCreationRange(
                    currency.id,
                    dayjs.unix(1713090112),
                    dayjs.unix(1713110112),
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
        try {
            const getBalanceResponse = await TransactionsService.getInstance().getBalance(
                currency.id,
                dayjs.unix(1713090112),
                dayjs.unix(1713110112),
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
                <TransactionsHeader transactionsCount={transactions.length} />
                <TransactionsBalanceSummaryContainer
                    currencyCode={currency.code}
                    totalIncome={totalIncome}
                    totalExpense={totalExpense}
                />
                <TransactionsTable
                    transactions={transactions}
                    isLoading={isFetchingTransactions}
                />
            </div>
        </div>
    );
};

export default TransactionsModule;
