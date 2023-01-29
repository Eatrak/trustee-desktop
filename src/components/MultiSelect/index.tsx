import "./style.css";

import React, { useState } from "react";
import { IconType } from "react-icons";
import { MdKeyboardArrowDown } from "react-icons/md";

import Checkbox from "@components/Checkbox";

interface MultiSelectOption { name: string, value: string };

interface IProps {
    Icon: IconType,
    text: string,
    options: MultiSelectOption[],
    selectedOptions: MultiSelectOption[],
    setSelectedOptions: (...p: any) => any
}

const MultiSelect = ({ Icon, text, options, selectedOptions, setSelectedOptions }: IProps) => {
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

    const renderRenderCheckbox = () => {
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
    
    return (
        <div className="multi-select" tabIndex={0} onBlur={e => setOpened(false)}>
            <div className="multi-select__body" onTimeUpdate={e => showPanel(e)} onClick={e => showPanel(e)}>
                <div className="multi-select__body__custom-item-container">
                    <Icon className="multi-select__body__icon"/>
                    <p className="paragraph--small multi-select__body__text">{text}</p>
                </div>
                <MdKeyboardArrowDown className={"multi-select__body__icon multi-select__body__row" + (opened ? " multi-select__body__row--activated" : "")}/>
            </div>
            <div className="multi-select__options-panel" style={{display: opened ? "" : "none"}}>
                {renderRenderCheckbox()}
            </div>
        </div>
    );
};

export default MultiSelect;