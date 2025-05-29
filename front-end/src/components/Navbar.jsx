import React, { useState, useEffect } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faHouse,faUser,faBars,faTachometerAlt,faClipboardList, faSignOutAlt } from "@fortawesome/free-solid-svg-icons";
import { Link, useLocation } from "react-router-dom";
import "../css/Navbar.css";
import Modal from "./Modal";
import LoginRegistration from "./LoginRegistration";
import SignupRegistration from "./SignupRegistration";
import AdminLogin from "../admin/pages/AdminLogin";
import AdminSignup from "../admin/pages/AdminSignup";

function Navbar() {
  const [showLoginRegistration, setShowLoginRegistration] = useState(false);
  const [showSignupRegistration, setShowSignupRegistration] = useState(false);
  const [fullname, setFullname] = useState(null);
  const [showSidebar, setShowSidebar] = useState(false);
  const [sidebarVisible, setSidebarVisibel] = useState(false);
  const location = useLocation();

  const [showAdminLogin, setShowAdminLogin] = useState(false);
  const [showAdminSignup, setShowAdminSignup] = useState(false);

  useEffect(() => {
    const name = localStorage.getItem("fullName");
    if (name) setFullname(name);
  }, []);

  useEffect(() => {
    const modalOpen =
      showLoginRegistration ||
      showSignupRegistration ||
      showAdminLogin ||
      showAdminSignup;
    document.body.style.overflow = modalOpen ? "hidden" : "auto";
    return () => {
      document.body.style.overflow = "auto";
    };
  }, [
    showLoginRegistration,
    showSignupRegistration,
    showAdminLogin,
    showAdminSignup,
  ]);

  const openSignupModal = () => {
    setShowLoginRegistration(false);
    setShowSignupRegistration(true);
  };

  const openLoginModal = () => {
    setShowSignupRegistration(false);
    setShowLoginRegistration(true);
  };

  const openAdminSignupModal = () => {
    setShowAdminLogin(false);
    setShowAdminSignup(true);
  };

  const openAdminLoginModal = () => {
    setShowAdminSignup(false);
    setShowAdminLogin(true);
  };

  const toggleSidebar = () => {
    if (!showSidebar) {
      setShowSidebar(true);
      setTimeout(() => {
        setSidebarVisibel(true);
      }, 10);
    } else {
      setSidebarVisibel(false);
      setTimeout(() => {
        setShowSidebar(false);
      }, 300);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("fullName");
    setFullname(null);
    setShowSidebar(false);
  };

  const handleLoginSuccess = (name) => {
    localStorage.setItem("fullname", name);
    setFullname(name);
    setShowLoginRegistration(false);
  };
  const handleAdminLoginSuccess = (adminName) => {
    localStorage.setItem("adminName", adminName);
    setShowAdminLogin(false);
    window.location.href = "/admin/dashboard";
  };

  return (
    <div className="navcompo">
      <div className="Navbar">
        <nav>
          <ul className="homebut">
            <li>
              <Link to="/" className="housebut">
                <FontAwesomeIcon icon={faHouse} /> Events
              </Link>
            </li>
          </ul>
          <h3>Events That Match Your Vibe</h3>
          <ul className="navul">
            {fullname ? (
              <li className="user-info" onClick={toggleSidebar}>
                <span>
                  <FontAwesomeIcon icon={faUser} /> Hi, {fullname}
                </span>
              </li>
            ) : (
              <>
                <li>
                  <button
                    onClick={() => setShowLoginRegistration(true)}
                    className="auth-button"
                  >
                    Sign In / Sign Up
                  </button>
                </li>
                <li className="hamburger-menu" onClick={toggleSidebar}>
                  <button>
                    <FontAwesomeIcon icon={faBars} />
                  </button>
                </li>
              </>
            )}
          </ul>
        </nav>
      </div>

      <Modal
        show={showLoginRegistration}
        onClose={() => setShowLoginRegistration(false)}
      >
        <LoginRegistration
          onClose={() => setShowLoginRegistration(false)}
          openSignup={openSignupModal}
          onLoginSuccess={handleLoginSuccess}
        />
      </Modal>

      <Modal
        show={showSignupRegistration}
        onClose={() => setShowSignupRegistration(false)}
      >
        <SignupRegistration
          onClose={() => setShowSignupRegistration(false)}
          openLoginModal={openLoginModal}
        />
      </Modal>

      <Modal show={showAdminLogin} onClose={() => setShowAdminLogin(false)}>
        <AdminLogin
          onClose={() => setShowAdminLogin(false)}
          onLoginSuccess={handleAdminLoginSuccess}
          openSignup={openAdminSignupModal}
        />
      </Modal>

      <Modal show={showAdminSignup} onClose={() => setShowAdminSignup(false)}>
        <AdminSignup
          onClose={() => setShowAdminSignup(false)}
          openLoginModal={openAdminLoginModal}
        />
      </Modal>

      {showSidebar && (
        <>
          <div className="sidebar-overlay" onClick={toggleSidebar} />
          <div
            className={`sidebar ${sidebarVisible ? "open" : ""}`}
            onClick={(e) => e.stopPropagation()}
          >
            <div className="username">
              <span>Hi, {fullname ? fullname : "User"}</span>
              <hr className="hrtag" />
            </div>

            <div className="sidebarbutton">
              <Link
                to="/myregistrations"
                className={`side-nav-link ${!fullname ? "disabled-link" : ""}${location.pathname === "/myregistrations" ? "active-link" : ""}`}
                onClick={(e) => {
                  if (!fullname) {
                    e.preventDefault();
                  } else {
                    setShowSidebar(false);
                  }
                }}
              >
                <FontAwesomeIcon icon={faClipboardList} /> My Registrations
              </Link>

              <button className="dashboardbut" onClick={() => { setShowAdminLogin(true); setShowSidebar(false); }}>
              <FontAwesomeIcon icon={faTachometerAlt} /> &nbsp; Dashboard
              </button>
            </div>

            {fullname && (
              <div className="logout">
                <button onClick={handleLogout}>
                  <FontAwesomeIcon icon={faSignOutAlt} /> Logout
                </button>
              </div>
            )}
          </div>
        </>
      )}
    </div>
  );
}

export default Navbar;
