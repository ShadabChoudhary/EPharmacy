import "./App.css";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import Home from "./components/Home.js";
import Register from "./components/Register.js";
import Cart from "./components/Cart.js";
import Login from "./components/Login.js";
import ForgotPass from "./components/ForgotPass";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/cart" element={<Cart />} />
        <Route path="/register" element={<Register />} />
        <Route path="/login" element={<Login />} />
        <Route path="/recover-pass" element={<ForgotPass />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
