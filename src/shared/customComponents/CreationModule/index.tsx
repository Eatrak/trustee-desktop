import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

import "./style.css";
import { Button } from "@/components/ui/button";
import {
    Form,
    FormControl,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from "@/components/ui/form";
import H2 from "@/components/ui/h2";
import { Icons } from "@/components/ui/icons";
import { Input } from "@/components/ui/input";
import { Separator } from "@/components/ui/separator";
import { SignInFormSchema } from "@/shared/ts-types/APIs/input/auth/signIn";
import { signInFormSchema } from "@/shared/validatorRules/auth";

interface IProps {
    title: string;
    subTitle: string;
}

const CreationModule = ({ title, subTitle }: IProps) => {
    const form = useForm<SignInFormSchema>({
        resolver: zodResolver(signInFormSchema),
        defaultValues: {
            email: "",
            password: "",
        },
    });

    return (
        <div className="section">
            <div className="section__main-content creation-module__main-content">
                <div>
                    <H2 text={title} />
                    <p className="text-muted-foreground">{subTitle}</p>
                </div>
                <Form {...form}>
                    <form className="creation-module__form">
                        <Separator />
                        <div className="space-y-4">
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
                        </div>
                        <Separator />
                        <div className="creation-module__form__footer">
                            <Button variant="ghost" disabled={false}>
                                Cancel
                            </Button>
                            <Button type="submit" disabled={false}>
                                {false && (
                                    <Icons.loading className="mr-2 h-4 w-4 animate-spin" />
                                )}
                                Confirm
                            </Button>
                        </div>
                    </form>
                </Form>
            </div>
        </div>
    );
};

export default CreationModule;
