import ReactDOM from 'react-dom';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import 'react-toastify/dist/ReactToastify.css';

import './styles/themes.css';
import './index.css';
import reportWebVitals from './reportWebVitals';
import SignUpPage from './pages/SignUp';

const App = () => {
  document.body.classList.add("light-mode");

  return(
    <Router>
      <Routes>
        <Route path="/sign-up" element={<SignUpPage/>}/>
      </Routes>
    </Router>
  );
}

ReactDOM.render(<App />, document.getElementById('root'));

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
