import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

import "./style.css";
import { Button } from "@/components/ui/button";
import { Icons } from "@/components/ui/icons";
import { Input } from "@/components/ui/input";
import H2 from "@/components/ui/h2";
import {
    Form,
    FormControl,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from "@/components/ui/form";
import { cn } from "@/lib/utils";
import { SignInFormSchema } from "@/shared/ts-types/APIs/input/auth/signIn";
import { signInFormSchema } from "@/shared/validatorRules/auth";
import AuthService from "@/shared/services/auth";
import { useNavigate } from "react-router-dom";

interface IProps {
    className?: string;
}

const SignInForm = ({ className }: IProps) => {
    const navigate = useNavigate();
    const [isSigningIn, setIsSigningIn] = useState<boolean>(false);

    const form = useForm<SignInFormSchema>({
        resolver: zodResolver(signInFormSchema),
        defaultValues: {
            email: "",
            password: "",
        },
    });

    async function onSubmit({ email, password }: SignInFormSchema) {
        setIsSigningIn(true);

        const successfulSignIn = await AuthService.getInstance().signIn(email, password);

        if (successfulSignIn) {
            navigate("/wallets");
            return true;
        }

        setIsSigningIn(false);

        return true;
    }

    return (
        <div className={cn("sign-in-form", className)}>
            <Form {...form}>
                <div className="text-center">
                    <H2 text="Welcome back" />
                </div>
                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                    <FormField
                        control={form.control}
                        name="email"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Email</FormLabel>
                                <FormControl>
                                    <Input
                                        placeholder="name@example.com"
                                        type="email"
                                        autoCapitalize="none"
                                        autoComplete="email"
                                        autoCorrect="off"
                                        {...field}
                                    />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />
                    <FormField
                        control={form.control}
                        name="password"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Password</FormLabel>
                                <FormControl>
                                    <Input type="password" {...field} />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />
                    <Button className="w-full" type="submit" disabled={isSigningIn}>
                        {isSigningIn && (
                            <Icons.loading className="mr-2 h-4 w-4 animate-spin" />
                        )}
                        Sign In
                    </Button>
                </form>
            </Form>
        </div>
    );
};

export default SignInForm;
