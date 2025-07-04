import { createContext, useContext, useState, useEffect } from "react";

const UserContext = createContext();

export const UserProvider = ({ children }) => {
  const [user, setUser] = useState({
    token: null,
    fullName: null,
  });

  useEffect(() => {
    const token = localStorage.getItem("token");
    const fullName = localStorage.getItem("fullName");
    if (token && fullName) {
      setUser({ token, fullName });
    }
  }, []);

  const login = (token, fullName) => {
    localStorage.setItem("token", token);
    localStorage.setItem("fullName", fullName);
    setUser({ token, fullName });
  };

  const logout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("fullName");
    setUser({ token: null, fullName: null });
  };

  return (
    <UserContext.Provider value={{ user, login, logout }}>
      {children}
    </UserContext.Provider>
  );
};

export const useUser = () => useContext(UserContext);
