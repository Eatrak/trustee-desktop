import ErrorType from "@shared/errors/list";

export enum TranslationLanguage {
    EN = "en",
    IT = "it",
}

export enum TranslationKey {
    ERRORS = "errors",
    MODULES = "modules",
    WALLETS = "wallets",
    TRANSACTIONS = "transactions",
    TOAST_MESSAGES = "toastMessages",
    SUCCESSFUL_WALLET_CREATION = "successfulWalletCreation",
    SUCCESSFUL_WALLET_UPDATE = "successfulWalletUpdate",
    SUCCESSFUL_WALLET_DELETION = "successfulWalletDeletion",
    SUCCESSFUL_TRANSACTION_CREATION = "successfulTransactionCreation",
    SUCCESSFUL_TRANSACTION_UPDATE = "successfulTransactionUpdate",
    SUCCESSFUL_TRANSACTION_DELETION = "successfulTransactionDeletion",
    SUCCESSFUL_TRANSACTION_CATEGORY_CREATION = "successfulTransactionCategoryCreation",
    NAVBAR = "navbar",
    BUTTONS = "buttons",
    HEADER = "header",
    TITLE = "title",
    SUB_TITLE = "subTitle",
    TOTAL_INCOME = "totalIncome",
    TOTAL_EXPENSE = "totalExpense",
    TOTAL_UNTRACKED_BALANCE = "totalUntrackedBalance",
    TOTAL_NET = "totalNet",
    TABLE = "table",
    NAME = "name",
    NET = "net",
    INCOME = "income",
    EXPENSE = "expense",
    UNTRACKED_BALANCE = "untrackedBalance",
    TRANSACTIONS_COUNT = "transactionsCount",
    DELETION_DIALOG = "deletionDialog",
    DESCRIPTION = "description",
    CANCEL = "cancel",
    CONFIRM = "confirm",
    CREATION_DIALOG = "creationDialog",
    FIELDS = "fields",
    SUMMARY = "summary",
    CONFIRMATION_DIALOG = "confirmationDialog",
}

export interface Translation {
    [TranslationKey.ERRORS]: {
        [errorType in ErrorType]: string;
    };
    [TranslationKey.MODULES]: {
        [TranslationKey.WALLETS]: {
            [TranslationKey.HEADER]: {
                [TranslationKey.TITLE]: string;
                [TranslationKey.SUB_TITLE]: string;
            };
            [TranslationKey.TABLE]: {
                [TranslationKey.NAME]: string;
                [TranslationKey.NET]: string;
                [TranslationKey.INCOME]: string;
                [TranslationKey.EXPENSE]: string;
                [TranslationKey.UNTRACKED_BALANCE]: string;
                [TranslationKey.TRANSACTIONS_COUNT]: string;
            };
            [TranslationKey.SUMMARY]: {
                [TranslationKey.TOTAL_INCOME]: string;
                [TranslationKey.TOTAL_EXPENSE]: string;
                [TranslationKey.TOTAL_UNTRACKED_BALANCE]: string;
                [TranslationKey.TOTAL_NET]: string;
            };
            [TranslationKey.DELETION_DIALOG]: {
                [TranslationKey.TITLE]: string;
                [TranslationKey.DESCRIPTION]: string;
                [TranslationKey.CANCEL]: string;
                [TranslationKey.CONFIRM]: string;
            };
            [TranslationKey.CREATION_DIALOG]: {
                [TranslationKey.TITLE]: string;
                [TranslationKey.FIELDS]: {
                    [TranslationKey.NAME]: string;
                    [TranslationKey.UNTRACKED_BALANCE]: string;
                };
                [TranslationKey.CANCEL]: string;
                [TranslationKey.CONFIRM]: string;
            };
            [TranslationKey.TOAST_MESSAGES]: {
                [TranslationKey.SUCCESSFUL_WALLET_CREATION]: string;
                [TranslationKey.SUCCESSFUL_WALLET_UPDATE]: string;
                [TranslationKey.SUCCESSFUL_WALLET_DELETION]: string;
            };
        };
        [TranslationKey.TRANSACTIONS]: {
            [TranslationKey.HEADER]: {
                [TranslationKey.TITLE]: string;
            };
            [TranslationKey.TOAST_MESSAGES]: {
                [TranslationKey.SUCCESSFUL_TRANSACTION_CREATION]: string;
                [TranslationKey.SUCCESSFUL_TRANSACTION_UPDATE]: string;
                [TranslationKey.SUCCESSFUL_TRANSACTION_DELETION]: string;
                [TranslationKey.SUCCESSFUL_TRANSACTION_CATEGORY_CREATION]: string;
            };
        };
    };
    [TranslationKey.NAVBAR]: {
        [TranslationKey.BUTTONS]: {
            [TranslationKey.WALLETS]: string;
            [TranslationKey.TRANSACTIONS]: string;
        };
    };
    [TranslationKey.CONFIRMATION_DIALOG]: {
        [TranslationKey.CANCEL]: string;
        [TranslationKey.CONFIRM]: string;
    };
}
