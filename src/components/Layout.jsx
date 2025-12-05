import { Link, useNavigate } from "react-router-dom";
import "./Layout.css";
import logo from "../assets/logo.png";
import { useState, useEffect } from "react";

// Not USED anymore - moved to MainRouter.jsx

function Layout() {
  const navigate = useNavigate();

  const getUserFromStorage = () => {
    const token = localStorage.getItem("token");
    const username = localStorage.getItem("username");
    return token && username ? {token, username} : null;  
  }

  const [user, setUser] = useState(getUserFromStorage());

  useEffect(() => {
    setUser(getUserFromStorage());
  }, []);

  const handleSignout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("username");
    setUser(null);
    
  };

  return (
    <div className="navspace">
      <nav className="navbar">
        <div className="logo-div">
          <Link to="/">
            <img src={logo} alt="RT Logo" className="logo" />
          </Link>
        </div>

        <Link to="/">Home</Link> |  
        <Link to="/about">About</Link> |  
        <Link to="/projects">Projects</Link> |  
        <Link to="/education">Education</Link> |  
        <Link to="/services">Services</Link> |  
        <Link to="/contact">Contact</Link> |

        {user ? (
          <>
            <span className="nav-username">Hello, {user.username}</span> |{" "}
            <button onClick={handleSignout}>Logout</button>
          </>
        ) : (
          <>
            <Link to="/signup">Signup</Link>
            <Link to="/signin">Signin</Link>
          </>
        )}
      </nav>
    </div>
  );
}

export default Layout;
