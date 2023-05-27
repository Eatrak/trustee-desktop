import { useEffect, useState } from "react";

import Validator from "validatorjs";

import "./style.css";
import FormLayout from "@components/FormLayout";
import InputTextField from "@components/InputTextField";
import { signUpValidator } from "@validatorRules/auth";
import AuthService from "@services/auth";

const SignUpForm = () => {
    const [submitDisabled, setSubmitDisabled] = useState(true);
    const [ email, setEmail ] = useState<string>();
    const [ password, setPassword ] = useState<string>();

    const signUp = async () => {
        const successfulSignUp = await AuthService.getInstance().signUp(email!, password!);
        if (successfulSignUp) document.location.href = "/sign-in";

        return true;
    };

    const isFormValid = () => {
        const validator = new Validator({ email, password }, signUpValidator);
        const isFormValid = validator.passes();

        return isFormValid;
    };

    useEffect(() => {
        setSubmitDisabled(!isFormValid());
    }, [email, password]);
    
    return (
        <FormLayout header="Welcome!" submitText="Sign up" submitEvent={signUp} submitDisabled={submitDisabled}>
            {/* Email field */}
            <InputTextField testId="emailField" validatorRule={signUpValidator.email} validatorAttributeName="email"
                title="Email" placeholder="johndoe@test.com" onInput={setEmail}/>
            {/* Password field */}
            <InputTextField testId="passwordField" validatorRule={signUpValidator.password} validatorAttributeName="password"
                title="Password" type="password" onInput={setPassword}/>
        </FormLayout>
    );
};

export default SignUpForm;