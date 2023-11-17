import { FC, useEffect, useState } from "react";
import { Route, Routes, useLocation, useNavigate } from "react-router-dom";
import { MdFavoriteBorder, MdInfoOutline, MdOutlineVpnKey } from "react-icons/md";

import "./style.css";
import SettingsHeader from "./SettingsHeader";
import TabsContainer, { TabProps } from "@shared/components/TabsContainer";
import SettingsPreferences from "./SettingsSections/SettingsPreferences";
import SettingsInfo from "./SettingsSections/SettingsInfo";
import { TranslationKey } from "@shared/ts-types/generic/translations";
import { Utils } from "@shared/services/utils";
import SettingsChangePassword from "./SettingsSections/SettingsChangePassword";

const SettingsPage: FC = () => {
    const navigate = useNavigate();
    const location = useLocation();
    const [activeTab, setActiveTab] = useState<string>("1");

    const translate = (translationKeys: TranslationKey[], params?: Object) => {
        return Utils.getInstance().translate(
            [TranslationKey.MODULES, TranslationKey.SETTINGS, ...translationKeys],
            params,
        );
    };

    useEffect(() => {
        // Update selected tab when the path changes
        for (const tab of tabs) {
            if (tab.link === location.pathname) {
                setActiveTab(tab.id);
                break;
            }
        }
    }, [location]);

    const tabs: TabProps[] = [
        {
            id: "1",
            name: translate([
                TranslationKey.TABS,
                TranslationKey.INFO,
                TranslationKey.TITLE,
            ]),
            icon: MdInfoOutline,
            link: "/settings/info",
        },
        {
            id: "2",
            name: translate([
                TranslationKey.TABS,
                TranslationKey.PREFERENCES,
                TranslationKey.TITLE,
            ]),
            icon: MdFavoriteBorder,
            link: "/settings/preferences",
        },
        {
            id: "3",
            name: translate([
                TranslationKey.TABS,
                TranslationKey.CHANGE_PASSWORD,
                TranslationKey.TITLE,
            ]),
            icon: MdOutlineVpnKey,
            link: "/settings/change-password",
        },
    ];

    return (
        <div className="section section--main-content settings-section">
            <SettingsHeader></SettingsHeader>
            <div className="settings-section__card card">
                <TabsContainer
                    activeTab={activeTab}
                    tabs={tabs}
                    onTabClick={(id: string, link?: string) => {
                        setActiveTab(id);
                        link && navigate(link);
                    }}
                ></TabsContainer>
                <Routes>
                    <Route path="/info" element={<SettingsInfo />} />
                    <Route path="/preferences" element={<SettingsPreferences />} />
                    <Route path="/change-password" element={<SettingsChangePassword />} />
                </Routes>
            </div>
        </div>
    );
};

export default SettingsPage;
