import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

import AuthService from "@/shared/services/auth";
import LoadingView from "@/shared/customComponents/LoadingView";

interface IProps {
    children: JSX.Element;
    loadResources: Function;
}

const Authorizer = ({ children: pageToRender, loadResources }: IProps) => {
    const navigate = useNavigate();
    const [isChecked, setIsChecked] = useState<boolean>(false);

    const redirectUserIfItIsNotAuthenticated = async () => {
        const isUserAuthenticated = await AuthService.getInstance().isUserAuthenticated();
        if (isUserAuthenticated) {
            await loadResources();

            setIsChecked(isUserAuthenticated);
            return;
        }

        navigate("/sign-in");
    };

    useEffect(() => {
        // Add delay to avoid showing the loading-page for too little time
        setTimeout(() => {
            redirectUserIfItIsNotAuthenticated();
        }, 500);
    }, []);

    return (
        <>
            {isChecked ? (
                pageToRender
            ) : (
                <div className="page">
                    <LoadingView />
                </div>
            )}
        </>
    );
};

export default Authorizer;
