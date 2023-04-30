import "./style.css";

import
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
    isMini?: boolean
}

interface IHandle {
    setSelectedOption: (newSelectedOption: SelectOption) => void
}

const MiniSelect = forwardRef<IHandle, IProps>(({
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
    isMini
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
            className={"mini-select " + (errors.length > 0 ? "mini-select--error " : "") + (isMini ? "mini-select--mini" : "") + (className || "")}
            tabIndex={0}
        >
            <div className="mini-select__body" onTimeUpdate={() => switchPanelStatus()} onClick={() => switchPanelStatus()}>
                <p className="paragraph--small">{selectedOption?.name}</p>
            </div>
            <div className={"mini-select__options-panel mini-select__options-panel--" + (opened ? "opened" : "closed")}>
                <div className="mini-select__options-panel__options-container">
                    {renderOptions()}
                </div>
            </div>
        </div>
    );
});

export default MiniSelect;
