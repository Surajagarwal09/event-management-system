import React from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import { Provider } from "react-redux";
import store from "./redux/Store";
import App from "./App";
import reportWebVitals from "./reportWebVitals";
import { UIProvider } from "./context/UIContext";
import { UserProvider } from "./context/UserContext";
import { AdminProvider } from "./context/AdminContext";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";


ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <UserProvider>
      <AdminProvider>
        <UIProvider>
          <Provider store={store}>
            <App />
            <ToastContainer
              position="bottom-right"
              autoClose={2000}
              theme="dark"
              draggable
              limit={2}
            />
          </Provider>
        </UIProvider>
      </AdminProvider>
    </UserProvider>
  </React.StrictMode>
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
