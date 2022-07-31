import ReactDOM from 'react-dom';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import 'react-toastify/dist/ReactToastify.css';
import * as Sentry from '@sentry/react';
import { BrowserTracing } from '@sentry/tracing';

import './styles/themes.css';
import './index.css';
import reportWebVitals from './reportWebVitals';
import SignUpPage from './pages/SignUp';
import SignInPage from './pages/SignIn';
import AppLayout from './pages/AppLayout';

if (process.env.NODE_ENV === "production") {
  Sentry.init({
    dsn: process.env.REACT_APP_SENTRY_DSN,
    integrations: [new BrowserTracing()],
    tracesSampleRate: 1.0,
  });
}

const App = () => {
  document.body.classList.add("light-mode");

  return(
    <Router>
      <Routes>
        <Route path="/*" element={<AppLayout/>}/>
        <Route path="/sign-up" element={<SignUpPage/>}/>
        <Route path="/sign-in" element={<SignInPage/>}/>
      </Routes>
    </Router>
  );
}

ReactDOM.render(<App />, document.getElementById('root'));

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
