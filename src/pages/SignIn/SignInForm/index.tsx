import { createRef, RefObject, useState } from "react";

import Validator from "validatorjs";

import FormLayout from "@components/FormLayout";
import InputTextField from "@components/InputTextField";
import { signInValidator } from "@crudValidators/auth";
import AuthService from "@services/auth";

const SignInForm = () => {
    const [submitDisabled, setSubmitDisabled] = useState(true);

    const emailField: RefObject<InputTextField> = createRef();
    const passwordField: RefObject<InputTextField> = createRef();

    const signIn = async () => {
        const email = emailField.current!.getValue();
        const password = passwordField.current!.getValue();

        const successfulSignIn = await AuthService.getInstance().signIn(email, password);
        if (successfulSignIn) document.location.href = "/";

        return true;
    };

    const checkFieldValidity = () => {
        const email = emailField.current!.getValue();
        const password = passwordField.current!.getValue();

        const validation = new Validator({ email, password }, signInValidator);

        validation.fails() ? setSubmitDisabled(true) : setSubmitDisabled(false);
    };
    
    return (
        <FormLayout header="Welcome back!" submitText="Sign in" submitEvent={signIn} submitDisabled={submitDisabled}>
            {/* Email field */}
            <InputTextField testId="emailField" ref={emailField} validator={signInValidator} validatorAttribute="email"
                title="Email" placeholder="johndoe@test.com" onInput={checkFieldValidity}/>
            {/* Password field */}
            <InputTextField testId="passwordField" ref={passwordField} validator={signInValidator}
                validatorAttribute="password" title="Password" type="password" onInput={checkFieldValidity}/>
        </FormLayout>
    );
};

export default SignInForm;