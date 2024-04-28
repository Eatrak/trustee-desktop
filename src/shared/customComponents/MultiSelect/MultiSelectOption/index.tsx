import { FC, useEffect, useRef, useState } from "react";
import { MdDeleteOutline, MdModeEditOutline, MdSave } from "react-icons/md";
import Validator from "validatorjs";

import "./style.css";
import { MultiSelectOptionProprieties } from "..";
import Checkbox from "@/shared/customComponents/Checkbox";
import RoundedTextIconButton from "@/shared/customComponents/RoundedTextIconButton";
import LoadingIcon from "@/shared/customComponents/LoadingIcon";

interface IProps {
    option: MultiSelectOptionProprieties;
    isChecked: boolean;
    setIsChecked: (isChecked: boolean) => any;
    deleteOption?: (option: MultiSelectOptionProprieties) => any;
    updateOption?: (updatedOption: MultiSelectOptionProprieties) => Promise<any>;
    validatorRule?: string;
}

const MultiSelectOption: FC<IProps> = ({
    option,
    isChecked,
    setIsChecked,
    updateOption,
    deleteOption,
    validatorRule,
}) => {
    let isMounted = useRef(false);
    let [isEditModeEnabled, setIsEditModeEnabled] = useState(false);
    let [isUpdating, setIsUpdating] = useState(false);
    let [optionName, setOptionName] = useState(option.name);

    const showLoading = () => setIsUpdating(true);
    const finishUpdate = () => {
        setIsUpdating(false);
        setIsEditModeEnabled(false);
    };

    const update = async () => {
        try {
            if (!updateOption)
                throw "Missing updateOption property in multi-select-option";

            if (!getValidation()) return;

            showLoading();
            await updateOption({ name: optionName, value: option.value });
            isMounted.current && finishUpdate();
        } catch (err) {}
    };

    const getValidation = () => {
        // If there are no validation rules, there can no errors
        if (!validatorRule) return null;

        const validation = new Validator(
            { name: optionName },
            {
                name: validatorRule,
            },
        );
        validation.check();
        return validation;
    };

    const hasErrors = (): boolean => {
        const validation = getValidation();
        // If there are no validation rules, there can no errors
        if (!validation) return false;

        return validation.fails() == true;
    };

    const getErrorsToShow = () => {
        const validation = getValidation();
        if (!validation || !validation.errors.errors.name) return [];

        let id = 0;

        return validation.errors.errors.name.map((error) => {
            return (
                <p key={id++} className="paragraph--small text--error">
                    {error}
                </p>
            );
        });
    };

    useEffect(() => {
        isMounted.current = true;
    }, []);

    useEffect(
        () => () => {
            isMounted.current = false;
        },
        [],
    );

    return (
        <div
            className={`multi-select__option bg-background ${
                isEditModeEnabled ? "multi-select__option--in-edit-mode" : ""
            }`}
        >
            <div className="multi-select__option__input-container">
                <Checkbox
                    setChecked={(value: boolean) => setIsChecked(value)}
                    checked={isChecked}
                />
                <input
                    className={`multi-select__option_text paragraph--small bg-background  ${
                        hasErrors() ? "multi-select__option_text--in-error" : ""
                    }`}
                    value={optionName}
                    onInput={(e) => setOptionName(e.currentTarget.value)}
                />
                <div className="multi-select__option__actions">
                    {updateOption &&
                        (isEditModeEnabled ? (
                            <RoundedTextIconButton
                                clickEvent={update}
                                Icon={isUpdating ? LoadingIcon : MdSave}
                                size="small"
                                state="success"
                                isDisabled={
                                    (isEditModeEnabled && hasErrors()) || isUpdating
                                }
                            />
                        ) : (
                            <RoundedTextIconButton
                                clickEvent={() => setIsEditModeEnabled(true)}
                                Icon={MdModeEditOutline}
                                size="small"
                            />
                        ))}
                    {deleteOption && (
                        <RoundedTextIconButton
                            clickEvent={() => deleteOption(option)}
                            Icon={MdDeleteOutline}
                            size="small"
                            state="danger"
                        />
                    )}
                </div>
            </div>
            <div className="multi-select__option__input-container__errors">
                {getErrorsToShow()}
            </div>
        </div>
    );
};

export default MultiSelectOption;
