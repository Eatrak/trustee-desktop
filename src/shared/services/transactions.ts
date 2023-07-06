import { BehaviorSubject } from "rxjs";
import dayjs, { Dayjs } from "dayjs";

import { Currency, Transaction, TransactionCategory, Wallet } from "@models/transactions";
import { Utils } from "@utils/index";
import { GetTransactionsInputQueryParams } from "@inputTypes/transactions/getTransactions";
import { GetTransactionsResponse } from "@requestTypes/transactions/getTransactions";
import { GetWalletsResponse } from "@requestTypes/transactions/getWallets";
import { CreateWalletResponse } from "@requestTypes/transactions/createWallet";
import { DocumentClientTypes } from "@typedorm/document-client/cjs/public-api";
import { CreateWalletBody } from "@inputTypes/transactions/createWallet";
import { GetCurrenciesResponse } from "@requestTypes/transactions/getCurrencies";
import { GetTransactionCategoriesResponse } from "@requestTypes/transactions/getTransactionCategories";
import { CreateTransactionCategoryResponse } from "@requestTypes/transactions/createTransactionCategory";
import { CreateTransactionCategoryBody } from "@inputTypes/transactions/createTransactionCategory";
import { CreateTransactionBody } from "@inputTypes/transactions/createTransaction";
import { CreateTransactionResponse } from "@requestTypes/transactions/createTransactionResponse";
import { GetTotalIncomeByCurrencyResponse } from "@requestTypes/transactions/getTotalIncomeByCurrency";
import { GetTotalExpenseByCurrencyResponse } from "@requestTypes/transactions/getTotalExpenseByCurrency";
import { TotalExpenseByCurrency, TotalIncomeByCurrency } from "@genericTypes/currencies";

export default class TransactionsService {
    static instance: TransactionsService = new TransactionsService();

    transactions$: BehaviorSubject<Transaction[]>;
    wallets$: BehaviorSubject<Wallet[]>;
    currencies$: BehaviorSubject<Currency[]>;
    transactionCategories$: BehaviorSubject<TransactionCategory[]>;
    totalIncomeByCurrency$: BehaviorSubject<TotalIncomeByCurrency>;
    totalExpenseByCurrency$: BehaviorSubject<TotalExpenseByCurrency>;

    private constructor() {
        this.transactions$ = new BehaviorSubject<Transaction[]>([]);
        this.wallets$ = new BehaviorSubject<Wallet[]>([]);
        this.currencies$ = new BehaviorSubject<Currency[]>([]);
        this.transactionCategories$ = new BehaviorSubject<TransactionCategory[]>([]);
        this.totalIncomeByCurrency$ = new BehaviorSubject<TotalIncomeByCurrency>({});
        this.totalExpenseByCurrency$ = new BehaviorSubject<TotalExpenseByCurrency>({});
    }
    
    static getInstance() {
        return this.instance;
    }

    /**
     * Create new transaction.
     * 
     * @param input Input used to create new transaction.
     * @returns Is new transaction created.
     */
    async createTransaction(input: CreateTransactionBody): Promise<boolean> {
        try {
            const requestURL = Utils.getInstance().getAPIEndpoint("/transactions");
            const response = await fetch(requestURL, {
                method: "POST",
                headers: {
                    "Authorization": "Bearer " + localStorage.getItem("authToken")
                },
                body: JSON.stringify(input)
            });

            if (!response.ok) {
                return false;
            }

            const { createdTransaction }: CreateTransactionResponse = await response.json();
            const updatedTransactions = [ createdTransaction, ...this.transactions$.getValue() ];

            this.transactions$.next(updatedTransactions);

            // Update monthly-wallet-balance locally
            const { walletId, transactionAmount, isIncome } = createdTransaction;
            this.updateMonthlyWalletBalanceLocally(
                walletId,
                transactionAmount,
                isIncome
            );

            return true;
        }
        catch (err) {
            return false;
        }
    }

    /**
     * Update amount of a monthly-wallet-income or a monthly-wallet-expense locally.
     * 
     * @param walletId ID of the transaction wallet.
     * @param transactionAmount Amount of the transaction.
     * @param isIncome Indicates if the transaction amount is an income or an expense.
     */
    updateMonthlyWalletBalanceLocally(
        walletId: string,
        transactionAmount: number,
        isIncome: boolean
    ) {
        // Get transaction wallet
        const transactionWallet = this.wallets$.getValue().find(wallet => (
            wallet.walletId == walletId
        ));

        if (transactionWallet) {
            // Get code of the transaction currency
            const transactionCurrencyCode = transactionWallet.currencyCode;

            if (isIncome) {
                // Update monthly-wallet-income amount
                let updatedTotalIncomeByCurrency = this.totalIncomeByCurrency$.getValue();
                updatedTotalIncomeByCurrency[transactionCurrencyCode] += transactionAmount;
                this.totalIncomeByCurrency$.next(updatedTotalIncomeByCurrency);
            }
            else {
                // Update monthly-wallet-expense amount
                let updatedTotalExpenseByCurrency = this.totalExpenseByCurrency$.getValue();
                updatedTotalExpenseByCurrency[transactionCurrencyCode] += transactionAmount;
                this.totalExpenseByCurrency$.next(updatedTotalExpenseByCurrency);
            }
        }
    }

    async getTransactionsByCurrencyAndCreationRange(
        currencyCode: string,
        startCreationTimestamp: Dayjs,
        endCreationTimestamp: Dayjs
    ) {
        const queryParams: GetTransactionsInputQueryParams = {
            startCreationTimestamp: startCreationTimestamp.unix().toString(),
            endCreationTimestamp: endCreationTimestamp.unix().toString(),
            currencyCode
        };
        const requestURL =
            Utils.getInstance().getAPIEndpoint("/transactions?") +
            new URLSearchParams({ ...queryParams });
        const response = await fetch(requestURL, {
            headers: {
                "Authorization": "Bearer " + localStorage.getItem("authToken")
            }
        });
        const { transactions, cursor }: GetTransactionsResponse = await response.json();

        this.transactions$.next(transactions);

        return cursor;
    }

    async getNextTransactionsByCreationRange(cursor: DocumentClientTypes.Key) {
        const nowTimestamp = dayjs().unix().toString();
        const firstDayOfTheCurrentMonthTimestamp = dayjs().startOf("month").unix().toString();

        const queryParams: GetTransactionsInputQueryParams = {
            startCreationTimestamp: firstDayOfTheCurrentMonthTimestamp,
            endCreationTimestamp: nowTimestamp,
            cursor: JSON.stringify(cursor)
        };
        const requestURL =
            Utils.getInstance().getAPIEndpoint("/transactions?") +
            new URLSearchParams({ ...queryParams });
        const response = await fetch(requestURL, {
            headers: {
                "Authorization": "Bearer " + localStorage.getItem("authToken")
            }
        });
        const { transactions, cursor: newCursor }: GetTransactionsResponse = await response.json();

        this.transactions$.next(this.transactions$.getValue().concat(transactions));

        return newCursor;
    }

    async getWallets() {
        const requestURL = Utils.getInstance().getAPIEndpoint("/wallets");
        const response = await fetch(requestURL, {
            headers: {
                "Authorization": "Bearer " + localStorage.getItem("authToken")
            }
        });
        const { wallets }: GetWalletsResponse = await response.json();

        this.wallets$.next(wallets);
    }

    async getTotalIncomeByCurrency() {
        const requestURL = Utils.getInstance().getAPIEndpoint("/currencies/income");
        const response = await fetch(requestURL, {
            headers: {
                "Authorization": "Bearer " + localStorage.getItem("authToken")
            }
        });
        const { totalIncomeByCurrency }: GetTotalIncomeByCurrencyResponse = await response.json();

        this.totalIncomeByCurrency$.next(totalIncomeByCurrency);
    }

    async getTotalExpenseByCurrency() {
        const requestURL = Utils.getInstance().getAPIEndpoint("/currencies/expense");
        const response = await fetch(requestURL, {
            headers: {
                "Authorization": "Bearer " + localStorage.getItem("authToken")
            }
        });
        const { totalExpenseByCurrency }: GetTotalExpenseByCurrencyResponse = await response.json();

        this.totalExpenseByCurrency$.next(totalExpenseByCurrency);
    }

    async createWallet(createWalletBody: CreateWalletBody) {
        const requestURL = Utils.getInstance().getAPIEndpoint("/wallets");
        const response = await fetch(requestURL, {
            method: "POST",
            headers: {
                "Authorization": "Bearer " + localStorage.getItem("authToken")
            },
            body: JSON.stringify(createWalletBody)
        });
        const { createdWallet }: CreateWalletResponse = await response.json();
        const newWallets = [ createdWallet, ...this.wallets$.getValue() ];

        this.wallets$.next(newWallets);
    }

    async getCurrencies() {
        const requestURL = Utils.getInstance().getAPIEndpoint("/currencies");
        const response = await fetch(requestURL, {
            headers: {
                "Authorization": "Bearer " + localStorage.getItem("authToken")
            }
        });
        const { currencies }: GetCurrenciesResponse = await response.json();

        this.currencies$.next(currencies);
    }

    async getTransactionCategories() {
        const requestURL = Utils.getInstance().getAPIEndpoint("/transaction-categories");
        const response = await fetch(requestURL, {
            headers: {
                "Authorization": "Bearer " + localStorage.getItem("authToken")
            }
        });
        const { transactionCategories }: GetTransactionCategoriesResponse = await response.json();

        this.transactionCategories$.next(transactionCategories);
    }

    async createTransactionCategory(
        createTransactionCategoryBody: CreateTransactionCategoryBody
    ) {
        const requestURL = Utils.getInstance().getAPIEndpoint("/transaction-categories");
        const response = await fetch(requestURL, {
            method: "POST",
            headers: {
                "Authorization": "Bearer " + localStorage.getItem("authToken")
            },
            body: JSON.stringify(createTransactionCategoryBody)
        });
        const { createdTransactionCategory }: CreateTransactionCategoryResponse = await response.json();
        const newTransactionCategories = [ createdTransactionCategory, ...this.transactionCategories$.getValue() ];

        this.transactionCategories$.next(newTransactionCategories);
    }

    /**
     * Get options of the wallets with the selected currency.
     * 
     * @returns Options of the wallets with the selected currency.
     */
    getOptionsOfWalletsWithSelectedCurrency(wallets: Wallet[], selectedCurrencyCode: string) {
        const newWalletsWithSelectedCurrency = wallets.filter(wallet => {
            return wallet.currencyCode == selectedCurrencyCode;
        })
        .map(wallet => ({ name: wallet.walletName, value: wallet.walletId }));

        return newWalletsWithSelectedCurrency;
    };
}
