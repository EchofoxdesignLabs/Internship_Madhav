import React, { useState } from 'react'
import { Outlet, useNavigate, useLocation } from "react-router-dom";
import "./styles/Layout.css";
import logo from "../assets/logo.png"
import bg from "../assets/bg.jpg"


//used to navigate via path location
const Layout = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const [logout, setLogout] = useState(false);

  const handleLogoClick = () => {
    if (location.pathname === "/hero") {//navigate to logout popup if path location is from hero.jsx
      setLogout(true);
    } 
    else {
      navigate("/home");//navigate to home
    }
  };

  const handleLogout = () => {//removes login details from hero while navigates to home
    localStorage.removeItem("token");
    sessionStorage.removeItem("token");
    setLogout(false);
    navigate("/home");
  };

  return (
    <div>
      {/*Logo*/}
      <div className='Logo'>
        <img
          src={logo}
          alt='logo'
          onClick={handleLogoClick}
        />
      </div>

      {/*Logout-popup*/}
      {logout && (
          <div className="logout-box">
            <p>Are you sure you want to logout?</p>
            <button onClick={handleLogout}>Logout</button>
            <button onClick={() => setLogout(false)}>Cancel</button>
          </div>
      )}

      {/*background-image*/}
      <div className="background">
        <img src={bg} alt="background" />
      </div>

      <main>
        <Outlet />
      </main>
    </div>
  );
};

export default Layout;