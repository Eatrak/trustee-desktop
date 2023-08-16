import { ReactNode } from "react";

import "./style.css";
import TextSkeleton from "../TextSkeleton";

interface IProps {
    title: string;
    subTitle: string;
    actions: ReactNode;
    isSubTitleLoading?: boolean;
}

const SectionHeader = ({
    title,
    subTitle,
    actions,
    isSubTitleLoading = false,
}: IProps) => {
    return (
        <div className="app-layout__header">
            <div className="app-layout__header__texts-container">
                <h5 className="header--bold app-layout__header__texts_container__title">
                    {title}
                </h5>
                {isSubTitleLoading ? (
                    <TextSkeleton
                        className="header--bold app-layout__header__texts_container__title"
                        size="small-paragraph"
                        width="100px"
                    />
                ) : (
                    <p className="paragraph--sub-title">{subTitle}</p>
                )}
            </div>
            <div className="app-layout__header__actions-container">{actions}</div>
        </div>
    );
};

export default SectionHeader;
