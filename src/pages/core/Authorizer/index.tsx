import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { BehaviorSubject } from 'rxjs';

import AuthService from '@services/auth';
import LoadingPage from '@pages/core/LoadingPage';

interface IProps {
    children: JSX.Element
}

const Authorizer = ({ children: pageToRender }: IProps) => {
    const navigate = useNavigate();
    const [ isChecked, setIsChecked ] = useState<boolean>(false);

    const redirectUserIfItIsNotAuthenticated = async () => {
        const isUserAuthenticated = await AuthService.getInstance().isUserAuthenticated();
        if (isUserAuthenticated) {
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
            {isChecked ? pageToRender : <LoadingPage />}
        </>
    );
};

export default Authorizer;
