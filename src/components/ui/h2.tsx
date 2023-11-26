import { cn } from "@/lib/utils";

interface IProps {
    text: string;
    className?: string;
}

const H2 = ({ text, className, ...props }: IProps) => {
    return (
        <h2
            className={cn(
                "scroll-m-20 pb-2 text-3xl font-semibold tracking-tight first:mt-0",
                className,
            )}
            {...props}
        >
            {text}
        </h2>
    );
};

export default H2;
