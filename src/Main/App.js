import { signOut } from "firebase/auth";
import React, { useEffect, useState } from "react";
import { Link, Route, Routes } from "react-router-dom";
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
import SignUp from "./Pages/SignUpPage";

function App3({ setUserData, userData }) {
  const [isAuth, setIsAuth] = useState(localStorage.getItem("isAuth"));
  const [showSidebar, setShowSidebar] = useState(false);
  const [loading, setLoading] = useState(false);

  const signUserOut = () => {
    signOut(auth).then(() => {
      localStorage.clear();
      setIsAuth(false);
      window.location.pathname = "/login";
    });
  };

  const toggleSidebar = () => {
    setShowSidebar((prevState) => !prevState);
  };
  useEffect(() => {
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
    }, 3000);
  }, []);
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
        <div className="bg-gray-200 h-screen flex">
            <ToastContainer />
            
          {/* Sidebar */}
          <div
            className={`bg-gray-800 text-white w-66 lg:block relative ${
              showSidebar ? "" : "hidden"
            }`}
          >
            <div className="p-4">
              <h1 className="text-[16px] font-bold font-mono">
                Time-Tracker-Web-Application
              </h1>
            </div>
            <nav>
              <Link to="/" className="block py-2 px-4 hover:bg-gray-700">
                Dashboard
              </Link>
              {!isAuth ? (
                <Link to="/login" className="block py-2 px-4 hover:bg-gray-700">
                  Login
                </Link>
              ) : (
                <>
                  <Link
                    to="/AddTask"
                    className="block py-2 px-4 hover:bg-gray-700"
                  >
                    Add Task
                  </Link>
                  <button
                    onClick={signUserOut}
                    className="block w-full py-2 px-4 bg-red-500 text-white hover:bg-red-600 mt-4"
                  >
                    Log Out
                  </button>
                </>
              )}
            </nav>
          </div>

          {/* Main content */}
          <div className="flex-1 bg-gray-100 flex flex-col">
            {/* Toggle Button */}
            <button onClick={toggleSidebar} className="lg:hidden p-2 ">
              {showSidebar ? (
                <img src={closeIcon} alt="Close Sidebar" className="w-6 h-6 closeBtn absolute ml-[-38px] rounded-full z-50 bg-white p-1" />
              ) : (
                <img src={openIcon} alt="Open Sidebar" className="w-6 h-6 openBtn absolute z-50 bg-white pl-1 pt-1 rounded-full mt-5" />
              )}
            </button>
            <div className="">
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
}

export default App3;
