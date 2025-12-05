import { Routes, Route, Link, useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import "./components/Layout.css";   // adjust if file is elsewhere
import logo from "./assets/logo.png";

import About from "./components/About";
import Home from "./components/Home";
import Contact from "./components/Contact";
import Education from "./components/Education";
import Projects from "./components/Projects";
import Services from "./components/Services";
import Signup from "./components/Signup";
import Signin from "./components/Signin";

const MainRouter = () => {
  const navigate = useNavigate();

  const getUserFromStorage = () => {
    const token = localStorage.getItem("token");
    const username = localStorage.getItem("username");
    return token && username ? { token, username } : null;
  };

  const [user, setUser] = useState(getUserFromStorage());

  useEffect(() => {
    setUser(getUserFromStorage());
  }, []);

  const handleSignout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("username");
    setUser(null);
    navigate("/");
  };

  return (
    <div className="navspace">
      {/* Navbar */}
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
            <Link to="/signup">Signup</Link> |
            <Link to="/signin">Signin</Link>|
          </>
        )}
      </nav>

      {/* Routes */}
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/about" element={<About />} />
        <Route path="/contact" element={<Contact />} />
        <Route path="/education" element={<Education />} />
        <Route path="/projects" element={<Projects />} />
        <Route path="/services" element={<Services />} />
        <Route path="/signup" element={<Signup setUser={setUser} />} />
        <Route path="/signin" element={<Signin setUser={setUser} />} />
      </Routes>
    </div>
  );
};

export default MainRouter;