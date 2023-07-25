import Validator from "validatorjs";
import { BehaviorSubject } from "rxjs";

import { signInValidator, signUpValidator } from "@shared/validatorRules/auth";
import { Utils } from "@shared/services/utils";
import { SignUpBody } from "@shared/types/APIs/input/auth/signUp";
import { SignUpResponse } from "@shared/types/APIs/output/auth/signUp";
import { SignInResponse } from "@shared/types/APIs/output/auth/signIn";
import { CheckAuthenticationResponse } from "@shared/types/APIs/output/auth/checkAuthentication";

interface PersonalInfo {
    name: string;
    surname: string;
    email: string;
}

export default class AuthService {
    static instance: AuthService = new AuthService();
    personalInfo$: BehaviorSubject<PersonalInfo>;

    private constructor() {
        this.personalInfo$ = new BehaviorSubject({
            name: "",
            surname: "",
            email: "",
        });
    }

    static getInstance() {
        return this.instance;
    }

    async isUserAuthenticated() {
        const authToken = localStorage.getItem("authToken");

        if (!authToken) {
            return false;
        }

        const response = await fetch(Utils.getInstance().getAPIEndpoint("/auth/check"), {
            headers: {
                Authorization: `Bearer ${authToken}`,
            },
        });
        if (response.ok) {
            const jsonResponse = await response.json();
            const decodedAuthToken = jsonResponse.decodedAuthToken;

            this.personalInfo$.next({
                name: decodedAuthToken["custom:name"],
                surname: decodedAuthToken["custom:surname"],
                email: decodedAuthToken["email"],
            });

            return true;
        }

        return false;
    }

    async signUp(name: string, surname: string, email: string, password: string) {
        try {
            const body: SignUpBody = {
                userInfo: {
                    name,
                    surname,
                    email,
                    password,
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
            const jsonResponse = await response.json();

            if (response.ok) {
                localStorage.setItem("authToken", jsonResponse.authToken);

                return true;
            }
        } catch (err) {
            console.log(err);
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
            const jsonResponse = await response.json();

            if (response.ok) {
                localStorage.setItem("authToken", jsonResponse.authToken);

                return true;
            }
        } catch (err) {
            console.log(err);
        }

        return false;
    }
}
