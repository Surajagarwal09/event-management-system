import React, { useState, useEffect } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faCalendarDay,
  faUser,
  faBars,
  faTachometerAlt,
  faClipboardList,
  faSignOutAlt,
} from "@fortawesome/free-solid-svg-icons";
import { Link, useLocation, useNavigate } from "react-router-dom";
import "../css/Navbar.css";
import Modal from "./Modal";
import LoginRegistration from "./LoginRegistration";
import SignupRegistration from "./SignupRegistration";
import AdminLogin from "../admin/pages/AdminLogin";
import AdminSignup from "../admin/pages/AdminSignup";
import { useUser } from "../context/UserContext";
import ButtonLoader from "./ButtonLoader";
import { toast } from "react-toastify";

function Navbar() {
  const [showLoginRegistration, setShowLoginRegistration] = useState(false);
  const [showSignupRegistration, setShowSignupRegistration] = useState(false);
  const { user, logout } = useUser();
  const [showSidebar, setShowSidebar] = useState(false);
  const [sidebarVisible, setSidebarVisibel] = useState(false);
  const location = useLocation();
  const [showAdminLogin, setShowAdminLogin] = useState(false);
  const [showAdminSignup, setShowAdminSignup] = useState(false);
  const navigate = useNavigate();
  const [buttonloading, setButtonloading] = useState(false);

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
    setButtonloading(true);
    setTimeout(() => {
      logout();
      setShowSidebar(false);
      navigate("/");
      setButtonloading(false);
      toast.success("Logged out successfully!");
    }, 800);
  };

  return (
    <div className="navcompo">
      <div className="Navbar">
        <nav>
          <ul className="homebut">
            <li>
              <Link to="/" className="housebut">
                <FontAwesomeIcon icon={faCalendarDay} /> Events
              </Link>
            </li>
          </ul>
          <h3>Events for You</h3>
          <ul className="navul">
            {user.fullName ? (
              <li className="user-info" onClick={toggleSidebar}>
                <span>
                  <FontAwesomeIcon icon={faUser} /> Profile
                </span>
              </li>
            ) : (
              <>
                <li className="signin-out">
                  <button
                    onClick={() => setShowLoginRegistration(true)}
                    className="auth-button"
                  >
                    Sign In
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
              <span>Hi, {user.fullName ? user.fullName : "User"}</span>
              <hr className="hrtag" />
            </div>

            <div className="sidebarbutton">
              <Link
                to="/myregistrations"
                className={`side-nav-link ${
                  !user.fullName ? "disabled-link" : ""
                }${
                  location.pathname === "/myregistrations" ? "active-link" : ""
                }`}
                onClick={(e) => {
                  if (!user.fullName) {
                    e.preventDefault();
                  } else {
                    setShowSidebar(false);
                  }
                }}
              >
                <FontAwesomeIcon icon={faClipboardList} /> My Registrations
              </Link>

              <button
                className="dashboardbut"
                onClick={() => {
                  setShowAdminLogin(true);
                  setShowSidebar(false);
                }}
              >
                <FontAwesomeIcon icon={faTachometerAlt} /> &nbsp; Dashboard
              </button>
            </div>

            {user.fullName && (
              <div className="logout">
                <ButtonLoader
                  onClick={handleLogout}
                  loading={buttonloading}
                  type="submit"
                  className="userLogout-btn"
                >
                  <FontAwesomeIcon icon={faSignOutAlt} /> Logout
                </ButtonLoader>
              </div>
            )}
          </div>
        </>
      )}
    </div>
  );
}

export default Navbar;
