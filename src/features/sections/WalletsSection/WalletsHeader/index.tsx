import { FC } from "react";
import { MdAdd, MdRefresh } from "react-icons/md";

import "./style.css";
import RoundedIconButton from "@shared/components/RoundedIconButton";
import SectionHeader from "@shared/components/SectionHeader";
import RoundedTextIconButton from "@shared/components/RoundedTextIconButton";
import { Utils } from "@shared/services/utils";
import { TranslationKey } from "@shared/ts-types/generic/translations";

interface IProps {
    reloadWallets: Function;
    walletsCount: number;
    onCreationButtonClicked: Function;
    isSubTitleLoading?: boolean;
}

const WalletsHeader: FC<IProps> = ({
    reloadWallets,
    walletsCount,
    onCreationButtonClicked,
    isSubTitleLoading = false,
}) => {
    const translate = (translationKeys: TranslationKey[]) => {
        return Utils.getInstance().translate([
            TranslationKey.MODULES,
            TranslationKey.WALLETS,
            TranslationKey.HEADER,
            ...translationKeys,
        ]);
    };

    return (
        <SectionHeader
            title={translate([TranslationKey.TITLE])}
            subTitle={`${walletsCount} ${translate([TranslationKey.SUB_TITLE])}`}
            isSubTitleLoading={isSubTitleLoading}
            actions={[
                <RoundedTextIconButton
                    Icon={MdRefresh}
                    clickEvent={() => reloadWallets()}
                />,
                <RoundedIconButton
                    Icon={MdAdd}
                    clickEvent={() => onCreationButtonClicked()}
                />,
            ]}
        />
    );
};

export default WalletsHeader;
