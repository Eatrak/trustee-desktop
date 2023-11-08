import "./style.css";

import { withTranslation } from "react-i18next";

import logo from "@shared/assets/logo.jpg";
import { ReactComponent as DotsDecoration } from "@shared/assets/dots-decoration.svg";
import SignInForm from "./SignInForm";

const SignInPage = () => {
    return (
        <div className="page page--sign-in">
            <div>
                <img className="page--sign-in__logo" src={logo} alt="logo" />
                <SignInForm />
            </div>
            <div>
                <DotsDecoration className="page--sign-in__decoration"></DotsDecoration>
            </div>
        </div>
    );
};

export default withTranslation()(SignInPage);
