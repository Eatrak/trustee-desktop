import "./style.css";
import { LoadingSpinner } from "@/components/ui/loadingSpinner";

const LoadingPage = () => {
    return (
        <div className="page loading-page">
            <div className="loading-content">
                <LoadingSpinner />
            </div>
        </div>
    );
};

export default LoadingPage;
