import "./style.css";

import logo from '@assets/logo.jpg';
import { ReactComponent as DotsDecoration } from '@assets/dots-decoration.svg';
import SignUpForm from "./SignUpForm";

const SignUpPage = () => {
    return(
        <div className="page page--sign-up">
            <div>
                <img className="page--sign-up__logo" src={logo} alt="logo"/>
                <SignUpForm/>
            </div>
            <div>
                <DotsDecoration className="page--sign-up__decoration"></DotsDecoration>
            </div>
        </div>
    );
};

export default SignUpPage;