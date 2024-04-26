import { Utils } from "@/shared/services/utils";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

interface IProps extends React.ComponentProps<typeof Card> {
    title: string;
    amount: number;
    currencyCode: string;
}

const WalletsBalanceSummary = ({ title, amount, currencyCode, ...other }: IProps) => {
    const getFormattedAmount = (amount: number) => {
        return Utils.getInstance().getFormattedAmount(currencyCode, amount);
    };

    return (
        <Card {...other}>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">{title}</CardTitle>
            </CardHeader>
            <CardContent>
                <div className="text-2xl font-bold">{getFormattedAmount(amount)}</div>
            </CardContent>
        </Card>
    );
};

export default WalletsBalanceSummary;
