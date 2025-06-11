/// <reference types="vite-plugin-svgr/client" />

import { Link, Outlet } from "react-router-dom";
import DogoWalker from "../assets/dogo-Walker.svg?react";
import { useEffect, useState } from "react";
import React from "react";
import { useAuth } from "./AuthContext"; // Import the AuthContext to access currentUser

interface DropdownItem {
  name: string;
  path: string;
  id: string;
}

interface NavbarItem {
  name: string;
  path: string;
  onlyLoggedIn: boolean;
  id: string;
  dropdownItems?: DropdownItem[];
}

const Navigation: React.FC = () => {
  const { currentUser, signOutUser } = useAuth(); // Get currentUser directly from context
  const [isUserLoggedIn, setIsUserLoggedIn] = useState<boolean>(false);
  const [isMenuOpen, setIsMenuOpen] = useState<boolean>(false);

  useEffect(() => {
    setIsUserLoggedIn(!!currentUser); // Convert to boolean using !!
  }, [currentUser]); // This will run whenever currentUser changes in the context

  const signOutHandler = async () => {
    try {
      await signOutUser(); // Use the context's signOutUser function
    } catch (error) {
      console.error("Logout failed:", error);
    }
  };

  const handleMenuToggle = () => {
    const timer = setTimeout(() => {
      setIsMenuOpen(false)
    }, 100);
    return () => clearTimeout(timer);
  }

  const navbarItems: Record<string, NavbarItem> = {
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
      path: "/menu",
      onlyLoggedIn: true,
      id: "navbar-btn-Menu",
      dropdownItems: [
        {
          name: "Profile",
          path: "/profile",
          id: "dropdown-profile",
        },
        {
          name: "Settings",
          path: "/settings",
          id: "dropdown-settings",
        },
        {
          name: "Friends",
          path: "/friends",
          id: "dropdown-friends",
        },
      ],
    },
  };
  console.log("Navbar render, user:", currentUser?.firebaseUser.displayName);
  return (
    <div id="site" className="flex flex-col w-screen bg-background-primary ">
      <nav className="w-fit overflow-visible px-5 self-center 
      rounded-xl bg-neutral-200 border-b-0.5 border-gray-200 shadow-2xl sticky top-2 z-50 backdrop-blur-2xl">
        <ul className="px-4 flex">
          <li className="flex items-center">
            <DogoWalker className=" h-10 w-10 sm:mr-4 my-1" />
          </li>
          <li className="flex">
            {Object.values(navbarItems).map(
              item =>
                item.onlyLoggedIn === isUserLoggedIn &&       //button only shown if user is logged in
                (item.name === "Menu" ? (                     // Dropdown menu for "Menu" item
                  <ul className=" flex items-center h-full" key={item.id}>
                    <button className="navbar-Button text-lg" id={item.id} onClick={() => setIsMenuOpen(!isMenuOpen)}>
                      {item.name}
                    </button>
                    {isMenuOpen && (
                      <div onMouseLeave={()=>setIsMenuOpen(false)} 
                      onMouseUp={handleMenuToggle}
                      className="absolute right-0 top-0 pt-12 w-48 transition-all duration-1000 ease-in-out">
                        <div className="py-1 bg-white rounded-md shadow-lg  ring-1 ring-black ring-opacity-5">
                          {item.dropdownItems?.map(dropdownItem => (
                            <Link
                              key={dropdownItem.id}
                              id={dropdownItem.id}
                              to={dropdownItem.path}
                              className="block px-4 py-2 text-sm text-gray-700 hover:bg-white"
                            >
                              {dropdownItem.name}
                            </Link>
                          ))}
                        </div>
                      </div>
                    )}
                  </ul>
                ) : (
                  <li key={item.id} className="flex items-center">
                    <button className="navbar-Button">
                      <Link to={item.path} id={item.id} className="text-lg font-semibold">
                        {item.name}
                      </Link>
                    </button>
                  </li>
                ))
            )}
          </li>
          <li className="ml-auto items-center hidden sm:flex">
            {isUserLoggedIn ? (
              <button
                className="px-4 py-2 bg-secondary text-font-primary rounded hover:bg-secondary-dark transition-all duration-300"
                onClick={signOutHandler}
              >
                Logout
              </button>
            ) : (
              <Link
                to="/login"
                className="px-4 py-2 bg-secondary-dark text-font-primary rounded hover:bg-secondary-light transition-all duration-300"
              >
                Login
              </Link>
            )}
          </li>
        </ul>
      </nav>
      <div
        className="container flex mx:0 mx-auto px-0 md:px-4 py-6 min-h-[calc(100vh-3rem)]"
        id="content"
      >
        <Outlet />
      </div>
    </div>
  );
};

export default Navigation;
