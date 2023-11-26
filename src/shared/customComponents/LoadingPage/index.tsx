import "./style.css";
import { Icons } from "@/components/ui/icons";

const LoadingPage = () => {
    return (
        <div className="page loading-page">
            <div className="loading-content">
                <Icons.loading className="w-8 h-8 animate-spin" />
            </div>
        </div>
    );
};

export default LoadingPage;
