import { signUpValidator } from "./auth";

export const updateUserPreferencesBodyRules = {
    updateInfo: {
        currencyId: "required|string",
        language: "required|string",
    },
};

export const updatePasswordBodyRules = {
    updateInfo: {
        password: signUpValidator.password,
        repeatedPassword: "same:password",
    },
};
