import { z } from "zod";

import { FieldName } from "../ts-types/generic/translations";

export const signUpValidator = {
    name: "required|string",
    surname: "required|string",
    email: "required|email",
    password: "required|string|min:5|max:30",
    language: "required|string",
};

export const signInFormSchema = z.object({
    [FieldName.EMAIL]: z.string().email(),
    [FieldName.PASSWORD]: z.string().min(5).max(30),
});
