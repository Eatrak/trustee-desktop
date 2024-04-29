import "./style.css";

import React, {
    useEffect,
    useImperativeHandle,
    useRef,
    useState,
    forwardRef,
} from "react";
import Validator from "validatorjs";
import { ChevronDown } from "lucide-react";

import Chip from "@/shared/customComponents/Chip";
import MultiSelectOption from "./MultiSelectOption";
import { Utils } from "@/shared/services/utils";
import { TranslationKey } from "@/shared/ts-types/generic/translations";
import { Button } from "@/components/ui/button";
import LoadingIcon from "../LoadingIcon";

export interface MultiSelectOptionProprieties {
    name: string;
    value: string;
}

interface IProps {
    text: string;
    getCreateNewOptionButtonText?: (filterValue: string) => string;
    createNewOption?: (filterValue: string) => any;
    className?: string;
    onSelect?: (newSelectedOptions: MultiSelectOptionProprieties[]) => any;
    options: MultiSelectOptionProprieties[];
    filterInputPlaceholder?: string;
    isCreatingNewOption?: boolean;
    children?: React.ReactNode;
    deleteOption?: (option: MultiSelectOptionProprieties) => any;
    updateOption?: (updatedOption: MultiSelectOptionProprieties) => Promise<any>;
    optionsValidatorRule?: string;
    creationErrorMessage?: string;
    creationValidatorRule?: string;
}

interface IHandle {
    setSelectedOptions: (newSelectedOptions: MultiSelectOptionProprieties[]) => void;
}

const MultiSelect = forwardRef<IHandle, IProps>(
    (
        {
            deleteOption,
            updateOption,
            getCreateNewOptionButtonText,
            createNewOption,
            className,
            onSelect,
            options,
            filterInputPlaceholder,
            isCreatingNewOption,
            children,
            creationValidatorRule,
            creationErrorMessage,
        }: IProps,
        ref,
    ) => {
        useImperativeHandle(
            ref,
            () => ({
                setSelectedOptions: (
                    newSelectedOptions: MultiSelectOptionProprieties[],
                ) => {
                    let newChecks: { [optionName: string]: boolean } = { ...checks };
                    newSelectedOptions.forEach(({ name }) => (newChecks[name] = true));

                    setSelectedOptions([...newSelectedOptions]);
                    onSelect && onSelect(newSelectedOptions);
                    setChecks(newChecks);
                },
            }),
            [],
        );

        let multiSelectFrame = useRef<HTMLDivElement>(null);

        const isFirstRender = useRef(true);
        let [opened, setOpened] = useState<boolean>(false);
        let [errors, setErrors] = useState<string[]>([]);
        let [hasNeverBeenOpened, setHasNeverBeenOpened] = useState<boolean>(true);
        let [checks, setChecks] = useState<{ [optionName: string]: boolean }>({});
        let [filteredOptions, changeFilteredOptions] =
            useState<MultiSelectOptionProprieties[]>(options);
        let [selectedOptions, setSelectedOptions] = useState<
            MultiSelectOptionProprieties[]
        >([]);
        let [filterValue, changeFilterValue] = useState<string>("");

        const showPanel = () => {
            setHasNeverBeenOpened(false);
            setOpened(!opened);
        };

        const setChecked = (option: MultiSelectOptionProprieties, value: boolean) => {
            let newChecks: { [optionName: string]: boolean } = { ...checks };
            newChecks[option.name] = value;

            let newSelectedOptions = selectedOptions;
            if (value) {
                newSelectedOptions.push(option);
            } else {
                newSelectedOptions.splice(
                    newSelectedOptions.findIndex(({ name }) => name == option.name),
                    1,
                );
            }

            setSelectedOptions(newSelectedOptions);
            onSelect && onSelect([...newSelectedOptions]);
            setChecks(newChecks);
        };

        const renderOptions = () => {
            if (filteredOptions.length > 0) {
                return filteredOptions.map((option) => {
                    return (
                        <MultiSelectOption
                            key={option.name}
                            option={option}
                            isChecked={checks[option.name]}
                            setIsChecked={(value: boolean) => setChecked(option, value)}
                            updateOption={updateOption}
                            deleteOption={deleteOption}
                            validatorRule={creationValidatorRule}
                        />
                    );
                });
            }

            return (
                <div className="multi-select__options-panel__options-container__no-options-container">
                    <p className="paragraph--small multi-select__options-panel__options-container__no-options-container__text">
                        {Utils.getInstance().translate([
                            TranslationKey.GENERAL,
                            TranslationKey.NO_OPTIONS,
                        ])}
                    </p>
                </div>
            );
        };

        // Event used to close the multi-select when touching outside of it
        const closeMultiSelectWhenTouchingOutsideEvent = (e: MouseEvent) => {
            const hasMultiSelectBeenClicked = e.target == multiSelectFrame.current;
            const haveMultiSelectChildsBeenClicked = multiSelectFrame.current?.contains(
                e.target as HTMLElement,
            );
            if (!hasMultiSelectBeenClicked && !haveMultiSelectChildsBeenClicked) {
                setOpened(false);
            }
        };

        const filterOptions = (newFilterValue: string) => {
            const newFilteredOptions = options.filter((option) => {
                return option.name.toLowerCase().startsWith(newFilterValue.toLowerCase());
            });
            changeFilteredOptions(newFilteredOptions);
            changeFilterValue(newFilterValue);
        };

        const filteredOptionExists = (): boolean => {
            let filteredOption = options.find((e) => e.name == filterValue);

            return filteredOption != undefined;
        };

        const getCreationErrorsToShow = () => {
            let id = 0;

            const creationValidation = getCreationValidation(filterValue);

            if (!creationValidation || creationValidation.passes()) return [];

            return [
                <p key={id++} className="text-sm font-medium text-destructive">
                    {creationErrorMessage || ""}
                </p>,
                ...errors.map((error) => {
                    return (
                        <p key={id++} className="text-sm font-medium text-destructive">
                            {error}
                        </p>
                    );
                }),
            ];
        };

        const getCreationValidation = (optionName: string) => {
            // If there are no validation rules, there can no errors
            if (!creationValidatorRule) return null;

            const validation = new Validator(
                { name: optionName },
                {
                    name: creationValidatorRule,
                },
            );
            validation.check();
            return validation;
        };

        const startOptionCreation = () => {
            const validation = getCreationValidation(filterValue);
            if (!validation) return;

            setErrors(validation.errors.errors.name || []);

            // If there are no errors, create the option
            if (!validation.errors.errors.name)
                createNewOption && createNewOption(filterValue);
        };

        const getErrorsToShow = () => {
            let id = 0;

            return errors.map((error) => {
                return (
                    <p key={id++} className="text-sm font-medium text-destructive">
                        {error}
                    </p>
                );
            });
        };

        // Change filtered options when options change
        useEffect(() => {
            filterOptions(filterValue);
        }, [options]);

        useEffect(() => {
            document.addEventListener(
                "mousedown",
                closeMultiSelectWhenTouchingOutsideEvent,
            );
        }, []);

        useEffect(
            () => () => {
                document.removeEventListener(
                    "mousedown",
                    closeMultiSelectWhenTouchingOutsideEvent,
                );
            },
            [],
        );

        useEffect(() => {
            // Exit if it is the first render
            if (isFirstRender.current) {
                isFirstRender.current = false;
                return;
            }
        }, [opened]);

        return (
            <div
                ref={multiSelectFrame}
                className={
                    "multi-select border border-input rounded-md text-sm " +
                    (className || "")
                }
                tabIndex={0}
            >
                {/*                 <p className="paragraph--small paragraph--sub-title multi-select__title">
                    {text}
                </p> */}
                <div
                    className="multi-select__body px-3 h-[40px] bg-background overflow-hidden rounded-md"
                    onTimeUpdate={showPanel}
                    onClick={showPanel}
                >
                    <div className="multi-select__body__chip-container flex flex-row space-x-2">
                        {
                            // Show the all-selected chip if there is at least an option
                            // and all the options are selected
                            selectedOptions.length == options.length &&
                            options.length > 0 ? (
                                <Chip
                                    key=""
                                    text={Utils.getInstance().translate([
                                        TranslationKey.GENERAL,
                                        TranslationKey.ALL,
                                    ])}
                                />
                            ) : (
                                selectedOptions.map((selectedOption) => {
                                    return (
                                        <Chip
                                            key={selectedOption.name}
                                            text={selectedOption.name}
                                        />
                                    );
                                })
                            )
                        }
                    </div>
                    <ChevronDown className={"h-4 w-4 opacity-50"} />
                </div>
                <div
                    className={
                        "bg-background border-input rounded-md overflow-hidden border multi-select__options-panel multi-select__options-panel--" +
                        (opened ? "opened" : "closed") +
                        (hasNeverBeenOpened
                            ? " multi-select__options-panel--has-never-been-opened"
                            : "")
                    }
                >
                    <div className="multi-select__options-panel__search-container bg-background">
                        <input
                            className="px-2 py-1 multi-select__options-panel__search-container__search-input bg-background border-input border rounded-sm"
                            onInput={(e) => filterOptions(e.currentTarget.value)}
                            placeholder={filterInputPlaceholder}
                        />
                        <div>{children}</div>
                    </div>
                    <div className="multi-select__options-panel__options-container bg-background">
                        {renderOptions()}
                    </div>
                    {createNewOption && (
                        <div className="multi-select__options-panel__create-new-option-button-container bg-background">
                            {filterValue != "" && !filteredOptionExists() && (
                                <>
                                    <Button
                                        className="w-full relative"
                                        disabled={isCreatingNewOption ? true : false}
                                        variant="secondary"
                                        onClick={(e) => {
                                            e.preventDefault();
                                            startOptionCreation();
                                        }}
                                    >
                                        <p className="truncate absolute w-full">
                                            {isCreatingNewOption ? (
                                                <LoadingIcon className="m-auto w-6 h-6" />
                                            ) : getCreateNewOptionButtonText ? (
                                                getCreateNewOptionButtonText(filterValue)
                                            ) : (
                                                ""
                                            )}
                                        </p>
                                    </Button>
                                    <div className="multi-select__options-panel__create-new-option-button-container__errors">
                                        {getCreationErrorsToShow()}
                                    </div>
                                </>
                            )}
                        </div>
                    )}
                </div>
            </div>
        );
    },
);

export default MultiSelect;
