import { useState } from "react";
import { MdAdd } from "react-icons/md";
import Validator from "validatorjs";

import "./style.css";
import Dialog from "@shared/components/Dialog";
import InputTextField from "@shared/components/InputTextField";
import TransactionsService from "@shared/services/transactions";
import NormalButton from "@shared/components/NormalButton";
import TextButton from "@shared/components/TextButton";
import { Wallet } from "@shared/schema";
import { CreateWalletBody } from "@shared/ts-types/APIs/input/transactions/createWallet";
import { createWalletBodyRules } from "@shared/validatorRules/wallets";
import WalletsService from "@shared/services/wallets";
import { FieldName, TranslationKey } from "@shared/ts-types/generic/translations";
import { Utils } from "@shared/services/utils";

interface IProps {
    close: Function;
    isCreationMode: boolean;
    selectedCurrencyId: string;
    openedWallet?: Wallet;
    onSuccess?: (createdTransaction: Wallet) => any;
    onUpdate?: Function;
}

const WalletDialog = ({
    close,
    isCreationMode,
    selectedCurrencyId,
    openedWallet,
    onSuccess,
    onUpdate,
}: IProps) => {
    if (!isCreationMode && !openedWallet) {
        throw new Error("The wallet dialog in update mode must receive a wallet to open");
    }

    let [isSubmitting, setIsSubmitting] = useState<boolean>(false);

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
        setIsSubmitting(true);

        const createWalletRequest = await WalletsService.getInstance().createWallet({
            name,
            untrackedBalance,
            currencyId: selectedCurrencyId,
        });
        if (createWalletRequest.err) {
            // TODO: handle error
        } else {
            onSuccess && onSuccess(createWalletRequest.val);
        }

        setIsSubmitting(false);
    };

    const updateWallet = async () => {
        setIsSubmitting(true);

        const updateWalletRequest = await WalletsService.getInstance().updateWallet(
            // TODO: remove assertion and use conditional props interface instead
            openedWallet!.id,
            {
                name,
                untrackedBalance,
            },
        );
        if (updateWalletRequest.err) {
            // TODO: handle error
        } else {
            onUpdate && onUpdate();
        }

        setIsSubmitting(false);
    };

    const translate = (translationKeys: TranslationKey[]) => {
        return Utils.getInstance().translate([
            TranslationKey.MODULES,
            TranslationKey.WALLETS,
            ...translationKeys,
        ]);
    };

    return (
        <Dialog
            title={
                isCreationMode
                    ? translate([TranslationKey.CREATION_DIALOG, TranslationKey.TITLE])
                    : `"${openedWallet!.name}" wallet`
            }
            content={
                <div className="transaction-creation-dialog__content">
                    {/* Name */}
                    <InputTextField
                        title={translate([
                            TranslationKey.CREATION_DIALOG,
                            TranslationKey.FIELDS,
                            TranslationKey.NAME,
                        ])}
                        value={name}
                        validatorAttributeName={FieldName.NAME}
                        validatorRule={createWalletBodyRules.name}
                        onInput={setName}
                    />
                    {/* Untracked balance */}
                    <InputTextField
                        title={translate([
                            TranslationKey.CREATION_DIALOG,
                            TranslationKey.FIELDS,
                            TranslationKey.UNTRACKED_BALANCE,
                        ])}
                        type="number"
                        validatorAttributeName={FieldName.UNTRACKED_BALANCE}
                        validatorRule={createWalletBodyRules.untrackedBalance}
                        value={untrackedBalance}
                        onInput={(value) => setUntrackedBalance(Number.parseFloat(value))}
                    />
                </div>
            }
            footer={
                <div className="transaction-creation-dialog__footer">
                    <TextButton
                        text={translate([
                            TranslationKey.CREATION_DIALOG,
                            TranslationKey.CANCEL,
                        ])}
                        size="large"
                        clickEvent={() => close()}
                    />
                    <NormalButton
                        className="transaction-creation-dialog__footer__confirmation-button"
                        Icon={isCreationMode ? MdAdd : undefined}
                        text={
                            isCreationMode
                                ? translate([
                                      TranslationKey.CREATION_DIALOG,
                                      TranslationKey.CONFIRM,
                                  ])
                                : "Update"
                        }
                        isLoading={isSubmitting}
                        event={() => (isCreationMode ? createWallet() : updateWallet())}
                        disabled={!getFormValidator().passes() || isSubmitting}
                    />
                </div>
            }
        />
    );
};

export default WalletDialog;
