import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import Slide2 from "../assets/Slide2.png";
import "./styles/Register.css";



//password setting criteria
const PWD_RULE = {
  min: 8,
  u_case: /[A-Z]/,
  num: /[0-9]/,
  spec: /[!@#$%^&*()_+\-=[\]{};':"\\|,.<>/?]/,
};



//returns what is required in password
const validatePassword = (pwd) => {
  const errors = [];
  if (!pwd || pwd.length < PWD_RULE.min) 
    errors.push(` ${PWD_RULE.min} characters`);
  if (!PWD_RULE.u_case.test(pwd)) 
    errors.push(' one uppercase letter (A-Z)');
  if (!PWD_RULE.num.test(pwd)) 
    errors.push(' one number (0-9)');
  if (!PWD_RULE.spec.test(pwd)) 
    errors.push(' one special character (!@#$...)');

  return errors.length > 0 ? [`At least ${errors.join(', ')}`]:[];
};


const Register = () => {
  const navigate = useNavigate();//used to navigate


  //declared some constatnts to return with data and error display
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [accepted, setAccepted] = useState(false);
 
  const [nameError, setNameError] = useState('');
  const [emailError, setEmailError] = useState('');
  const [passwordErrors, setPasswordErrors] = useState([]);
  const [confirmError, setConfirmError] = useState('');
  const [acceptedError, setAcceptedError] = useState('');
  const [userExistsError, setUserExistsError] = useState(false);
  
  const [isSubmitted, setIsSubmitted] = useState(false);
  

  //some handles used to remove error from particular field when that get an update
  const handleNameChange = (val) => {
    setName(val);
    if (isSubmitted && val.trim() !== '') setNameError('');
  };

  const handleEmailChange = (val) => {
    setEmail(val);
    if (isSubmitted && val.trim() !== '') setEmailError('');
  };

  const handlePasswordChange = (val) => {
    setPassword(val);
    if (isSubmitted) setPasswordErrors([]);
  };

  const handleConfirmChange = (val) => {
    setConfirmPassword(val);
    if (isSubmitted && val.trim() !== '') setConfirmError('');
  };

  const handleRegister = async () => {
    setIsSubmitted(true);

    
    setNameError('');
    setEmailError('');
    setPasswordErrors([]);
    setConfirmError('');
    setAcceptedError('');

    let hasError = false;

    if (!name.trim()) {
      setNameError('Name is required');
      hasError = true;
    }
    
    if (!email.trim()) {
      setEmailError('Email is required');
      hasError = true;
    } else {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(email)) {
        setEmailError('Enter a valid email');
        hasError = true;
      }
    }
    
    if (!password.trim()) {
      setPasswordErrors(['Password is required']);
      hasError = true;
    } else {
      const pwdErrors = validatePassword(password);
      if (pwdErrors.length > 0) {
        setPasswordErrors(pwdErrors);
        hasError = true;
      }
    }
 
    if (password !== confirmPassword) {
      setConfirmError("Passwords don't match");
      hasError = true;
    }
    
    if (!accepted) {
      setAcceptedError('You must accept terms & conditions to register');
      hasError = true;
    }

    if (hasError) return;

    
    //gets access to backend file auth.controller
    try {
      const response = await axios.post("http://localhost:3001/auth/register", {
        name,
        email,
        password,
        acceptedTerms: accepted,
      });
      
      
      //if success is true then navigate to home page
      if (response.data?.success) {
        navigate('/home', { state: { fromRegister: true } });
      } 
      else {// if success is false then return error according to messages return
        const msg = response.data?.message || 'Registration failed';
        if (msg.toLowerCase().includes('email')) setUserExistsError(true);
        else alert(msg);
      }
    } 
    catch (err) {//states backend error!
      alert('Something went wrong.');
      console.error(err);
    }
  };

  return (
    <div>
    {/* if user exists a box appears to redirect to login   */}
    {userExistsError && (
      <div className="email-exists">
        <p>Email already exists!<br/>Login instead.</p>
        <button onClick={()=> navigate('/login')}>Login</button>
      </div>
    )}
      {/*register box*/}
      <div className="register-container">
        <div className="register-box">
          <h1 className="register-title">Register</h1>

          {/*Name*/}
          <p className="register-name">
            Full Name
            <input
              type="text"
              placeholder="Name"
              className="input-field"
              value={name}
              onChange={(e) => handleNameChange(e.target.value)}
            />
          </p>
          {nameError && <div className="field-error">{nameError}</div>}

          {/*Email*/}
          <p className="register-email">
            Email Id
            <input
              type="email"
              placeholder="username@email.com"
              className="input-field"
              value={email}
              onChange={(e) => handleEmailChange(e.target.value)}
            />
          </p>
          {emailError && <div className="field-error">{emailError}</div>}

          {/*Password*/}
          <p className="register-password">
            Password
            <input
              type="password"
              placeholder="Password"
              className="input-field"
              value={password}
              onChange={(e) => handlePasswordChange(e.target.value)}
            />
          </p>
          {passwordErrors.length > 0 && (
            <div className="field-error">{passwordErrors.join(', ')}</div>
          )}

          {/*Confirm-Password*/}
          <p className="register-confirm-password">
            Confirm Password
            <input
              type="password"
              placeholder="Confirm Password"
              className="input-field"
              value={confirmPassword}
              onChange={(e) => handleConfirmChange(e.target.value)}
            />
          </p>
          {confirmError && <div className="field-error">{confirmError}</div>}

          {/*T&cs*/}
          <label className="terms">
            <input
              type="checkbox"
              checked={accepted}
              onChange={(e) => {
                setAccepted(e.target.checked);
                if (isSubmitted && e.target.checked) setAcceptedError('');
              }}
            />
            <span>I agree with the terms and conditions</span>
          </label>
          {acceptedError && <div className="field-error">{acceptedError}</div>}

          {/*Register-button*/}
          <button
            className="register-btn"
            onClick={handleRegister}
            disabled={!accepted}
          >
            Register
          </button>
        </div>

        <div className="ImageD">
          <img src={Slide2} alt="Slide2" />
        </div>
      </div>
    </div>
  );
};

export default Register;
