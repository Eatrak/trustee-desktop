export const signUpValidator = {
    name: "required|string",
    surname: "required|string",
    email: "required|email",
    password: "required|string|min:5|max:30"
};

export const signInValidator = {
    email: "required|email",
    password: "required|string|min:5|max:30"
};
