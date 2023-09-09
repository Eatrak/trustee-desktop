import ErrorType from "@shared/errors/list";
import { Translation } from "@shared/ts-types/generic/translations";

const translation: Translation = {
    errors: {
        [ErrorType.DUPLICATE_ENTRY]: "Already existing resource",
        [ErrorType.ENV]: "Something went wrong. Please, try later",
        [ErrorType.DATA_VALIDATION]: "Invalid data",
        [ErrorType.COGNITO_USER_CREATION]: "Sign-up failed",
        [ErrorType.COGNITO_USER_PASSWORD_SETTING]:
            "Sign-up failed. Please, contact the support to complete the sign-up.",
        [ErrorType.NOT_FOUND]: "Not found",
        [ErrorType.READING_GENERATED_ID_TOKEN]: "Sign-in failed",
        [ErrorType.UNAUTHORIZED]: "You are not authorized to perform this operation",
        [ErrorType.DB_INITIALIZATION]: "Something went wrong. Please, try later",
        [ErrorType.UNKNOWN]: "Something went wrong. Please, try later",
    },
    navbar: {
        buttons: {
            wallets: "Wallets",
            transactions: "Transactions",
        },
    },
    confirmationDialog: {
        cancel: "Exit",
        confirm: "Confirm",
    },
    modules: {
        wallets: {
            header: {
                title: "Wallets",
                subTitle: "wallets",
            },
            summary: {
                totalIncome: "Total income",
                totalExpense: "Total expense",
                totalUntrackedBalance: "Total untracked balance",
                totalNet: "Total net",
            },
            table: {
                name: "Name",
                net: "Net",
                income: "Income",
                expense: "Expense",
                untrackedBalance: "Untracked balance",
                transactionsCount: "Transactions count",
            },
            creationDialog: {
                title: "Wallet creation",
                fields: {
                    name: "Name",
                    untrackedBalance: "Untracked balance",
                },
                cancel: "Exit",
                confirm: "Confirm",
            },
            deletionDialog: {
                title: "Wallet deletion",
                description: "Are you sure to delete the wallet?",
                cancel: "Exit",
                confirm: "Confirm",
            },
            toastMessages: {
                successfulWalletCreation: "Wallet successfully created",
                successfulWalletUpdate: "Wallet successfully updated",
                successfulWalletDeletion: "Wallet successfully deleted",
            },
        },
        transactions: {
            header: {
                title: "Transactions",
            },
            toastMessages: {
                successfulTransactionCreation: "Transaction successfully created",
                successfulTransactionUpdate: "Transaction successfully updated",
                successfulTransactionDeletion: "Transaction successfully deleted",
                successfulTransactionCategoryCreation:
                    "Transaction category successfully created",
            },
        },
    },
};

export default {
    translation,
};
