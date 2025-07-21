/// <reference types="vite-plugin-svgr/client" />
import { Link } from "react-router-dom";
import DogoWalker from "../assets/dogo-Walker.svg?react";
import { useEffect, useState} from "react";
import React from "react";
import { useAuth } from "./AuthContext"; // Import the AuthContext to access currentUser
import MenuIcon from "@mui/icons-material/Menu";

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
  const [isMenuOpen, setIsMenuOpen] = useState<boolean>(false);
  const [isScrolled, setIsScrolled] = useState<boolean>(false);
  let windowsWidth = window.innerWidth;

  useEffect(() => {
    const handleScroll = () => {
      // Check if page is scrolled more than 10px
      setIsScrolled(window.scrollY > 10);
    };

    window.addEventListener("scroll", handleScroll);
    handleScroll();
    console.log("Navbar useEffect, isScrolled");
    // Clean up
    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, [isScrolled]);

  useEffect(() => {
    windowsWidth = window.innerWidth;
    console.log("Navbar useEffect, windowsWidth");
  }, [window.innerWidth]);

  const signOutHandler = async () => {
    try {
      await signOutUser(); // Use the context's signOutUser function
    } catch (err) {
      console.error("Logout failed:", err);
    }
  };

  const handleMenuToggle = () => {
    const timer = setTimeout(() => {
      setIsMenuOpen(false);
    }, 100);
    return () => clearTimeout(timer);
  };

  const navbarItems: Record<string, NavbarItem> = {
    home: {
      name: "Doggo Walker",
      path: "/",
      onlyLoggedIn: false,
      id: "navbar-btn-home",
    },
    contact: {
      name: "Contact",
      path: "/",
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
          path: "/",
          id: "dropdown-settings",
        },
        {
          name: "Friends",
          path: "/",
          id: "dropdown-friends",
        },
      ],
    },
  };
  console.log("Navigation render, user ID:", currentUser?.firebaseUser.uid);
  return (
    <nav
      className={`  w-full overflow-visible sm:px-5 sm:py-1 self-center 
       sm:rounded-none border-b-0.5 border-gray-200 shadow-2xl sticky top-0 sm:top-0 z-50 backdrop-blur-2xl transition duration-600 
      ${
        isScrolled
          ? "bg-white backdrop-blur-lg border-gray-500/50 border-1 opacity-95"
          : "bg-neutral-200 border-1"
      }`}
    >
      <ul className="px-4 flex">
        <li className="flex items-center">
          <DogoWalker className=" h-10 w-10 sm:mr-4 my-1" />
        </li>
        <ul className="flex w-full relative">
          {Object.values(navbarItems).map(
            item =>
              item.onlyLoggedIn === !!currentUser && //button only shown if user is logged in
              (item.name === "Menu" ? ( // Dropdown menu for "Menu" item
                <ul className="h-full sm:absolute right-1" key={item.id}>
                  <button
                    className="navbar-Button text-lg h-full"
                    id={item.id}
                    onClick={() => setIsMenuOpen(!isMenuOpen)}
                  >
                    <span style={{ display: windowsWidth <= 400 ? "none" : "block" }}>
                      {item.name}
                    </span>
                    <MenuIcon
                      className="mx-5 "
                      style={{ display: windowsWidth > 400 ? "none" : "block" }}
                    />
                  </button>
                  {isMenuOpen && (
                    <div
                      onMouseLeave={() => setIsMenuOpen(false)}
                      onMouseUp={handleMenuToggle}
                      className="absolute right-0 top-0 pt-12 w-48 transition-all duration-1000 ease-in-out z-50"
                    >
                      <div className="py-1 bg-white rounded-md shadow-lg ring-1 ring-black ring-opacity-5">
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
        </ul>
        <li className="ml-auto items-center flex">
          {!!currentUser ? (
            <button
              className="px-4 py-2 flex bg-secondary text-font-primary rounded hover:bg-secondary-dark transition-all duration-300"
              onClick={signOutHandler}
            >
              {currentUser?.firebaseUser.photoURL ? (
                <img
                  src={currentUser?.firebaseUser.photoURL}
                  alt="Profile"
                  className="w-8 rounded-full aspect-square hover:hidden"
                />) : (
                  <></>
                
                )}
              <span className="w-full px-3 mt-0.5">Logout</span>
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
  );
};

export default Navigation;
