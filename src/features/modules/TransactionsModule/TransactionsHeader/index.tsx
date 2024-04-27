import { useNavigate } from "react-router-dom";

import H2 from "@/components/ui/h2";
import { Icons } from "@/components/ui/icons";
import { Button } from "@/components/ui/button";
import { TranslationKey } from "@/shared/ts-types/generic/translations";
import { Utils } from "@/shared/services/utils";
import { Calendar } from "@/components/ui/calendar";
import { DateRange, SelectRangeEventHandler } from "react-day-picker";
import { cn } from "@/lib/utils";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { CalendarIcon } from "lucide-react";

interface IProps {
    transactionsCount: number;
    dateRangeToFilter: DateRange | undefined;
    setDateRangeToFilter: SelectRangeEventHandler;
}

const TransactionsHeader = ({
    transactionsCount,
    dateRangeToFilter,
    setDateRangeToFilter,
}: IProps) => {
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
            <div className="flex flex-column space-x-3">
                <Popover>
                    <PopoverTrigger asChild>
                        <Button
                            variant={"outline"}
                            className={cn("pl-3 text-left font-normal")}
                        >
                            {dateRangeToFilter && dateRangeToFilter.from
                                ? Utils.getInstance().getFormattedDateFromDate(
                                      dateRangeToFilter.from,
                                  )
                                : translate([
                                      TranslationKey.CALENDAR,
                                      TranslationKey.START_DATE,
                                  ])}
                            &nbsp;-&nbsp;
                            {dateRangeToFilter && dateRangeToFilter.to
                                ? Utils.getInstance().getFormattedDateFromDate(
                                      dateRangeToFilter.to,
                                  )
                                : translate([
                                      TranslationKey.CALENDAR,
                                      TranslationKey.END_DATE,
                                  ])}
                            <CalendarIcon className="ml-2 h-4 w-4 opacity-50" />
                        </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0" align="start">
                        <Calendar
                            mode="range"
                            selected={dateRangeToFilter}
                            onSelect={setDateRangeToFilter}
                            initialFocus
                        />
                    </PopoverContent>
                </Popover>
                <Button onClick={goToTransactionCreationModule}>
                    <Icons.plus className="mr-2 h-4 w-4" />
                    {translate([TranslationKey.CREATION_BUTTON_TEXT])}
                </Button>
            </div>
        </div>
    );
};

export default TransactionsHeader;
