/// <reference types="vite-plugin-svgr/client" />

import { Link, Outlet } from "react-router-dom";
import DogoWalker from "../assets/dogo-Walker.svg?react";
import { useEffect, useState } from "react";
import React, { } from 'react';
import { useAuth } from "./AuthContext"; // Import the AuthContext to access currentUser



const Navigation: React.FC = () => {
  const { currentUser, signOutUser } = useAuth(); // Get currentUser directly from context
  const [isUserLoggedIn, setIsUserLoggedIn] = useState<boolean>(false);

  useEffect(() => {
    setIsUserLoggedIn(!!currentUser); // Convert to boolean using !!
  }, [currentUser]); // This will run whenever currentUser changes in the context

  const signOutHandler = async () => {
    try {
      await signOutUser(); // Use the context's signOutUser function
    } catch (error) {
      console.error('Logout failed:', error);
    }
  };

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
      name: "Menu",
      path: "/about",
      onlyLoggedIn: true,
      id: "navbar-btn-about",
    },
  };
  console.log("Navbar render, user:", currentUser?.firebaseUser.displayName);
  return (
    <div  id="site" className="flex flex-col w-screen bg-gray-600 ">
      <nav className="w-fit overflow-visible px-5 self-center rounded-xl bg-neutral-100 border-b-0.5 border-gray-200 shadow-2xl sticky top-2 z-50 backdrop-blur-2xl">
        <div className="px-4  flex">
          <DogoWalker className=" h-10 w-10 sm:mr-4 my-1 self-center" />
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
          <div className="ml-auto items-center hidden sm:flex">
            {isUserLoggedIn ? (
              <button className="px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600 " onClick={signOutHandler}>
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
      <div className="container flex mx:0 mx-auto px-0 md:px-4 py-6 h-[calc(100vh-3rem)]" id="content">
        <Outlet />
      </div>
    </div>
  );
};

export default Navigation;
