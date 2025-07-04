import React from 'react';
import { createBrowserRouter, RouterProvider } from 'react-router-dom';

import EventList from './pages/EventList';
import EventDetail from './pages/EventDetail';
import SignupRegistration from './components/SignupRegistration';
import LoginRegistration from './components/LoginRegistration';
import MyRegistrations from './pages/MyRegistrations';
import RequireUserAuth from './components/UserLoginreq';

import AdminLogin from './admin/pages/AdminLogin';
import AdminSignup from './admin/pages/AdminSignup';
import Dashboard from './admin/pages/Dashboard';
import AdminEvents from './admin/pages/AdminEvents';
import AddEvent from './admin/pages/AddEvent';
import AllLocations from './admin/pages/AllLocation';
import Addlocation from './admin/pages/AddLocation';
import AdminEventDetails from './admin/pages/AdminEventDetails';
import UpdateEvent from './admin/component/UpdateEvent';
import Allusers from './admin/pages/Allusers';
import UserRegisteration from './admin/pages/UserRegisteration';
import RequireAdminAuth from "./admin/component/AdminLoginReq";

function App() {
  const router = createBrowserRouter([
    {
      path: "/",
      element: <EventList />,
    },
    {
      path: "/myregistrations",
      element: (
        <RequireUserAuth>
          <MyRegistrations />
        </RequireUserAuth>
      )
    },
    {
      path: "/eventdetails/:id",
      element: <EventDetail />,
    },
    {
      path: "/signup",
      element: <SignupRegistration />,
    },
    {
      path: "/login",
      element: <LoginRegistration />,
    },

    {
      path: "/admin/login",
      element: <AdminLogin />,
    },
    {
      path: "/admin/signup",
      element: <AdminSignup />,
    },
    {
      path: "/admin/login",
      element: <AdminLogin />,
    },
    {
      path: "/admin/signup",
      element: <AdminSignup />,
    },
    {
      path: "/admin/dashboard",
      element: (
        <RequireAdminAuth>
          <Dashboard />
        </RequireAdminAuth>
      ),
    },
    {
      path: "/admin/events",
      element: (
        <RequireAdminAuth>
          <AdminEvents />
        </RequireAdminAuth>
      ),
    },
    {
      path: "/admin/events/new",
      element: (
        <RequireAdminAuth>
          <AddEvent />
        </RequireAdminAuth>
      ),
    },
    {
      path: "/admin/events/location",
      element: (
        <RequireAdminAuth>
          <AllLocations/>
        </RequireAdminAuth>
      )
    },
    {
      path: "/admin/events/Addlocation",
      element: (
        <RequireAdminAuth>
          <Addlocation/>
        </RequireAdminAuth>
      )
    },
    {
      path: "/admin/events/details/:id",
      element: (
        <RequireAdminAuth>
          <AdminEventDetails />
        </RequireAdminAuth>
      ),
    },
    {
      path: "/admin/events/update/:id",
      element: (
        <RequireAdminAuth>
          <UpdateEvent />
        </RequireAdminAuth>
      ),
    },
    {
      path: "/admin/users",
      element: (
        <RequireAdminAuth>
          <Allusers />
        </RequireAdminAuth>
      ),
    },
    {
      path: "/admin/users/:userId/registration",
      element: (
        <RequireAdminAuth>
          <UserRegisteration />
        </RequireAdminAuth>
      ),
    }
  ]);

  return (
    <div className="App">
      <RouterProvider router={router} />
    </div>
  );
}

export default App;
