import React, { useEffect, useState } from "react";
import AdminSidebar from "../component/AdminSidebar";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import "../css/AllUsers.css";

function Allusers() {
  const [users, setUsers] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    axios.get("http://localhost:5000/api/users/all")
      .then((res) => setUsers(res.data))
      .catch((err) => console.error("Failed to fetch users:", err));
  }, []);

  const handleViewDetails = (userId) => {
    navigate(`/admin/users/${userId}/registration`);
  };

  return (
    <div className="admin-events">
      <AdminSidebar />

      <div className="user-list-container">
        <h1 className="user-list-title">All Registered Users</h1>

        <table className="user-table">
          <thead>
            <tr>
              <th>Full Name</th>
              <th>Email</th>
              <th>Total Registered Events</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody>
            {users.length > 0 ? users.map((user) => (
              <tr key={user._id}>
                <td>{user.fullname}</td>
                <td>{user.email}</td>
                <td>{user.registeredEventCount || 0}</td>
                <td>
                  <button 
                    className="user-details-button"
                    onClick={() => handleViewDetails(user._id)}
                  >
                    View Details
                  </button>
                </td>
              </tr>
            )) : (
              <tr>
                <td colSpan="4" style={{ textAlign: "center" }}>No users found.</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default Allusers;
