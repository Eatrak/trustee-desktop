import Validator from "validatorjs";
import { BehaviorSubject } from "rxjs";

import { signInValidator, signUpValidator } from "@shared/validatorRules/auth";
import { Utils } from "@shared/services/utils";
import { SignUpBody } from "@shared/ts-types/APIs/input/auth/signUp";
import { SignUpResponse } from "@shared/ts-types/APIs/output/auth/signUp";
import { SignInResponse } from "@shared/ts-types/APIs/output/auth/signIn";
import { CheckAuthenticationResponse } from "@shared/ts-types/APIs/output/auth/checkAuthentication";
import { PersonalInfo } from "@shared/ts-types/DTOs/auth";
import { getErrorType } from "@shared/errors";
import ErrorType from "@shared/errors/list";
import { TranslationLanguage } from "@shared/ts-types/generic/translations";
import SettingsService from "./settings";
import { setCurrentLanguage } from "@shared/i18n";

export default class AuthService {
    static instance: AuthService = new AuthService();
    personalInfo$: BehaviorSubject<PersonalInfo>;

    private constructor() {
        this.personalInfo$ = new BehaviorSubject({
            name: "",
            surname: "",
            email: "",
            settings: {
                currency: { id: "", code: "", symbol: "" },
                language: SettingsService.getInstance().getBrowserLanguage(),
            },
        });
    }

    static getInstance() {
        return this.instance;
    }

    async isUserAuthenticated() {
        try {
            const authToken = localStorage.getItem("authToken");

            if (!authToken) {
                return false;
            }

            const response = await fetch(
                Utils.getInstance().getAPIEndpoint("/auth/check"),
                {
                    headers: {
                        Authorization: `Bearer ${authToken}`,
                    },
                },
            );

            const { data, error }: CheckAuthenticationResponse = await response.json();
            if (error) {
                return false;
            }

            const { personalInfo } = data;
            this.personalInfo$.next(personalInfo);
            await setCurrentLanguage(personalInfo.settings.language);

            return true;
        } catch (err) {
            Utils.getInstance().showErrorMessage(ErrorType.UNKNOWN);
            return false;
        }
    }

    async signUp(
        name: string,
        surname: string,
        email: string,
        password: string,
        language: TranslationLanguage,
    ) {
        try {
            const body: SignUpBody = {
                userInfo: {
                    name,
                    surname,
                    email,
                    password,
                    language,
                },
            };

            const validation = new Validator(body.userInfo, signUpValidator);

            if (validation.fails()) {
                return false;
            }

            const response = await fetch(Utils.getInstance().getAPIEndpoint("/sign-up"), {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(body),
            });
            const { data, error }: SignUpResponse = await response.json();
            if (error) {
                Utils.getInstance().showErrorMessage(
                    getErrorType(data.status, data.code),
                );
                return false;
            }

            return true;
        } catch (err) {
            console.log(err);
            Utils.getInstance().showErrorMessage(ErrorType.UNKNOWN);
        }

        return false;
    }

    async signIn(email: string, password: string) {
        try {
            const validation = new Validator({ email, password }, signInValidator);

            if (validation.fails()) {
                return false;
            }

            const response = await fetch(Utils.getInstance().getAPIEndpoint("/sign-in"), {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({ userInfo: { email, password } }),
            });

            const { data, error }: SignInResponse = await response.json();
            if (error) {
                Utils.getInstance().showErrorMessage(
                    getErrorType(data.status, data.code),
                );
                return false;
            }

            const { authToken } = data;
            localStorage.setItem("authToken", authToken);

            return true;
        } catch (err) {
            console.log(err);
            Utils.getInstance().showErrorMessage(ErrorType.UNKNOWN);
        }

        return false;
    }
}
