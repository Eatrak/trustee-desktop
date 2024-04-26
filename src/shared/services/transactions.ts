import { BehaviorSubject } from "rxjs";
import { Dayjs } from "dayjs";
import { Ok, Err, Result } from "ts-results";

import { Currency, Transaction } from "@/shared/schema";
import { Utils } from "@/shared/services/utils";
import {
    GetTransactionsInputMultiQueryParams,
    GetTransactionsInputQueryParams,
} from "@/shared/ts-types/APIs/input/transactions/getTransactions";
import { GetTransactionsResponse } from "@/shared/ts-types/APIs/output/transactions/getTransactions";
import { GetCurrenciesResponse } from "@/shared/ts-types/APIs/output/transactions/getCurrencies";
import {
    GetNormalTransactionCategoriesResponse,
    GetTransactionCategoryBalancesResponse,
} from "@/shared/ts-types/APIs/output/transactions/getTransactionCategories";
import { CreateTransactionCategoryResponse } from "@/shared/ts-types/APIs/output/transactions/createTransactionCategory";
import { CreateTransactionCategoryBody } from "@/shared/ts-types/APIs/input/transactions/createTransactionCategory";
import { CreateTransactionBody } from "@/shared/ts-types/APIs/input/transactions/createTransaction";
import { CreateTransactionResponse } from "@/shared/ts-types/APIs/output/transactions/createTransaction";
import { DeleteTransactionQueryParameters } from "@/shared/ts-types/APIs/input/transactions/deleteTransaction";
import {
    GetBalanceResponse,
    GetBalanceResponseData,
} from "@/shared/ts-types/APIs/output/transactions/getBalance";
import { DeleteTransactionResponse } from "@/shared/ts-types/APIs/output/transactions/deleteTransaction";
import { ErrorResponseBodyAttributes } from "@/shared/errors/types";
import {
    GetTransactionCategoryBalancesInputMultiQueryParams,
    GetTransactionCategoryBalancesInputQueryParams,
} from "@/shared/ts-types/APIs/input/transactions/getTransactionCategories";
import { TransactionCategoryBalance } from "@/shared/ts-types/DTOs/transactions";
import ErrorType from "@/shared/errors/list";
import Validator from "validatorjs";
import { getTransactionCategoryBalancesInputRules } from "@/shared/validatorRules/transactions";
import {
    GetBalanceInputMultiQueryParams,
    GetBalanceInputQueryParams,
} from "@/shared/ts-types/APIs/input/transactions/getBalance";
import { getErrorType } from "@/shared/errors";
import { TranslationKey } from "@/shared/ts-types/generic/translations";
import { toast } from "react-toastify";

export default class TransactionsService {
    static instance: TransactionsService = new TransactionsService();

    currencies$: BehaviorSubject<Currency[]>;

    private constructor() {
        this.currencies$ = new BehaviorSubject<Currency[]>([]);
    }

    static getInstance() {
        return this.instance;
    }

    translate(translationKeys: (TranslationKey | ErrorType)[]) {
        return Utils.getInstance().translate([
            TranslationKey.MODULES,
            TranslationKey.TRANSACTIONS,
            TranslationKey.TOAST_MESSAGES,
            ...translationKeys,
        ]);
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

            const { data, error }: CreateTransactionResponse = await response.json();
            if (error) {
                Utils.getInstance().showErrorMessage(
                    getErrorType(data.status, data.code),
                );
                return false;
            }

            toast.success(
                this.translate([TranslationKey.SUCCESSFUL_TRANSACTION_CREATION]),
            );

            const { createdTransaction } = data;

            return createdTransaction;
        } catch (err) {
            Utils.getInstance().showErrorMessage(ErrorType.UNKNOWN);
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
        wallets: string[],
    ): Promise<Result<Transaction[], ErrorResponseBodyAttributes | undefined>> {
        try {
            const queryParams: GetTransactionsInputQueryParams = {
                startCarriedOut: startCreationTimestamp.unix().toString(),
                endCarriedOut: endCreationTimestamp.unix().toString(),
                currencyId,
            };
            const multiQueryParams: GetTransactionsInputMultiQueryParams = {
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
                `/transactions?${stringQueryParams}&${stringMultiQueryParams}`,
            );
            const response = await fetch(requestURL, {
                headers: {
                    Authorization: "Bearer " + localStorage.getItem("authToken"),
                },
            });

            const { data, error }: GetTransactionsResponse = await response.json();
            if (error) {
                Utils.getInstance().showErrorMessage(
                    getErrorType(data.status, data.code),
                );
                return Err(data);
            }

            const { transactions } = data;
            return Ok(transactions);
        } catch (err) {
            Utils.getInstance().showErrorMessage(ErrorType.UNKNOWN);
            return Err(undefined);
        }
    }

    async getBalance(
        currencyId: string,
        startCarriedOut: Dayjs,
        endCarriedOut: Dayjs,
        wallets: string[],
    ): Promise<Result<GetBalanceResponseData, ErrorResponseBodyAttributes | undefined>> {
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

            const { data, error }: GetBalanceResponse = await response.json();
            if (error) {
                Utils.getInstance().showErrorMessage(
                    getErrorType(data.status, data.code),
                );
                return Err(data);
            }

            return Ok(data);
        } catch (err) {
            Utils.getInstance().showErrorMessage(ErrorType.UNKNOWN);
        }

        return Err(undefined);
    }

    async getCurrencies() {
        try {
            const requestURL = Utils.getInstance().getAPIEndpoint("/currencies");
            const response = await fetch(requestURL, {
                headers: {
                    Authorization: "Bearer " + localStorage.getItem("authToken"),
                },
            });

            const { data, error }: GetCurrenciesResponse = await response.json();
            if (error) {
                Utils.getInstance().showErrorMessage(
                    getErrorType(data.status, data.code),
                );
                return;
            }

            const { currencies } = data;
            this.currencies$.next(currencies);
        } catch (err) {
            Utils.getInstance().showErrorMessage(ErrorType.UNKNOWN);
        }
    }

    getCurrency(id: string): Currency | undefined {
        return this.currencies$.getValue().find((currency) => currency.id === id);
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

            const { data, error }: GetNormalTransactionCategoriesResponse =
                await response.json();
            if (error) {
                Utils.getInstance().showErrorMessage(
                    getErrorType(data.status, data.code),
                );
                return;
            }

            const { transactionCategories } = data;

            return transactionCategories;
        } catch (err) {
            Utils.getInstance().showErrorMessage(ErrorType.UNKNOWN);
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

            const { data, error }: GetTransactionCategoryBalancesResponse =
                await response.json();
            if (error) {
                Utils.getInstance().showErrorMessage(
                    getErrorType(data.status, data.code),
                );
                return Err(data);
            }

            const { transactionCategories } = data;
            return Ok(transactionCategories);
        } catch (err) {
            console.log(err);
            Utils.getInstance().showErrorMessage(ErrorType.UNKNOWN);
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

            const { data, error }: CreateTransactionCategoryResponse =
                await response.json();
            if (error) {
                Utils.getInstance().showErrorMessage(
                    getErrorType(data.status, data.code),
                );
                return;
            }

            toast.success(
                this.translate([TranslationKey.SUCCESSFUL_TRANSACTION_CATEGORY_CREATION]),
            );

            const { createdTransactionCategory } = data;

            return createdTransactionCategory;
        } catch (err) {
            Utils.getInstance().showErrorMessage(ErrorType.UNKNOWN);
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

            const { data, error }: DeleteTransactionResponse = await response.json();
            if (error) {
                Utils.getInstance().showErrorMessage(
                    getErrorType(data.status, data.code),
                );
                return false;
            }

            toast.success(
                this.translate([TranslationKey.SUCCESSFUL_TRANSACTION_DELETION]),
            );

            return true;
        } catch (err) {
            Utils.getInstance().showErrorMessage(ErrorType.UNKNOWN);
            return false;
        }
    }
}
