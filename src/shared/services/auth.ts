import Validator from "validatorjs";

import { signInValidator, signUpValidator } from "@validatorRules/auth";
import { Utils } from "@utils/index";

export default class AuthService {
    static instance: AuthService = new AuthService();

    private constructor() {}
    
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
                "Authorization": `Bearer ${authToken}`
            }
        });
        if (response.ok) {
            const jsonResponse = await response.json();
            const decodedAuthToken = jsonResponse.decodedAuthToken;

            console.log(decodedAuthToken);

            return true;
        }

        return false;
    };

    async signUp(
        name: string,
        surname: string,
        email: string,
        password: string
    ) {
        try {
            const validation = new Validator({ email, password }, signUpValidator);
            
            if (validation.fails()) {
                return false;
            }

            const response = await fetch(Utils.getInstance().getAPIEndpoint("/sign-up"), {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({
                    userInfo: {
                        name,
                        surname,
                        email,
                        password
                    }
                })
            });
            const jsonResponse = await response.json();
    
            if (response.ok) {
                localStorage.setItem("authToken", jsonResponse.authToken);

                return true;
            }
        }
        catch (err) {
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
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({ userInfo: { email, password } })
            });
            const jsonResponse = await response.json();
    
            if (response.ok) {
                localStorage.setItem("authToken", jsonResponse.authToken);

                return true;
            }
        }
        catch (err) {
            console.log(err);
        }

        return false;
    }
}
