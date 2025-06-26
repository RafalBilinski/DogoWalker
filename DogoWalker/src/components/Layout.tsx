/// <reference types="vite-plugin-svgr/client" />
import { Link, Outlet } from "react-router-dom";
import DogoWalker from "../assets/dogo-Walker.svg?react";
import { useEffect, useState } from "react";
import React from "react";
import { useAuth } from "./AuthContext"; // Import the AuthContext to access currentUser
import MenuIcon from "@mui/icons-material/Menu";
import Navigation from "./Navigation";


const Layout: React.FC = () => {
  const { currentUser, signOutUser, error } = useAuth(); // Get currentUser directly from context
  
  console.log("Layout render, user:", currentUser?.firebaseUser.displayName);
  return (
    <div id="site" className="flex flex-col w-screen bg-background-primary ">
      <Navigation />
      <div
        className="container flex mx:0 mx-auto px-0 md:px-4 py-6 min-h-[calc(100vh-3rem)]"
        id="content"
      >
        <Outlet />
      </div>
    </div>
  );
};

export default Layout;
