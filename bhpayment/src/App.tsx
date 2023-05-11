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
import DonationSuccess from "./pages/donation/DonationSuccess";

/*
Main App file

Here we load fonts, instantiate React Router and define different routers

Also we see user context for storing user data globally, and also grabs global styling and setting up navigation bar
*/
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
          <Route path="/donationsuccess" element={<DonationSuccess />} />

        </Routes>
      </div>

    </UserContextProvider>
  );
}

export default App;
