import './App.css';
import { Login } from './components/Login';
import { Signup } from './components/Signup';
import { Account } from "./components/Account"
import Status from "./components/Status"
import { Main } from './components/Main';
import { BrowserRouter as Router,  Routes, Route, useLocation, Link } from "react-router-dom";
import Chat from './components/Chat';


function App() {
  const location = useLocation()
  return (
    <>
      <Account>
        <Main />
        <Status />
        <Signup />
        <Login />
        <Chat />
      </Account>
    </>

  );

}

export default App;
