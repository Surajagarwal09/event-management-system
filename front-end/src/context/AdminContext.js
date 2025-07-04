import { createContext, useContext, useState, useEffect } from "react";

const AdminContext = createContext();

export const AdminProvider = ({ children }) => {
  const [admin, setAdmin] = useState({
    adminToken: null,
    adminName: null,
  });

  useEffect(() => {
    const token = localStorage.getItem("adminToken");
    const name = localStorage.getItem("adminName");
    if (token && name) {
      setAdmin({ adminToken: token, adminName: name });
    }
  }, []);

  const login = (token, name) => {
    localStorage.setItem("adminToken", token);
    localStorage.setItem("adminName", name);
    setAdmin({ adminToken: token, adminName: name });
  };

  const logout = () => {
    localStorage.removeItem("adminToken");
    localStorage.removeItem("adminName");
    setAdmin({ adminToken: null, adminName: null });
  };

  return (
    <AdminContext.Provider value={{ ...admin, login, logout }}>
      {children}
    </AdminContext.Provider>
  );
};

export const useAdmin = () => useContext(AdminContext);
