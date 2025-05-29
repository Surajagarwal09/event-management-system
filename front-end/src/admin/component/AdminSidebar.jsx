import React, { useState, useEffect } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import "../css/AdminSidebar.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faTachometerAlt, faListUl, faFile, faUsers, faSignOut } from "@fortawesome/free-solid-svg-icons";

function AdminSidebar() {
  const location = useLocation();
  const navigate = useNavigate();
  
  const [adminName, setAdminName] = useState(null)
  const isActive = (path) => location.pathname === path;

  useEffect(() => {
      const name = localStorage.getItem("adminName");
      if (name) setAdminName(name);
    }, []);

  const handleLogout = () => {
    localStorage.removeItem("adminToken");
    localStorage.removeItem("adminName");
    navigate("/");
  };

  return (
    <div className="admin-sidebar">
      <h2>Hello, {adminName}</h2><hr className="adminhr"/>
      <nav>
        <ul>
          <li className={isActive("/") ? "active" : ""}>
            <Link to="/admin/dashboard">Dashboard &nbsp;<FontAwesomeIcon icon={faTachometerAlt} /></Link>
          </li>
          <li className={isActive("/admin/events") ? "active" : ""}>
            <Link to="/admin/events">Event List &nbsp;<FontAwesomeIcon icon={faListUl} /></Link>
          </li>
          <li className={isActive("/admin/events/new") ? "active" : ""}>
            <Link to="/admin/events/new">Add New Event &nbsp;<FontAwesomeIcon icon={faFile} /></Link>
          </li>
          <li className={isActive("/admin/users") ? "active" : ""}>
            <Link to="/admin/users">All Users &nbsp;<FontAwesomeIcon icon={faUsers} /></Link>
          </li>
        </ul>
      </nav>
      <div className="logout-button">
        <button onClick={handleLogout}><FontAwesomeIcon icon={faSignOut}/> Logout</button>
      </div>
    </div>
  );
}

export default AdminSidebar;
