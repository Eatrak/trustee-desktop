import { FC } from "react";

import "./style.css";
import SectionHeader from "@shared/components/SectionHeader";
import { Utils } from "@shared/services/utils";
import { TranslationKey } from "@shared/ts-types/generic/translations";

const SettingsHeader: FC = () => {
    const translate = (translationKeys: TranslationKey[]) => {
        return Utils.getInstance().translate([
            TranslationKey.MODULES,
            TranslationKey.SETTINGS,
            TranslationKey.HEADER,
            ...translationKeys,
        ]);
    };

    return (
        <SectionHeader
            title={translate([TranslationKey.TITLE])}
            subTitle={translate([TranslationKey.SUB_TITLE])}
            actions={[]}
        />
    );
};

export default SettingsHeader;
