import ReactDOM from "react-dom";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import "react-toastify/dist/ReactToastify.css";
import * as Sentry from "@sentry/react";
import { BrowserTracing } from "@sentry/tracing";
import Validator from "validatorjs";
//@ts-ignore
import en from "validatorjs/src/lang/en";
import dayjs from "dayjs";
import localeData from "dayjs/plugin/localeData";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

import "./themes/light.css";
import "./index.css";
import reportWebVitals from "./reportWebVitals";
import SignUpPage from "@features/core/auth/SignUp";
import SignInPage from "@features/core/auth/SignIn";
import AppLayout from "@shared/customComponents/AppLayout";
import Authorizer from "@shared/customComponents/Authorizer";
import TransactionsService from "@shared/services/transactions";

dayjs.extend(localeData);
Validator.setMessages("en", en);

if (process.env.NODE_ENV === "production") {
    Sentry.init({
        dsn: process.env.VITE_APP_SENTRY_DSN,
        integrations: [new BrowserTracing()],
        tracesSampleRate: 1.0,
    });
}

const App = () => {
    document.body.classList.add("light-mode");

    const loadResources = async () => {
        await Promise.all([TransactionsService.getInstance().getCurrencies()]);
    };

    return (
        <Router>
            <Routes>
                <Route
                    path="/*"
                    element={
                        <Authorizer loadResources={loadResources}>
                            <AppLayout />
                        </Authorizer>
                    }
                />
                <Route path="/sign-up" element={<SignUpPage />} />
                <Route path="/sign-in" element={<SignInPage />} />
            </Routes>
            <ToastContainer />
        </Router>
    );
};

ReactDOM.render(<App />, document.getElementById("root"));

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
