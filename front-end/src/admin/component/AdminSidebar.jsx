import React, { useState, useEffect, useRef } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import "../css/AdminSidebar.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faTachometerAlt,
  faListUl,
  faFileCirclePlus,
  faUsers,
  faSignOut,
  faBars,
  faLocationCrosshairs,
  faLocationDot,
} from "@fortawesome/free-solid-svg-icons";
import { useUI } from "../../context/UIContext";
import { useAdmin } from "../../context/AdminContext";
import FullScreenLoader from "../../components/FullscreenLoader";
import { toast } from "react-toastify";

function AdminSidebar() {
  const location = useLocation();
  const navigate = useNavigate();
  const { isSidebarOpen: isOpen, toggleSidebar, setSidebarOpen } = useUI();
  const { adminName, logout } = useAdmin();
  const sidebarRef = useRef(null);
  const [loading, setLoading] = useState(false);

  const currentpagetitle = (path) => {
    if (path === "/admin/dashboard") return "Dashboard";
    if (path === "/admin/events") return "Event List";
    if (path === "/admin/events/new") return "Add New Event";
    if (path === "/admin/events/Addlocation") return "Add New Location";
    if (path === "/admin/users") return "All Users";
    if (path.includes("/admin/events/details/")) return "Event Details";
    if (path.includes("/admin/events/update/")) return "Update Event";
    if (path.includes("/admin/users/")) return "User Details";
    return "Admin Panel";
  };

  const currentPage = currentpagetitle(location.pathname);

  const handleLogout = () => {
    setLoading(true);
    setTimeout(() => {
      logout();
      navigate("/");
      toast.success("Logged out sucessfully!");
    }, 800);
  };

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (
        isOpen &&
        sidebarRef.current &&
        !sidebarRef.current.contains(e.target)
      ) {
        setSidebarOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [isOpen]);

  const isActive = (path) => {
    const current = location.pathname;

    if (
      path === "/admin/events" &&
      (current === "/admin/events" ||
        current.includes("/admin/events/details/") ||
        current.includes("/admin/events/update/"))
    ) {
      return true;
    }

    if (
      path === "/admin/users" &&
      (current === "/admin/users" || current.includes("/admin/users/"))
    ) {
      return true;
    }

    return current == path;
  };

  return (
    <>
      <div className="admin-topbar">
        <FontAwesomeIcon
          icon={faBars}
          className="bar-icon"
          onClick={toggleSidebar}
        />
        <span className="page-name">{currentPage}</span>
      </div>

      {isOpen && <div className="admin-overlay"></div>}

      <div className={`admin-sidebar ${isOpen ? "open" : ""}`} ref={sidebarRef}>
        <h2>Hello, {adminName}</h2>
        <hr className="adminhr" />
        <nav>
          <ul>
            <li className={isActive("/admin/dashboard") ? "active" : ""}>
              <Link to="/admin/dashboard">
                Dashboard &nbsp;
                <FontAwesomeIcon icon={faTachometerAlt} />
              </Link>
            </li>
            <li className={isActive("/admin/events") ? "active" : ""}>
              <Link to="/admin/events">
                Event List &nbsp;
                <FontAwesomeIcon icon={faListUl} />
              </Link>
            </li>
            <li className={isActive("/admin/events/new") ? "active" : ""}>
              <Link to="/admin/events/new">
                Add New Event &nbsp;
                <FontAwesomeIcon icon={faFileCirclePlus} />
              </Link>
            </li>
            <li className={isActive("/admin/events/location") ? "active" : ""}>
              <Link to="/admin/events/location">
                Locations &nbsp;
                <FontAwesomeIcon icon={faLocationDot} />
              </Link>
            </li>
            <li
              className={isActive("/admin/events/Addlocation") ? "active" : ""}
            >
              <Link to="/admin/events/Addlocation">
                Add New Location &nbsp;
                <FontAwesomeIcon icon={faLocationCrosshairs} />
              </Link>
            </li>
            <li className={isActive("/admin/users") ? "active" : ""}>
              <Link to="/admin/users">
                All Users &nbsp;
                <FontAwesomeIcon icon={faUsers} />
              </Link>
            </li>
          </ul>
        </nav>
        <div className="logout-button">
          {loading && <FullScreenLoader />}
          <button onClick={handleLogout}>
            <FontAwesomeIcon icon={faSignOut} /> Logout
          </button>
        </div>
      </div>
    </>
  );
}

export default AdminSidebar;
