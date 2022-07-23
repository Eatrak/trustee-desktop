import "./style.css";

import { createRef, RefObject } from "react";

import Validator from "validatorjs";

import FormLayout from '@components/FormLayout';
import InputTextField from '@components/InputTextField';
import logo from '@assets/logo.png';
import { ReactComponent as DotsDecoration } from '@assets/dots-decoration.svg';
import { signUpValidator } from "src/crud-validators/auth";
import AuthService from "src/services/auth";

const SignUpPage = () => {
    const emailField: RefObject<InputTextField> = createRef();
    const passwordField: RefObject<InputTextField> = createRef();

    const signUp = async () => {
        const email = emailField.current!.getValue();
        const password = passwordField.current!.getValue();

        const successfulSignUp = await AuthService.getInstance().signUp(email, password);
        if (successfulSignUp) document.location.href = "/sign-in";

        return true;
    };

    return(
        <div className="page page--sign-up">
            <div>
                <img className="page--sign-up__logo" src={logo}/>
                <FormLayout submitText="Sign up" submitEvent={signUp}>
                    {/* Email field */}
                    <InputTextField ref={emailField} validator={signUpValidator} validatorAttribute="email"
                        title="Email" placeholder="johndoe@test.com"/>
                    {/* Password field */}
                    <InputTextField ref={passwordField} validator={signUpValidator} validatorAttribute="password"
                        title="Password"/>
                </FormLayout>
            </div>
            <div>
                <DotsDecoration className="page--sign-up__decoration"></DotsDecoration>
            </div>
        </div>
    );
};

export default SignUpPage;