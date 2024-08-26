import React from 'react';
import { Link } from 'react-router-dom';
import closeIcon from "../assets/close.svg";
const Sidebar = ({ showSidebar, toggleSidebar, signUserOut, isAuth }) => {
  return (
    <div
      className={`fixed top-0 left-0 h-full bg-gray-800 text-white z-50 transition-transform transform lg:relative lg:w-64 lg:h-auto lg:bg-gray-800 ${
        showSidebar ? 'translate-x-0' : '-translate-x-full'
      } lg:translate-x-0`}
    >
      {/* Close button only visible on small screens */}
      <div className="flex items-center justify-between p-4 lg:hidden">
        <h1 className="text-lg font-bold font-mono">
          Time-Tracker-Web-Application
        </h1>
        <button onClick={toggleSidebar}>
          <img
            src={closeIcon}
            alt="Close Sidebar"
            className="w-6 h-6 rounded-full bg-white p-1"
          />
        </button>
      </div>

      {/* Title always visible on larger screens */}
      <div className="p-4 hidden lg:block">
        <h1 className="text-lg font-bold font-mono">
          Time-Tracker-Web-Application
        </h1>
      </div>

      <nav className="mt-5">
        <Link
          to="/"
          className="block py-2 px-4 hover:bg-gray-700 transition-colors"
          onClick={toggleSidebar}
        >
          Dashboard
        </Link>
        {!isAuth ? (
          <Link
            to="/login"
            className="block py-2 px-4 hover:bg-gray-700 transition-colors"
            onClick={toggleSidebar}
          >
            Login
          </Link>
        ) : (
          <>
            <Link
              to="/AddTask"
              className="block py-2 px-4 hover:bg-gray-700 transition-colors"
              onClick={toggleSidebar}
            >
              Add Task
            </Link>
            <button
              onClick={() => {
                signUserOut();
                toggleSidebar(); // Close the sidebar after signing out
              }}
              className="block w-full py-2 px-4 bg-red-500 text-white hover:bg-red-600 transition-colors mt-10"
            >
              Log Out
            </button>
          </>
        )}
      </nav>
    </div>
  );
};



export default Sidebar;
