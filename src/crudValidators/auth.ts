export const signUpValidator = {
    email: "required|email",
    password: "required|string|min:5|max:30"
};

export const signInValidator = {
    ...signUpValidator
};
