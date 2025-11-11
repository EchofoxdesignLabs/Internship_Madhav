import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import Slide1 from "../assets/Slide1.png";
import "./styles/Login.css";

const Login = () => {
  const navigate = useNavigate();//used to navigate


  //some handles used to remove error from particular field when that get an update
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [,setLogin] = useState('');
  
  const [emailError, setEmailError] = useState('');
  const [passwordError, setPasswordError] = useState('');
  const [loginError, setLoginError] = useState('');
  
  const [isSubmitted, setIsSubmitted] = useState(false);
  
  useEffect(() => {
    const token = sessionStorage.getItem('token');
    if (token) navigate('/hero');
  }, [navigate]);

  const handleLoginChange = (e) => {
    setLogin(e.target.value);
    if (isSubmitted && e.target.value.trim() !== '') setLoginError('');
  };

  const handleEmailChange = (e) => {
    setEmail(e.target.value);
    if (isSubmitted && e.target.value.trim() !== '') setEmailError('');
  };

  const handlePasswordChange = (e) => {
    setPassword(e.target.value);
    if (isSubmitted && e.target.value.trim() !== '') setPasswordError('');
  };
  
  const handleLogin = async () => {
    setIsSubmitted(true);

    let hasError = false;

    if (!email.trim()) {
      setEmailError('Email is required');
      hasError = true;
    }
    if (!password.trim()) {
      setPasswordError('Password is required');
      hasError = true;
    }

    if (hasError) return;

    try {//gets access to backend file auth.controller
      const response = await axios.post("http://localhost:3001/auth/login", {
        email,
        password,
      });
      

      //if success is true then navigate to hero page
      if (response.data?.success) {
        sessionStorage.setItem("token", response.data.access_token);
        navigate("/hero");
      } 
      else {// if success is false then return error according to messages return
        const msg = response.data?.message || "Login failed!";
        if (msg.toLowerCase().includes('user')) setLoginError(msg);
        else if (msg.toLowerCase().includes('password')) setPasswordError(msg);
        else alert(msg);
      }
    } 
    
    catch {//states backend error
      alert("Invalid email or password!");
    }
  };


  //redirects to google login
  const handleGoogleLogin = () => {
    const googleLoginUrl = "http://localhost:3001/auth/google";
    const popup = window.open(googleLoginUrl, "_blank", "width=500,height=600");

    const messageHandler = (event) => {

      if (event.origin !== "http://localhost:3001") return;

      const { token, success } = event.data;
      if (success && token) {
        sessionStorage.setItem("token", token);
        popup.close();
        navigate("/hero");
      }
      window.removeEventListener("message", messageHandler);
    };
    window.addEventListener("message", messageHandler);
  };



  return (
    <div>
      <div className="login-container">
        <div className="login-box">
          <h1 className="login-title">Login</h1>

          {loginError && <div className="login-error">{loginError}</div>}


          {/*Email*/}
          <p className="login-email">
            Email
            <input
              type="text"
              placeholder="username@email.com"
              className="input-field"
              value={email}
              onChange={(e) => { //used to return both handles, as if any field changes, remove "User not found!" error
                handleEmailChange(e);
                handleLoginChange(e);
              }}
            />
          </p>
  
          {emailError && <div className="field-error">{emailError}</div>}


          {/*Password*/}    
          <p className="login-password">
            Password
            <input
              type="password"
              placeholder="Password"
              className="input-field"
              value={password}
              onChange={(e) => { //used to return both handles, as if any field changes, remove "User not found!" error
                handlePasswordChange(e);
                handleLoginChange(e);
              }}
            />
          </p>

          {passwordError && <div className="field-error">{passwordError}</div>}
          
          {/*Login-button*/}
          <button className="login-btn" onClick={handleLogin}>
            Login
          </button>

          <p className="login-option">Or login with</p>
          
          {/*Google-login-button*/}
          <button className="google-btn" onClick={handleGoogleLogin}>
            Google
          </button>
          
          {/*Register-option*/}
          <p className="register-option">
            Don’t have an account?
            <span className="register-link" onClick={() => navigate("/register")}>
              {" "}
              Register for free
            </span>
          </p>
        </div>

        <div className="ImageR">
          <img src={Slide1} alt="Slide1" />
        </div>
      </div>
    </div>
  );
};

export default Login;
