import "./style.css";

import
    React,
    {
        useEffect,
        useImperativeHandle,
        useRef,
        useState,
        forwardRef
    }
from "react";
import { MdAdd, MdKeyboardArrowDown } from "react-icons/md";
import Validator, { Rules, TypeCheckingRule } from "validatorjs";

import NormalButton from "@components/NormalButton";
import TextButton from "@components/TextButton";

export interface SelectOption { name: string, value: string };

interface IProps {
    text: string,
    getCreateNewOptionButtonText?: (filterValue: string) => string,
    createNewOption?: (filterValue: string) => any
    className?: string,
    onSelect?: (newSelectedOption: SelectOption) => any
    options: SelectOption[],
    filterInputPlaceholder?: string,
    isCreatingNewOption?: boolean,
    entityName: string,
    validatorRule?: string | Array<string | TypeCheckingRule> | Rules,
    children?: React.ReactNode
}

interface IHandle {
    setSelectedOption: (newSelectedOption: SelectOption) => void
}

const Select = forwardRef<IHandle, IProps>(({
    text,
    getCreateNewOptionButtonText,
    createNewOption,
    className,
    onSelect,
    options,
    filterInputPlaceholder,
    isCreatingNewOption,
    entityName,
    validatorRule,
    children
}: IProps, ref) => {
    useImperativeHandle(ref, () => ({
        setSelectedOption: (newSelectedOption: SelectOption) => {
            setSelectedOption(newSelectedOption);
            onSelect && onSelect(newSelectedOption);
        }
    }), []);

    let selectFrame = useRef<HTMLDivElement>(null);

    const isFirstRender = useRef(true);
    let [ opened, setOpened ] = useState<boolean>(false);
    let [ filteredOptions, changeFilteredOptions ] = useState<SelectOption[]>(options);
    let [ selectedOption, setSelectedOption ] = useState<SelectOption>();
    let [ filterValue, changeFilterValue ] = useState<string>("");
    let [ errors, setErrors ] = useState<string[]>([]);
    
    const switchPanelStatus = () => {
        setOpened(!opened);
    };

    const selectOption = (optionToSelect: SelectOption) => {
        setSelectedOption(optionToSelect);
        onSelect && onSelect(optionToSelect);
        switchPanelStatus();
    };

    const checkErrors = () => {
        if (!validatorRule) return;
        
        const validation = new Validator(
            { [entityName]: selectedOption?.value },
            { [entityName]: validatorRule }
        );
        validation.check();

        const errors = validation.errors.get(entityName);
        setErrors(errors);
    }
    
    const renderErrors = () => {
        let id = 0;

        return errors.map(error => {
            return <p key={id++} className="paragraph--small text--error">{error}</p>;
        });
    }

    const renderOptions = () => {
        return filteredOptions.map(option => {
            return (
                <div
                    key={option.name}
                    className={`select__option ${option.name == selectedOption?.name ? "select__option--selected": ""}`}
                    onClick={() => selectOption(option)}
                >
                    <p className="select__option_text paragraph--small">{option.name}</p>
                </div>
            );
        });
    };
    
    // Event used to close the select when touching outside of it
    const closeSelectWhenTouchingOutsideEvent = (e: MouseEvent) => {
        const hasSelectBeenClicked = e.target == selectFrame.current;
        const haveSelectChildsBeenClicked = selectFrame.current?.contains(e.target as HTMLElement);
        if (!hasSelectBeenClicked && !haveSelectChildsBeenClicked) {
            setOpened(false);
        }
    };

    const filterOptions = (newFilterValue: string) => {
        const newFilteredOptions = options.filter(option => {
            return option.name.toLowerCase().startsWith(newFilterValue.toLowerCase());
        });
        changeFilteredOptions(newFilteredOptions);
        changeFilterValue(newFilterValue);
    };

    const filteredOptionExists = (): boolean => {
        let filteredOption = options.find(e => e.name == filterValue);
        
        return filteredOption != undefined;
    };

    // Change filtered options when options change
    useEffect(() => {
        filterOptions(filterValue);
    }, [options]);

    useEffect(() => {
        document.addEventListener("mousedown", closeSelectWhenTouchingOutsideEvent);
    }, []);

    useEffect(() => () => {
        document.removeEventListener("mousedown", closeSelectWhenTouchingOutsideEvent);
    }, []);
    
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
            ref={selectFrame}
            className={"select " + (errors.length > 0 ? "select--error" : "") + (className || "")}
            tabIndex={0}
        >
            <p className="paragraph--small paragraph--sub-title">{text}</p>
            <div className="select__body" onTimeUpdate={() => switchPanelStatus()} onClick={() => switchPanelStatus()}>
                <p className="paragraph--small">{selectedOption?.name}</p>
                <NormalButton
                    className="select__body__button"
                    Icon={MdKeyboardArrowDown}
                    iconClass={"select__body__row" + (opened ? " select__body__row--activated" : "")}/>
            </div>
            {renderErrors()}
            <div className={"select__options-panel select__options-panel--" + (opened ? "opened" : "closed")}>
                <div className="select__options-panel__search-container">
                    <input
                        className="select__options-panel__search-container__search-input"
                        onInput={e => filterOptions(e.currentTarget.value)}
                        placeholder={filterInputPlaceholder}/>
                    <div>
                        {
                            children
                        }
                    </div>
                </div>
                <div className="select__options-panel__options-container">
                    {renderOptions()}
                </div>
                <div className="select__options-panel__create-new-option-button-container">
                    {
                        filterValue != "" &&
                        !filteredOptionExists() &&
                        <TextButton
                            Icon={MdAdd}
                            text={getCreateNewOptionButtonText ? getCreateNewOptionButtonText(filterValue) : ""}
                            isLoading={isCreatingNewOption}
                            clickEvent={() => createNewOption && createNewOption(filterValue)} />
                    }
                </div>
            </div>
        </div>
    );
});

export default Select;
