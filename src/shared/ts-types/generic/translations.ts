import ErrorType from "@shared/errors/list";

export enum TranslationLanguage {
    EN = "en",
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
}

export interface Translation {
    [TranslationKey.ERRORS]: {
        [errorType in ErrorType]: string;
    };
    [TranslationKey.MODULES]: {
        [TranslationKey.WALLETS]: {
            [TranslationKey.TOAST_MESSAGES]: {
                [TranslationKey.SUCCESSFUL_WALLET_CREATION]: string;
                [TranslationKey.SUCCESSFUL_WALLET_UPDATE]: string;
                [TranslationKey.SUCCESSFUL_WALLET_DELETION]: string;
            };
        };
        [TranslationKey.TRANSACTIONS]: {
            [TranslationKey.TOAST_MESSAGES]: {
                [TranslationKey.SUCCESSFUL_TRANSACTION_CREATION]: string;
                [TranslationKey.SUCCESSFUL_TRANSACTION_UPDATE]: string;
                [TranslationKey.SUCCESSFUL_TRANSACTION_DELETION]: string;
                [TranslationKey.SUCCESSFUL_TRANSACTION_CATEGORY_CREATION]: string;
            };
        };
    };
}
