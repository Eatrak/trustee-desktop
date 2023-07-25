import "./style.css";

import logo from "@shared/assets/logo.jpg";
import { ReactComponent as DotsDecoration } from "@shared/assets/dots-decoration.svg";
import SignUpForm from "./SignUpForm";

const SignUpPage = () => {
    return (
        <div className="page page--sign-up">
            <div>
                <img className="page--sign-up__logo" src={logo} alt="logo" />
                <SignUpForm />
            </div>
            <div>
                <DotsDecoration className="page--sign-up__decoration"></DotsDecoration>
            </div>
        </div>
    );
};

export default SignUpPage;
