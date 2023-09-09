import ErrorType from "@shared/errors/list";
import { Translation } from "@shared/ts-types/generic/translations";

const translation: Translation = {
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
        cancel: "Esci",
        confirm: "Conferma",
    },
    modules: {
        wallets: {
            header: {
                title: "Portafogli",
                subTitle: "portafogli",
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
            },
            toastMessages: {
                successfulTransactionCreation: "Transazione creata con successo",
                successfulTransactionUpdate: "Transazione aggiornata con successo",
                successfulTransactionDeletion: "Transazione eliminata con successo",
                successfulTransactionCategoryCreation:
                    "Categoria di transazione creata con successo",
            },
        },
    },
};

export default {
    translation,
};
