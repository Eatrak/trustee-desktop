import "./style.css";

import { createRef, useState, RefObject } from "react";

import Validator from "validatorjs";

import FormLayout from '@components/FormLayout';
import InputTextField from '@components/InputTextField';
import logo from '@assets/logo.png';
import { ReactComponent as DotsDecoration } from '@assets/dots-decoration.svg';
import { signUpValidator } from "@crudValidators/auth";
import AuthService from "@services/auth";

const SignUpPage = () => {
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

    return(
        <div className="page page--sign-up">
            <div>
                <img className="page--sign-up__logo" src={logo} alt="logo"/>
                <FormLayout submitText="Sign up" submitEvent={signUp} submitDisabled={submitDisabled}>
                    {/* Email field */}
                    <InputTextField ref={emailField} validator={signUpValidator} validatorAttribute="email"
                        title="Email" placeholder="johndoe@test.com" onInput={checkFieldValidity}/>
                    {/* Password field */}
                    <InputTextField ref={passwordField} validator={signUpValidator} validatorAttribute="password"
                        title="Password" onInput={checkFieldValidity}/>
                </FormLayout>
            </div>
            <div>
                <DotsDecoration className="page--sign-up__decoration"></DotsDecoration>
            </div>
        </div>
    );
};

export default SignUpPage;