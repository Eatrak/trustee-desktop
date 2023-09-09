import { useState } from "react";
import { useNavigate } from "react-router-dom";

import Validator from "validatorjs";

import "./style.css";
import FormLayout from "@shared/components/FormLayout";
import InputTextField from "@shared/components/InputTextField";
import { signUpValidator } from "@shared/validatorRules/auth";
import AuthService from "@shared/services/auth";

const SignUpForm = () => {
    const navigate = useNavigate();
    const [name, setName] = useState<string>("");
    const [surname, setSurname] = useState<string>("");
    const [email, setEmail] = useState<string>("");
    const [password, setPassword] = useState<string>("");
    const [isSignedUp, setIsSignedUp] = useState(false);
    const [isSigningUp, setIsSigningUp] = useState(false);

    const signUp = async () => {
        setIsSigningUp(true);

        const successfulSignUp = await AuthService.getInstance().signUp(
            name!,
            surname!,
            email!,
            password!,
        );
        if (successfulSignUp) {
            setIsSignedUp(true);
            navigate("/sign-in");
        }

        setIsSigningUp(false);

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

    return (
        <FormLayout
            header="Welcome!"
            submitText="Sign up"
            submitEvent={signUp}
            submitDisabled={!isFormValid() || isSigningUp || isSignedUp}
            isLoading={isSigningUp}
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
