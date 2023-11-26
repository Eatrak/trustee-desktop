import { z } from "zod";

import { signInFormSchema } from "@/shared/validatorRules/auth";

/**
 * Body of the request body for the sign-up process.
 */
export interface SignInBody {
    userInfo: {
        email: string;
        password: string;
    };
}

export type SignInFormSchema = z.infer<typeof signInFormSchema>;
