import { signOut } from "firebase/auth";
import React, { useEffect, useState } from "react";
import { Route, Routes, useLocation } from "react-router-dom";
import ClipLoader from "react-spinners/ClipLoader";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import closeIcon from "./assets/close.svg";
import openIcon from "./assets/menu.svg";
import { auth } from "./firebase-config";
import AddTask from "./Pages/AddTask";
import Dashboard from "./Pages/Dashboard";
import ForgotPassword from "./Pages/ForgotPassord";
import Login from "./Pages/Login";
import Sidebar from "./Pages/Sidebar";
import SignUp from "./Pages/SignUpPage";

const App3 = ({ setUserData, userData }) => {
  const [isAuth, setIsAuth] = useState(localStorage.getItem("isAuth"));
  const [showSidebar, setShowSidebar] = useState(false);
  const [loading, setLoading] = useState(false);
  const location = useLocation();

  const signUserOut = () => {
    signOut(auth).then(() => {
      localStorage.clear();
      setIsAuth(false);
      window.location.pathname = "/login";
    });
  };

  const toggleSidebar = () => {
    setShowSidebar(!showSidebar);
  };

  useEffect(() => {
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
    }, 3000);
  }, []);

  // const showSidebarCondition = location.pathname === "/";
  // Adjust showSidebarCondition to include all relevant paths
  const showSidebarCondition = ["/", "/AddTask"].includes(location.pathname);

  return (
    <>
      {loading ? (
        <div className="flex items-center justify-center h-screen">
          <ClipLoader
            color="#36d7b7"
            loading={loading}
            size={50}
            aria-label="Loading Spinner"
            data-testid="loader"
          />
        </div>
      ) : (
        <div className="lg:flex lg:h-screen">
          <ToastContainer />

          {/* Sidebar */}
          <Sidebar
            showSidebar={showSidebar}
            toggleSidebar={toggleSidebar}
            signUserOut={signUserOut}
            isAuth={isAuth}
          />

          {/* Main content */}
          <div className="flex-1 flex flex-col">
            {/* Toggle Button */}
            {showSidebarCondition && (
              <button onClick={toggleSidebar} className="lg:hidden p-2 ml-1">
                {showSidebar ? (
                  <img
                    src={closeIcon}
                    alt="Close Sidebar"
                    className="w-6 h-6 mt-2"
                  />
                ) : (
                  <div className="flex justify-start">
                    <div>
                      <img
                        src={openIcon}
                        alt="Open Sidebar"
                        className="w-6 h-6 mt-1"
                      />
                    </div>
                    <div>
                      <h1 className="text-[21px] sm:text[14px] font-bold font-mono">
                        Time-Tracker-Web-Application
                      </h1>
                    </div>
                  </div>
                )}
              </button>
            )}
            <div className="p-4 flex-1 overflow-y-auto">
              <Routes>
                <Route path="/">
                  <Route
                    index
                    element={<Dashboard isAuth={isAuth} userData={userData} />}
                  />
                  <Route
                    path="/AddTask"
                    element={
                      <AddTask isAuth={isAuth} setUserData={setUserData} />
                    }
                  />
                  <Route
                    path="/login"
                    element={
                      <Login setIsAuth={setIsAuth} setUserData={setUserData} />
                    }
                  />
                  <Route
                    path="/SignUp"
                    element={
                      <SignUp setIsAuth={setIsAuth} setUserData={setUserData} />
                    }
                  />
                </Route>
                <Route
                  path="/ForgotPassword"
                  element={
                    <ForgotPassword setIsAuth={setIsAuth} userData={userData} />
                  }
                />
              </Routes>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default App3;
