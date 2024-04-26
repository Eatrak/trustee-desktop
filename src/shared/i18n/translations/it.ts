import zodTranslation from "zod-i18n-map/locales/it/zod.json";

import ErrorType from "@/shared/errors/list";
import {
    FieldNamesTranslation,
    Translation,
} from "@/shared/ts-types/generic/translations";

const translation: Translation = {
    fieldNames: {
        name: "nome",
        wallet: "portafoglio",
        amount: "importo",
        categories: "categorie",
        creationDate: "data creazione",
        untrackedBalance: "saldo non monitorato",
        email: "email",
        surname: "cognome",
        currency: "valuta",
        language: "lingua",
        password: "password",
    },
    errors: {
        [ErrorType.DUPLICATE_ENTRY]: "Risorsa già esistente",
        [ErrorType.ENV]: "Qualcosa è andato storto. Per favore, riprova più tardi",
        [ErrorType.DATA_VALIDATION]: "Dati non validi",
        [ErrorType.COGNITO_USER_CREATION]: "Registrazione fallita",
        [ErrorType.COGNITO_USER_PASSWORD_SETTING]:
            "Registrazione fallita. Per favore, contatta il supporto per completare la registrazione.",
        [ErrorType.NOT_FOUND]: "Non trovato",
        [ErrorType.READING_GENERATED_ID_TOKEN]: "Accesso fallito",
        [ErrorType.UNAUTHORIZED]: "Non sei autorizzato a eseguire questa operazione",
        [ErrorType.DB_INITIALIZATION]:
            "Qualcosa è andato storto. Per favore, riprova più tardi",
        [ErrorType.UNKNOWN]: "Qualcosa è andato storto. Per favore, riprova più tardi",
    },
    navbar: {
        buttons: {
            wallets: "Portafogli",
            transactions: "Transazioni",
        },
    },
    confirmationDialog: {
        cancel: "No",
        confirm: "Sì",
    },
    formModule: {
        confirmationDialog: {
            title: "Sei sicuro di uscire?",
            description: "Cliccando 'Sì' il processo sarà annullato.",
        },
        footer: {
            cancel: "Esci",
            confirm: "Conferma",
        },
    },
    general: {
        all: "Tutti",
    },
    modules: {
        walletUpdate: {
            header: {
                title: "Modifica portafoglio",
                subTitle: "Stai modificando il portafoglio '{{name}}'.",
            },
        },
        walletCreation: {
            header: {
                title: "Creazione portafoglio",
                subTitle: "Crea un nuovo portafoglio.",
            },
        },
        wallets: {
            header: {
                title: "Portafogli",
                subTitle_one: "{{count}} portafoglio",
                subTitle_other: "{{count}} portafogli",
                creationButtonText: "Aggiungi nuovo portafoglio",
            },
            summary: {
                totalIncome: "Reddito totale",
                totalExpense: "Spesa totale",
                totalUntrackedBalance: "Saldo non monitorato totale",
                totalNet: "Totale netto",
            },
            table: {
                name: "Nome",
                net: "Netto",
                income: "Reddito",
                expense: "Spesa",
                untrackedBalance: "Saldo non monitorato",
                transactionsCount: "Conteggio transazioni",
            },
            creationDialog: {
                title: "Creazione portafoglio",
                fields: {
                    name: "Nome",
                    untrackedBalance: "Saldo non monitorato",
                },
                cancel: "Esci",
                confirm: "Conferma",
            },
            deletionDialog: {
                title: "Eliminazione portafoglio",
                description: "Sei sicuro di voler eliminare il portafoglio?",
                cancel: "Esci",
                confirm: "Conferma",
            },
            toastMessages: {
                successfulWalletCreation: "Portafoglio creato con successo",
                successfulWalletUpdate: "Portafoglio aggiornato con successo",
                successfulWalletDeletion: "Portafoglio eliminato con successo",
            },
        },
        transactions: {
            header: {
                title: "Transazioni",
                subTitle_one: "{{count}} transazione",
                subTitle_other: "{{count}} transazioni",
                creationButtonText: "Aggiungi nuova transazione",
            },
            summary: {
                income: "Entrata",
                expense: "Spesa",
                net: "Netto",
            },
            walletsMultiSelect: {
                title: "Portafogli",
                placeholder: "Cerca un portafoglio digitando un nome",
            },
            table: {
                name: "Nome",
                creationDate: "Data di creazione",
                amount: "Importo",
            },
            creationDialog: {
                title: "Creazione transazione",
                fields: {
                    name: "Nome",
                    walletSelect: {
                        title: "Portafoglio",
                        placeholder: "Cerca digitando un nome",
                    },
                    categoriesMultiSelect: {
                        title: "Categorie",
                        placeholder: "Cerca o crea digitando un nome",
                        creationButtonText: 'Crea la categoria "{{categoryName}}"',
                    },
                    creationDate: "Data di creazione",
                    amount: "Importo",
                    itIsIncome: "È un'entrata",
                },
                cancel: "Esci",
                confirm: "Conferma",
            },
            deletionDialog: {
                title: "Eliminazione transazione",
                description: "Sei sicuro di voler eliminare la transazione?",
                cancel: "Esci",
                confirm: "Conferma",
            },
            statistics: {
                categoriesIncome: "Entrate per categorie",
                categoriesExpense: "Spese per categorie",
            },
            loadMore: "Carica altro",
            toastMessages: {
                successfulTransactionCreation: "Transazione creata con successo",
                successfulTransactionUpdate: "Transazione aggiornata con successo",
                successfulTransactionDeletion: "Transazione eliminata con successo",
                successfulTransactionCategoryCreation:
                    "Categoria di transazione creata con successo",
            },
        },
        settings: {
            header: {
                title: "Impostazioni",
                subTitle: "",
            },
            tabs: {
                info: {
                    title: "Info",
                    fields: {
                        name: "Nome",
                        surname: "Cognome",
                        email: "Email",
                    },
                },
                preferences: {
                    title: "Preferenze",
                    fields: {
                        currency: {
                            title: "Valuta",
                            filterPlaceHolder: "Cerca una valuta scrivendo un nome",
                        },
                        language: {
                            title: "Lingua",
                            filterPlaceHolder: "Cerca una lingua scrivendo un nome",
                        },
                    },
                    toastMessages: {
                        successfulSettingsUpdate:
                            "Le tue preferenze sono state aggiornate con successo.",
                    },
                    footer: { confirm: "Salva" },
                },
                changePassword: {
                    title: "Cambia Password",
                    toastMessages: {
                        successfulSettingsUpdate:
                            "La tua password e' stata aggiornate con successo.",
                    },
                    footer: { confirm: "Salva" },
                },
            },
        },
    },
};

let customZodTranslation = zodTranslation;
customZodTranslation.errors.too_small.string.inclusive =
    "Il campo {{path}} deve essere almeno {{minimum}} carattere/i";

const fieldNamesTranslation: FieldNamesTranslation = {
    email: "email",
    password: "password",
    amount: "import",
    categories: "categorie",
    creationDate: "data di creazione",
    currency: "valuta",
    language: "lingua",
    name: "nome",
    surname: "cognome",
    untrackedBalance: "bilancio non tracciato",
    wallet: "portafoglio",
};

export default {
    zod: { ...customZodTranslation, ...fieldNamesTranslation },
    translation,
};
