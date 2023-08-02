import { FC, useState } from "react";
import { MdClose, MdDeleteOutline, MdModeEditOutline, MdSave } from "react-icons/md";

import "./style.css";
import { MultiSelectOptionProprieties } from "..";
import Checkbox from "@shared/components/Checkbox";
import RoundedTextIconButton from "@shared/components/RoundedTextIconButton";

interface IProps {
    option: MultiSelectOptionProprieties;
    isChecked: boolean;
    setIsChecked: (isChecked: boolean) => any;
    deleteOption?: (option: MultiSelectOptionProprieties) => any;
    updateOption?: (updatedOption: MultiSelectOptionProprieties) => any;
}

const MultiSelectOption: FC<IProps> = ({
    option,
    isChecked,
    setIsChecked,
    updateOption,
    deleteOption,
}) => {
    let [isEditModeEnabled, setIsEditModeEnabled] = useState(false);

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
                className="multi-select__option_text paragraph--small"
                defaultValue={option.name}
            />
            <div className="multi-select__option__actions">
                {updateOption &&
                    (isEditModeEnabled ? (
                        <RoundedTextIconButton
                            clickEvent={() => setIsEditModeEnabled(false)}
                            Icon={MdSave}
                            size="small"
                            state="success"
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
