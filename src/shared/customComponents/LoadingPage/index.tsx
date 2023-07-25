import "./style.css";
import logo from "@shared/assets/logo.jpg";
import LoadingBar from "@shared/components/LoadingBar";

const LoadingPage = () => {
    return (
        <div className="page loading-page">
            <div className="loading-page__content">
                <img src={logo} draggable={false} />
                <LoadingBar />
            </div>
        </div>
    );
};

export default LoadingPage;
