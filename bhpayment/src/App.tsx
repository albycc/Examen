import { Route, Routes } from "react-router-dom"
import './App.css';
import Home from "./pages/Home/Home";
import User from "./pages/User/User";
import Checkout from "./pages/Checkout/Checkout";

function App() {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/user" element={<User />} />
      <Route path="/checkout" element={<Checkout />} />

    </Routes>
  );
}

export default App;
