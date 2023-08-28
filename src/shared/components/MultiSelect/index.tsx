import "./style.css";

import React, {
    useEffect,
    useImperativeHandle,
    useRef,
    useState,
    forwardRef,
} from "react";
import { MdAdd, MdKeyboardArrowDown } from "react-icons/md";
import Validator from "validatorjs";

import NormalButton from "@shared/components/NormalButton";
import TextButton from "@shared/components/TextButton";
import Chip from "@shared/components/Chip";
import MultiSelectOption from "./MultiSelectOption";

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
    entityName: string;
    creationValidatorRule?: string;
}

interface IHandle {
    setSelectedOptions: (newSelectedOptions: MultiSelectOptionProprieties[]) => void;
}

const MultiSelect = forwardRef<IHandle, IProps>(
    (
        {
            text,
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
            optionsValidatorRule,
            creationValidatorRule,
            creationErrorMessage,
            entityName,
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
                        No options found
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
                <p key={id++} className="paragraph--small text--error">
                    {creationErrorMessage || ""}
                </p>,
                ...errors.map((error) => {
                    return (
                        <p key={id++} className="paragraph--small text--error">
                            - {error}
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

        const checkErrors = () => {
            if (!optionsValidatorRule) return;

            const validation = new Validator(
                {
                    [entityName]: selectedOptions?.map(
                        (selectedOption) => selectedOption.value,
                    ),
                },
                { [entityName]: optionsValidatorRule },
            );
            validation.check();

            const errors = validation.errors.get(entityName);
            setErrors(errors);
            console.log("Checked errors", errors);
        };

        const getErrorsToShow = () => {
            let id = 0;

            return errors.map((error) => {
                return (
                    <p key={id++} className="paragraph--small text--error">
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

            if (!opened) {
                checkErrors();
            }
        }, [opened]);

        return (
            <div
                ref={multiSelectFrame}
                className={"multi-select " + (className || "")}
                tabIndex={0}
            >
                <p className="paragraph--small paragraph--sub-title multi-select__title">
                    {text}
                </p>
                <div
                    className="multi-select__body"
                    onTimeUpdate={showPanel}
                    onClick={showPanel}
                >
                    <div className="multi-select__body__chip-container">
                        {
                            // Show the all-selected chip if there is at least an option
                            // and all the options are selected
                            selectedOptions.length == options.length &&
                            options.length > 0 ? (
                                <Chip key="" text="All" />
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
                    <NormalButton
                        className="multi-select__body__button"
                        Icon={MdKeyboardArrowDown}
                        iconClass={
                            "multi-select__body__row" +
                            (opened ? " multi-select__body__row--activated" : "")
                        }
                    />
                </div>
                {getErrorsToShow()}
                <div
                    className={
                        "multi-select__options-panel multi-select__options-panel--" +
                        (opened ? "opened" : "closed") +
                        (hasNeverBeenOpened
                            ? " multi-select__options-panel--has-never-been-opened"
                            : "")
                    }
                >
                    <div className="multi-select__options-panel__search-container">
                        <input
                            className="multi-select__options-panel__search-container__search-input"
                            onInput={(e) => filterOptions(e.currentTarget.value)}
                            placeholder={filterInputPlaceholder}
                        />
                        <div>{children}</div>
                    </div>
                    <div className="multi-select__options-panel__options-container">
                        {renderOptions()}
                    </div>
                    {createNewOption && (
                        <div className="multi-select__options-panel__create-new-option-button-container">
                            {filterValue != "" && !filteredOptionExists() && (
                                <>
                                    <TextButton
                                        Icon={MdAdd}
                                        text={
                                            getCreateNewOptionButtonText
                                                ? getCreateNewOptionButtonText(
                                                      filterValue,
                                                  )
                                                : ""
                                        }
                                        isLoading={isCreatingNewOption}
                                        clickEvent={startOptionCreation}
                                    />
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
