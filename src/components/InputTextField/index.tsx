import "./style.css";

import { useState } from "react";
import Validator, { Rules, TypeCheckingRule } from "validatorjs";

interface IProps {
    title: string,
    placeholder?: string,
    validatorAttributeName: string,
    validatorRule?: string | Array<string | TypeCheckingRule> | Rules,
    onInput?: (value: string) => void,
    testId?: string,
    type?: string
}

const InputTextField = ({
    title,
    placeholder,
    validatorAttributeName,
    validatorRule,
    onInput,
    testId,
    type
}: IProps) => {
    
    let [ errors, setErrors ] = useState<string[]>([]);
    let [ value, setValue ] = useState<string>();

    const changeValue = (newValue: string) => {
        setValue(newValue);
        onInput && onInput(newValue);
    };

    const checkErrors = () => {
        if (!validatorRule) return;
        
        const validation = new Validator(
            { [validatorAttributeName]: value },
            { [validatorAttributeName]: validatorRule }
        );
        validation.check();

        const errors = validation.errors.get(validatorAttributeName);
        setErrors(errors);
    }
    
    const renderErrors = () => {
        let id = 0;

        return errors.map(error => {
            return <p key={id++} className="paragraph--small text--error">{error}</p>;
        });
    }

    return(
        <div className={`input-text-field ${errors.length > 0 ? "input-text-field--in-error" : ""}`}>
            <p className="paragraph--small paragraph--bold input-text-field__title">{title}</p>
            <input data-testid={testId} type={type}
                onInput={(e) => changeValue(e.currentTarget.value)}
                onBlur={checkErrors} className="input-text-field__input" placeholder={placeholder}/>
            {renderErrors()}
        </div>
    );
};

export default InputTextField;