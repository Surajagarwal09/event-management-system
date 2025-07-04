import React, { useEffect, useState } from "react";
import AdminSidebar from "../component/AdminSidebar";
import axios from "axios";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faEye } from "@fortawesome/free-solid-svg-icons";
import { useNavigate } from "react-router-dom";
import "../css/AllUsers.css";

function Allusers() {
  const [users, setUsers] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    axios
      .get("http://localhost:5000/api/users/all")
      .then((res) => setUsers(res.data))
      .catch((err) => console.error("Failed to fetch users:", err));
  }, []);

  const handleViewDetails = (userId) => {
    navigate(`/admin/users/${userId}/registration`);
  };

  return (
    <div className="admin-events">
      <AdminSidebar />
      <div className="user-list-title">
        <h1>All Registered Users</h1>
      </div>
      <div className="user-list-container">
        <table className="user-table">
          <thead>
            <tr>
              <th className="email-th">User</th>
              <th className="eventreg-th">Events Reg.</th>
              <th className="action-head">Action</th>
            </tr>
          </thead>
          <tbody>
            {users.length > 0 ? (
              users.map((user) => (
                <tr key={user._id}>
                  <td className="email-td">
                    {user.email}
                    <button
                      className="user-details-mobile-button"
                      onClick={() => handleViewDetails(user._id)}
                    >
                      <FontAwesomeIcon icon={faEye} />
                    </button>
                  </td>
                  <td className="eventreg-th">
                    {user.registeredEventCount || 0}
                  </td>
                  <td className="user-details-button-td">
                    <button
                      className="user-details-button"
                      onClick={() => handleViewDetails(user._id)}
                    >
                      View Details
                    </button>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="4" style={{ textAlign: "center" }}>
                  No users found.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default Allusers;
