import React, { useEffect, useRef, useState, useContext } from "react";
import "./Login.css";
import useAuth from "../hooks/useAuth";
import useAxiosPrivate from "../hooks/useAxiosPrivate";
import {useNavigate} from 'react-router-dom';

const Login = () => {
  const { setAuth, persist, setPersist } = useAuth();
  const axiosPrivate = useAxiosPrivate();

  const navigate = useNavigate();
  //const location = useLocation();
  //const from = location.state?.from?.pathname || "/";

  const userRef = useRef();
  const errRef = useRef();

  const [user, setUser] = useState("");
  const [pwd, setpwd] = useState("");
  const [errmsg, seterrmsg] = useState("");

  useEffect(() => {
    userRef.current.focus();
  }, []);

  useEffect(() => {
    seterrmsg("");
  }, [user, pwd]);

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      const response = await axiosPrivate.post(
        "http://localhost:3001/auth/login",
        { user, pwd },
        {
          headers: { "Content-Type": "application/json" },
          withCredentials: true,
        }
      );
      console.log(JSON.stringify(response?.data));
      const accessToken = response?.data?.accessToken;
      //const refreshToken = response?.data?.refreshToken;
      setAuth({user, pwd, accessToken});
      setUser("");
      setpwd("");
      //navigate(from, {replace: true});
      navigate('/dashboard');
    } catch (err) {
      if(!err?.response){
        seterrmsg('No server Response');
      }
      else seterrmsg('Login failed');
      navigate("/");
      errRef.current.focus();
    }
  };

  const togglePersist = () =>{
    setPersist(prev => !prev);
  }

  useEffect(()=>{
    localStorage.setItem("persist", persist);
  },[persist])

  return (
    <div className="inp">
      <p
        ref={errRef}
        className={errmsg ? "errmsg" : "offscreen"}
        aria-live="assertive"
      >
        {errmsg}
      </p>

      <label htmlFor="login-username">Username:</label>
      <input
        type="text"
        ref={userRef}
        id="login-user"
        name="username"
        onChange={(e) => setUser(e.target.value)}
        required
        value={user}
      />
      <br />

      <label htmlFor="login-password">Password:</label>

      <input
        type="password"
        id="login-password"
        name="password"
        onChange={(e) => setpwd(e.target.value)}
        required
        value={pwd}
      />
      <br />

      <button type="submit" className="submit" onClick={handleLogin}>
        Log in
      </button>
      <div className="persistCheck">
        <input 
        type="checkbox" 
        id="persist"
        onChange={togglePersist}
        checked={persist}
        />
        <label htmlFor="persist">Trust this device?</label>
      </div>
      <br />
    </div>
  );
};

export default Login;
