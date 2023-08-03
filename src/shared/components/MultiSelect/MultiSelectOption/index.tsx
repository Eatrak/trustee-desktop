import { FC, useEffect, useRef, useState } from "react";
import { MdDeleteOutline, MdModeEditOutline, MdSave } from "react-icons/md";
import Validator from "validatorjs";

import "./style.css";
import { MultiSelectOptionProprieties } from "..";
import Checkbox from "@shared/components/Checkbox";
import RoundedTextIconButton from "@shared/components/RoundedTextIconButton";
import LoadingIcon from "@shared/components/LoadingIcon";

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

            if (hasErrors()) return;

            showLoading();
            await updateOption({ name: optionName, value: option.value });
            isMounted.current && finishUpdate();
        } catch (err) {}
    };

    const hasErrors = (): boolean => {
        // If there are no validation rules, there can no errors
        if (!validatorRule) return false;

        const validation = new Validator(
            { optionName },
            {
                optionName: validatorRule,
            },
        );
        return validation.fails() == true;
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
            className={`multi-select__option ${
                isEditModeEnabled ? "multi-select__option--in-edit-mode" : ""
            }`}
        >
            <Checkbox
                setChecked={(value: boolean) => setIsChecked(value)}
                checked={isChecked}
            />
            <input
                className={`multi-select__option_text paragraph--small ${
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
                            isDisabled={(isEditModeEnabled && hasErrors()) || isUpdating}
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
    );
};

export default MultiSelectOption;
