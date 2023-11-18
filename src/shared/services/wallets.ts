import { Err, Ok, Result } from "ts-results";
import { toast } from "react-toastify";

import { Utils } from "./utils";
import { Wallet } from "@/shared/schema";
import ErrorType from "@/shared/errors/list";
import { getErrorType } from "@/shared/errors";
import { ErrorResponseBodyAttributes } from "@/shared/errors/types";
import { TranslationKey } from "@/shared/ts-types/generic/translations";
import { CreateWalletBody } from "@/shared/ts-types/APIs/input/transactions/createWallet";
import { DeleteWalletPathParameters } from "@/shared/ts-types/APIs/input/transactions/deleteWallet";
import {
    UpdateWalletBody,
    UpdateWalletPathParameters,
    UpdateWalletUpdateInfo,
} from "@/shared/ts-types/APIs/input/transactions/updateWallet";
import { CreateWalletResponse } from "@/shared/ts-types/APIs/output/transactions/createWallet";
import { DeleteWalletsResponse } from "@/shared/ts-types/APIs/output/transactions/deleteWallet";
import { UpdateWalletResponse } from "@/shared/ts-types/APIs/output/transactions/updateWallet";
import {
    GetWalletTableRowsResponse,
    GetWalletsResponse,
} from "@/shared/ts-types/APIs/output/transactions/getWallets";
import { WalletTableRow, WalletViews } from "@/shared/ts-types/DTOs/wallets";

export default class WalletsService {
    static instance: WalletsService = new WalletsService();

    private constructor() {}

    static getInstance() {
        return this.instance;
    }

    translate(translationKeys: (TranslationKey | ErrorType)[]) {
        return Utils.getInstance().translate([
            TranslationKey.MODULES,
            TranslationKey.WALLETS,
            TranslationKey.TOAST_MESSAGES,
            ...translationKeys,
        ]);
    }

    async createWallet(
        createWalletBody: CreateWalletBody,
    ): Promise<Result<Wallet, ErrorResponseBodyAttributes | undefined>> {
        try {
            const requestURL = Utils.getInstance().getAPIEndpoint("/wallets");
            const response = await fetch(requestURL, {
                method: "POST",
                headers: {
                    Authorization: "Bearer " + localStorage.getItem("authToken"),
                },
                body: JSON.stringify(createWalletBody),
            });

            const { data, error }: CreateWalletResponse = await response.json();
            if (error) {
                Utils.getInstance().showErrorMessage(
                    getErrorType(data.status, data.code),
                );
                return Err(data);
            }

            toast.success(this.translate([TranslationKey.SUCCESSFUL_WALLET_CREATION]));

            const { createdWallet } = data;

            return Ok(createdWallet);
        } catch (err) {
            console.log(err);
            Utils.getInstance().showErrorMessage(ErrorType.UNKNOWN);
            return Err(undefined);
        }
    }

    async deleteWallet(id: string): Promise<boolean> {
        try {
            // Initialize query parameters
            const pathParams: DeleteWalletPathParameters = {
                id,
            };

            // Initialize request URL
            const requestURL = Utils.getInstance().getAPIEndpoint(
                `/wallets/${pathParams.id}`,
            );

            // Send request
            const response = await fetch(requestURL, {
                method: "DELETE",
                headers: {
                    Authorization: "Bearer " + localStorage.getItem("authToken"),
                },
            });

            const { data, error }: DeleteWalletsResponse = await response.json();
            if (error) {
                Utils.getInstance().showErrorMessage(
                    getErrorType(data.status, data.code),
                );
                return false;
            }

            toast.success(this.translate([TranslationKey.SUCCESSFUL_WALLET_DELETION]));

            return true;
        } catch (err) {
            Utils.getInstance().showErrorMessage(ErrorType.UNKNOWN);
            return false;
        }
    }

    async updateWallet(
        id: string,
        updateInfo: UpdateWalletUpdateInfo,
    ): Promise<Result<undefined, ErrorResponseBodyAttributes | undefined>> {
        try {
            // Initialize path parameters
            const pathParams: UpdateWalletPathParameters = {
                id,
            };

            // Initialize body
            const body: UpdateWalletBody = {
                updateInfo,
            };

            // Initialize request URL
            const requestURL = Utils.getInstance().getAPIEndpoint(
                `/wallets/${pathParams.id}`,
            );

            // Send request
            const response = await fetch(requestURL, {
                method: "PUT",
                headers: {
                    Authorization: "Bearer " + localStorage.getItem("authToken"),
                },
                body: JSON.stringify(body),
            });

            const { data, error }: UpdateWalletResponse = await response.json();
            if (error) {
                Utils.getInstance().showErrorMessage(
                    getErrorType(data.status, data.code),
                );
                return Err(data);
            }

            toast.success(this.translate([TranslationKey.SUCCESSFUL_WALLET_UPDATE]));

            return Ok(undefined);
        } catch (err) {
            Utils.getInstance().showErrorMessage(ErrorType.UNKNOWN);
            return Err(undefined);
        }
    }

    async getWalletsSummary() {
        try {
            const requestURL = Utils.getInstance().getAPIEndpoint(
                `/wallets?view=${WalletViews.SUMMARY}`,
            );
            const response = await fetch(requestURL, {
                headers: {
                    Authorization: "Bearer " + localStorage.getItem("authToken"),
                },
            });

            const { data, error }: GetWalletsResponse = await response.json();
            if (error) {
                Utils.getInstance().showErrorMessage(
                    getErrorType(data.status, data.code),
                );
                return;
            }

            const { wallets } = data;

            return wallets;
        } catch (err) {
            Utils.getInstance().showErrorMessage(ErrorType.UNKNOWN);
        }
    }

    async getWalletTableRows(): Promise<
        Result<WalletTableRow[], ErrorResponseBodyAttributes | undefined>
    > {
        try {
            const requestURL = Utils.getInstance().getAPIEndpoint(
                `/wallets?view=${WalletViews.TABLE_ROW}`,
            );
            const response = await fetch(requestURL, {
                headers: {
                    Authorization: "Bearer " + localStorage.getItem("authToken"),
                },
            });

            const { data, error }: GetWalletTableRowsResponse = await response.json();
            if (error) {
                Utils.getInstance().showErrorMessage(
                    getErrorType(data.status, data.code),
                );
                return Err(data);
            }

            return Ok(data.wallets);
        } catch (err) {
            Utils.getInstance().showErrorMessage(ErrorType.UNKNOWN);
            return Err(undefined);
        }
    }
}
