import React from 'react';
import { useNavigate } from 'react-router-dom';
import "./styles/Hero.css";
import social from "../assets/social.png";

const Hero = () => {
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem("token");
    sessionStorage.removeItem("token");
    navigate("/home");
  };

  return (
    <div className="hero-page">
      <button className="logout-btn" onClick={handleLogout}>
          Logout
      </button>
      <div className="content">
        <h1>Welcome!</h1>
        <p className="hero-subtext">You are successfully logged in</p>
      </div>
      <div className="Social">
        <img src={social} alt="social" />
      </div>
    </div>
  );
};

export default Hero;
