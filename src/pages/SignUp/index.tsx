import "./style.css";

import FormLayout from '@components/FormLayout';
import InputTextField from '@components/InputTextField';
import logo from '../../assets/logo.png';
import { ReactComponent as DotsDecoration } from '../../assets/dots-decoration.svg';

const SignUpPage = () => {
    return(
        <div className="page page--sign-up">
            <div>
                <img className="page--sign-up__logo" src={logo}/>
                <FormLayout submitText="Sign up">
                    <InputTextField title="Email" placeholder="johndoe@test.com"/>
                    <InputTextField title="Password"/>
                </FormLayout>
            </div>
            <div>
                <DotsDecoration className="page--sign-up__decoration"></DotsDecoration>
            </div>
        </div>
    );
};

export default SignUpPage;