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
import { Wallet } from "@shared/schema";
import { CreateWalletBody } from "@shared/ts-types/APIs/input/transactions/createWallet";
import { createWalletBodyRules } from "@shared/validatorRules/wallets";

interface IProps {
    close: Function;
    isCreationMode: boolean;
    selectedCurrencyId: string;
    openedWallet?: Wallet;
    onSuccess?: (createdTransaction: Wallet) => any;
}

const WalletDialog = ({
    close,
    isCreationMode,
    selectedCurrencyId,
    openedWallet,
    onSuccess,
}: IProps) => {
    if (!isCreationMode && !openedWallet) {
        throw new Error("The wallet dialog in update mode must receive a wallet to open");
    }

    let [isCreatingWallet, setIsCreatingWallet] = useState<boolean>(false);

    // Form data
    let [name, setName] = useState<string>(isCreationMode ? "" : openedWallet!.name);
    let [untrackedBalance, setUntrackedBalance] = useState<number>(
        isCreationMode ? 0 : openedWallet!.untrackedBalance,
    );

    const getFormValidator = () => {
        const formData: CreateWalletBody = {
            name,
            untrackedBalance,
            currencyId: selectedCurrencyId,
        };

        return new Validator(formData, createWalletBodyRules);
    };

    const createWallet = async () => {
        setIsCreatingWallet(true);

        const createWalletRequest = await TransactionsService.getInstance().createWallet({
            name,
            untrackedBalance,
            currencyId: selectedCurrencyId,
        });
        if (createWalletRequest.err) {
            // TODO: handle error
        } else {
            onSuccess && onSuccess(createWalletRequest.val);
        }

        setIsCreatingWallet(false);
    };

    return (
        <Dialog
            title={isCreationMode ? "Wallet creation" : `"${openedWallet!.name}" wallet`}
            content={
                <div className="transaction-creation-dialog__content">
                    {/* Name */}
                    <InputTextField
                        title="Name"
                        value={name}
                        validatorAttributeName="name"
                        validatorRule={createWalletBodyRules.name}
                        onInput={setName}
                    />
                    {/* Untracked balance */}
                    <InputTextField
                        title="Untracked balance"
                        type="number"
                        validatorAttributeName="untracked balance"
                        validatorRule={createWalletBodyRules.untrackedBalance}
                        value={untrackedBalance}
                        onInput={(value) => setUntrackedBalance(Number.parseFloat(value))}
                    />
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
