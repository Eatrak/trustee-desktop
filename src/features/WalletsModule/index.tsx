import H2 from "@/components/ui/h2";
import { WalletsTable } from "./WalletsTable";

const WalletsModule = () => {
    return (
        <div className="section">
            <div className="section__main-content">
                <H2 text="Wallets" />
                <WalletsTable wallets={[]} />
            </div>
        </div>
    );
};

export default WalletsModule;
