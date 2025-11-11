import React from 'react'
import "./styles/Home.css";
import social from "../assets/social.png";
import Slide from "../assets/Slide.png";
import { useLocation, useNavigate } from 'react-router-dom';


const Home = () => {
    const location = useLocation();
    const navigate = useNavigate();
    const fromRegister = location.state?.fromRegister;
  return (
    <div>
      <div className="content">
        {fromRegister ? (
          <>
            <h1>Successfull Registered!</h1>
            <p>Click here to get started</p>
            <button className="start-btn" onClick={() => navigate("/home")} >Get Started!</button>
          </>
        ) : (
        <>
        <h1>Hey there!</h1>
        <p>Your next move starts here</p>
        <button className="start-btn" onClick={() => navigate("/login")} >Get Started!</button>
        </>
        )}
      </div>
      <div className="Slide">
        <img src={Slide} alt='Slide'/>
      </div>
      <div className="Social">
        <img src={social} alt='social'/>
      </div>
    </div>
  )
}

export default Home
