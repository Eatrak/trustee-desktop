import { useNavigate } from "react-router-dom";

import H2 from "@/components/ui/h2";
import { Icons } from "@/components/ui/icons";
import { Button } from "@/components/ui/button";
import { TranslationKey } from "@/shared/ts-types/generic/translations";
import { Utils } from "@/shared/services/utils";

interface IProps {
    transactionsCount: number;
}

const TransactionsHeader = ({ transactionsCount }: IProps) => {
    const navigate = useNavigate();

    const translate = (translationKeys: TranslationKey[], params?: Object) => {
        return Utils.getInstance().translate(
            [
                TranslationKey.MODULES,
                TranslationKey.TRANSACTIONS,
                TranslationKey.HEADER,
                ...translationKeys,
            ],
            params,
        );
    };

    const goToTransactionCreationModule = () => navigate("/transactions/new");

    return (
        <div className="flex flex-column space-x-4">
            <div className="flex-grow">
                <H2 text={translate([TranslationKey.TITLE])} />
                <p className="text-muted-foreground">
                    {translate([TranslationKey.SUB_TITLE], {
                        count: transactionsCount,
                    })}
                </p>
            </div>
            <div className="flex flex-column space-x-1">
                <Button onClick={goToTransactionCreationModule}>
                    <Icons.plus className="mr-2 h-4 w-4" />
                    {translate([TranslationKey.CREATION_BUTTON_TEXT])}
                </Button>
            </div>
        </div>
    );
};

export default TransactionsHeader;
