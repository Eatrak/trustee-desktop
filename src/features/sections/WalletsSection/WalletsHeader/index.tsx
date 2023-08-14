import { FC } from "react";
import { MdAdd, MdRefresh } from "react-icons/md";

import "./style.css";
import RoundedIconButton from "@shared/components/RoundedIconButton";
import SectionHeader from "@shared/components/SectionHeader";
import RoundedTextIconButton from "@shared/components/RoundedTextIconButton";

interface IProps {
    reloadWallets: Function;
    walletsCount: number;
    onCreationButtonClicked: Function;
}

const WalletsHeader: FC<IProps> = ({
    reloadWallets,
    walletsCount,
    onCreationButtonClicked,
}) => {
    return (
        <SectionHeader
            title="Wallets"
            subTitle={`${walletsCount} wallets`}
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
