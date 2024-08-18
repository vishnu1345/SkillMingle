
import axios from 'axios';
import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';

const Signup = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const res = await axios.post("http://localhost:3000/signup", {
        email,
        password, 
      });

      if (res.data === 'exist') {
        alert("User already exists");
      } else {
        alert("Signup successful");
        navigate("/login");
      }
    } catch (e) {
      alert("Wrong details");
      console.log(e);
    }
  };

  return (
    
    <div className="container">
      <div className="left">
        <div className="leftContainer">
        <div className="mainHeadingdiv">
            <h1 className="mainHeading">Sign Up</h1>
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
            className="input"
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
          <input type="submit" value="Signup" className="loginBtn"/>

          <p className="signup">Already have an account? <Link to="/login">Login</Link></p>
        </form>
        </div>
      </div>
      <div className="right">
        <img src="../public/bg.png" alt="error" />
      </div>
    </div>
  );
};

export default Signup;
