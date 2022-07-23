import Validator from "validatorjs";

import { signUpValidator } from "src/crud-validators/auth";
import { Utils } from "src/utils";

export default class AuthService {
    static instance: AuthService = new AuthService();

    private constructor() {}
    
    static getInstance() {
        return this.instance;
    }

    async signUp(email: string, password: string) {
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
