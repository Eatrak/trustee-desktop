import "./style.css";

import React, { RefObject } from "react";

import Validator from "validatorjs";

interface IProps {
    title: string,
    placeholder?: string,
    validator: Validator.Rules,
    validatorAttribute: string,
    onInput?: (value: string, errors: string[]) => void,
    testId?: string,
    type?: string
}

class InputTextField extends React.Component<IProps> {
    state = { errors: [] };

    inputRef: RefObject<HTMLInputElement> = React.createRef();

    getValue = () => {
        if (!this.inputRef.current) return "";

        const value = this.inputRef.current.value;

        return value;
    };

    checkErrors = () => {
        if (!this.props.validator) return true;
        
        const value = this.inputRef.current ? this.inputRef.current.value : "";
        
        const validation = new Validator({ [this.props.validatorAttribute]: value }, this.props.validator);
        validation.check();

        const errors = validation.errors.get(this.props.validatorAttribute);
        this.setState({ errors });
        
        if (errors.length > 0) {
            this.inputRef.current?.classList.add("input-text-field__input--error");
        }
        else {
            this.inputRef.current?.classList.remove("input-text-field__input--error");
        }
    }
    
    renderErrors() {
        let id = 0;

        return this.state.errors.map(error => {
            return <p key={id++} className="paragraph--small text--error">{error}</p>;
        });
    }

    render() {
        return(
            <div className="input-text-field">
                <p className="paragraph--small paragraph--bold input-text-field__title">{this.props.title}</p>
                <input data-testid={this.props.testId} ref={this.inputRef} type={this.props.type}
                    onInput={() => this.props.onInput && this.props.onInput(this.getValue(), this.state.errors)}
                    onBlur={this.checkErrors} className="input-text-field__input" placeholder={this.props.placeholder}/>
                {this.renderErrors()}
            </div>
        );
    }
};

export default InputTextField;