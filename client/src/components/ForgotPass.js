import React from "react";
import "./ForgotPass.css";

function ForgotPass() {
  return (
    <div className="pass-recover-container">
      <div>
        <h1>Please enter your Email</h1>
      </div>
      <form className="email-input-container">
        <div className="form">
          <input
            type="text"
            placeholder="Enter email"
            className="email-input"
            name="email"
          />
        </div>
        <div>
          <button className="send-email-btn" type="button">
            Send Email
          </button>
        </div>
      </form>
    </div>
  );
}

export default ForgotPass;
