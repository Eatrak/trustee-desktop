import "./style.css";

import NormalButton from "@shared/components/NormalButton";

interface IProps {
    header?: string;
    children: React.ReactNode;
    submitText: string;
    submitEvent?: (...p: any) => any;
    submitDisabled?: boolean;
    isLoading?: boolean;
}

const FormLayout = ({
    header,
    children,
    submitText,
    submitEvent,
    submitDisabled,
    isLoading = false,
}: IProps) => {
    return (
        <div className="form">
            <h3 className="header--bold">{header}</h3>
            <div className="form__fields-container">{children}</div>
            <NormalButton
                testId="submitButton"
                className="form__submit-button"
                isLoading={isLoading}
                text={submitText}
                event={submitEvent}
                disabled={submitDisabled}
            />
        </div>
    );
};

export default FormLayout;
