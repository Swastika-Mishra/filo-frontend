import React, { useState } from "react";
import "./Auth.css";
import Register from "../componenets/Register";
import Login from "../componenets/Login";

function Auth(){
  const [isLogin, isSignup] = useState(true);

  const toggleForm = () => {
    isSignup(!isLogin);
  };

  return (
    <div className="auth">
        {isLogin ? <h2>Login</h2> : <h2>Signup</h2>}
      {isLogin ? <Login /> : <Register />}
      <div className="toggle">
        {isLogin ? <button onClick={toggleForm} className="container">Signup</button> : <button onClick={toggleForm} className="container">Login</button>}
      </div>
    </div>
  );
};

export default Auth;