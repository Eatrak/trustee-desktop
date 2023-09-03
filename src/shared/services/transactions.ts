import { BehaviorSubject } from "rxjs";
import { Dayjs } from "dayjs";
import { Ok, Err, Result } from "ts-results";

import { Currency, Transaction, TransactionCategory, Wallet } from "@shared/schema";
import { Utils } from "@shared/services/utils";
import { GetTransactionsInputQueryParams } from "@shared/ts-types/APIs/input/transactions/getTransactions";
import { GetTransactionsResponse } from "@shared/ts-types/APIs/output/transactions/getTransactions";
import {
    GetWalletTableRowsResponse,
    GetWalletsResponse,
} from "@shared/ts-types/APIs/output/transactions/getWallets";
import { CreateWalletResponse } from "@shared/ts-types/APIs/output/transactions/createWallet";
import { CreateWalletBody } from "@shared/ts-types/APIs/input/transactions/createWallet";
import { GetCurrenciesResponse } from "@shared/ts-types/APIs/output/transactions/getCurrencies";
import {
    GetNormalTransactionCategoriesResponse,
    GetTransactionCategoryBalancesResponse,
} from "@shared/ts-types/APIs/output/transactions/getTransactionCategories";
import { CreateTransactionCategoryResponse } from "@shared/ts-types/APIs/output/transactions/createTransactionCategory";
import { CreateTransactionCategoryBody } from "@shared/ts-types/APIs/input/transactions/createTransactionCategory";
import { CreateTransactionBody } from "@shared/ts-types/APIs/input/transactions/createTransaction";
import { CreateTransactionResponse } from "@shared/ts-types/APIs/output/transactions/createTransaction";
import { DeleteTransactionQueryParameters } from "@shared/ts-types/APIs/input/transactions/deleteTransaction";
import { GetBalanceResponse } from "@shared/ts-types/APIs/output/transactions/getBalance";
import { DeleteTransactionResponse } from "@shared/ts-types/APIs/output/transactions/deleteTransaction";
import { DeleteWalletsResponse } from "@shared/ts-types/APIs/output/transactions/deleteWallet";
import { DeleteWalletPathParameters } from "@shared/ts-types/APIs/input/transactions/deleteWallet";
import {
    UpdateWalletBody,
    UpdateWalletPathParameters,
    UpdateWalletUpdateInfo,
} from "@shared/ts-types/APIs/input/transactions/updateWallet";
import { UpdateWalletResponse } from "@shared/ts-types/APIs/output/transactions/updateWallet";
import { WalletTableRow, WalletViews } from "@shared/ts-types/DTOs/wallets";
import { ErrorResponseBodyAttributes } from "@shared/errors/types";
import {
    GetTransactionCategoryBalancesInputMultiQueryParams,
    GetTransactionCategoryBalancesInputQueryParams,
} from "@shared/ts-types/APIs/input/transactions/getTransactionCategories";
import { TransactionCategoryBalance } from "@shared/ts-types/DTOs/transactions";
import ErrorType from "@shared/errors/list";
import Validator from "validatorjs";
import { getTransactionCategoryBalancesInputRules } from "@shared/validatorRules/transactions";
import {
    GetBalanceInputMultiQueryParams,
    GetBalanceInputQueryParams,
} from "@shared/ts-types/APIs/input/transactions/getBalance";

export default class TransactionsService {
    static instance: TransactionsService = new TransactionsService();

    currencies$: BehaviorSubject<Currency[]>;

    private constructor() {
        this.currencies$ = new BehaviorSubject<Currency[]>([]);
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
    async createTransaction(input: CreateTransactionBody) {
        try {
            const requestURL = Utils.getInstance().getAPIEndpoint("/transactions");
            const response = await fetch(requestURL, {
                method: "POST",
                headers: {
                    Authorization: "Bearer " + localStorage.getItem("authToken"),
                },
                body: JSON.stringify(input),
            });

            const jsonResponse: CreateTransactionResponse = await response.json();
            if (jsonResponse.error) {
                // TODO: handle error
                return false;
            }

            const { createdTransaction } = jsonResponse.data;

            return createdTransaction;
        } catch (err) {
            // TODO: handle error
        }
    }

    // /**
    //  * Update transaction.
    //  *
    //  * @param input Input used to update transaction.
    //  * @returns The transaction has been updated.
    //  */
    // async updateTransaction(input: UpdateTransactionBody): Promise<boolean> {
    //     try {
    //         const requestURL = Utils.getInstance().getAPIEndpoint("/transactions");
    //         const response = await fetch(requestURL, {
    //             method: "PUT",
    //             headers: {
    //                 Authorization: "Bearer " + localStorage.getItem("authToken"),
    //             },
    //             body: JSON.stringify(input),
    //         });

    //         if (!response.ok) {
    //             return false;
    //         }

    //         return true;
    //     } catch (err) {
    //         return false;
    //     }
    // }

    async getTransactionsByCurrencyAndCreationRange(
        currencyId: string,
        startCreationTimestamp: Dayjs,
        endCreationTimestamp: Dayjs,
    ) {
        try {
            const queryParams: GetTransactionsInputQueryParams = {
                startCarriedOut: startCreationTimestamp.unix().toString(),
                endCarriedOut: endCreationTimestamp.unix().toString(),
                currencyId,
            };
            const requestURL =
                Utils.getInstance().getAPIEndpoint("/transactions?") +
                new URLSearchParams({ ...queryParams });
            const response = await fetch(requestURL, {
                headers: {
                    Authorization: "Bearer " + localStorage.getItem("authToken"),
                },
            });

            const jsonResponse: GetTransactionsResponse = await response.json();
            if (jsonResponse.error) {
                // TODO: handle error
                return;
            }

            const { transactions } = jsonResponse.data;
            return transactions;
        } catch (err) {
            // TODO: handle error
        }
    }

    async getBalance(
        currencyId: string,
        startCarriedOut: Dayjs,
        endCarriedOut: Dayjs,
        wallets: string[],
    ) {
        try {
            const queryParams: GetBalanceInputQueryParams = {
                startCarriedOut: startCarriedOut.unix().toString(),
                endCarriedOut: endCarriedOut.unix().toString(),
                currencyId,
            };
            const multiQueryParams: GetBalanceInputMultiQueryParams = {
                wallets,
            };

            const stringQueryParams = new URLSearchParams({
                ...queryParams,
            });
            const stringMultiQueryParams = Utils.getInstance().getMultiQueryParams(
                "wallets",
                multiQueryParams.wallets,
            );

            const requestURL = Utils.getInstance().getAPIEndpoint(
                `/transactions/balance?${stringQueryParams}&${stringMultiQueryParams}`,
            );
            const response = await fetch(requestURL, {
                headers: {
                    Authorization: "Bearer " + localStorage.getItem("authToken"),
                },
            });

            const jsonResponse: GetBalanceResponse = await response.json();
            if (jsonResponse.error) {
                // TODO: handle error
                return;
            }

            const balance = jsonResponse.data;
            return balance;
        } catch (err) {
            // TODO: handle error
        }
    }

    async getWalletsSummary() {
        try {
            const requestURL = Utils.getInstance().getAPIEndpoint(
                `/wallets?view=${WalletViews.SUMMARY}`,
            );
            const response = await fetch(requestURL, {
                headers: {
                    Authorization: "Bearer " + localStorage.getItem("authToken"),
                },
            });

            const jsonResponse: GetWalletsResponse = await response.json();
            if (jsonResponse.error) {
                // TODO: handle error
                return;
            }

            const { wallets } = jsonResponse.data;

            return wallets;
        } catch (err) {
            // TODO: handle error
        }
    }

    async getWalletTableRows(): Promise<
        Result<WalletTableRow[], ErrorResponseBodyAttributes | undefined>
    > {
        try {
            const requestURL = Utils.getInstance().getAPIEndpoint(
                `/wallets?view=${WalletViews.TABLE_ROW}`,
            );
            const response = await fetch(requestURL, {
                headers: {
                    Authorization: "Bearer " + localStorage.getItem("authToken"),
                },
            });

            const jsonResponse: GetWalletTableRowsResponse = await response.json();
            if (jsonResponse.error) {
                // TODO: handle error
                return Err(jsonResponse.data);
            }

            return Ok(jsonResponse.data.wallets);
        } catch (err) {
            // TODO: handle error

            return Err(undefined);
        }
    }

    async createWallet(
        createWalletBody: CreateWalletBody,
    ): Promise<Result<Wallet, ErrorResponseBodyAttributes | undefined>> {
        try {
            const requestURL = Utils.getInstance().getAPIEndpoint("/wallets");
            const response = await fetch(requestURL, {
                method: "POST",
                headers: {
                    Authorization: "Bearer " + localStorage.getItem("authToken"),
                },
                body: JSON.stringify(createWalletBody),
            });

            const jsonResponse: CreateWalletResponse = await response.json();
            if (jsonResponse.error) {
                // TODO: handle error
                return Err(jsonResponse.data);
            }

            const { createdWallet } = jsonResponse.data;

            return Ok(createdWallet);
        } catch (err) {
            // TODO: handle error
            return Err(undefined);
        }
    }

    async getCurrencies() {
        try {
            const requestURL = Utils.getInstance().getAPIEndpoint("/currencies");
            const response = await fetch(requestURL, {
                headers: {
                    Authorization: "Bearer " + localStorage.getItem("authToken"),
                },
            });

            const jsonResponse: GetCurrenciesResponse = await response.json();
            if (jsonResponse.error) {
                // TODO: handle error
                return;
            }

            const { currencies } = jsonResponse.data;
            this.currencies$.next(currencies);
        } catch (err) {
            // TODO: handle error
        }
    }

    async getTransactionCategories() {
        try {
            const requestURL = Utils.getInstance().getAPIEndpoint(
                "/transaction-categories",
            );
            const response = await fetch(requestURL, {
                headers: {
                    Authorization: "Bearer " + localStorage.getItem("authToken"),
                },
            });

            const jsonResponse: GetNormalTransactionCategoriesResponse =
                await response.json();
            if (jsonResponse.error) {
                // TODO: handle error
                return;
            }

            const { transactionCategories } = jsonResponse.data;

            return transactionCategories;
        } catch (err) {
            // TODO: handle error
        }
    }

    async getTransactionCategoryBalances(
        queryParams: GetTransactionCategoryBalancesInputQueryParams,
        multiQueryParams: GetTransactionCategoryBalancesInputMultiQueryParams,
    ): Promise<
        Result<TransactionCategoryBalance[], ErrorResponseBodyAttributes | undefined>
    > {
        try {
            // Validate data
            const getTransactionCategoryBalanceValidation = new Validator(
                { ...queryParams, ...multiQueryParams },
                getTransactionCategoryBalancesInputRules,
            );
            if (getTransactionCategoryBalanceValidation.fails()) {
                return Err(undefined);
            }

            const { startDate, endDate } = queryParams;
            const stringQueryParams = new URLSearchParams({
                startDate: startDate.toString(),
                endDate: endDate.toString(),
            });
            const stringMultiQueryParams = Utils.getInstance().getMultiQueryParams(
                "wallets",
                multiQueryParams.wallets,
            );

            const requestURL = Utils.getInstance().getAPIEndpoint(
                `/transaction-categories?${stringQueryParams}&${stringMultiQueryParams}`,
            );

            const response = await fetch(requestURL, {
                headers: {
                    Authorization: "Bearer " + localStorage.getItem("authToken"),
                },
            });

            const jsonResponse: GetTransactionCategoryBalancesResponse =
                await response.json();
            if (jsonResponse.error) {
                // TODO: handle error
                return Err(jsonResponse.data);
            }

            const { transactionCategories } = jsonResponse.data;
            return Ok(transactionCategories);
        } catch (err) {
            console.log(err);
            // TODO: handle error
            return Err(undefined);
        }
    }

    async createTransactionCategory(
        createTransactionCategoryBody: CreateTransactionCategoryBody,
    ) {
        try {
            const requestURL = Utils.getInstance().getAPIEndpoint(
                "/transaction-categories",
            );
            const response = await fetch(requestURL, {
                method: "POST",
                headers: {
                    Authorization: "Bearer " + localStorage.getItem("authToken"),
                },
                body: JSON.stringify(createTransactionCategoryBody),
            });

            const jsonResponse: CreateTransactionCategoryResponse = await response.json();
            if (jsonResponse.error) {
                // TODO: handle error
                return;
            }

            const { createdTransactionCategory } = jsonResponse.data;

            return createdTransactionCategory;
        } catch (err) {
            // TODO: handle error
        }
    }

    async deleteTransaction(id: string): Promise<boolean> {
        try {
            // Initialize query parameters
            const queryParams: DeleteTransactionQueryParameters = {
                id,
            };

            // Initialize request URL
            const requestURL =
                Utils.getInstance().getAPIEndpoint("/transactions?") +
                new URLSearchParams({ ...queryParams });

            // Send request
            const response = await fetch(requestURL, {
                method: "DELETE",
                headers: {
                    Authorization: "Bearer " + localStorage.getItem("authToken"),
                },
            });

            const jsonResponse: DeleteTransactionResponse = await response.json();
            if (jsonResponse.error) {
                // TODO: handle error
                return false;
            }

            return true;
        } catch (err) {
            // TODO: handle error
            return false;
        }
    }

    async deleteWallet(id: string): Promise<boolean> {
        try {
            // Initialize query parameters
            const pathParams: DeleteWalletPathParameters = {
                id,
            };

            // Initialize request URL
            const requestURL = Utils.getInstance().getAPIEndpoint(
                `/wallets/${pathParams.id}`,
            );

            // Send request
            const response = await fetch(requestURL, {
                method: "DELETE",
                headers: {
                    Authorization: "Bearer " + localStorage.getItem("authToken"),
                },
            });

            const jsonResponse: DeleteWalletsResponse = await response.json();
            if (jsonResponse.error) {
                // TODO: handle error
                return false;
            }

            return true;
        } catch (err) {
            // TODO: handle error
            return false;
        }
    }

    async updateWallet(
        id: string,
        updateInfo: UpdateWalletUpdateInfo,
    ): Promise<Result<undefined, ErrorResponseBodyAttributes | undefined>> {
        try {
            // Initialize path parameters
            const pathParams: UpdateWalletPathParameters = {
                id,
            };

            // Initialize body
            const body: UpdateWalletBody = {
                updateInfo,
            };

            // Initialize request URL
            const requestURL = Utils.getInstance().getAPIEndpoint(
                `/wallets/${pathParams.id}`,
            );

            // Send request
            const response = await fetch(requestURL, {
                method: "PUT",
                headers: {
                    Authorization: "Bearer " + localStorage.getItem("authToken"),
                },
                body: JSON.stringify(body),
            });

            const jsonResponse: UpdateWalletResponse = await response.json();
            if (jsonResponse.error) {
                // TODO: handle error
                return Err(jsonResponse.data);
            }

            return Ok(undefined);
        } catch (err) {
            // TODO: handle error
            return Err(undefined);
        }
    }
}
