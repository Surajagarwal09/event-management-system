import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import AdminSidebar from "../component/AdminSidebar";
import "../css/AdminDashboard.css";
import axios from "axios";
import FullScreenLoader from "../../components/FullscreenLoader";

function Dashboard() {
  const [totalEvents, setTotalEvents] = useState(0);
  const [totalRegisteredUsers, setTotalRegisteredUsers] = useState(0);
  const [topEvents, setTopEvents] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDashboardData = async () => {
      // await new Promise((resolve) => setTimeout(resolve, 1000));
      try {
        const res = await axios.get(
          `${process.env.REACT_APP_BACKEND_URL}/api/events/admin/dashboard`
        );
        setTotalEvents(res.data.totalEvents);
        setTotalRegisteredUsers(res.data.totalRegisteredUsers);
        setTopEvents(res.data.topEvents);
      } catch (error) {
        console.error("Failed to fetch dashboard data:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardData();
  }, []);

  return (
    <div className="dashboard">
      <AdminSidebar />

      <div className="dashboard-content">
        {loading ? (
          <FullScreenLoader />
        ) : (
          <>
            <h1>Analytics:</h1>
            <div className="stats-boxes">
              <div className="stat-box">
                <h3>Total Events</h3>
                <p>{totalEvents.toString().padStart(2, "0")}</p>
              </div>
              <div className="stat-box">
                <h3>Total Users Registered</h3>
                <p>{totalRegisteredUsers.toString().padStart(2, "0")}</p>
              </div>
            </div>

            <h1 className="section-title">Top Events by Registered Users:</h1>
            <div className="event-cards">
              {topEvents.map((event) => (
                <Link
                  to={`/admin/events/details/${event.id}`}
                  key={event.id}
                  className="event-card"
                >
                  <h3>{event.name}</h3>
                  <p>Date: {event.date}</p>
                  <p className="total-reg">
                    Registered: {event.registeredUsers}
                  </p>
                </Link>
              ))}
            </div>
          </>
        )}
      </div>
    </div>
  );
}

export default Dashboard;
