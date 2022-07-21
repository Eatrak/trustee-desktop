import "./style.css";

import React, { RefObject } from "react";

interface IProps {
    title: string,
    placeholder?: string,
    validator?: (value: string) => boolean,
    errorMessage?: string
}

class InputTextField extends React.Component<IProps> {
    state = { error: false };

    inputRef: RefObject<HTMLInputElement> = React.createRef();

    getValidatedValue = () => {
        if (!this.inputRef.current) return "";

        const value = this.inputRef.current.value;

        return value;
    };

    validate = () => {
        if (!this.props.validator) return;
        
        const value = this.inputRef.current ? this.inputRef.current.value : "";
        const valid = this.props.validator(value);

        if (valid) {
            this.inputRef.current?.classList.remove("input-text-field__input--error");
            this.setState({ error: false });
        }
        else {
            this.inputRef.current?.classList.add("input-text-field__input--error");
            this.setState({ error: true });
        }
    }

    render() {
        return(
            <div className="input-text-field">
                <p className="paragraph--small paragraph--bold input-text-field__title">{this.props.title}</p>
                <input ref={this.inputRef} onBlur={this.validate} className="input-text-field__input" placeholder={this.props.placeholder}/>
                {this.state.error && <p className="paragraph--small text--error">{this.props.errorMessage}</p>}
            </div>
        );
    }
};

export default InputTextField;