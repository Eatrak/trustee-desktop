import { render } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it } from 'vitest';

import SignUpForm from '.';

const emailFieldId = "emailField";
const passwordFieldId = "passwordField";
const submitButtonFieldId = "submitButton";

describe("signUpForm", () => {
    it("should disable the submit button for incorrect email", () => {
        const { getByTestId } = render(<SignUpForm />);

        userEvent.type(getByTestId(emailFieldId), "foobaremail.com");
        userEvent.type(getByTestId(passwordFieldId), "pass1234");
        
        const submitButton = getByTestId(submitButtonFieldId).closest("button");
        
        expect(submitButton!.disabled).toBeTruthy();
    });
    
    it("should disable the submit button for incorrect password", () => {
        const { getByTestId } = render(<SignUpForm />);

        userEvent.type(getByTestId(emailFieldId), "foobar@email.com");
        userEvent.type(getByTestId(passwordFieldId), "leak");
        
        const submitButton = getByTestId(submitButtonFieldId).closest("button");
        
        expect(submitButton!.disabled).toBeTruthy();
    });
    
    it("should disable the submit button for incorrect email and password", () => {
        const { getByTestId } = render(<SignUpForm />);

        userEvent.type(getByTestId(emailFieldId), "foobaremail.com");
        userEvent.type(getByTestId(passwordFieldId), "leak");
        
        const submitButton = getByTestId(submitButtonFieldId).closest("button");
        
        expect(submitButton!.disabled).toBeTruthy();
    });
    
    it("should enable the submit button for correct email and password", () => {
        const { getByTestId } = render(<SignUpForm />);

        userEvent.type(getByTestId(emailFieldId), "foobar@email.com");
        userEvent.type(getByTestId(passwordFieldId), "pass1234");
        
        const submitButton = getByTestId(submitButtonFieldId).closest("button");
        
        expect(submitButton!.disabled).toBeFalsy();
    });
});
