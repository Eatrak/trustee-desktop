import { useState, useEffect } from "react";

import Validator from "validatorjs";

import "./style.css";
import FormLayout from "@components/FormLayout";
import InputTextField from "@components/InputTextField";
import { signInValidator } from "@crudValidators/auth";
import AuthService from "@services/auth";

const SignInForm = () => {
    const [submitDisabled, setSubmitDisabled] = useState(true);
    const [ email, setEmail ] = useState<string>();
    const [ password, setPassword ] = useState<string>();

    const signIn = async () => {
        const successfulSignIn = await AuthService.getInstance().signIn(email!, password!);
        if (successfulSignIn) document.location.href = "/";

        return true;
    };

    const isFormValid = () => {
        const validator = new Validator({ email, password }, signInValidator);
        const isFormValid = validator.passes();

        return isFormValid;
    };

    useEffect(() => {
        setSubmitDisabled(!isFormValid());
    }, [email, password]);

    return (
        <FormLayout header="Welcome back!" submitText="Sign in" submitEvent={signIn} submitDisabled={submitDisabled}>
            {/* Email field */}
            <InputTextField testId="emailField" validatorRule={signInValidator.email} validatorAttributeName="email"
                title="Email" placeholder="johndoe@test.com" onInput={setEmail}/>
            {/* Password field */}
            <InputTextField testId="passwordField" validatorRule={signInValidator.password}
                validatorAttributeName="password" title="Password" type="password" onInput={setPassword}/>
        </FormLayout>
    );
};

export default SignInForm;