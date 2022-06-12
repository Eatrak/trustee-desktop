import "./style.css";

import NormalButton from "@components/NormalButton";

interface IProps {
    children: React.ReactNode,
    submitText: string,
    submitEvent?: (...p: any) => any
}

const FormLayout = ({children, submitText, submitEvent}: IProps) => {
    return(
        <div className="form">
            <h3 className="header--bold">Welcome!</h3>
            <div className="form__fields-container">
                {children}
            </div>
            <NormalButton className="form__submit-button" text={submitText} />
        </div>
    );
}

export default FormLayout;
