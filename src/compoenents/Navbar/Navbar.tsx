import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import Cookies from 'js-cookie';
import './navbar.css';
import { useAuth } from '../../context/AuthContext.tsx';

const Navbar = () => {
  const { logout } = useAuth();
  const token = Cookies.get("token");

  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  const toggleSidebar = () => setIsSidebarOpen(!isSidebarOpen);

  const closeSidebar = () => setIsSidebarOpen(false);  

  return (
    <nav className="navigation">
      <h1 className="navbar-logo">TaskManager</h1>

      <div className={`hamburger-menu ${isSidebarOpen ? 'open' : ''}`} onClick={toggleSidebar}>
        <div className="bar"></div>
        <div className="bar"></div>
        <div className="bar"></div>
      </div>

     
      <div className={`navbarLinks-container ${isSidebarOpen ? 'hidden' : ''}`}>
        <ul className="navbarLinks">
          <li><Link style={{textDecoration:"none",color:"black"}} to="/">Login</Link></li>
          <li><Link style={{textDecoration:"none",color:"black"}} to="/signup">Signup</Link></li>
          {token && <li onClick={logout}>Logout</li>}
        </ul>
      </div>

    
      <div className={`sidebar ${isSidebarOpen ? 'open' : ''}`}>
        <div className="close-icon" onClick={closeSidebar}>x</div> {/* Close icon */}
        <ul className="navbarLinks">
          <li><Link style={{textDecoration:"none",color:"black"}} to="/">Login</Link></li>
          <li><Link style={{textDecoration:"none",color:"black"}} to="/signup">Signup</Link></li>
          {token && <li onClick={logout}>Logout</li>}
        </ul>
      </div>
    </nav>
  );
};

export default Navbar;
