/// <reference types="vite-plugin-svgr/client" />
import { Outlet } from "react-router-dom";
import React from "react";
import { useAuth } from "./AuthContext"; // Import the AuthContext to access currentUser
import Navigation from "./Navigation";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";


const Layout: React.FC = () => {
  const { currentUser } = useAuth(); // Get currentUser directly from context  
  
  console.log("Layout render, user:", currentUser?.firebaseUser.displayName);
  return (
    <div id="site" className="flex flex-col w-screen bg-background-primary ">
      <Navigation />
      <main
        className="container flex mx:0 mx-auto px-0 md:px-4 py-6 min-h-[calc(100vh-3rem)]"
        id="content"
      >
        <Outlet />
      </main>
       {/* Toast Container - position in bottom right, auto close after 10s */}
      <ToastContainer
        position="bottom-right"
        autoClose={10000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        toastStyle={{ backgroundColor: "transparent", backdropFilter: "blur(10px)", color: "white" }}
        draggable
        pauseOnHover
      />
    </div>
  );
};

export default Layout;
