import { useEffect, useState } from "react";

import Validator from "validatorjs";

import "./style.css";
import FormLayout from "@shared/components/FormLayout";
import InputTextField from "@shared/components/InputTextField";
import { signUpValidator } from "@shared/validatorRules/auth";
import AuthService from "@shared/services/auth";

const SignUpForm = () => {
    const [submitDisabled, setSubmitDisabled] = useState(true);
    const [name, setName] = useState<string>("");
    const [surname, setSurname] = useState<string>("");
    const [email, setEmail] = useState<string>("");
    const [password, setPassword] = useState<string>("");

    const signUp = async () => {
        const successfulSignUp = await AuthService.getInstance().signUp(
            name!,
            surname!,
            email!,
            password!,
        );
        if (successfulSignUp) document.location.href = "/sign-in";

        return true;
    };

    const isFormValid = () => {
        const validator = new Validator(
            {
                name,
                surname,
                email,
                password,
            },
            signUpValidator,
        );
        const isFormValid = validator.passes();

        return isFormValid;
    };

    useEffect(() => {
        setSubmitDisabled(!isFormValid());
    }, [name, surname, email, password]);

    return (
        <FormLayout
            header="Welcome!"
            submitText="Sign up"
            submitEvent={signUp}
            submitDisabled={submitDisabled}
        >
            {/* Name field */}
            <InputTextField
                testId="nameField"
                value={name}
                validatorRule={signUpValidator.name}
                validatorAttributeName="name"
                title="Name"
                placeholder="John"
                onInput={setName}
            />
            {/* Surname field */}
            <InputTextField
                testId="surnameField"
                value={surname}
                validatorRule={signUpValidator.surname}
                validatorAttributeName="surname"
                title="Surname"
                placeholder="Doe"
                onInput={setSurname}
            />
            {/* Email field */}
            <InputTextField
                testId="emailField"
                value={email}
                validatorRule={signUpValidator.email}
                validatorAttributeName="email"
                title="Email"
                placeholder="johndoe@test.com"
                onInput={setEmail}
            />
            {/* Password field */}
            <InputTextField
                testId="passwordField"
                value={password}
                validatorRule={signUpValidator.password}
                validatorAttributeName="password"
                title="Password"
                type="password"
                onInput={setPassword}
            />
        </FormLayout>
    );
};

export default SignUpForm;
