/// <reference types="vite-plugin-svgr/client" />

import { Link, Outlet } from "react-router-dom";
import { getAuth, onAuthStateChanged } from "firebase/auth";
import DogoWalker from "../assets/dogo-Walker.svg?react";
//import { useAuth } from '../contexts/AuthContext';
//import React, { } from 'react';

const Navigation: React.FC = () => {
  const { currentUser } = getAuth(); //useAuth();
  const isUserLoggedIn = currentUser !== null;
  console.log("is user logged?", isUserLoggedIn);

  const navbarItems = {
    home: {
      name: "Doggo Walker",
      path: "/",
      onlyLoggedIn: false,
      id: "navbar-btn-home",
    },
    contact: {
      name: "Contact",
      path: "/contact",
      onlyLoggedIn: false,
      id: "navbar-btn-contact",
    },
    home2: {
      name: "Doggo Walker",
      path: "/home2",
      onlyLoggedIn: true,
      id: "navbar-btn-home2",
    },
    about: {
      name: "About",
      path: "/about",
      onlyLoggedIn: true,
      id: "navbar-btn-about",
    },
  };
  console.log(currentUser);
  return (
    <div className="flex flex-col h-max w-screen bg-gray-600">
      <nav className="w-fit px-5 self-center rounded-xl bg-neutral-100 border-b-0.5 border-gray-200 shadow-md sticky top-2 z-50 backdrop-blur-2xl">
        <div className="px-4  flex">
          <DogoWalker className=" h-10 w-10 mr-4 my-1 self-center" />
          <div className="flex ">
            {Object.values(navbarItems).map(
              (item) =>
                item.onlyLoggedIn === isUserLoggedIn && (
                  <button key={item.id} className="navbar-Button">
                    <Link
                      to={item.path}
                      id={item.id}
                      className="text-lg font-semibold"
                    >
                      {item.name}
                    </Link>
                  </button>
                )
            )}
          </div>
          <div className="ml-auto flex items-center">
            {isUserLoggedIn ? (
              <button className="px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600">
                Logout
              </button>
            ) : (
              <Link
                to="/login"
                className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
              >
                Login
              </Link>
            )}
          </div>
        </div>
      </nav>
      <div className="container mx-auto px-4 py-6 h-max-screen">
        <Outlet />
      </div>
    </div>
  );
};

export default Navigation;
