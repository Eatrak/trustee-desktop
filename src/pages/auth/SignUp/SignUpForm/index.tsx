import { createRef, RefObject, useState } from "react";

import Validator from "validatorjs";

import "./style.css";
import FormLayout from "@components/FormLayout";
import InputTextField from "@components/InputTextField";
import { signUpValidator } from "@validatorRules/auth";
import AuthService from "@services/auth";

const SignUpForm = () => {
    const [submitDisabled, setSubmitDisabled] = useState(true);

    const emailField: RefObject<InputTextField> = createRef();
    const passwordField: RefObject<InputTextField> = createRef();

    const signUp = async () => {
        const email = emailField.current!.getValue();
        const password = passwordField.current!.getValue();

        const successfulSignUp = await AuthService.getInstance().signUp(email, password);
        if (successfulSignUp) document.location.href = "/sign-in";

        return true;
    };

    const checkFieldValidity = () => {
        const email = emailField.current!.getValue();
        const password = passwordField.current!.getValue();

        const validation = new Validator({ email, password }, signUpValidator);

        validation.fails() ? setSubmitDisabled(true) : setSubmitDisabled(false);
    };
    
    return (
        <FormLayout header="Welcome!" submitText="Sign up" submitEvent={signUp} submitDisabled={submitDisabled}>
            {/* Email field */}
            <InputTextField testId="emailField" ref={emailField} validator={signUpValidator} validatorAttribute="email"
                title="Email" placeholder="johndoe@test.com" onInput={checkFieldValidity}/>
            {/* Password field */}
            <InputTextField testId="passwordField" ref={passwordField} validator={signUpValidator} validatorAttribute="password"
                title="Password" type="password" onInput={checkFieldValidity}/>
        </FormLayout>
    );
};

export default SignUpForm;