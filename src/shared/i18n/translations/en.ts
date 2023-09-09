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
    modules: {
        wallets: {
            toastMessages: {
                successfulWalletCreation: "Wallet successfully created",
                successfulWalletUpdate: "Wallet successfully updated",
                successfulWalletDeletion: "Wallet successfully deleted",
            },
        },
    },
};

export default {
    translation,
};
