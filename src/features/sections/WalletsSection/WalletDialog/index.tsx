import { useState } from "react";
import { MdAdd } from "react-icons/md";
import Validator from "validatorjs";

import "./style.css";
import Dialog from "@shared/components/Dialog";
import InputTextField from "@shared/components/InputTextField";
import TransactionsService from "@shared/services/transactions";
import NormalButton from "@shared/components/NormalButton";
import TextButton from "@shared/components/TextButton";
import { createTransactionBodyRules } from "@shared/validatorRules/transactions";
import { Transaction } from "@shared/schema";
import { CreateWalletBody } from "@shared/ts-types/APIs/input/transactions/createWallet";

interface IProps {
    close: Function;
    isCreationMode: boolean;
    selectedCurrencyId: string;
    openedTransaction?: Transaction;
    onSuccess?: (createdTransaction: Transaction) => any;
}

const WalletDialog = ({
    close,
    isCreationMode,
    selectedCurrencyId,
    openedTransaction,
    onSuccess,
}: IProps) => {
    if (!isCreationMode && !openedTransaction) {
        throw new Error("The wallet dialog in update mode must receive a wallet to open");
    }

    let [isCreatingWallet, setIsCreatingWallet] = useState<boolean>(false);

    // Form data
    let [name, setName] = useState<string>(isCreationMode ? "" : openedTransaction!.name);

    const getFormValidator = () => {
        const formData: CreateWalletBody = {
            name,
            currencyId: selectedCurrencyId,
        };

        return new Validator(formData, createTransactionBodyRules);
    };

    const createWallet = async () => {
        setIsCreatingWallet(true);

        await TransactionsService.getInstance().createWallet({
            name,
            currencyId: selectedCurrencyId,
        });

        setIsCreatingWallet(false);
    };

    return (
        <Dialog
            title={
                isCreationMode ? "Wallet creation" : `"${openedTransaction!.name}" wallet`
            }
            content={
                <div className="transaction-creation-dialog__content">
                    {/* Name */}
                    <InputTextField
                        title="Name"
                        value={name}
                        validatorAttributeName="name"
                        validatorRule={createTransactionBodyRules.name}
                        onInput={setName}
                    />
                    {/* Value */}
                    {/* <InputTextField
                        title="Value"
                        type="number"
                        min={0}
                        validatorAttributeName="value"
                        validatorRule={createTransactionBodyRules.amount}
                        value={value}
                        onInput={(value) => setValue(Number.parseFloat(value))}
                    /> */}
                </div>
            }
            footer={
                <div className="transaction-creation-dialog__footer">
                    <TextButton text="Exit" size="large" clickEvent={() => close()} />
                    <NormalButton
                        className="transaction-creation-dialog__footer__confirmation-button"
                        Icon={isCreationMode ? MdAdd : undefined}
                        text={isCreationMode ? "Create" : "Update"}
                        isLoading={isCreatingWallet}
                        event={() => isCreationMode && createWallet()}
                        disabled={!getFormValidator().passes() || isCreatingWallet}
                    />
                </div>
            }
        />
    );
};

export default WalletDialog;
