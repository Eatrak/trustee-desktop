import "./style.css";

import React, { useState } from "react";
import Validator, { Rules, TypeCheckingRule } from "validatorjs";

interface IProps extends Omit<React.InputHTMLAttributes<HTMLInputElement>, "onInput"> {
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
    type,
    value,
    ...nativeInputProps
}: IProps) => {
    
    let [ errors, setErrors ] = useState<string[]>([]);

    const changeValue = (newValue: string) => {
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
                {...nativeInputProps}
                value={value}
                onInput={(e) => changeValue(e.currentTarget.value)}
                onBlur={checkErrors} className="input-text-field__input" placeholder={placeholder}/>
            {renderErrors()}
        </div>
    );
};

export default InputTextField;