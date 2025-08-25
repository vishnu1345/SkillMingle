import axios from "axios";
import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import "./Login.css";

const API_URL = import.meta.env.VITE_API_URL;

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const res = await axios.post(`${API_URL}/`, {
        email,
        password,
      });

      if (res.data === "exist") {
        localStorage.setItem("isAuthenticated", "true");
        localStorage.setItem("userEmail", email);
        navigate("/home", { state: { id: email } });
      } else if (res.data === "notexist") {
        alert("User does not exist. Please sign up.");
      } else if (res.data === "incorrect") {
        alert("Incorrect password");
      }
    } catch (e) {
      alert("An error occurred. Please try again.");
      console.log(e);
    }
  };

  return (
    <div className="container">
      <div className="left">
        <div className="leftContainer">
          <div className="mainHeadingdiv">
            <h1 className="mainHeading">Login</h1>
          </div>
          <form onSubmit={handleSubmit} className="form">
            <div className="input1">
              <p>Username</p>
              <input
                type="text"
                name="email"
                // placeholder="Email"
                onChange={(e) => setEmail(e.target.value)}
                required
                className="inputu"
              />
            </div>
            <div className="input2">
              <p>Password</p>
              <input
                type="password"
                name="password"
                // placeholder="Password"
                onChange={(e) => setPassword(e.target.value)}
                required
                className="input"
              />
            </div>
            <input type="submit" value="Login" className="loginBtn" />

            <p className="signup">
              Don't have an account? <Link to="/signup">Sign Up</Link>
            </p>
          </form>
        </div>
      </div>
      <div className="right">
        <img src="/bg.png" alt="error" />
      </div>
    </div>
  );
};

export default Login;
