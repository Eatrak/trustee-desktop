import zodTranslation from "zod-i18n-map/locales/en/zod.json";

import ErrorType from "@/shared/errors/list";
import {
    FieldNamesTranslation,
    Translation,
} from "@/shared/ts-types/generic/translations";

const translation: Translation = {
    fieldNames: {
        name: "name",
        wallet: "wallet",
        amount: "amount",
        categories: "categories",
        creationDate: "creation date",
        untrackedBalance: "untracked balance",
        email: "email",
        surname: "surname",
        currency: "currency",
        language: "language",
        password: "password",
    },
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
        cancel: "No",
        confirm: "Yes",
    },
    formModule: {
        confirmationDialog: {
            title: "Are you sure to exit?",
            description: "By clicking 'Yes' the process will be aborted.",
        },
        footer: {
            cancel: "Exit",
            confirm: "Confirm",
        },
    },
    general: {
        all: "All",
    },
    modules: {
        walletUpdate: {
            header: {
                title: "Wallet update",
                subTitle: "You are updating the wallet '{{name}}'.",
            },
        },
        walletCreation: {
            header: {
                title: "Wallet creation",
                subTitle: "Create a new wallet.",
            },
        },
        wallets: {
            header: {
                title: "Wallets",
                subTitle_one: "{{count}} wallet",
                subTitle_other: "{{count}} wallets",
                creationButtonText: "Add new wallet",
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
            summary: {
                income: "Income",
                expense: "Expense",
                net: "Net",
            },
            walletsMultiSelect: {
                title: "Wallets",
                placeholder: "Search a wallet by typing a name",
            },
            table: {
                name: "Name",
                creationDate: "Creation date",
                amount: "Amount",
            },
            creationDialog: {
                title: "Transaction creation",
                fields: {
                    name: "Name",
                    walletSelect: {
                        title: "Wallet",
                        placeholder: "Search by typing a name",
                    },
                    categoriesMultiSelect: {
                        title: "Categories",
                        placeholder: "Search or create by typing a name",
                        creationButtonText: 'Create the category "{{categoryName}}"',
                    },
                    creationDate: "Creation date",
                    amount: "Amount",
                    itIsIncome: "It's income",
                },
                cancel: "Exit",
                confirm: "Confirm",
            },
            deletionDialog: {
                title: "Transaction deletion",
                description: "Are you sure to delete the transaction?",
                cancel: "Exit",
                confirm: "Confirm",
            },
            statistics: {
                categoriesIncome: "Categories income",
                categoriesExpense: "Categories expense",
            },
            loadMore: "Load more",
            toastMessages: {
                successfulTransactionCreation: "Transaction successfully created",
                successfulTransactionUpdate: "Transaction successfully updated",
                successfulTransactionDeletion: "Transaction successfully deleted",
                successfulTransactionCategoryCreation:
                    "Transaction category successfully created",
            },
        },
        settings: {
            header: {
                title: "Settings",
                subTitle: "",
            },
            tabs: {
                info: {
                    title: "Info",
                    fields: {
                        name: "Name",
                        surname: "Surname",
                        email: "Email",
                    },
                },
                preferences: {
                    title: "Preferences",
                    fields: {
                        currency: {
                            title: "Currency",
                            filterPlaceHolder: "Search a currency by typing a name",
                        },
                        language: {
                            title: "Language",
                            filterPlaceHolder: "Search a language by typing a name",
                        },
                    },
                    toastMessages: {
                        successfulSettingsUpdate:
                            "Your settings has been successfully updated",
                    },
                    footer: { confirm: "Save" },
                },
                changePassword: {
                    title: "Change Password",
                    toastMessages: {
                        successfulSettingsUpdate:
                            "Your settings has been successfully updated",
                    },
                    footer: { confirm: "Save" },
                },
            },
        },
    },
};

let customZodTranslation = zodTranslation;
customZodTranslation.errors.too_small.string.inclusive =
    "The field {{path}} must be at least {{minimum}} character(s)";

const fieldNamesTranslation: FieldNamesTranslation = {
    email: "email",
    password: "password",
    amount: "amount",
    categories: "categories",
    creationDate: "creation date",
    currency: "currency",
    language: "language",
    name: "name",
    surname: "surname",
    untrackedBalance: "untracked balance",
    wallet: "wallet",
};

export default {
    zod: { ...customZodTranslation, ...fieldNamesTranslation },
    translation,
};
