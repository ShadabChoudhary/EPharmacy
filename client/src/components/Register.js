import React from "react";
import { useState } from "react";
import { AccountBox, Email } from "@material-ui/icons";
import { Link } from "react-router-dom";
import "./Register.css";
import regImage from "../components/images/regImage.jpg";

function Register() {
  const [regUser, setRegUser] = useState({ name: "", email: "", password: "" });

  const handleInputs = async (e) => {
    e.preventDefault();
    const { name, value } = e.target;
    setRegUser({ ...regUser, [name]: value });
  };

  const PostData = async (e) => {
    e.preventDefault();
    const { name, email, password } = regUser;

    const PostUser = await fetch("http://localhost:8000/api/register", {
      method: "POST",
      headers: {
        "content-Type": "application/json",
      },
      body: JSON.stringify({
        name,
        email,
        password,
      }),
    });

    const data = await PostUser.json();
    console.log(data);

    if (!data) {
      window.alert("Invalid Registeration");
      console.log("Invalid Registeration");
    } else {
      window.alert("Registeration successfull");
      console.log("Registeration successfull");
    }
  };

  return (
    <section className="main-container">
      <div className="form-container">
        <div>
          <h1 className="reg-title">Create an account</h1>
        </div>
        <div className="container">
          <div className="right-container">
            <form className="signup" method="post">
              <div className="form">
                <label htmlFor="name" className="form-label">
                  <AccountBox style={{ fontSize: 30 }} />
                </label>
                <input
                  type="text"
                  value={regUser.name}
                  onChange={handleInputs}
                  placeholder="Your Name"
                  className="input-control"
                  name="name"
                />
              </div>
              <div className="form">
                <label htmlFor="email" className="form-label">
                  <Email style={{ fontSize: 30 }} />
                </label>
                <input
                  type="email"
                  required
                  value={regUser.email}
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
                  value={regUser.password}
                  onChange={handleInputs}
                  placeholder="Password"
                  className="input-control"
                  name="password"
                />
              </div>
              <button className="btn" type="submit" onClick={PostData}>
                Register
              </button>
            </form>

            <div className="existing-user">
              <h3>
                <Link to="/login" className="already-acc-title">
                  Already have an account?Login
                </Link>
              </h3>
            </div>
          </div>
          <div className="left-container">
            <div>
              <img className="reg-image" src={regImage} alt="RegImage" />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

export default Register;
