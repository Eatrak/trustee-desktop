import ErrorType from "@shared/errors/list";

export enum TranslationLanguage {
    EN = "en",
}

export enum TranslationKey {
    ERRORS = "errors",
    MODULES = "modules",
    WALLETS = "wallets",
    TOAST_MESSAGES = "toastMessages",
    SUCCESSFUL_WALLET_CREATION = "successfulWalletCreation",
    SUCCESSFUL_WALLET_UPDATE = "successfulWalletUpdate",
    SUCCESSFUL_WALLET_DELETION = "successfulWalletDeletion",
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
    };
}
