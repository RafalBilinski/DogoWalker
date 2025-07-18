import "./App.tailwind.css";
import { lazy, useEffect, Suspense } from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import HomePage  from "./components/HomePage"; 
import HomePage2 from "./components/InternalHomePage"; 
import { AuthProvider } from "./components/AuthContext";
import Navigation from "./components/Navigation";


const Login = lazy(() => import( "./components/Login"));
const Explore = lazy(() => import("./components/Explore")); 
const Profile = lazy(() => import("./components/Profile")); 

const ToastContainer = lazy(() => import("react-toastify")
  .then(module => ({ 
    default: module.ToastContainer 
  }))
);


function App() {
  useEffect(() => {
    // Funkcja do preloadowania komponentów po załadowaniu strony
    const preloadComponents = () => {
      // Preload komponentów w tle
      const preloads = [
        import("./components/Login"),
        import("./components/Explore"),
        import("./components/Profile"),
        import("react-toastify")
      ];
      
      // Wykonaj preloady bez czekania na ich zakończenie
      Promise.all(preloads).catch(err => console.log("Preload error:", err));
    };
    
    // Użyj requestIdleCallback do preloadowania gdy przeglądarka jest bezczynna
    if ('requestIdleCallback' in window) {
      window.requestIdleCallback(preloadComponents, { timeout: 3000 });
    } else {
      // Fallback dla przeglądarek bez requestIdleCallback
      setTimeout(preloadComponents, 3000);
    }
  }, []);
  return (
    <AuthProvider>
      <BrowserRouter>
      <div id="site" className="flex flex-col bg-gradient-to-b from-secondary to-primary min-h-[600px]">
        <Suspense fallback={<div style={{ display: "flex", justifyContent: "center", alignItems: "center", width: "100vw", height: "100vh", fontSize: "24px", color: "white", backgroundColor: "#7aabc5"}}>Caching fresh internet :) Give us a sec...</div>}>
          <Navigation />
          <main
            className=" flex mx-0 px-0 md:px-4 py-6 min-h-[500px]"
            id="content"
          ><Routes>
              
                <Route index element={<HomePage />} />
                <Route path="/home2" element={<HomePage2 />} />
                <Route path="/login" element={<Login />} />
                <Route path="/explore" element={<Explore />} />
                <Route path="/profile" element={<Profile />} />
              
            </Routes>
          </main>
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
          </Suspense>
        </div>
                
      </BrowserRouter>
    </AuthProvider>
  );
}

export default App;
