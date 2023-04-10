import "./style.css";

import React, { useEffect, useRef, useState } from "react";
import { MdKeyboardArrowDown } from "react-icons/md";

import Checkbox from "@components/Checkbox";
import NormalButton from "@components/NormalButton";

export interface MultiSelectOption { name: string, value: string };

interface IProps {
    text: string,
    className: string,
    options: MultiSelectOption[],
    selectedOptions: MultiSelectOption[],
    setSelectedOptions: (...p: any) => any,
    filterInputPlaceholder?: string
}

const MultiSelect = ({
    text,
    className,
    options,
    selectedOptions,
    setSelectedOptions,
    filterInputPlaceholder
}: IProps) => {
    let multiSelectFrame = useRef<HTMLDivElement>(null);

    let [ opened, setOpened ] = useState<boolean>(false);
    let [ checks, setChecks ] = useState<boolean[]>([]);
    
    const showPanel = (e: React.MouseEvent<HTMLDivElement, MouseEvent> | React.FormEvent<HTMLDivElement>) => {
        setOpened(!opened);
    };
    
    const setChecked = (index: number, value: boolean) => {
        let newChecks: boolean[] = [ ...checks ];
        newChecks[index] = value;

        let newSelectedOptions: MultiSelectOption[] = [];
        
        newChecks.forEach((check, index) => {
            if (check) newSelectedOptions.push(options[index]);
        });
        
        setSelectedOptions(newSelectedOptions);
        setChecks(newChecks);
    };

    const renderOptions = () => {
        let index = 0;

        return options.map(option => {
            const indexCopy = index++;
            
            return (
                <div key={indexCopy} className="multi-select__option">
                    <Checkbox setChecked={(value: boolean) => setChecked(indexCopy, value)} checked={checks[indexCopy]}/>
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
                    <input className="multi-select__options-panel__search-container__search-input" placeholder={filterInputPlaceholder}/>
                </div>
                <div className="multi-select__options-panel__options-container">
                    {renderOptions()}
                </div>
            </div>
        </div>
    );
};

export default MultiSelect;