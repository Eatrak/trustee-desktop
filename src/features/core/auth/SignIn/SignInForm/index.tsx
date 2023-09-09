import { useState } from "react";
import { useNavigate } from "react-router-dom";

import Validator from "validatorjs";

import "./style.css";
import FormLayout from "@shared/components/FormLayout";
import InputTextField from "@shared/components/InputTextField";
import { signInValidator } from "@shared/validatorRules/auth";
import AuthService from "@shared/services/auth";

const SignInForm = () => {
    const navigate = useNavigate();
    const [isSigningIn, setIsSigningIn] = useState(false);
    const [isSignedIn, setIsSignedIn] = useState(false);
    const [email, setEmail] = useState<string>("");
    const [password, setPassword] = useState<string>("");

    const signIn = async () => {
        setIsSigningIn(true);

        const successfulSignIn = await AuthService.getInstance().signIn(
            email!,
            password!,
        );
        if (successfulSignIn) {
            setIsSignedIn(true);
            navigate("/wallets");
        }

        setIsSigningIn(false);

        return true;
    };

    const isFormValid = () => {
        const validator = new Validator({ email, password }, signInValidator);
        const isFormValid = validator.passes();

        return isFormValid;
    };

    return (
        <FormLayout
            header="Welcome back!"
            submitText="Sign in"
            submitEvent={signIn}
            submitDisabled={!isFormValid() || isSigningIn || isSignedIn}
            isLoading={isSigningIn}
        >
            {/* Email field */}
            <InputTextField
                testId="emailField"
                validatorRule={signInValidator.email}
                validatorAttributeName="email"
                title="Email"
                placeholder="johndoe@test.com"
                value={email}
                onInput={setEmail}
            />
            {/* Password field */}
            <InputTextField
                testId="passwordField"
                validatorRule={signInValidator.password}
                validatorAttributeName="password"
                title="Password"
                type="password"
                value={password}
                onInput={setPassword}
            />
        </FormLayout>
    );
};

export default SignInForm;
