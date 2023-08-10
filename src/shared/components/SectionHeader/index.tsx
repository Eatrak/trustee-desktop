import { ReactNode } from "react";

import "./style.css";

interface IProps {
    title: string;
    subTitle: string;
    actions: ReactNode;
}

const SectionHeader = ({ title, subTitle, actions }: IProps) => {
    return (
        <div className="app-layout__header">
            <div className="app-layout__header__texts-container">
                <h5 className="header--bold app-layout__header__texts_container__title">
                    {title}
                </h5>
                <p className="paragraph--sub-title">{subTitle}</p>
            </div>
            <div className="app-layout__header__actions-container">{actions}</div>
        </div>
    );
};

export default SectionHeader;
