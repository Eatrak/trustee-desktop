import "./style.css";

import React, { useEffect, useRef, useState } from "react";
import { MdAdd, MdKeyboardArrowDown } from "react-icons/md";

import Checkbox from "@components/Checkbox";
import NormalButton from "@components/NormalButton";
import TextButton from "@components/TextButton";

export interface MultiSelectOption { name: string, value: string };

interface IProps {
    text: string,
    getCreateNewOptionButtonText?: (filterValue: string) => string,
    createNewOption?: (filterValue: string) => any
    className: string,
    options: MultiSelectOption[],
    selectedOptions: MultiSelectOption[],
    setSelectedOptions: (...p: any) => any,
    filterInputPlaceholder?: string
}

const MultiSelect = ({
    text,
    getCreateNewOptionButtonText,
    createNewOption,
    className,
    options,
    selectedOptions,
    setSelectedOptions,
    filterInputPlaceholder
}: IProps) => {
    let multiSelectFrame = useRef<HTMLDivElement>(null);

    let [ opened, setOpened ] = useState<boolean>(false);
    let [ checks, setChecks ] = useState<{ [optionName: string]: boolean }>({});
    let [ filteredOptions, changeFilteredOptions ] = useState<MultiSelectOption[]>(options);
    let [ filterValue, changeFilterValue ] = useState<string>("");
    
    const showPanel = (e: React.MouseEvent<HTMLDivElement, MouseEvent> | React.FormEvent<HTMLDivElement>) => {
        setOpened(!opened);
    };
    
    const setChecked = (option: MultiSelectOption, value: boolean) => {
        let newChecks: { [optionName: string]: boolean } = { ...checks };
        newChecks[option.name] = value;

        let newSelectedOptions = selectedOptions;
        if (value) {
            newSelectedOptions.push(option);
        }
        else {
            newSelectedOptions.splice(newSelectedOptions.indexOf(option), 1);
        }
        
        setSelectedOptions(newSelectedOptions);
        setChecks(newChecks);
    };

    const renderOptions = () => {
        return filteredOptions.map(option => {
            return (
                <div key={option.name} className="multi-select__option">
                    <Checkbox setChecked={(value: boolean) => setChecked(option, value)} checked={checks[option.name]}/>
                    <p className="multi-select__option_text paragraph--small">{option.name}</p>
                </div>
            );
        });
    };
    
    // Event used to close the multi-select when touching outside of it
    const closeMultiSelectWhenTouchingOutsideEvent = (e: MouseEvent) => {
        const hasMultiSelectBeenClicked = e.target == multiSelectFrame.current;
        const haveMultiSelectChildsBeenClicked = multiSelectFrame.current?.contains(e.target as HTMLElement);
        if (!hasMultiSelectBeenClicked && !haveMultiSelectChildsBeenClicked) {
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
        document.addEventListener("mousedown", closeMultiSelectWhenTouchingOutsideEvent);
    }, []);

    useEffect(() => () => {
        document.removeEventListener("mousedown", closeMultiSelectWhenTouchingOutsideEvent);
    }, []);
    
    return (
        <div ref={multiSelectFrame} className={"multi-select " + className} tabIndex={0}>
            <p className="paragraph--small paragraph--sub-title">{text}</p>
            <div className="multi-select__body" onTimeUpdate={e => showPanel(e)} onClick={e => showPanel(e)}>
                <p className="paragraph--small multi-select__body__text"></p>
                <NormalButton
                    className="multi-select__body__button"
                    Icon={MdKeyboardArrowDown}
                    iconClass={"multi-select__body__row" + (opened ? " multi-select__body__row--activated" : "")}/>
            </div>
            <div className={"multi-select__options-panel multi-select__options-panel--" + (opened ? "opened" : "closed")}>
                <div className="multi-select__options-panel__search-container">
                    <input
                        className="multi-select__options-panel__search-container__search-input"
                        onInput={e => filterOptions(e.currentTarget.value)}
                        placeholder={filterInputPlaceholder}/>
                </div>
                <div className="multi-select__options-panel__options-container">
                    {renderOptions()}
                </div>
                <div className="multi-select__options-panel__create-new-option-button-container">
                    {
                        filterValue != "" &&
                        !filteredOptionExists() &&
                        <TextButton
                            Icon={MdAdd}
                            text={getCreateNewOptionButtonText ? getCreateNewOptionButtonText(filterValue) : ""}
                            clickEvent={() => createNewOption && createNewOption(filterValue)} />
                    }
                </div>
            </div>
        </div>
    );
};

export default MultiSelect;