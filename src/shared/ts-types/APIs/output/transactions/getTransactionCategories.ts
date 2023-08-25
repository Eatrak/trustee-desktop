import { Response } from "@shared/errors/types";
import { TransactionCategory } from "@shared/schema";
import {
    TransactionCategoriesViews,
    TransactionCategoryBalance,
} from "@shared/ts-types/DTOs/transactions";

export interface GetNormalTransactionCategoriesResponseData {
    view: TransactionCategoriesViews.NORMAL;
    transactionCategories: TransactionCategory[];
}

export interface GetTransactionCategoryBalancesResponseData {
    view: TransactionCategoriesViews.WITH_BALANCE;
    transactionCategories: TransactionCategoryBalance[];
}

export type GetNormalTransactionCategoriesResponse =
    Response<GetNormalTransactionCategoriesResponseData>;

export type GetTransactionCategoryBalancesResponse =
    Response<GetTransactionCategoryBalancesResponseData>;

export type GetTransactionCategoriesResponse = Response<
    | GetNormalTransactionCategoriesResponseData
    | GetTransactionCategoryBalancesResponseData
>;
