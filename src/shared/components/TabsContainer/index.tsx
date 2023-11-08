import { IconType } from "react-icons";

import "./style.css";
import Tab, { TabOnClickEvent } from "./Tab";

export interface TabProps {
    id: string;
    name: string;
    icon?: IconType;
    link?: string;
}

export interface IProps {
    tabs: TabProps[];
    activeTab: string;
    onTabClick: TabOnClickEvent;
}

const TabsContainer = ({ tabs, activeTab, onTabClick }: IProps) => {
    const getTabsToRender = () => {
        return tabs.map(({ id, name, icon, link }) => (
            <Tab
                key={id}
                id={id}
                isActive={id === activeTab}
                Icon={icon}
                name={name}
                link={link}
                onClick={onTabClick}
            />
        ));
    };

    return <div className="tabs-container">{getTabsToRender()}</div>;
};

export default TabsContainer;
