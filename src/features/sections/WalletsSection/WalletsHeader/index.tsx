import { MdAdd, MdRefresh } from "react-icons/md";

import "./style.css";
import RoundedIconButton from "@shared/components/RoundedIconButton";
import SectionHeader from "@shared/components/SectionHeader";
import RoundedTextIconButton from "@shared/components/RoundedTextIconButton";

const WalletsHeader = () => {
    return (
        <SectionHeader
            title="Wallets"
            subTitle="0 wallets"
            actions={[
                <RoundedTextIconButton Icon={MdRefresh} />,
                <RoundedIconButton Icon={MdAdd} />,
            ]}
        />
    );
};

export default WalletsHeader;
