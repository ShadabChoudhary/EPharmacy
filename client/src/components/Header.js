import React from "react";
import "./Header.css";
import { AppBar, Toolbar } from "@mui/material";
import {
  AccountCircleRounded,
  AddShoppingCartOutlined,
  Search,
} from "@material-ui/icons";
import { Link } from "react-router-dom";

function Header() {
  return (
    <div>
      <AppBar>
        <Toolbar>
          <div className="nav-container">
            <Link to="/">
              <div className="logo">
                <img alt="Logo"></img>
              </div>
            </Link>

            <div className="search-panel">
              <div className="search-icon">
                <Search></Search>
              </div>
              <input
                className="input-txt"
                type="text"
                placeholder="Search for medicines"
              ></input>
            </div>

            <Link to="/cart" className="cart-container">
              <AddShoppingCartOutlined />
              <p className="cart">Cart</p>
            </Link>

            <Link to="/register" className="account-container">
              <AccountCircleRounded />
              <p className="log-reg">Login/Register</p>
            </Link>
          </div>
        </Toolbar>
      </AppBar>
    </div>
  );
}

export default Header;
