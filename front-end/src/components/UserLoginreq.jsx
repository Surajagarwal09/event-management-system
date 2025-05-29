import React from "react";
import { Navigate } from "react-router-dom";

const RequireUserAuth = ({ children }) => {
  const userToken = localStorage.getItem("token"); 

  if (!userToken) {
    return <Navigate to="/" replace />;
  }

  return children;
};

export default RequireUserAuth;
