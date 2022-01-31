import React from "react";
import { useState } from "react";
import { Link } from "react-router-dom";
import { Email } from "@material-ui/icons";
import loginImage from "../components/images/LoginImage.jpg";

function Login() {
  const [login, setLogin] = useState({ email: "", password: "" });

  const handleInputs = async (e) => {
    const { name, value } = e.target;

    setLogin({ ...login, [name]: value });
  };

  const loginUser = async (e) => {
    e.preventDefault();
    const { email, password } = login;

    const PostUser = await fetch("http://localhost:8000/api/login", {
      method: "POST",
      headers: {
        "content-Type": "application/json",
      },
      body: JSON.stringify({
        email,
        password,
      }),
    });
    const data = await PostUser.json();
    console.log(data);

    if (!data) {
      window.alert("Invalid cridentials");
      console.log("Invalid cridentials");
    } else {
      window.alert("Login successfull");
      console.log("Login successfull");
    }
  };

  return (
    <section className="main-container">
      <div className="form-container">
        <div>
          <h1 className="reg-title">Login</h1>
        </div>
        <div className="container">
          <div className="right-container">
            <form method="POST" className="signup">
              <div className="form">
                <label htmlFor="email" className="form-label">
                  <Email style={{ fontSize: 30 }} />
                </label>
                <input
                  type="text"
                  value={login.email}
                  onChange={handleInputs}
                  placeholder="Email"
                  className="input-control"
                  name="email"
                />
              </div>
              <div className="form">
                <label htmlFor="password" className="form-label">
                  <img
                    className="pass-logo"
                    alt="passLogo"
                    src="https://img.icons8.com/ios-glyphs/50/000000/password--v1.png"
                  />
                </label>
                <input
                  type="password"
                  value={login.password}
                  onChange={handleInputs}
                  placeholder="Password"
                  className="input-control"
                  name="password"
                />
              </div>
              <div className="forgot-pass-container">
                <Link to="/recover-pass" className="forgot-pass">
                  <h4>Forgot password?</h4>
                </Link>
              </div>
              <button className="btn" type="button" onClick={loginUser}>
                Login
              </button>
            </form>
            <div className="create-user-container">
              <Link to="/register" className="create-user">
                <h3>Don't have an account?Create one</h3>
              </Link>
            </div>
          </div>
          <div className="left-container">
            <div>
              <img className="reg-image" src={loginImage} alt="RegImage" />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

export default Login;
