import React, { useEffect } from "react";
import { Route, Routes } from "react-router-dom"
import './App.css';
import Home from "./pages/Home/Home";
import User from "./pages/User/User";
import Checkout from "./pages/Checkout/Checkout";
import Login from "./pages/login/Login"
import WebFont from "webfontloader"
import NavigationBar from "./components/navbar/NavigationBar";
import { GlobalStyle } from "./components/GlobalStyle";
import UserContextProvider from "./context/UserContext";

function App() {

  useEffect(() => {
    WebFont.load({
      google: {
        families: ["Crimson Text", "Roboto", "Lato"]
      }
    });
  }, []);

  return (
    <UserContextProvider>
      <NavigationBar />
      <GlobalStyle />

      <div className="mt-5">

        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="login" element={<Login />} />
          <Route path="/user/:userId" element={<User />} />
          <Route path="/checkout/:id" element={<Checkout />} />

        </Routes>
      </div>

    </UserContextProvider>
  );
}

export default App;
